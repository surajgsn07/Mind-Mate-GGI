import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format, subDays, addDays, isSameDay } from 'date-fns';
import axiosInstance from '../config/axiosConfig';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

// Global events array matching your schema
const events = [
  {
    _id: '65f8a3d9e1b9f3a9c7d8e5f1',
    user: '65f8a3d9e1b9f3a9c7d8e5a1',
    title: 'Technical Screening',
    description: 'Assessing core programming skills and problem-solving approach',
    date: new Date('2023-10-15T10:30:00')
  },
  {
    _id: '65f8a3d9e1b9f3a9c7d8e5f2',
    user: '65f8a3d9e1b9f3a9c7d8e5a2',
    title: 'System Design Review',
    description: 'Evaluating architecture design skills for scalable systems',
    date: new Date('2023-10-16T14:00:00')
  },
  {
    _id: '65f8a3d9e1b9f3a9c7d8e5f3',
    user: '65f8a3d9e1b9f3a9c7d8e5a3',
    title: 'Cultural Fit Interview',
    description: 'Assessing alignment with company values and team dynamics',
    date: new Date('2023-10-17T11:15:00')
  },
  {
    _id: '65f8a3d9e1b9f3a9c7d8e5f4',
    user: '65f8a3d9e1b9f3a9c7d8e5a1',
    title: 'Final Round',
    description: 'Meeting with senior leadership and final evaluation',
    date: new Date('2023-10-18T09:45:00')
  },
  {
    _id: '65f8a3d9e1b9f3a9c7d8e5f5',
    user: '65f8a3d9e1b9f3a9c7d8e5a2',
    title: 'HR Discussion',
    description: 'Compensation, benefits, and policy overview',
    date: new Date('2023-10-19T16:30:00')
  }
];

// Mock user data for reference
const users = {
  '65f8a3d9e1b9f3a9c7d8e5a1': { name: 'John Doe', role: 'Engineering Manager' },
  '65f8a3d9e1b9f3a9c7d8e5a2': { name: 'Jane Smith', role: 'HR Specialist' },
  '65f8a3d9e1b9f3a9c7d8e5a3': { name: 'Alex Johnson', role: 'Tech Lead' }
};

// Generate demo interview performance data
const generatePerformanceData = () => {
  const data = [];
  for (let i = 30; i >= 0; i--) {
    data.push({
      date: subDays(new Date(), i),
      score: Math.floor(Math.random() * 30) + 70,
      interviews: Math.floor(Math.random() * 5) + 1
    });
  }
  return data;
};

const AnalyticsDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const performanceData = generatePerformanceData();
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false);
  
  // Filter data for last 7 days for the chart
  const chartData = performanceData.slice(-7);
  const fetchEvents = async()=>{
    try {
      setLoading(true);
        const response = await axiosInstance.get('/event');
        if(response.data){
            console.log("events : " , response.data.events);
            setEvents(response.data.events);
        }
    } catch (error) {
        console.log("events error : " , error);
    }finally{
      setLoading(false);
    }
}
  
  // Filter events for selected date
  const dailyEvents = events.filter(event => 
    isSameDay(event.date, selectedDate)
  );

  // Line chart configuration
  const chartConfig = {
    labels: chartData.map(item => format(item.date, 'EEE')),
    datasets: [
      {
        label: 'Performance Score',
        data: chartData.map(item => item.score),
        borderColor: '#0d9488',
        backgroundColor: 'rgba(13, 148, 136, 0.1)',
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#0d9488',
        pointBorderWidth: 2,
        pointRadius: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => `Score: ${context.raw}%`
        }
      }
    },
    scales: {
      y: {
        min: 60,
        max: 100,
        ticks: {
          stepSize: 10,
          callback: (value) => `${value}%`
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  // Calendar navigation
  const navigateDays = (days) => {
    setSelectedDate(addDays(selectedDate, days));
  };

  useEffect(() => {
    fetchEvents();
  }, [])
  

  return (
    <div className="min-h-screen bg-teal-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-teal-800">Interview Analytics Dashboard</h1>
          <p className="text-teal-600">Track performance and upcoming interviews</p>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-teal-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-teal-800">Weekly Performance</h2>
              <div className="flex space-x-2">
                <span className="px-3 py-1 bg-teal-100 text-teal-800 text-sm rounded-full">
                  Last 7 days
                </span>
              </div>
            </div>
            <div className="h-80">
              <Line data={chartConfig} options={chartOptions} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="bg-teal-50 p-3 rounded-lg">
                <p className="text-sm text-teal-600">Avg Score</p>
                <p className="text-2xl font-bold text-teal-800">
                  {Math.round(chartData.reduce((sum, item) => sum + item.score, 0) / chartData.length)}%
                </p>
              </div>
              <div className="bg-teal-50 p-3 rounded-lg">
                <p className="text-sm text-teal-600">Total Interviews</p>
                <p className="text-2xl font-bold text-teal-800">
                  {chartData.reduce((sum, item) => sum + item.interviews, 0)}
                </p>
              </div>
              <div className="bg-teal-50 p-3 rounded-lg">
                <p className="text-sm text-teal-600">High Score</p>
                <p className="text-2xl font-bold text-teal-800">
                  {Math.max(...chartData.map(item => item.score))}%
                </p>
              </div>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-teal-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-teal-800">Interview Calendar</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => navigateDays(-1)}
                  className="p-1 text-teal-600 hover:bg-teal-50 rounded"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button 
                  onClick={() => setSelectedDate(new Date())}
                  className="px-3 py-1 text-sm text-teal-800 bg-teal-100 rounded"
                >
                  Today
                </button>
                <button 
                  onClick={() => navigateDays(1)}
                  className="p-1 text-teal-600 hover:bg-teal-50 rounded"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-center text-lg font-medium text-teal-800 mb-2">
                {format(selectedDate, 'MMMM d, yyyy')}
              </div>
              <div className="text-center text-sm text-teal-600">
                {format(selectedDate, 'EEEE')}
              </div>
            </div>

            {dailyEvents.length > 0 ? (
              <div className="space-y-3">
                {dailyEvents.map(event => (
                  <div key={event._id} className="p-3 bg-teal-50 rounded-lg border border-teal-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-teal-800">{event.title}</h3>
                        <p className="text-sm text-teal-600 mb-1">{event.description}</p>
                        <p className="text-xs text-teal-500">
                          With: {users[event.user]?.name || 'Unknown'} • {format(event.date, 'h:mm a')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-teal-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2">No interviews scheduled</p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-teal-100">
              <h3 className="text-sm font-medium text-teal-800 mb-2">Upcoming Interviews</h3>
              <div className="space-y-2">
                {events
                  .filter(event => event.date > new Date())
                  .slice(0, 3)
                  .map(event => (
                    <div key={event._id} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
                      <span className="text-teal-800">{format(event.date, 'MMM d')}</span>
                      <span className="mx-2 text-teal-400">•</span>
                      <span className="text-teal-600 truncate">{event.title}</span>
                      <span className="ml-auto text-xs text-teal-500">
                        {users[event.user]?.name.split(' ')[0] || 'Unknown'}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;