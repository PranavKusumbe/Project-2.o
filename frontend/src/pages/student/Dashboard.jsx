import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Video, 
  FileText, 
  Trophy, 
  Clock,
  TrendingUp,
  Target,
  Award
} from 'lucide-react';
import Card from '../../components/Card';
import { useAuthStore } from '../../store/useStore';
import { performanceAPI, curriculumAPI } from '../../services/api';

const StudentDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    videosWatched: 0,
    testsCompleted: 0,
    averageScore: 0,
    rank: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [performanceRes] = await Promise.all([
        performanceAPI.getStats().catch(() => ({ data: { stats: {} } })),
      ]);
      
      setStats({
        videosWatched: performanceRes.data.stats.videosWatched || 0,
        testsCompleted: performanceRes.data.stats.testsCompleted || 0,
        averageScore: performanceRes.data.stats.averageScore || 0,
        rank: performanceRes.data.stats.rank || 0,
        recentActivity: performanceRes.data.stats.recentActivity || [],
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      icon: Video,
      label: 'Videos Watched',
      value: stats.videosWatched,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: FileText,
      label: 'Tests Completed',
      value: stats.testsCompleted,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Target,
      label: 'Average Score',
      value: `${stats.averageScore}%`,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Trophy,
      label: 'Your Rank',
      value: stats.rank || 'N/A',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ];

  const quickActions = [
    {
      icon: BookOpen,
      title: 'Start Learning',
      description: 'Browse subjects and chapters',
      link: '/student/learning',
      gradient: 'from-primary-500 to-primary-600',
    },
    {
      icon: Video,
      title: 'Watch Videos',
      description: 'Educational video library',
      link: '/student/videos',
      gradient: 'from-accent-500 to-accent-600',
    },
    {
      icon: FileText,
      title: 'Take Tests',
      description: 'Practice with MCQ tests',
      link: '/student/tests',
      gradient: 'from-green-500 to-green-600',
    },
    {
      icon: Trophy,
      title: 'View Leaderboard',
      description: 'See top performers',
      link: '/student/leaderboard',
      gradient: 'from-yellow-500 to-yellow-600',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.username}! 👋
        </h1>
        <p className="text-gray-600">
          Standard {user?.std} • Ready to continue your learning journey?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover={false} className="relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bgColor} rounded-full -mr-12 -mt-12 opacity-50`} />
              <div className="relative">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white mb-4`}>
                  <stat.icon size={24} />
                </div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Link to={action.link}>
                <Card className="h-full group">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${action.gradient} text-white mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon size={28} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <Card>
          {stats.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Clock size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <TrendingUp size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No recent activity yet.</p>
              <p className="text-gray-500 text-sm mt-2">Start learning to see your progress here!</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
