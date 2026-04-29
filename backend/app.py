from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import uuid
import jwt
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=False)

JWT_SECRET = os.environ.get("JWT_SECRET", "groupd-secret-key")


def get_containers():
    from azure.cosmos import CosmosClient
    client = CosmosClient(
        url=os.environ["COSMOS_ENDPOINT"],
        credential=os.environ["COSMOS_KEY"]
    )
    db = client.get_database_client(os.environ["COSMOS_DATABASE"])
    return (
        db.get_container_client("users"),
        db.get_container_client("teams"),
        db.get_container_client("messages"),
        db.get_container_client("notifications"),
    )


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
        if not token:
            return jsonify({"error": "Token missing"}), 401
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            request.user_id = payload["user_id"]
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        return f(*args, **kwargs)
    return decorated


def push_notification(notifications_container, user_id, notif_type, title, body, ref_id=None):
    notif_id = str(uuid.uuid4())
    doc = {
        "id": notif_id,
        "userId": user_id,
        "type": notif_type,
        "title": title,
        "body": body,
        "refId": ref_id,
        "read": False,
        "timestamp": datetime.utcnow().isoformat()
    }
    notifications_container.upsert_item(body=doc)
    return doc


@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "project": "groupd"})


@app.route("/register", methods=["POST"])
def register():
    from azure.cosmos import exceptions
    users, _, __, ___ = get_containers()
    data = request.json
    if not data.get("email") or not data.get("password") or not data.get("name"):
        return jsonify({"error": "name, email and password are required"}), 400
    existing = list(users.query_items(
        query="SELECT * FROM c WHERE c.email = @email",
        parameters=[{"name": "@email", "value": data["email"]}],
        enable_cross_partition_query=True
    ))
    if existing:
        return jsonify({"error": "Email already registered"}), 409
    user_id = str(uuid.uuid4())
    doc = {
        "id": user_id, "userId": user_id,
        "name": data["name"], "email": data["email"],
        "password": generate_password_hash(data["password"]),
        "department": "", "skills": [], "availability": "", "about": "", "embedding": None
    }
    users.upsert_item(body=doc)
    token = jwt.encode(
        {"user_id": user_id, "exp": datetime.utcnow() + timedelta(days=7)},
        JWT_SECRET, algorithm="HS256"
    )
    return jsonify({"token": token, "user": {"id": user_id, "name": doc["name"], "email": doc["email"]}}), 201


