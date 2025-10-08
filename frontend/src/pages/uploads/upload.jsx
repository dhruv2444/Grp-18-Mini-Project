// import React, { useState } from "react";

// const FileUpload = () => {
//   const [file, setFile] = useState(null);

//   // Opens file picker automatically when user clicks "Choose File"
//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]); // Store selected file
//   };

//   const handleUpload = () => {
//     if (!file) {
//       alert("Please select a file first!");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     // Example: send file to backend
//     fetch("http://localhost:5000/upload", {
//       method: "POST",
//       body: formData,
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         alert("File uploaded successfully!");
//         console.log(data);
//       })
//       .catch((err) => console.error(err));
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
//       <h1 className="text-3xl font-bold mb-6">Upload a File</h1>

//       {/* Native File Picker */}
//       <input
//         type="file"
//         onChange={handleFileChange}
//         className="mb-4"
//       />

//       {file && <p className="mb-4 text-gray-700">Selected: {file.name}</p>}

//       <button
//         onClick={handleUpload}
//         className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition mb-4"
//       >
//         Upload
//       </button>

//       {/* Back to Home */}
//       <a href="/" className="text-indigo-600 hover:underline">
//         ← Back to Home
//       </a>
//     </div>
//   );
// };

// export default FileUpload;


// import React, { useState } from "react";
// import UploadForm from "../../Component/UploadForm";
// import Results from "../../Component/Results";
// import Spinner from "../../Component/Spinner";


// export default function UploadPage() {
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleResult = (data) => {
//     setResult(data);
//     setLoading(false);
//     setError(null);
//   };

//   const handleError = (errorMsg) => {
//     setError(errorMsg);
//     setLoading(false);
//     setResult(null);
//   };

//   const handleLoading = (isLoading) => {
//     setLoading(isLoading);
//     setError(null);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-3xl font-bold text-gray-900 mb-4">
//             Activity Analyzer
//           </h1>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             Upload your daily mobile activity log (Excel) and get AI-powered insights 
//             with personalized routine recommendations.
//           </p>
//         </div>

//         {/* Content Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Left Column - Upload Form */}
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <UploadForm 
//               onResult={handleResult}
//               onError={handleError}
//               onLoading={handleLoading}
//             />
//           </div>

//           {/* Right Column - Results */}
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             {loading && (
//               <div className="flex flex-col items-center justify-center py-12">
//                 <Spinner size="lg" />
//                 <p className="mt-4 text-gray-600">Analyzing your activity data...</p>
//               </div>
//             )}

//             {error && (
//               <div className="text-center py-12">
//                 <div className="text-red-500 text-lg font-semibold mb-2">
//                   Analysis Failed
//                 </div>
//                 <p className="text-gray-600">{error}</p>
//               </div>
//             )}

//             {result ? (
//               <Results data={result} />
//             ) : !loading && !error && (
//               <div className="text-center py-12">
//                 <div className="text-gray-400 mb-4">
//                   <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                 </div>
//                 <h4 className="text-lg font-semibold text-gray-900 mb-2">
//                   Analysis Results
//                 </h4>
//                 <p className="text-gray-500">
//                   Upload an Excel file to see your activity analysis and AI-generated routine.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import UploadForm from "../../Component/UploadForm";
import Results from "../../Component/Results";
import Spinner from "../../Component/Spinner";

export default function UploadPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleResult = (data) => {
    setResult(data);
    setLoading(false);
    setError(null);
  };

  const handleError = (errorMsg) => {
    setError(errorMsg);
    setLoading(false);
    setResult(null);
  };

  const handleLoading = (isLoading) => {
    setLoading(isLoading);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Beautiful Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-2xl mb-6">
            <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-indigo-700 bg-clip-text text-transparent">
            Activity Analyzer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Upload your daily mobile activity log and get <span className="font-semibold text-indigo-600">AI-powered insights</span> 
            with personalized routine recommendations.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Upload Section - Beautiful Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/60 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Upload Your Data</h2>
              <p className="text-gray-600">Get started by uploading your activity Excel file</p>
            </div>
            
            <UploadForm 
              onResult={handleResult}
              onError={handleError}
              onLoading={handleLoading}
            />
          </div>

          {/* Results Section - Beautiful Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/60 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Analysis Results</h2>
              <p className="text-gray-600">Your personalized insights will appear here</p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="relative">
                  <Spinner size="xl" className="text-indigo-600" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <p className="mt-6 text-lg font-medium text-gray-700">Analyzing your activity data...</p>
                <p className="mt-2 text-sm text-gray-500">This may take a few moments</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-red-600 mb-3">Analysis Failed</h3>
                <p className="text-gray-600 max-w-md mx-auto">{error}</p>
                <button 
                  onClick={() => setError(null)}
                  className="mt-6 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Results State */}
            {result ? (
              <Results data={result} />
            ) : !loading && !error && (
              // Empty State - Beautiful Design
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready for Analysis</h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-2">
                  Upload an Excel file to unlock personalized insights about your mobile activity patterns.
                </p>
                <p className="text-sm text-indigo-500 font-medium">
                  We'll analyze your data and provide actionable recommendations
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Back to Home - Beautiful Footer */}
        <div className="text-center">
          <a 
            href="/" 
            className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl shadow-lg hover:shadow-xl border border-white/60 hover:bg-white transition-all duration-300 group"
          >
            <svg className="w-5 h-5 text-indigo-600 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-semibold">Back to Home</span>
          </a>
        </div>
      </div>
    </div>
  );
}