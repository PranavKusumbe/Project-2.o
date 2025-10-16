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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      const response = await performanceAPI.getTeacherStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sample data
  const monthlyData = [
    { month: 'Jan', avgScore: 72, students: 40 },
    { month: 'Feb', avgScore: 75, students: 42 },
    { month: 'Mar', avgScore: 78, students: 45 },
    { month: 'Apr', avgScore: 80, students: 45 },
    { month: 'May', avgScore: 82, students: 48 }
  ];

  const subjectData = [
    { subject: 'Math', A: 30, B: 40, C: 20, D: 10 },
    { subject: 'English', A: 35, B: 45, C: 15, D: 5 },
    { subject: 'Science', A: 28, B: 42, C: 22, D: 8 },
    { subject: 'Social', A: 32, B: 38, C: 20, D: 10 }
  ];

  const skillsData = [
    { skill: 'Problem Solving', value: 85 },
    { skill: 'Critical Thinking', value: 78 },
    { skill: 'Communication', value: 82 },
    { skill: 'Creativity', value: 75 },
    { skill: 'Collaboration', value: 80 }
  ];

  const statCards = [
    {
      title: 'Class Average',
      value: '78%',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      change: '+5% from last month'
    },
    {
      title: 'Total Students',
      value: '45',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      change: '+3 new students'
    },
    {
      title: 'Top Performers',
      value: '12',
      icon: Award,
      color: 'from-yellow-500 to-yellow-600',
      change: 'Above 90%'
    },
    {
      title: 'Completion Rate',
      value: '92%',
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      change: 'Test completion'
    }
  ];

  if (loading) {
    return <Loader fullScreen />;
  }

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
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="avgScore" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Average Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Grade Distribution */}
        <Card>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Grade Distribution by Subject</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectData}>
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
        </Card>
      </div>

      {/* Skills Radar Chart */}
      <Card>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Overall Skills Assessment</h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={skillsData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="skill" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar 
              name="Class Average" 
              dataKey="value" 
              stroke="#8b5cf6" 
              fill="#8b5cf6" 
              fillOpacity={0.6} 
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </Card>

      {/* Top Performers */}
      <Card>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Top Performers This Month</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { rank: 1, name: 'Priya Patel', score: 95, tests: 15 },
            { rank: 2, name: 'Rahul Sharma', score: 92, tests: 14 },
            { rank: 3, name: 'Sneha Reddy', score: 90, tests: 13 }
          ].map((student, index) => (
            <motion.div
              key={student.rank}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {student.rank}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{student.name}</p>
                  <p className="text-sm text-gray-600">{student.tests} tests completed</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-yellow-700">{student.score}%</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Performance;
