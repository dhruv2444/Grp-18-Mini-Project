import React, { useState } from "react";

const FileUpload = () => {
  const [file, setFile] = useState(null);

  // Opens file picker automatically when user clicks "Choose File"
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Store selected file
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // Example: send file to backend
    fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        alert("File uploaded successfully!");
        console.log(data);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Upload a File</h1>

      {/* Native File Picker */}
      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4"
      />

      {file && <p className="mb-4 text-gray-700">Selected: {file.name}</p>}

      <button
        onClick={handleUpload}
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition mb-4"
      >
        Upload
      </button>

      {/* Back to Home */}
      <a href="/" className="text-indigo-600 hover:underline">
        ← Back to Home
      </a>
    </div>
  );
};

export default FileUpload;
