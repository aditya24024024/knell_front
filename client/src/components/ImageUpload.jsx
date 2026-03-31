import Image from 'next/image';
import imageCompression from "browser-image-compression";
import React, { useState, useCallback, useEffect } from 'react';

const ImageUpload = ({ files, setFile }) => {
  const [compressing, setCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previews, setPreviews] = useState([]);

  const handleFiles = useCallback(async (selectedFiles) => {
    if (!selectedFiles.length) return;

    setCompressing(true);
    setProgress(0);

    const total = selectedFiles.length;
    let done = 0;

    // ✅ 1. Show previews instantly
    const instantPreviews = selectedFiles.map(f => URL.createObjectURL(f));
    setPreviews(prev => [...prev, ...instantPreviews]);

    // ✅ 2. Add ORIGINAL files immediately (no delay)
    setFile(prev => [...prev, ...selectedFiles]);

    // ✅ 3. Compress in background
    const compressedFiles = await Promise.all(
      selectedFiles.map(async (file) => {
        const options = {
          maxSizeMB: 0.8,
          maxWidthOrHeight: 1080,
          useWebWorker: true,
          fileType: "image/jpeg",
        };

        try {
          const compressed = await imageCompression(file, options);
          done++;
          setProgress(Math.round((done / total) * 100));

          return new File([compressed], file.name, {
            type: "image/jpeg",
          });
        } catch (error) {
          console.error("Compression error:", error);
          done++;
          setProgress(Math.round((done / total) * 100));
          return file;
        }
      })
    );

    // ✅ 4. Replace originals with compressed versions
    setFile(prev =>
      prev.map(file => {
        const compressed = compressedFiles.find(f => f.name === file.name);
        return compressed || file;
      })
    );

    setCompressing(false);
    setProgress(0);

  }, [setFile]);

  const onInputChange = (e) => {
    const selected = Array.from(e.target.files);
    handleFiles(selected);
  };

  const onDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    handleFiles(dropped);
  };

  const removeImage = (index) => {
    setFile(files.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // ✅ 5. CLEANUP memory (VERY IMPORTANT)
  useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previews]);

  return (
    <div style={{ width: "100%" }}>
      {/* Drop zone */}
      <label
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: 120,
          border: "1px dashed rgba(93,201,74,0.3)",
          cursor: compressing ? "not-allowed" : "pointer",
          background: "#09090b",
          transition: "all 0.2s",
          position: "relative",
        }}
      >
        {compressing ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 200, height: 3, background: "#15171c", borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${progress}%`,
                background: "#5dc94a",
                transition: "width 0.3s ease",
                borderRadius: 2,
              }} />
            </div>
            <span style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#5dc94a",
            }}>
              Optimising {progress}%
            </span>
          </div>
        ) : (
          <>
            <span style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#6b7a62",
            }}>
              Click or drag to upload
            </span>
          </>
        )}
        <input
          type="file"
          onChange={onInputChange}
          style={{ display: "none" }}
          multiple
          accept="image/*"
          name="files[]"
          disabled={compressing}
        />
      </label>

      {/* Previews */}
      {previews.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1rem" }}>
          {previews.map((src, index) => (
            <div
              key={index}
              style={{
                position: "relative",
                width: 80,
                height: 80,
                border: "1px solid rgba(93,201,74,0.2)",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <button
                type="button"
                onClick={() => removeImage(index)}
                style={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  background: "rgba(239,68,68,0.9)",
                  color: "white",
                  border: "none",
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  cursor: "pointer",
                  zIndex: 10,
                }}
              >
                ×
              </button>

              <Image
                src={src}
                alt={`preview-${index}`}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;