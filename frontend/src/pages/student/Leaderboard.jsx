import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Award, Medal, Crown, TrendingUp } from 'lucide-react';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import { performanceAPI } from '../../services/api';
import { useAuthStore } from '../../store/useStore';

const Leaderboard = () => {
  const { user } = useAuthStore();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await performanceAPI.getLeaderboard(user.std);
      setLeaderboard(response.data.leaderboard || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown size={28} className="text-yellow-500" />;
      case 2:
        return <Medal size={28} className="text-gray-400" />;
      case 3:
        return <Award size={28} className="text-orange-600" />;
      default:
        return <Trophy size={24} className="text-gray-400" />;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-yellow-500';
      case 2:
        return 'from-gray-300 to-gray-400';
      case 3:
        return 'from-orange-400 to-orange-500';
      default:
        return 'from-gray-200 to-gray-300';
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
        <p className="text-gray-600">
          Top performers in Standard {user?.std}
        </p>
      </div>

      {/* Top 3 */}
      {leaderboard.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leaderboard.slice(0, 3).map((student, index) => (
            <motion.div
              key={student.rank}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`text-center bg-gradient-to-br ${getRankColor(student.rank)} text-white`}>
                <div className="mb-4">
                  {getRankIcon(student.rank)}
                </div>
                <div className={`text-4xl font-bold mb-2 ${student.rank === 1 ? 'text-yellow-100' : 'text-white'}`}>
                  #{student.rank}
                </div>
                <h3 className="text-xl font-bold mb-1">{student.username}</h3>
                <p className="text-lg font-semibold opacity-90">{student.score}% Average</p>
                <p className="text-sm opacity-75">{student.tests_completed} tests completed</p>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Full Leaderboard */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-4">All Rankings</h2>
        <div className="space-y-3">
          {leaderboard.map((student, index) => (
            <motion.div
              key={student.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-4 p-4 rounded-lg ${
                student.username === user.username
                  ? 'bg-primary-50 border-2 border-primary-200'
                  : 'bg-gray-50'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                #{student.rank}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">
                  {student.username}
                  {student.username === user.username && (
                    <span className="ml-2 text-xs text-primary-600 font-medium">(You)</span>
                  )}
                </h4>
                <p className="text-sm text-gray-600">
                  {student.tests_completed} tests completed
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{student.score}%</div>
                <p className="text-xs text-gray-500">Average Score</p>
              </div>
            </motion.div>
          ))}
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-12">
            <TrendingUp size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No leaderboard data yet</p>
            <p className="text-gray-500 text-sm mt-2">Complete tests to appear on the leaderboard!</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Leaderboard;
