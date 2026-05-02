from flask import Blueprint, request, jsonify
from blob_service import upload_file_to_blob, delete_blob

# JWT import — adjust to match your existing auth setup
# from flask_jwt_extended import jwt_required, get_jwt_identity

upload_bp = Blueprint("upload", __name__)


@upload_bp.route("/api/upload", methods=["POST"])
# @jwt_required()  # Uncomment once you wire JWT
def upload_file():
    """
    Upload a file to Azure Blob Storage.

    Form fields:
        file        — the file to upload
        upload_type — 'avatar' | 'resume' | 'team_cover'
        user_id     — user's ID (use get_jwt_identity() instead once JWT is wired)
    
    Returns:
        { url, blob_name }
    """
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    upload_type = request.form.get("upload_type")
    if not upload_type:
        return jsonify({"error": "upload_type is required (avatar | resume | team_cover)"}), 400

    # Replace with: user_id = get_jwt_identity() once JWT is wired
    user_id = request.form.get("user_id", "anonymous")

    try:
        result = upload_file_to_blob(file, upload_type, user_id)
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Upload failed", "details": str(e)}), 500


@upload_bp.route("/api/upload/<path:blob_name>", methods=["DELETE"])
# @jwt_required()
def delete_file(blob_name):
    """Delete a blob by its blob_name path."""
    success = delete_blob(blob_name)
    if success:
        return jsonify({"message": "File deleted"}), 200
    return jsonify({"error": "File not found or already deleted"}), 404