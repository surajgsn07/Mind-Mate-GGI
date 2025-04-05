import React, { useEffect, useState } from 'react';
import axiosInstance from '../../config/axiosConfig';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const getToneColor = (tone) => {
  switch (tone?.toLowerCase()) {
    case 'professional':
      return 'bg-green-100 text-green-700';
    case 'casual':
      return 'bg-yellow-100 text-yellow-700';
    case 'mixed':
      return 'bg-blue-100 text-blue-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 animate-pulse">
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-4" />
    <div className="h-6 bg-gray-200 rounded-full w-24 mb-6" />
    <div className="space-y-3">
      <div className="h-4 bg-gray-300 rounded w-full" />
      <div className="h-4 bg-gray-300 rounded w-5/6" />
      <div className="h-4 bg-gray-300 rounded w-2/3" />
      <div className="h-4 bg-gray-300 rounded w-1/2" />
    </div>
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div className="h-2 bg-gray-300 rounded-full w-full" />
      <div className="h-2 bg-gray-300 rounded-full w-full" />
    </div>
    <div className="h-4 bg-gray-200 rounded w-1/3 mt-6" />
  </div>
);

const InterviewReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axiosInstance.get('/interview-reports/get');
        if (response.data) {
          setReports(response.data);
        }
      } catch (err) {
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Prepare data for chart
  const chartData = {
    labels: reports.map((_, i) => `Report ${i + 1}`),
    datasets: [
      {
        label: 'Avg Response Time (sec)',
        data: reports.map(r => Number(r.averageResponseTime || 0).toFixed(2)),
        backgroundColor: 'rgba(59,130,246,0.3)',
        borderColor: '#3B82F6',
        tension: 0.3,
        fill: false,
      },
      {
        label: 'Duration (min)',
        data: reports.map(r => Number(r.duration || 0).toFixed(2)),
        backgroundColor: 'rgba(34,197,94,0.3)',
        borderColor: '#22C55E',
        tension: 0.3,
        fill: false,
      },
      {
        label: 'Confidence (%)',
        data: reports.map(r => Number(r.confidence || 0).toFixed(2)),
        backgroundColor: 'rgba(168,85,247,0.3)',
        borderColor: '#A855F7',
        tension: 0.3,
        fill: false,
      },
    ],
  };
  

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#374151', // text-gray-700
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  

  return (
    <div className="p-6">
      <div className="bg-white p-4 mb-6 rounded-xl shadow border">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Interview Stats Overview</h2>
        {!loading && reports.length > 0 ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <div className="text-gray-500 text-sm">No data available for chart.</div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : reports.map((report, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 transition hover:shadow-2xl"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Interview Report #{index + 1}
                  </h2>
                 
                </div>

                <div className="space-y-3 text-gray-800">
                  <p><strong>🕒 Duration:</strong> {report.duration || '0'} minutes</p>
                  <p><strong>❓ Questions Asked:</strong> {report.questionsAsked || '0'}</p>
        <p>
  <strong>⏱️ Avg Response Time:</strong>{' '}
  {report.averageResponseTime ? Number(report.averageResponseTime).toFixed(2) : '0'} sec
</p>


                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Expression : {report.expression}</p>
                      <div className="h-2 bg-gray-300 rounded-full">
                        
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Confidence</p>
                      <div className="h-2 bg-gray-300 rounded-full">
                        <div
                          className="h-2 bg-purple-500 rounded-full"
                          style={{ width: `${(report.confidence || 0)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-500">
                  Created on: {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'Unknown'}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default InterviewReports;
