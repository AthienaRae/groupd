from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import uuid
import jwt
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

app = Flask(__name__)
CORS(app)

JWT_SECRET = os.environ.get("JWT_SECRET", "groupd-secret-key")

def get_containers():
    from azure.cosmos import CosmosClient
    client = CosmosClient(
        url=os.environ["COSMOS_ENDPOINT"],
        credential=os.environ["COSMOS_KEY"]
    )
    db = client.get_database_client(os.environ["COSMOS_DATABASE"])
    return db.get_container_client("users"), db.get_container_client("teams")

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

@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "project": "groupd"})

@app.route("/register", methods=["POST"])
def register():
    from azure.cosmos import exceptions
    users, _ = get_containers()
    data = request.json

    if not data.get("email") or not data.get("password") or not data.get("name"):
        return jsonify({"error": "name, email and password are required"}), 400

    # Check if email already exists
    existing = list(users.query_items(
        query="SELECT * FROM c WHERE c.email = @email",
        parameters=[{"name": "@email", "value": data["email"]}],
        enable_cross_partition_query=True
    ))
    if existing:
        return jsonify({"error": "Email already registered"}), 409

    user_id = str(uuid.uuid4())
    doc = {
        "id": user_id,
        "userId": user_id,
        "name": data["name"],
        "email": data["email"],
        "password": generate_password_hash(data["password"]),
        "department": "",
        "skills": [],
        "availability": "",
        "about": "",
        "embedding": None
    }
    users.upsert_item(body=doc)

    token = jwt.encode({
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(days=7)
    }, JWT_SECRET, algorithm="HS256")

    return jsonify({
        "token": token,
        "user": {"id": user_id, "name": doc["name"], "email": doc["email"]}
    }), 201

@app.route("/login", methods=["POST"])
def login():
    users, _ = get_containers()
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
    token = jwt.encode({
        "user_id": user["userId"],
        "exp": datetime.utcnow() + timedelta(days=7)
    }, JWT_SECRET, algorithm="HS256")

    return jsonify({
        "token": token,
        "user": {"id": user["userId"], "name": user["name"], "email": user["email"]}
    })

@app.route("/api/users", methods=["POST"])
def create_user():
    users, _ = get_containers()
    data = request.json
    if not data.get("userId"):
        return jsonify({"error": "userId required"}), 400
    doc = {
        "id": data["userId"],
        "userId": data["userId"],
        "name": data.get("name", ""),
        "email": data.get("email", ""),
        "department": data.get("department", ""),
        "skills": data.get("skills", []),
        "availability": data.get("availability", ""),
        "about": data.get("about", ""),
        "embedding": None
    }
    users.upsert_item(body=doc)
    return jsonify({"status": "created", "id": doc["id"]}), 201

@app.route("/api/users/<user_id>", methods=["GET"])
@token_required
def get_user(user_id):
    from azure.cosmos import exceptions
    users, _ = get_containers()
    try:
        item = users.read_item(item=user_id, partition_key=user_id)
        return jsonify(item)
    except exceptions.CosmosResourceNotFoundError:
        return jsonify({"error": "User not found"}), 404

@app.route("/api/teams", methods=["GET"])
def get_teams():
    _, teams = get_containers()
    items = list(teams.query_items(
        query="SELECT * FROM c",
        enable_cross_partition_query=True
    ))
    return jsonify(items)

@app.route("/api/teams", methods=["POST"])
@token_required
def create_team():
    _, teams = get_containers()
    data = request.json
    if not data.get("teamId"):
        return jsonify({"error": "teamId required"}), 400
    doc = {
        "id": data["teamId"],
        "teamId": data["teamId"],
        "name": data.get("name", ""),
        "description": data.get("description", ""),
        "type": data.get("type", ""),
        "skills": data.get("skills", []),
        "slots": data.get("slots", 1),
        "leadId": data.get("leadId", ""),
        "members": []
    }
    teams.upsert_item(body=doc)
    return jsonify({"status": "created", "id": doc["id"]}), 201

@app.route("/api/teams/<team_id>", methods=["GET"])
def get_team(team_id):
    from azure.cosmos import exceptions
    _, teams = get_containers()
    try:
        item = teams.read_item(item=team_id, partition_key=team_id)
        return jsonify(item)
    except exceptions.CosmosResourceNotFoundError:
        return jsonify({"error": "Team not found"}), 404

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)