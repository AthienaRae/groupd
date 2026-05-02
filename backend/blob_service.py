import os
import uuid
from azure.storage.blob import BlobServiceClient, ContentSettings
from werkzeug.utils import secure_filename

AZURE_STORAGE_CONNECTION_STRING = os.environ.get("AZURE_STORAGE_CONNECTION_STRING")
CONTAINER_NAME = "groupd-assets"

ALLOWED_IMAGE_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}
ALLOWED_RESUME_EXTENSIONS = {"pdf", "doc", "docx"}
MAX_FILE_SIZE_MB = 10

UPLOAD_FOLDERS = {
    "avatar": "avatars",
    "resume": "resumes",
    "team_cover": "team-covers",
}


def get_blob_service_client():
    if not AZURE_STORAGE_CONNECTION_STRING:
        raise ValueError("AZURE_STORAGE_CONNECTION_STRING environment variable not set")
    return BlobServiceClient.from_connection_string(AZURE_STORAGE_CONNECTION_STRING)


def allowed_file(filename: str, upload_type: str) -> bool:
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if upload_type in ("avatar", "team_cover"):
        return ext in ALLOWED_IMAGE_EXTENSIONS
    if upload_type == "resume":
        return ext in ALLOWED_RESUME_EXTENSIONS
    return False


def upload_file_to_blob(file, upload_type: str, user_id: str) -> dict:
    """
    Upload a file to Azure Blob Storage.

    Args:
        file: FileStorage object from Flask request
        upload_type: 'avatar' | 'resume' | 'team_cover'
        user_id: The ID of the user uploading the file

    Returns:
        dict with 'url' and 'blob_name'
    """
    if upload_type not in UPLOAD_FOLDERS:
        raise ValueError(f"Invalid upload_type: {upload_type}. Must be one of {list(UPLOAD_FOLDERS.keys())}")

    filename = secure_filename(file.filename)
    if not filename or not allowed_file(filename, upload_type):
        allowed = ALLOWED_IMAGE_EXTENSIONS if upload_type != "resume" else ALLOWED_RESUME_EXTENSIONS
        raise ValueError(f"File type not allowed. Allowed: {allowed}")

    # Check file size (read into memory, then reset)
    file.seek(0, 2)
    size_mb = file.tell() / (1024 * 1024)
    file.seek(0)
    if size_mb > MAX_FILE_SIZE_MB:
        raise ValueError(f"File too large. Max size is {MAX_FILE_SIZE_MB}MB")

    ext = filename.rsplit(".", 1)[-1].lower()
    unique_filename = f"{uuid.uuid4().hex}.{ext}"
    folder = UPLOAD_FOLDERS[upload_type]
    blob_name = f"{folder}/{user_id}/{unique_filename}"

    content_type_map = {
        "png": "image/png", "jpg": "image/jpeg", "jpeg": "image/jpeg",
        "gif": "image/gif", "webp": "image/webp",
        "pdf": "application/pdf",
        "doc": "application/msword",
        "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    }
    content_type = content_type_map.get(ext, "application/octet-stream")

    client = get_blob_service_client()
    container_client = client.get_container_client(CONTAINER_NAME)
    blob_client = container_client.get_blob_client(blob_name)

    blob_client.upload_blob(
        file,
        overwrite=True,
        content_settings=ContentSettings(content_type=content_type),
    )

    url = blob_client.url
    return {"url": url, "blob_name": blob_name}


def delete_blob(blob_name: str) -> bool:
    """Delete a blob by its name. Returns True if deleted, False if not found."""
    try:
        client = get_blob_service_client()
        container_client = client.get_container_client(CONTAINER_NAME)
        container_client.delete_blob(blob_name)
        return True
    except Exception:
        return False