@app.route("/login", methods=["POST"])
def login():
    users, _, __, ___ = get_containers()
    data = request.json
    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "email and password are required"}), 400
    results = list(users.query_items(
        query="SELECT * FROM c WHERE c.email = @email",
        parameters=[{"name": "@email", "value": data["email"]}],
        enable_cross_partition_query=True
    ))
    if not results or not check_password_hash(results[0]["password"], data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401
    user = results[0]
    token = jwt.encode(
        {"user_id": user["userId"], "exp": datetime.utcnow() + timedelta(days=7)},
        JWT_SECRET, algorithm="HS256"
    )
    return jsonify({"token": token, "user": {"id": user["userId"], "name": user["name"], "email": user["email"]}})


@app.route("/api/users", methods=["POST"])
def create_user():
    users, _, __, ___ = get_containers()
    data = request.json
    if not data.get("userId"):
        return jsonify({"error": "userId required"}), 400
    doc = {
        "id": data["userId"], "userId": data["userId"],
        "name": data.get("name", ""), "email": data.get("email", ""),
        "department": data.get("department", ""), "skills": data.get("skills", []),
        "availability": data.get("availability", ""), "about": data.get("about", ""), "embedding": None
    }
    users.upsert_item(body=doc)
    return jsonify({"status": "created", "id": doc["id"]}), 201


@app.route("/api/users/<user_id>", methods=["GET"])
@token_required
def get_user(user_id):
    from azure.cosmos import exceptions
    users, _, __, ___ = get_containers()
    try:
        item = users.read_item(item=user_id, partition_key=user_id)
        return jsonify(item)
    except exceptions.CosmosResourceNotFoundError:
        return jsonify({"error": "User not found"}), 404


@app.route("/api/users/<user_id>", methods=["PUT"])
@token_required
def update_user(user_id):
    if request.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403
    from azure.cosmos import exceptions
    users, _, __, ___ = get_containers()
    try:
        item = users.read_item(item=user_id, partition_key=user_id)
    except exceptions.CosmosResourceNotFoundError:
        return jsonify({"error": "User not found"}), 404
    data = request.json
    for field in ["name", "department", "skills", "availability", "about"]:
        if field in data:
            item[field] = data[field]
    users.upsert_item(body=item)
    return jsonify(item)


@app.route("/api/match", methods=["GET"])
@token_required
def get_matches():
    from azure.cosmos import exceptions
    users, _, __, ___ = get_containers()
    try:
        current_user = users.read_item(item=request.user_id, partition_key=request.user_id)
    except exceptions.CosmosResourceNotFoundError:
        return jsonify({"error": "User not found"}), 404
    all_users = list(users.query_items(
        query="SELECT * FROM c WHERE c.userId != @uid",
        parameters=[{"name": "@uid", "value": request.user_id}],
        enable_cross_partition_query=True
    ))
    my_skills = set(current_user.get("skills", []))
    results = []
    for u in all_users:
        their_skills = set(u.get("skills", []))
        if not my_skills or not their_skills:
            score = 0
        else:
            overlap = len(my_skills & their_skills)
            score = round((overlap / len(my_skills | their_skills)) * 100)
        results.append({
            "id": u["userId"], "name": u.get("name", ""),
            "department": u.get("department", ""), "skills": u.get("skills", []),
            "about": u.get("about", ""), "availability": u.get("availability", ""),
            "match": score
        })
    results.sort(key=lambda x: x["match"], reverse=True)
    return jsonify(results)


@app.route("/api/search", methods=["GET"])
@token_required
def search():
    q = request.args.get("q", "").lower().strip()
    users, teams, _, __ = get_containers()
    all_users = list(users.query_items(
        query="SELECT * FROM c WHERE c.userId != @uid",
        parameters=[{"name": "@uid", "value": request.user_id}],
        enable_cross_partition_query=True
    ))
    all_teams = list(teams.query_items(
        query="SELECT * FROM c",
        enable_cross_partition_query=True
    ))
    if q:
        def match_user(u):
            return (q in u.get("name", "").lower() or q in u.get("department", "").lower() or
                    any(q in s.lower() for s in u.get("skills", [])))
        def match_team(t):
            return (q in t.get("name", "").lower() or q in t.get("type", "").lower() or
                    any(q in s.lower() for s in t.get("skills", [])))
        all_users = [u for u in all_users if match_user(u)]
        all_teams = [t for t in all_teams if match_team(t)]
    return jsonify({
        "users": [{"id": u["userId"], "name": u.get("name", ""), "department": u.get("department", ""), "skills": u.get("skills", []), "availability": u.get("availability", "")} for u in all_users],
        "teams": [{"id": t["teamId"], "name": t.get("name", ""), "type": t.get("type", ""), "skills": t.get("skills", []), "slots": t.get("slots", 0)} for t in all_teams]
    })


@app.route("/api/teams", methods=["GET"])
def get_teams():
    _, teams, __, ___ = get_containers()
    items = list(teams.query_items(query="SELECT * FROM c", enable_cross_partition_query=True))
    return jsonify(items)


@app.route("/api/teams", methods=["POST"])
@token_required
def create_team():
    _, teams, __, ___ = get_containers()
    data = request.json
    if not data.get("teamId"):
        return jsonify({"error": "teamId required"}), 400
    doc = {
        "id": data["teamId"], "teamId": data["teamId"],
        "name": data.get("name", ""), "description": data.get("description", ""),
        "type": data.get("type", ""), "skills": data.get("skills", []),
        "slots": data.get("slots", 1), "leadId": data.get("leadId", ""), "members": []
    }
    teams.upsert_item(body=doc)
    return jsonify({"status": "created", "id": doc["id"]}), 201


@app.route("/api/teams/<team_id>", methods=["GET"])
def get_team(team_id):
    from azure.cosmos import exceptions
    _, teams, __, ___ = get_containers()
    try:
        item = teams.read_item(item=team_id, partition_key=team_id)
        return jsonify(item)
    except exceptions.CosmosResourceNotFoundError:
        return jsonify({"error": "Team not found"}), 404


@app.route("/api/teams/<team_id>/invite", methods=["POST"])
@token_required
def invite_to_team(team_id):
    from azure.cosmos import exceptions
    users, teams, _, notifications = get_containers()
    data = request.json
    invitee_id = data.get("userId")
    if not invitee_id:
        return jsonify({"error": "userId required"}), 400
    try:
        team = teams.read_item(item=team_id, partition_key=team_id)
        inviter = users.read_item(item=request.user_id, partition_key=request.user_id)
    except exceptions.CosmosResourceNotFoundError:
        return jsonify({"error": "Team or user not found"}), 404
    push_notification(
        notifications,
        user_id=invitee_id,
        notif_type="team_invite",
        title="Team Invite",
        body=f"{inviter.get('name', 'Someone')} invited you to join {team.get('name', 'a team')}",
        ref_id=team_id
    )
    return jsonify({"status": "invite_sent"})


@app.route("/api/connections", methods=["GET"])
@token_required
def get_connections():
    users, _, __, ___ = get_containers()
    try:
        current_user = users.read_item(item=request.user_id, partition_key=request.user_id)
    except:
        return jsonify({"error": "User not found"}), 404
    connections = current_user.get("connections", [])
    pending = current_user.get("pendingConnections", [])
    connected_users = []
    for uid in connections:
        try:
            u = users.read_item(item=uid, partition_key=uid)
            connected_users.append({"id": u["userId"], "name": u.get("name", ""), "department": u.get("department", ""), "skills": u.get("skills", [])})
        except:
            pass
    pending_users = []
    for uid in pending:
        try:
            u = users.read_item(item=uid, partition_key=uid)
            pending_users.append({"id": u["userId"], "name": u.get("name", ""), "department": u.get("department", ""), "skills": u.get("skills", [])})
        except:
            pass
    return jsonify({"connected": connected_users, "pending": pending_users})


@app.route("/api/connections/<target_id>", methods=["POST"])
@token_required
def send_connection(target_id):
    users, _, __, notifications = get_containers()
    try:
        target = users.read_item(item=target_id, partition_key=target_id)
        sender = users.read_item(item=request.user_id, partition_key=request.user_id)
    except:
        return jsonify({"error": "User not found"}), 404
    pending = target.get("pendingConnections", [])
    if request.user_id not in pending:
        pending.append(request.user_id)
        target["pendingConnections"] = pending
        users.upsert_item(body=target)
        push_notification(
            notifications,
            user_id=target_id,
            notif_type="connection_request",
            title="New Connection Request",
            body=f"{sender.get('name', 'Someone')} sent you a connection request",
            ref_id=request.user_id
        )
    return jsonify({"status": "request_sent"})


@app.route("/api/connections/<target_id>/accept", methods=["POST"])
@token_required
def accept_connection(target_id):
    users, _, __, notifications = get_containers()
    try:
        current_user = users.read_item(item=request.user_id, partition_key=request.user_id)
        target = users.read_item(item=target_id, partition_key=target_id)
    except:
        return jsonify({"error": "User not found"}), 404
    pending = current_user.get("pendingConnections", [])
    if target_id in pending:
        pending.remove(target_id)
    current_user["pendingConnections"] = pending
    current_user.setdefault("connections", [])
    if target_id not in current_user["connections"]:
        current_user["connections"].append(target_id)
    target.setdefault("connections", [])
    if request.user_id not in target["connections"]:
        target["connections"].append(request.user_id)
    users.upsert_item(body=current_user)
    users.upsert_item(body=target)
    push_notification(
        notifications,
        user_id=target_id,
        notif_type="connection_accepted",
        title="Connection Accepted",
        body=f"{current_user.get('name', 'Someone')} accepted your connection request",
        ref_id=request.user_id
    )
    return jsonify({"status": "connected"})


@app.route("/api/connections/<target_id>/decline", methods=["POST"])
@token_required
def decline_connection(target_id):
    users, _, __, ___ = get_containers()
    try:
        current_user = users.read_item(item=request.user_id, partition_key=request.user_id)
    except:
        return jsonify({"error": "User not found"}), 404
    pending = current_user.get("pendingConnections", [])
    if target_id in pending:
        pending.remove(target_id)
        current_user["pendingConnections"] = pending
        users.upsert_item(body=current_user)
    return jsonify({"status": "declined"})


@app.route("/api/notifications", methods=["GET"])
@token_required
def get_notifications():
    _, __, ___, notifications = get_containers()
    items = list(notifications.query_items(
        query="SELECT * FROM c WHERE c.userId = @uid ORDER BY c.timestamp DESC",
        parameters=[{"name": "@uid", "value": request.user_id}],
        enable_cross_partition_query=True
    ))
    return jsonify(items)


@app.route("/api/notifications/<notif_id>/read", methods=["PATCH"])
@token_required
def mark_notification_read(notif_id):
    _, __, ___, notifications = get_containers()
    results = list(notifications.query_items(
        query="SELECT * FROM c WHERE c.id = @id AND c.userId = @uid",
        parameters=[
            {"name": "@id", "value": notif_id},
            {"name": "@uid", "value": request.user_id}
        ],
        enable_cross_partition_query=True
    ))
    if not results:
        return jsonify({"error": "Notification not found"}), 404
    notif = results[0]
    notif["read"] = True
    notifications.upsert_item(body=notif)
    return jsonify({"status": "marked_read"})


@app.route("/api/notifications/read-all", methods=["PATCH"])
@token_required
def mark_all_notifications_read():
    _, __, ___, notifications = get_containers()
    items = list(notifications.query_items(
        query="SELECT * FROM c WHERE c.userId = @uid AND c.read = false",
        parameters=[{"name": "@uid", "value": request.user_id}],
        enable_cross_partition_query=True
    ))
    for item in items:
        item["read"] = True
        notifications.upsert_item(body=item)
    return jsonify({"status": "all_marked_read", "count": len(items)})


@app.route("/api/messages/send", methods=["POST"])
@token_required
def send_message():
    users, _, messages, __ = get_containers()
    data = request.json
    receiver_id = data.get("receiver_id")
    content = data.get("content", "").strip()
    if not receiver_id or not content:
        return jsonify({"error": "receiver_id and content are required"}), 400
    msg_id = str(uuid.uuid4())
    doc = {
        "id": msg_id,
        "senderId": request.user_id,
        "receiverId": receiver_id,
        "content": content,
        "timestamp": datetime.utcnow().isoformat(),
        "read": False
    }
    messages.upsert_item(body=doc)
    return jsonify(doc), 201


@app.route("/api/messages/conversation/<other_user_id>", methods=["GET"])
@token_required
def get_conversation(other_user_id):
    _, __, messages, ___ = get_containers()
    sent = list(messages.query_items(
        query="SELECT * FROM c WHERE c.senderId = @me AND c.receiverId = @other",
        parameters=[
            {"name": "@me", "value": request.user_id},
            {"name": "@other", "value": other_user_id}
        ],
        enable_cross_partition_query=True
    ))
    received = list(messages.query_items(
        query="SELECT * FROM c WHERE c.senderId = @other AND c.receiverId = @me",
        parameters=[
            {"name": "@other", "value": other_user_id},
            {"name": "@me", "value": request.user_id}
        ],
        enable_cross_partition_query=True
    ))
    all_messages = sorted(sent + received, key=lambda x: x.get("timestamp", ""))
    for msg in received:
        if not msg.get("read"):
            msg["read"] = True
            messages.upsert_item(body=msg)
    return jsonify(all_messages)


@app.route("/api/messages/conversations", methods=["GET"])
@token_required
def get_conversations():
    users, _, messages, __ = get_containers()
    sent = list(messages.query_items(
        query="SELECT * FROM c WHERE c.senderId = @me",
        parameters=[{"name": "@me", "value": request.user_id}],
        enable_cross_partition_query=True
    ))
    received = list(messages.query_items(
        query="SELECT * FROM c WHERE c.receiverId = @me",
        parameters=[{"name": "@me", "value": request.user_id}],
        enable_cross_partition_query=True
    ))
    convo_map = {}
    for msg in sent + received:
        other_id = msg["receiverId"] if msg["senderId"] == request.user_id else msg["senderId"]
        existing = convo_map.get(other_id)
        if not existing or msg.get("timestamp", "") > existing.get("timestamp", ""):
            convo_map[other_id] = msg
    conversations = []
    for other_id, last_msg in convo_map.items():
        try:
            u = users.read_item(item=other_id, partition_key=other_id)
            unread_count = sum(
                1 for m in received
                if m["senderId"] == other_id and not m.get("read", False)
            )
            conversations.append({
                "userId": other_id,
                "name": u.get("name", ""),
                "department": u.get("department", ""),
                "lastMessage": last_msg.get("content", ""),
                "lastMessageTime": last_msg.get("timestamp", ""),
                "unreadCount": unread_count
            })
        except:
            pass
    conversations.sort(key=lambda x: x["lastMessageTime"], reverse=True)
    return jsonify(conversations)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
