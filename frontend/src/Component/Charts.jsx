// frontend/src/Component/Charts.jsx
import React from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function Charts({ metrics = {}, topWasters = [] }) {
  // Handle metrics data structure from Gemini
  const categoryData = {
    labels: ['Productive', 'Entertainment', 'Social'],
    datasets: [
      {
        data: [
          metrics.productivePercent || 0,
          metrics.entertainmentPercent || 0,
          metrics.socialPercent || 0
        ],
        backgroundColor: [
          '#10B981', // green
          '#F59E0B', // amber
          '#EF4444'  // red
        ]
      }
    ]
  };

  // Handle top time wasters
  const appLabels = topWasters.map(item => item.activity || "Unknown");
  const appData = topWasters.map(item => item.minutes || 0);

  const barData = {
    labels: appLabels,
    datasets: [
      {
        label: "Minutes",
        data: appData,
        backgroundColor: '#8B5CF6', // purple
        borderColor: '#7C3AED',
        borderWidth: 1
      }
    ]
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw}%`;
          }
        }
      }
    }
  };

  const barOptions = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Minutes'
        }
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {/* Category Breakdown Pie Chart */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <h4 className="font-semibold text-gray-900 mb-4 text-center">Time Distribution</h4>
        {metrics.productivePercent !== undefined ? (
          <div className="h-64 flex items-center justify-center">
            <Pie data={categoryData} options={pieOptions} />
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8">No category data available</div>
        )}
      </div>

      {/* Top Time Wasters Bar Chart */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <h4 className="font-semibold text-gray-900 mb-4 text-center">Top Time Wasters</h4>
        {appLabels.length > 0 ? (
          <div className="h-64">
            <Bar data={barData} options={barOptions} />
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8">No time waster data available</div>
        )}
      </div>
    </div>
  );
}