import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, CheckCircle, XCircle, Home, RotateCcw } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';

const TestResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <div className="text-center">
            <p className="text-gray-600 mb-4">No result data available</p>
            <Button onClick={() => navigate('/student/tests')}>
              Go to Tests
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const score = Number(result.score ?? 0);
  const correct = Number(result.correct ?? result.correctAnswers ?? 0);
  const totalQuestions = Number(result.totalQuestions ?? result.total ?? 0);
  const totalMarks = Number(
    result.totalMarks != null ? result.totalMarks : totalQuestions
  ) || 0;
  const passed = Boolean(result.passed);
  const computedPercentage = totalMarks
    ? (score / totalMarks) * 100
    : 0;
  const percentage = Number(
    Number(result.percentage ?? computedPercentage).toFixed(2)
  );
  const displayPercentage = Math.round(percentage);
  const incorrect = Math.max(totalQuestions - correct, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Result Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="text-center mb-6">
            {/* Score Circle */}
            <div className="mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className={`w-40 h-40 mx-auto rounded-full flex items-center justify-center ${
                  passed 
                    ? 'bg-gradient-to-br from-green-400 to-green-600' 
                    : 'bg-gradient-to-br from-red-400 to-red-600'
                }`}
              >
                <div className="text-center">
                  <div className="text-5xl font-bold text-white mb-1">
                    {displayPercentage}%
                  </div>
                  <div className="text-white text-sm font-medium">
                    {correct}/{totalQuestions}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Status */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                {passed ? (
                  <CheckCircle size={32} className="text-green-600" />
                ) : (
                  <XCircle size={32} className="text-red-600" />
                )}
                <h1 className={`text-3xl font-bold ${
                  passed ? 'text-green-600' : 'text-red-600'
                }`}>
                  {passed ? 'Congratulations!' : 'Keep Practicing!'}
                </h1>
              </div>
              <p className="text-gray-600 text-lg">
                {passed 
                  ? 'You have successfully passed the test!' 
                  : 'Don\'t worry, you can try again!'}
              </p>
            </motion.div>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-green-50 border-green-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500 rounded-lg">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-700 font-medium">Correct</p>
                  <p className="text-2xl font-bold text-green-900">{correct}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-red-50 border-red-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-500 rounded-lg">
                  <XCircle size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-red-700 font-medium">Incorrect</p>
                  <p className="text-2xl font-bold text-red-900">{incorrect}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Achievement Badge */}
        {passed && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 mb-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
                  <Award size={32} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-lg text-gray-900 mb-1">
                    Achievement Unlocked!
                  </p>
                  <p className="text-gray-600">
                    You've earned {Math.floor(score * 10)} points
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex gap-4"
        >
          <Button
            onClick={() => navigate('/student/dashboard')}
            variant="outline"
            className="flex-1"
          >
            <Home size={18} />
            Dashboard
          </Button>
          <Button
            onClick={() => navigate('/student/tests')}
            variant="primary"
            className="flex-1"
          >
            <RotateCcw size={18} />
            More Tests
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default TestResult;
