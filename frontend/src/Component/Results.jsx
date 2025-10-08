// frontend/src/Component/Results.jsx
import React from "react";
import StatCard from "./StatCard";
import Charts from "./Charts";

export default function Results({ data }) {
  // Handle the data structure from your backend
  const analysis = data?.analysis || {};
  const summary = data?.summary || {};
  const topApps = data?.topApps || [];

  // Handle error / parse fallbacks
  if (!analysis || Object.keys(analysis).length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Analysis Results</h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">No analysis data available from the server.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Activity Analysis</h3>
        
        {/* Quick Summary */}
        <StatCard title="📊 Quick Summary">
          <p className="text-gray-700 leading-relaxed">
            {analysis.summary || "No summary available."}
          </p>
        </StatCard>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Time">
          <div className="text-2xl font-bold text-indigo-600">
            {analysis.metrics?.totalMinutes || summary.totalDuration || 0} min
          </div>
        </StatCard>

        <StatCard title="Productive">
          <div className="text-2xl font-bold text-green-600">
            {analysis.metrics?.productivePercent || 0}%
          </div>
        </StatCard>

        <StatCard title="Entertainment">
          <div className="text-2xl font-bold text-amber-600">
            {analysis.metrics?.entertainmentPercent || 0}%
          </div>
        </StatCard>

        <StatCard title="Social">
          <div className="text-2xl font-bold text-red-600">
            {analysis.metrics?.socialPercent || 0}%
          </div>
        </StatCard>
      </div>

      {/* Charts */}
      <Charts 
        metrics={analysis.metrics || {}} 
        topWasters={analysis.top_time_wasters || []} 
      />

      {/* Recommended Routine */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">📅 Recommended Routine</h4>
        {Array.isArray(analysis.recommended_routine) && analysis.recommended_routine.length > 0 ? (
          <div className="space-y-3">
            {analysis.recommended_routine.map((routine, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                  {index + 1}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {routine.time} - {routine.activity}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{routine.reason}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No routine suggestions available.</p>
        )}
      </div>

      {/* Actions to Cut */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">🔧 Actions to Improve</h4>
        {Array.isArray(analysis.actions_to_cut) && analysis.actions_to_cut.length > 0 ? (
          <ul className="space-y-2">
            {analysis.actions_to_cut.map((action, index) => (
              <li key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-semibold text-sm">
                  ⚡
                </div>
                <div>
                  <div className="font-medium text-gray-900">{action.action}</div>
                  {action.estimated_productive_gain && (
                    <div className="text-sm text-green-600 mt-1">
                      Estimated gain: {action.estimated_productive_gain}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No improvement actions suggested.</p>
        )}
      </div>

      {/* Raw Data Sample (for debugging) */}
      {process.env.NODE_ENV === 'development' && data.rawSample && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Debug - Raw Sample</h4>
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify(data.rawSample, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}