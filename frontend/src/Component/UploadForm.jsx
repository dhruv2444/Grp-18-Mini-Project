import React, { useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Clock, TrendingUp, AlertCircle, CheckCircle, Target, Zap, Award, Upload, FileSpreadsheet } from 'lucide-react';

// Spinner Component
const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
  
  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600 h-full w-full"></div>
    </div>
  );
};

// Upload Form Component
const UploadForm = ({ onResult, onError, onLoading }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const authToken = localStorage.getItem("token");

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
        timeout: 120000,
      });

      if (resp.data?.ok && resp.data.data) {
        onResult(resp.data.data);
        console.log(resp.data.data);
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
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
          <FileSpreadsheet className="w-8 h-8 text-indigo-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Upload Activity File
        </h3>
        <p className="text-gray-600">
          Supported formats: .xlsx, .xls (Max 10MB)
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleChange}
            disabled={loading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-50 cursor-pointer"
          />
        </div>

        {file && (
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-800">
                {file.name}
              </span>
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        )}

        <button
          type="submit"
          disabled={!file || loading}
          className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <>
              <Spinner size="sm" className="mr-3" />
              Analyzing... {progress}%
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-2" />
              Upload & Analyze
            </>
          )}
        </button>
      </form>

      {loading && (
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-3 text-center font-medium">
            Processing your activity data...
          </p>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-800 font-medium">{error}</p>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <p className="text-sm text-blue-800">
          <strong className="font-semibold">💡 Tip:</strong> Your Excel file should include columns like{" "}
          <code className="bg-blue-100 px-2 py-0.5 rounded font-mono text-xs">start_time</code>,{" "}
          <code className="bg-blue-100 px-2 py-0.5 rounded font-mono text-xs">end_time</code>,{" "}
          <code className="bg-blue-100 px-2 py-0.5 rounded font-mono text-xs">duration_minutes</code>,{" "}
          <code className="bg-blue-100 px-2 py-0.5 rounded font-mono text-xs">app</code>.
        </p>
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function ActivityDashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('schedule');

  const handleResult = (resultData) => {
    setData(resultData);
    setError(null);
  };

  const handleError = (errorMsg) => {
    setError(errorMsg);
  };

  const handleLoading = (loading) => {
    setIsLoading(loading);
  };

  // Define colors and data processing functions
  const COLORS = {
    work: '#6366f1',
    wellness: '#10b981',
    meals: '#f59e0b',
    breaks: '#8b5cf6',
    exercise: '#ef4444',
    social: '#ec4899',
    learning: '#3b82f6',
    sleep: '#1f2937'
  };

  const priorityColors = {
    critical: '#dc2626',
    high: '#f59e0b',
    medium: '#3b82f6',
    low: '#6b7280'
  };

  // Process data only when it exists
  const scheduleByCategory = data?.analysis?.nextDaySchedule?.reduce((acc, item) => {
    const duration = parseInt(item.duration) || 0;
    acc[item.category] = (acc[item.category] || 0) + duration;
    return acc;
  }, {}) || {};

  const categoryData = Object.entries(scheduleByCategory).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  const timelineData = data?.analysis?.nextDaySchedule
    ?.filter(item => item.category !== 'sleep')
    ?.map((item) => ({
      time: item.time,
      duration: parseInt(item.duration) || 0,
      category: item.category,
      activity: item.activity
    })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center mb-4 md:mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Activity Analysis Dashboard
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            Upload your activity data to get personalized insights and recommendations
          </p>
        </div>

        {/* Upload Form - Always visible */}
        <UploadForm 
          onResult={handleResult}
          onError={handleError}
          onLoading={handleLoading}
        />

        {/* Results Section - Only show when data exists */}
        {data && (
          <>
            {/* Header Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-4 md:p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-100 text-xs md:text-sm font-medium">Productivity Score</p>
                    <p className="text-3xl md:text-4xl font-bold mt-2">{data.analysis?.productivityScore || 0}</p>
                  </div>
                  <Award className="w-10 h-10 md:w-12 md:h-12 opacity-80" />
                </div>
                <div className="mt-4 bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white rounded-full h-2" 
                    style={{ width: `${data.analysis?.productivityScore || 0}%` }} 
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs md:text-sm font-medium">Total Activities</p>
                    <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                      {data.summary?.totalRecords || 0}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-2 md:p-3 rounded-xl">
                    <Target className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs md:text-sm font-medium">Screen Time</p>
                    <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                        {/* totalDur =500 */}
                      {/* {Math.floor((data.summary?.totalDuration || 0) / 60)}h {(data.summary?.totalDuration || 0) % 60}m */}
                      {Math.floor((500) / 60)}h {(500) % 60}m
                    </p>
                  </div>
                  <div className="bg-purple-100 p-2 md:p-3 rounded-xl">
                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs md:text-sm font-medium">Avg Session</p>
                    <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                      {Math.round(data.summary?.averageSessionDuration || 0)}m
                    </p>
                  </div>
                  <div className="bg-green-100 p-2 md:p-3 rounded-xl">
                    <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl shadow-lg p-2">
              <div className="flex space-x-2 overflow-x-auto">
                {['schedule', 'analysis', 'charts'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 min-w-[100px] py-2 md:py-3 px-3 md:px-4 rounded-xl font-medium transition-all text-sm md:text-base ${
                      activeTab === tab
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
              <div className="space-y-4 md:space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
                  <div className="flex items-center space-x-3 mb-4 md:mb-6">
                    <Calendar className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">Tomorrow's Schedule</h2>
                  </div>
                  
                  <div className="space-y-3 max-h-[500px] md:max-h-[600px] overflow-y-auto pr-2">
                    {data.analysis?.nextDaySchedule?.map((item, idx) => (
                      <div
                        key={idx}
                        className="group hover:shadow-md transition-all duration-200 rounded-xl border-2 border-gray-100 hover:border-indigo-200 p-3 md:p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 md:space-x-4 flex-1">
                            <div className="flex flex-col items-center min-w-[70px] md:min-w-[80px]">
                              <span className="text-xs md:text-sm font-bold text-indigo-600">{item.time}</span>
                              <span className="text-xs text-gray-500 mt-1">{item.duration}</span>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2 flex-wrap">
                                <h3 className="font-semibold text-gray-900 text-sm md:text-base">{item.activity}</h3>
                                <span
                                  className="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                                  style={{
                                    backgroundColor: `${priorityColors[item.priority]}15`,
                                    color: priorityColors[item.priority]
                                  }}
                                >
                                  {item.priority}
                                </span>
                              </div>
                              
                              <p className="text-xs md:text-sm text-gray-600 mb-2">{item.tips}</p>
                              
                              <div className="flex items-center space-x-2">
                                <span
                                  className="px-2 md:px-3 py-1 rounded-full text-xs font-medium"
                                  style={{
                                    backgroundColor: `${COLORS[item.category]}15`,
                                    color: COLORS[item.category]
                                  }}
                                >
                                  {item.category}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div
                            className="w-1 h-full rounded-full ml-2 md:ml-4 hidden sm:block"
                            style={{ backgroundColor: COLORS[item.category] }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Analysis Tab */}
            {activeTab === 'analysis' && (
              <div className="space-y-4 md:space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
                  <div className="flex items-center space-x-3 mb-4 md:mb-6">
                    <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">Time Wasting Analysis</h2>
                  </div>
                  
                  <div className="space-y-3 md:space-y-4">
                    {data.analysis?.timeWastingAnalysis?.map((item, idx) => (
                      <div
                        key={idx}
                        className="border-l-4 rounded-lg p-4 md:p-5 bg-gradient-to-r from-gray-50 to-white hover:shadow-md transition-all"
                        style={{ borderColor: priorityColors[item.priority] }}
                      >
                        <div className="flex items-start justify-between mb-3 gap-2">
                          <h3 className="font-bold text-gray-900 text-base md:text-lg">{item.issue}</h3>
                          <span
                            className="px-2 md:px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                            style={{
                              backgroundColor: `${priorityColors[item.priority]}15`,
                              color: priorityColors[item.priority]
                            }}
                          >
                            {item.priority}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-3 md:mb-4">
                          <div className="bg-red-50 rounded-lg p-3">
                            <p className="text-xs text-red-600 font-medium mb-1">Time Wasted</p>
                            <p className="font-bold text-red-700 text-sm md:text-base">{item.timeWasted}</p>
                          </div>
                          <div className="bg-orange-50 rounded-lg p-3 md:col-span-2">
                            <p className="text-xs text-orange-600 font-medium mb-1">Impact</p>
                            <p className="font-semibold text-orange-700 text-sm md:text-base">{item.impact}</p>
                          </div>
                        </div>
                        
                        <div className="bg-green-50 rounded-lg p-3 md:p-4">
                          <p className="text-xs text-green-600 font-medium mb-2">💡 Solution</p>
                          <p className="text-green-800 text-sm md:text-base">{item.solution}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-4 md:p-6 text-white">
                  <div className="flex items-center space-x-3 mb-4 md:mb-6">
                    <Zap className="w-5 h-5 md:w-6 md:h-6" />
                    <h2 className="text-xl md:text-2xl font-bold">Addiction Control</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <h3 className="font-semibold text-purple-100 mb-3 text-sm md:text-base">Identified Patterns</h3>
                      <div className="space-y-2">
                        {data.analysis?.addictionControl?.identifiedAddictions?.map((addiction, idx) => (
                          <div key={idx} className="bg-white/10 backdrop-blur rounded-lg px-3 md:px-4 py-2">
                            <span className="font-medium text-sm md:text-base">{addiction}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-purple-100 mb-3 text-sm md:text-base">Daily Limits</h3>
                      <div className="space-y-2">
                        {Object.entries(data.analysis?.addictionControl?.dailyLimits || {}).map(([key, value]) => (
                          <div key={key} className="bg-white/10 backdrop-blur rounded-lg px-3 md:px-4 py-2 flex justify-between gap-2">
                            <span className="font-medium text-sm md:text-base">{key}</span>
                            <span className="text-purple-200 text-sm md:text-base">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-6">
                    <h3 className="font-semibold text-purple-100 mb-3 text-sm md:text-base">Strategies</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                      {data.analysis?.addictionControl?.strategies?.map((strategy, idx) => (
                        <div key={idx} className="bg-white/10 backdrop-blur rounded-lg px-3 md:px-4 py-2 md:py-3 flex items-start space-x-2 md:space-x-3">
                          <CheckCircle className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" />
                          <span className="text-xs md:text-sm">{strategy}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Key Recommendations</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {data.analysis?.keyRecommendations?.map((rec, idx) => (
                      <div key={idx} className="flex items-start space-x-3 p-3 md:p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                        <div className="bg-indigo-600 text-white rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center font-bold flex-shrink-0 text-sm md:text-base">
                          {idx + 1}
                        </div>
                        <p className="text-gray-800 font-medium text-sm md:text-base">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Charts Tab */}
            {activeTab === 'charts' && (
              <div className="space-y-4 md:space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Time Distribution by Category</h2>
                  <ResponsiveContainer width="100%" height={300} className="md:h-[350px]">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={window.innerWidth < 768 ? 80 : 120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase()] || '#cccccc'} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Minutes per Category</h2>
                  <ResponsiveContainer width="100%" height={300} className="md:h-[350px]">
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: window.innerWidth < 768 ? 10 : 12 }}
                        angle={window.innerWidth < 768 ? -45 : 0}
                        textAnchor={window.innerWidth < 768 ? "end" : "middle"}
                        height={window.innerWidth < 768 ? 60 : 30}
                      />
                      <YAxis tick={{ fontSize: window.innerWidth < 768 ? 10 : 12 }} />
                      <Tooltip />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase()] || '#cccccc'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Activity Timeline</h2>
                  <ResponsiveContainer width="100%" height={300} className="md:h-[350px]">
                    <LineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="time" 
                        angle={-45} 
                        textAnchor="end" 
                        height={window.innerWidth < 768 ? 70 : 80}
                        tick={{ fontSize: window.innerWidth < 768 ? 8 : 10 }}
                      />
                      <YAxis tick={{ fontSize: window.innerWidth < 768 ? 10 : 12 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: window.innerWidth < 768 ? '12px' : '14px' }} />
                      <Line 
                        type="monotone" 
                        dataKey="duration" 
                        stroke="#6366f1" 
                        strokeWidth={window.innerWidth < 768 ? 1.5 : 2} 
                        dot={{ r: window.innerWidth < 768 ? 3 : 4 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}