import Image from 'next/image';
import React, { useState } from 'react';

const ImageUpload = ({ files, setFile }) => {
  const [message, setMessage] = useState("");

  const handleFile = (e) => {
    setMessage("");
    const selectedFiles = Array.from(e.target.files);

    selectedFiles.forEach((file) => {
      const fileType = file.type;
      const validImageTypes = ["image/gif", "image/jpeg", "image/png", "image/webp"];
      if (validImageTypes.includes(fileType)) {
        setFile((prev) => [...prev, file]);
      } else {
        setMessage("Only images (jpg, png, gif, webp) are accepted.");
      }
    });
  };

  const removeImage = (fileName) => {
    setFile(files.filter((file) => file.name !== fileName));
  };

  return (
    <div className="w-full px-4">
      <div className="rounded-lg bg-gray-50 w-full p-4">
        {message && (
          <div className="text-center text-sm text-red-500 mb-2">{message}</div>
        )}

        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-100 hover:border-gray-300">
          <div className="flex flex-col items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
            <p className="pt-1 text-sm text-gray-500">Click or drag to upload</p>
          </div>
          <input
            type="file"
            onChange={handleFile}
            className="hidden"
            multiple
            accept="image/*"
            name="files[]"
          />
        </label>

        {/* Image Previews */}
        <div className="flex flex-wrap gap-3 mt-4">
          {files.map((file, index) => (
            <div key={index} className="relative h-20 w-20 rounded-md overflow-hidden border border-gray-300">
              <button
                type="button"
                onClick={() => removeImage(file.name)}
                className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center z-10 hover:bg-red-600"
              >
                ×
              </button>
              <Image
                src={URL.createObjectURL(file)}
                alt={`preview-${index}`}
                layout="fill"
                objectFit="cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
