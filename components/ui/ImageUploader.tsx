"use client";
import React, { useState, useRef } from "react";
import { UploadCloud, Link as LinkIcon, Image as ImageIcon, X, Loader2, Check } from "lucide-react";

interface ImageUploaderProps {
  name: string;
  value: string;
  onChange: (val: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
}

export function ImageUploader({
  name,
  value,
  onChange,
  label = "Image",
  required = false,
  placeholder = "https://example.com/image.jpg",
}: ImageUploaderProps) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, WEBP, GIF, SVG)");
      return;
    }
    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image");
      }

      onChange(data.url);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".4rem" }}>
      {/* Hidden form input to preserve traditional form submissions */}
      <input type="hidden" name={name} value={value || ""} required={required} />

      {label && (
        <label
          style={{
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: ".15em",
            textTransform: "uppercase",
            color: "#7a9e88",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>
            {label} {required ? "*" : ""}
          </span>
          {value && (
            <span style={{ color: "#4ee07a", display: "inline-flex", alignItems: "center", gap: "2px" }}>
              <Check size={10} /> Image Attached
            </span>
          )}
        </label>
      )}

      {/* Mode Selector Switcher */}
      <div
        style={{
          display: "flex",
          background: "#070f0a",
          padding: "3px",
          borderRadius: "8px",
          border: "1px solid #1a3323",
          gap: "2px",
        }}
      >
        <button
          type="button"
          onClick={() => setMode("upload")}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            padding: ".35rem .6rem",
            borderRadius: "6px",
            fontSize: "10px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all .15s",
            background: mode === "upload" ? "#0e1f15" : "transparent",
            color: mode === "upload" ? "#d5ad67" : "#5a7a67",
            border: mode === "upload" ? "1px solid #1a3323" : "1px solid transparent",
          }}
        >
          <UploadCloud size={12} /> Upload / Drag & Drop
        </button>

        <button
          type="button"
          onClick={() => setMode("url")}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            padding: ".35rem .6rem",
            borderRadius: "6px",
            fontSize: "10px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all .15s",
            background: mode === "url" ? "#0e1f15" : "transparent",
            color: mode === "url" ? "#d5ad67" : "#5a7a67",
            border: mode === "url" ? "1px solid #1a3323" : "1px solid transparent",
          }}
        >
          <LinkIcon size={12} /> Image Link URL
        </button>
      </div>

      {/* Preview if Image exists */}
      {value ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: ".75rem",
            padding: ".6rem",
            background: "#070f0a",
            border: "1px solid #1a3323",
            borderRadius: "8px",
          }}
        >
          <img
            src={value}
            alt="Preview"
            style={{
              width: "48px",
              height: "48px",
              objectFit: "cover",
              borderRadius: "6px",
              background: "#0a1510",
              border: "1px solid #1a3323",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontSize: ".72rem",
                color: "#c8d8c0",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontFamily: "monospace",
              }}
            >
              {value}
            </p>
            <span style={{ fontSize: ".65rem", color: "#4a7a5e" }}>Live Image Preview</span>
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            title="Remove Image"
            style={{
              padding: ".35rem",
              background: "#1a0808",
              border: "1px solid #3a1010",
              borderRadius: "6px",
              color: "#e08080",
              cursor: "pointer",
            }}
          >
            <X size={14} />
          </button>
        </div>
      ) : mode === "upload" ? (
        /* Drag and Drop Zone */
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: dragOver ? "2px dashed #d5ad67" : "1px dashed #1a3323",
            background: dragOver ? "#142d1f" : "#070f0a",
            borderRadius: "8px",
            padding: "1.25rem 1rem",
            textAlign: "center",
            cursor: "pointer",
            transition: "all .18s",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: ".4rem",
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileSelect}
            style={{ display: "none" }}
          />

          {uploading ? (
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem", color: "#d5ad67", fontSize: ".78rem" }}>
              <Loader2 size={16} className="animate-spin" /> Uploading image to server...
            </div>
          ) : (
            <>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "#0e1f15",
                  border: "1px solid #1a3323",
                  display: "grid",
                  placeItems: "center",
                  color: "#d5ad67",
                }}
              >
                <UploadCloud size={16} />
              </div>
              <p style={{ margin: 0, fontSize: ".78rem", fontWeight: 600, color: "#c8d8c0" }}>
                Drag & drop image file here, or <span style={{ color: "#d5ad67", textDecoration: "underline" }}>browse device</span>
              </p>
              <span style={{ fontSize: ".68rem", color: "#4a7a5e" }}>
                Supports PNG, JPG, WEBP, GIF, SVG (Max 10MB)
              </span>
            </>
          )}
        </div>
      ) : (
        /* Image Link URL Input */
        <div style={{ position: "relative" }}>
          <ImageIcon
            size={14}
            style={{
              position: "absolute",
              left: ".75rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#4a7a5e",
              pointerEvents: "none",
            }}
          />
          <input
            type="url"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{
              width: "100%",
              padding: ".65rem .8rem .65rem 2.3rem",
              background: "#070f0a",
              border: "1px solid #1a3323",
              borderRadius: "7px",
              color: "#c8d8c0",
              fontSize: ".82rem",
              outline: "none",
              fontFamily: "monospace",
            }}
          />
        </div>
      )}

      {error && (
        <span style={{ fontSize: ".7rem", color: "#f4a0a0" }}>⚠️ {error}</span>
      )}
    </div>
  );
}
