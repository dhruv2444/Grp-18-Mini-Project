// // frontend/src/Component/UploadForm.jsx
// import React, { useState, useContext } from "react";
// import axios from "axios";
// import Spinner from "./Spinner";
// import { AuthContext } from "../Context/AuthContext"; // your existing context (optional)

// export default function UploadForm({ onResult }) {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [error, setError] = useState(null);

//   // Try to pull token from your AuthContext if present, otherwise fallback to localStorage
//   let token = null;
//   try {
//     const auth = useContext(AuthContext);
//     token = auth?.token || localStorage.getItem("token");
//   } catch (e) {
//     token = localStorage.getItem("token");
//   }

//   const handleChange = (e) => {
//     setFile(e.target.files?.[0] ?? null);
//     setError(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     if (!file) return setError("Please select an Excel file (.xlsx or .xls).");

//     const fd = new FormData();
//     fd.append("file", file);

//     setLoading(true);
//     setProgress(0);
//     try {
//       const headers = { "Content-Type": "multipart/form-data" };
//       if (token) headers["Authorization"] = `Bearer ${token}`;

//       // VITE_API_BASE_URL: optional env var; otherwise use relative path
//       const base = import.meta.env.VITE_API_BASE_URL || "";

//       const resp = await axios.post(`${base}/api/upload`, fd, {
//         headers,
//         onUploadProgress: (ev) => {
//           if (ev.total) setProgress(Math.round((ev.loaded / ev.total) * 100));
//         },
//         timeout: 120000, // allow time for analysis
//       });

//       if (resp.data?.ok) {
//         onResult(resp.data);
//       } else {
//         setError(resp.data?.error || "Unexpected server response");
//       }
//     } catch (err) {
//       setError(err.response?.data?.error || err.message || "Upload failed");
//     } finally {
//       setLoading(false);
//       setProgress(0);
//     }
//   };

//   return (
//     <div className="upload-card">
//       <h3>Upload activity file</h3>
//       <form onSubmit={handleSubmit} className="upload-form">
//         <input
//           type="file"
//           accept=".xlsx,.xls"
//           onChange={handleChange}
//           className="file-input"
//         />
//         <button type="submit" className="btn-primary" disabled={loading}>
//           {loading ? "Uploading..." : "Upload & Analyze"}
//         </button>
//       </form>

//       {loading && (
//         <div style={{ marginTop: 12 }}>
//           <div style={{ marginBottom: 8 }}>
//             <Spinner /> Uploading & analyzing — {progress}%{" "}
//           </div>
//           <div className="progress-bar">
//             <div className="progress-fill" style={{ width: `${progress}%` }} />
//           </div>
//         </div>
//       )}

//       {error && <div className="error-box">{error}</div>}
//       <div style={{ marginTop: 8, color: "#6b7280", fontSize: 13 }}>
//         Tip: Excel should include columns like <em>start_time, end_time, duration_minutes, app</em>.
//       </div>
//     </div>
//   );
// }







// frontend/src/Component/UploadForm.jsx
import React, { useState, useContext } from "react";
import axios from "axios";
import Spinner from "./Spinner";
import { AuthContext } from "../Context/AuthContext";

export default function UploadForm({ onResult, onError, onLoading }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const { token } = useContext(AuthContext) || {};
  const authToken = token || localStorage.getItem("token");

  const handleChange = (e) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile);
    setError(null);
    onError?.(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    onError?.(null);
    
    if (!file) {
      const errorMsg = "Please select an Excel file (.xlsx or .xls).";
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    // Enhanced file validation
    if (file.size > 10 * 1024 * 1024) {
      const errorMsg = "File size must be less than 10MB";
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    const fd = new FormData();
    fd.append("file", file);

    setLoading(true);
    onLoading?.(true);
    setProgress(0);

    try {
      const headers = { "Content-Type": "multipart/form-data" };
      if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

      const base = import.meta.env.VITE_API_BASE_URL || "";

      const resp = await axios.post(`${base}/api/upload`, fd, {
        headers,
        onUploadProgress: (ev) => {
          if (ev.total) {
            const progressPercent = Math.round((ev.loaded / ev.total) * 100);
            setProgress(progressPercent);
          }
        },
        timeout: 120000, // 2 minutes for analysis
      });

      if (resp.data?.ok && resp.data.data) {
        onResult(resp.data.data);
      } else {
        const errorMsg = resp.data?.error || "Unexpected server response";
        setError(errorMsg);
        onError?.(errorMsg);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || "Upload failed";
      setError(errorMsg);
      onError?.(errorMsg);
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
      onLoading?.(false);
      setProgress(0);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Upload Activity File
        </h3>
        <p className="text-gray-600 text-sm">
          Supported formats: .xlsx, .xls (Max 10MB)
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleChange}
            disabled={loading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-50"
          />
        </div>

        {file && (
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="text-sm font-medium text-green-800">
              {file.name}
            </span>
            <span className="text-xs text-green-600">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        )}

        <button
          type="submit"
          disabled={!file || loading}
          className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Uploading & Analyzing... {progress}%
            </>
          ) : (
            'Upload & Analyze'
          )}
        </button>
      </form>

      {loading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-2 text-center">
            Processing your activity data...
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          <strong>Tip:</strong> Your Excel file should include columns like{" "}
          <code className="bg-blue-100 px-1 rounded">start_time</code>,{" "}
          <code className="bg-blue-100 px-1 rounded">end_time</code>,{" "}
          <code className="bg-blue-100 px-1 rounded">duration_minutes</code>,{" "}
          <code className="bg-blue-100 px-1 rounded">app</code>.
        </p>
      </div>
    </div>
  );
}