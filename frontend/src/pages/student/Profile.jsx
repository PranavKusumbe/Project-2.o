import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User,
  Mail,
  Phone,
  BookOpen,
  Award,
  TrendingUp,
  Calendar,
  Edit2,
  Check,
  X
} from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useAuthStore } from '../../store/useStore';
import { performanceAPI, authAPI } from '../../services/api';

const Profile = () => {
  const { user, setUser } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: user?.username || '',
    mobile: user?.mobile || '',
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await performanceAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await authAPI.updateProfile(editData);
      setUser({ ...user, ...editData });
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleCancelEdit = () => {
    setEditData({
      username: user?.username || '',
      mobile: user?.mobile || '',
    });
    setEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">View and manage your profile information</p>
      </div>

      {/* Profile Card */}
      <Card>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white text-5xl font-bold mb-4">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900">{user?.username}</h2>
              <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
              <div className="mt-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                Standard {user?.std}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
              {!editing ? (
                <Button onClick={() => setEditing(true)} variant="secondary" size="sm">
                  <Edit2 size={16} />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSaveProfile} size="sm">
                    <Check size={16} />
                    Save
                  </Button>
                  <Button onClick={handleCancelEdit} variant="secondary" size="sm">
                    <X size={16} />
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Username */}
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-2">
                  <User size={16} />
                  Username
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={editData.username}
                    onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{user?.username}</p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-2">
                  <Phone size={16} />
                  Mobile Number
                </label>
                {editing ? (
                  <input
                    type="tel"
                    value={editData.mobile}
                    onChange={(e) => setEditData({ ...editData, mobile: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{user?.mobile || 'Not provided'}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-2">
                  <BookOpen size={16} />
                  Role
                </label>
                <p className="text-gray-900 font-medium capitalize">{user?.role}</p>
              </div>

              {/* Standard */}
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-2">
                  <Award size={16} />
                  Standard
                </label>
                <p className="text-gray-900 font-medium">{user?.std}</p>
              </div>

              {/* Joined Date */}
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-2">
                  <Calendar size={16} />
                  Member Since
                </label>
                <p className="text-gray-900 font-medium">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card hover={false} className="bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500 rounded-xl">
                <BookOpen size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Tests Taken</p>
                <p className="text-2xl font-bold text-blue-900">{stats?.totalTests || 0}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card hover={false} className="bg-gradient-to-br from-green-50 to-green-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500 rounded-xl">
                <Award size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Average Score</p>
                <p className="text-2xl font-bold text-green-900">{stats?.averageScore || 0}%</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card hover={false} className="bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500 rounded-xl">
                <TrendingUp size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-600 font-medium">Rank</p>
                <p className="text-2xl font-bold text-purple-900">#{stats?.rank || 'N/A'}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Achievements */}
      <Card>
        <h3 className="text-xl font-bold text-gray-900 mb-6">Achievements & Badges</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats?.achievements?.length > 0 ? (
            stats.achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl"
              >
                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Award size={32} className="text-white" />
                </div>
                <p className="font-medium text-gray-900">{achievement.name}</p>
                <p className="text-xs text-gray-600">{achievement.description}</p>
              </motion.div>
            ))
          ) : (
            <>
              <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                  <BookOpen size={32} className="text-gray-500" />
                </div>
                <p className="font-medium text-gray-700">First Test</p>
                <p className="text-xs text-gray-500">Complete your first test</p>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Award size={32} className="text-gray-500" />
                </div>
                <p className="font-medium text-gray-700">Top Scorer</p>
                <p className="text-xs text-gray-500">Score above 90%</p>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                  <TrendingUp size={32} className="text-gray-500" />
                </div>
                <p className="font-medium text-gray-700">Consistency</p>
                <p className="text-xs text-gray-500">5 tests in a row</p>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                  <BookOpen size={32} className="text-gray-500" />
                </div>
                <p className="font-medium text-gray-700">Subject Master</p>
                <p className="text-xs text-gray-500">Complete all chapters</p>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Profile;
