from flask import Flask, jsonify, request
from flask_cors import CORS
from azure.cosmos import CosmosClient, exceptions
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

client = CosmosClient(
    url=os.getenv("COSMOS_ENDPOINT"),
    credential=os.getenv("COSMOS_KEY")
)
db = client.get_database_client(os.getenv("COSMOS_DATABASE"))
users = db.get_container_client("users")
teams = db.get_container_client("teams")

@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "project": "groupd"})

@app.route("/api/users", methods=["POST"])
def create_user():
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
    try:
        item = users.read_item(item=user_id, partition_key=user_id)
        return jsonify(item)
    except exceptions.CosmosResourceNotFoundError:
        return jsonify({"error": "User not found"}), 404

@app.route("/api/teams", methods=["GET"])
def get_teams():
    items = list(teams.query_items(
        query="SELECT * FROM c",
        enable_cross_partition_query=True
    ))
    return jsonify(items)

@app.route("/api/teams", methods=["POST"])
def create_team():
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
    try:
        item = teams.read_item(item=team_id, partition_key=team_id)
        return jsonify(item)
    except exceptions.CosmosResourceNotFoundError:
        return jsonify({"error": "Team not found"}), 404

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
