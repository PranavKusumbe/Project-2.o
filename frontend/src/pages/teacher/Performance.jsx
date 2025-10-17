import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Award, Target } from 'lucide-react';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import { performanceAPI } from '../../services/api';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Performance = () => {
  const [stats, setStats] = useState(null);
  const [overview, setOverview] = useState({
    monthlyPerformance: [],
    gradeDistribution: [],
    subjectPerformance: [],
    topPerformers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      const [statsResponse, overviewResponse] = await Promise.all([
        performanceAPI.getTeacherStats(),
        performanceAPI.getTeacherOverview()
      ]);

      setStats(statsResponse.data.stats || null);
      setOverview({
        monthlyPerformance: overviewResponse.data.monthlyPerformance || [],
        gradeDistribution: overviewResponse.data.gradeDistribution || [],
        subjectPerformance: overviewResponse.data.subjectPerformance || [],
        topPerformers: overviewResponse.data.topPerformers || []
      });
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const summaryStats = stats || {
    total_students: 0,
    active_students: 0,
    avg_class_score: 0,
    total_tests: 0
  };

  const completionRate = summaryStats.total_students
    ? Math.round((summaryStats.active_students / Math.max(summaryStats.total_students, 1)) * 100)
    : 0;

  const statCards = [
    {
      title: 'Class Average',
      value: `${summaryStats.avg_class_score || 0}%`,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      change: 'Average across all test attempts'
    },
    {
      title: 'Total Students',
      value: summaryStats.total_students || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      change: `${summaryStats.total_tests || 0} tests available`
    },
    {
      title: 'Top Performers',
      value: overview.topPerformers.length,
      icon: Award,
      color: 'from-yellow-500 to-yellow-600',
      change: 'Students above 75% in last 30 days'
    },
    {
      title: 'Completion Rate',
      value: `${completionRate}%`,
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      change: 'Students active in last 7 days'
    }
  ];

  if (loading) {
    return <Loader fullScreen />;
  }

  const monthlyData = overview.monthlyPerformance;
  const gradeData = overview.gradeDistribution.map((item) => ({
    subject: item.subject,
    A: item.gradeA,
    B: item.gradeB,
    C: item.gradeC,
    D: item.gradeD
  }));
  const radarData = overview.subjectPerformance.map((item) => ({
    subject: item.subject,
    average: item.average
  }));
  const topPerformers = overview.topPerformers;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Class Performance Analytics</h1>
        <p className="text-gray-600">Comprehensive view of your students' progress</p>
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

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Performance Trend</h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
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
                  name="Tests Completed"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-500 text-center py-16">No monthly test data available.</p>
          )}
        </Card>

        {/* Grade Distribution */}
        <Card>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Grade Distribution by Subject</h3>
          {gradeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gradeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="A" stackId="a" fill="#10b981" name="A Grade" />
                <Bar dataKey="B" stackId="a" fill="#3b82f6" name="B Grade" />
                <Bar dataKey="C" stackId="a" fill="#f59e0b" name="C Grade" />
                <Bar dataKey="D" stackId="a" fill="#ef4444" name="D Grade" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-500 text-center py-16">No graded test data yet.</p>
          )}
        </Card>
      </div>

      {/* Skills Radar Chart */}
      <Card>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Subject Mastery Overview</h3>
        {radarData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar 
                name="Class Average" 
                dataKey="average" 
                stroke="#8b5cf6" 
                fill="#8b5cf6" 
                fillOpacity={0.6} 
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-gray-500 text-center py-16">No subject performance data available.</p>
        )}
      </Card>

      {/* Top Performers */}
      <Card>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Top Performers This Month</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topPerformers.length > 0 ? (
            topPerformers.map((student, index) => (
              <motion.div
                key={student.studentId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-600">Std {student.std} &middot; {student.testsCompleted} tests</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-yellow-700">{student.average}%</p>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 py-6">No recent test activity to rank.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Performance;
