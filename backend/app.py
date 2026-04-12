from flask import Flask, jsonify, request
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

def get_containers():
    from azure.cosmos import CosmosClient
    client = CosmosClient(
        url=os.environ["COSMOS_ENDPOINT"],
        credential=os.environ["COSMOS_KEY"]
    )
    db = client.get_database_client(os.environ["COSMOS_DATABASE"])
    return db.get_container_client("users"), db.get_container_client("teams")

@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "project": "groupd"})

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