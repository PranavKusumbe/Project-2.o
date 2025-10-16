import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Target, Calendar } from 'lucide-react';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import { performanceAPI } from '../../services/api';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Performance = () => {
  const [stats, setStats] = useState(null);
  const [testHistory, setTestHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      const response = await performanceAPI.getStats();
      setStats(response.data.stats);
      setTestHistory(response.data.testHistory || []);
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  // Sample data for charts (replace with real data)
  const progressData = testHistory.map((test, index) => ({
    name: `Test ${index + 1}`,
    score: test.score,
    average: 75
  }));

  const subjectData = [
    { name: 'Math', value: stats?.math_score || 75 },
    { name: 'English', value: stats?.english_score || 80 },
    { name: 'Science', value: stats?.science_score || 85 },
    { name: 'Social Studies', value: stats?.social_score || 70 }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const statCards = [
    {
      title: 'Tests Completed',
      value: stats?.tests_completed || 0,
      icon: Award,
      color: 'from-blue-500 to-blue-600',
      change: '+12%'
    },
    {
      title: 'Average Score',
      value: `${stats?.average_score || 0}%`,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      change: '+8%'
    },
    {
      title: 'Study Streak',
      value: `${stats?.study_streak || 0} days`,
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      change: '+3 days'
    },
    {
      title: 'Accuracy',
      value: `${stats?.accuracy || 0}%`,
      icon: Target,
      color: 'from-pink-500 to-pink-600',
      change: '+5%'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Performance Tracker</h1>
        <p className="text-gray-600">Track your learning progress and achievements</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <span className="text-green-600 text-sm font-medium">{stat.change}</span>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <stat.icon size={24} className="text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Line Chart */}
        <Card>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Score Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Your Score"
              />
              <Line 
                type="monotone" 
                dataKey="average" 
                stroke="#10b981" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Class Average"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Subject Pie Chart */}
        <Card>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Subject-wise Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={subjectData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {subjectData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Test History Table */}
      <Card>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Test History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Test</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Subject</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Score</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Date</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {testHistory.length > 0 ? (
                testHistory.map((test, index) => (
                  <motion.tr
                    key={test.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">{test.title}</td>
                    <td className="py-3 px-4">{test.subject}</td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${
                        test.score >= 80 ? 'text-green-600' : 
                        test.score >= 60 ? 'text-yellow-600' : 
                        'text-red-600'
                      }`}>
                        {test.score}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(test.completed_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        test.passed 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {test.passed ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No test history available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Achievements */}
      <Card>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'First Perfect Score', icon: '🏆', date: 'Dec 15, 2024' },
            { title: '7-Day Streak', icon: '🔥', date: 'Dec 14, 2024' },
            { title: 'Math Master', icon: '🎯', date: 'Dec 10, 2024' }
          ].map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
            >
              <div className="text-4xl mb-2">{achievement.icon}</div>
              <h4 className="font-bold text-gray-900 mb-1">{achievement.title}</h4>
              <p className="text-sm text-gray-600">{achievement.date}</p>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Performance;
