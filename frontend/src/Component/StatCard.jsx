// frontend/src/Component/StatCard.jsx
import React from "react";

export default function StatCard({ title, children, className = "" }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
      <h4 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
        {title}
      </h4>
      <div className="text-gray-900">
        {children}
      </div>
    </div>
  );
}