import React, { useState, useRef, useCallback } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
type UploadType = "avatar" | "resume" | "team_cover";

interface FileUploadProps {
  uploadType: UploadType;
  userId: string;
  onUploadSuccess: (url: string, blobName: string) => void;
  onUploadError?: (error: string) => void;
  label?: string;
  hint?: string;
}

const ACCEPT_MAP: Record<UploadType, string> = {
  avatar: "image/png, image/jpeg, image/gif, image/webp",
  team_cover: "image/png, image/jpeg, image/gif, image/webp",
  resume: ".pdf, .doc, .docx",
};

const ICON_MAP: Record<UploadType, string> = {
  avatar: "👤",
  team_cover: "🖼️",
  resume: "📄",
};

export const FileUpload: React.FC<FileUploadProps> = ({
  uploadType,
  userId,
  onUploadSuccess,
  onUploadError,
  label,
  hint,
}) => {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isImage = uploadType === "avatar" || uploadType === "team_cover";

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setFileName(file.name);

      if (isImage) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_type", uploadType);
      formData.append("user_id", userId);

      setUploading(true);
      setProgress(0);

      try {
        const response = await axios.post(`${API_BASE}/api/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            if (e.total) {
              setProgress(Math.round((e.loaded / e.total) * 100));
            }
          },
        });

        const { url, blob_name } = response.data;
        onUploadSuccess(url, blob_name);
      } catch (err: any) {
        const msg =
          err.response?.data?.error || "Upload failed. Please try again.";
        setError(msg);
        setPreview(null);
        setFileName(null);
        onUploadError?.(msg);
      } finally {
        setUploading(false);
      }
    },
    [uploadType, userId, isImage, onUploadSuccess, onUploadError]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div style={styles.wrapper}>
      {label && <p style={styles.label}>{label}</p>}

      <div
        style={{
          ...styles.dropzone,
          borderColor: dragging ? "#4f7ef7" : error ? "#ef4444" : "#d1d5db",
          background: dragging ? "#eff6ff" : "#f9fafb",
        }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_MAP[uploadType]}
          style={{ display: "none" }}
          onChange={onInputChange}
        />

        {preview ? (
          <img src={preview} alt="Preview" style={styles.preview} />
        ) : (
          <div style={styles.placeholder}>
            <span style={styles.icon}>{ICON_MAP[uploadType]}</span>
            <p style={styles.dropText}>
              {dragging ? "Drop it!" : "Drag & drop or click to browse"}
            </p>
            {hint && <p style={styles.hint}>{hint}</p>}
          </div>
        )}

        {fileName && !isImage && (
          <p style={styles.fileName}>📎 {fileName}</p>
        )}
      </div>

      {uploading && (
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>
      )}

      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrapper: { display: "flex", flexDirection: "column", gap: 8 },
  label: { fontWeight: 600, fontSize: 14, color: "#374151", margin: 0 },
  dropzone: {
    border: "2px dashed",
    borderRadius: 12,
    padding: 24,
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 140,
    gap: 8,
  },
  placeholder: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
  },
  icon: { fontSize: 36 },
  dropText: { fontSize: 14, color: "#6b7280", margin: 0 },
  hint: { fontSize: 12, color: "#9ca3af", margin: 0 },
  preview: {
    maxHeight: 160, maxWidth: "100%", borderRadius: 8, objectFit: "cover",
  },
  fileName: { fontSize: 13, color: "#374151", margin: 0 },
  progressBar: {
    height: 6, background: "#e5e7eb", borderRadius: 99, overflow: "hidden",
  },
  progressFill: {
    height: "100%", background: "#4f7ef7", borderRadius: 99,
    transition: "width 0.2s",
  },
  error: { fontSize: 13, color: "#ef4444", margin: 0 },
};

export default FileUpload;