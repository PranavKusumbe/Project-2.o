import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  FileText,
  Clock,
  Activity
} from 'lucide-react';
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
  ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [overview, setOverview] = useState({
    weeklyPerformance: [],
    subjectPerformance: [],
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, overviewResponse] = await Promise.all([
        performanceAPI.getTeacherStats(),
        performanceAPI.getTeacherOverview()
      ]);

      setStats(statsResponse.data.stats || {});
      setOverview({
        weeklyPerformance: overviewResponse.data.weeklyPerformance || [],
        subjectPerformance: overviewResponse.data.subjectPerformance || [],
        recentActivities: overviewResponse.data.recentActivities || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setStats({
        total_students: 0,
        active_students: 0,
        avg_class_score: 0,
        total_tests: 0
      });
      setOverview({ weeklyPerformance: [], subjectPerformance: [], recentActivities: [] });
    } finally {
      setLoading(false);
    }
  };

  const testsThisWeek = overview.weeklyPerformance.reduce((sum, entry) => sum + entry.tests, 0);
  const averageThisWeek = overview.weeklyPerformance.length
    ? Number(
        (
          overview.weeklyPerformance.reduce((sum, entry) => sum + entry.average, 0) /
          overview.weeklyPerformance.length
        ).toFixed(1)
      )
    : 0;

  const statCards = [
    {
      title: 'Total Students',
      value: stats?.total_students || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      link: '/teacher/students',
      change: `${testsThisWeek} tests completed this week`
    },
    {
      title: 'Active Today',
      value: stats?.active_students || 0,
      icon: Activity,
      color: 'from-green-500 to-green-600',
      link: '/teacher/students',
      change: stats?.total_students
        ? `${Math.round((stats.active_students / Math.max(stats.total_students, 1)) * 100)}% of class`
        : 'No recent activity'
    },
    {
      title: 'Avg. Class Score',
      value: `${stats?.avg_class_score || 0}%`,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      link: '/teacher/performance',
      change: averageThisWeek ? `Weekly avg: ${averageThisWeek}%` : 'No tests this week'
    },
    {
      title: 'Tests Created',
      value: stats?.total_tests || 0,
      icon: FileText,
      color: 'from-pink-500 to-pink-600',
      link: '/teacher/tests',
      change: 'Available across all standards'
    }
  ];

  const quickActions = [
    {
      title: 'View Students',
      description: 'Manage student profiles',
      icon: Users,
      link: '/teacher/students',
      color: 'bg-blue-500'
    },
    {
      title: 'Performance',
      description: 'View detailed analytics',
      icon: TrendingUp,
      link: '/teacher/performance',
      color: 'bg-purple-500'
    }
  ];

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Teacher Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your students.</p>
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
            <Link to={stat.link}>
              <Card className="group hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                    <span className="text-green-600 text-xs font-medium">{stat.change}</span>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon size={24} className="text-white" />
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Performance Chart */}
        <Card>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Class Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={overview.weeklyPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="average" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Average Score"
              />
              <Line 
                type="monotone" 
                dataKey="tests" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Tests Taken"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Subject Performance Chart */}
        <Card>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Subject-wise Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={overview.subjectPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="average" fill="#8b5cf6" name="Average %" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={action.link}>
                <div className="p-4 rounded-lg border-2 border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all group">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <action.icon size={24} className="text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">{action.title}</h4>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Student Activity</h3>
        <div className="space-y-3">
          {overview.recentActivities.length > 0 ? (
            overview.recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold">
                            {activity.studentName ? activity.studentName[0] : '?'}
                  </div>
                  <div>
                            <p className="font-medium text-gray-900">{activity.studentName || 'Unknown Student'}</p>
                    <p className="text-sm text-gray-600">
                              {(activity.testTitle || 'Test')} &middot; {(activity.subject || 'Subject')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {activity.percentage !== null && activity.percentage !== undefined ? (
                    <p className="font-bold text-green-600 mb-1">{activity.percentage}%</p>
                  ) : null}
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} />
                    {activity.submittedAt ? new Date(activity.submittedAt).toLocaleString() : 'No timestamp'}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No recent activity recorded.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
