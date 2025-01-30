import { useState } from "react";

const FileUpload = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      // Upload the file
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();
      if (uploadResponse.ok) {
        alert(uploadData.message);
        onFileUpload(uploadData); // Pass the response data back to the parent
      } else {
        alert(uploadData.error || "Upload failed.");
      }
    }
  };

  return (
    <div
      className={`flex flex-col items-center space-y-6 bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto border-2 border-dashed ${dragging ? 'border-blue-500 bg-blue-50' : 'border-blue-300'}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <label className="w-full text-center cursor-pointer p-4">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
        <span className="text-gray-600 font-medium">Click to upload or drag and drop</span>
      </label>
      {file && <p className="text-gray-700 text-sm">Selected file: {file.name}</p>}
      <button
        onClick={handleUpload}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition font-semibold"
      >
        Upload and Process
      </button>
    </div>
  );
};

export default FileUpload;
