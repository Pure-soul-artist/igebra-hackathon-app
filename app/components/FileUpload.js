import { useState } from 'react';

const FileUpload = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <label className="w-full text-center cursor-pointer border-2 border-dashed border-blue-300 rounded-lg p-4 hover:bg-blue-50 transition">
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