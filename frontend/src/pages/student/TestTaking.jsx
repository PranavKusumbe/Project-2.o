import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, AlertCircle, ArrowLeft, ArrowRight, Send } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import { testAPI } from '../../services/api';

const TestTaking = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [initialTime, setInitialTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    fetchTest();
  }, [testId]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const fetchTest = async () => {
    try {
      const response = await testAPI.getTestDetails(testId);
      const fetchedTest = response.data.test;
      const fetchedQuestions = response.data.questions || [];
      const totalSeconds = Math.max((fetchedTest?.duration || 30) * 60, 0);

      setTest(fetchedTest);
      setQuestions(fetchedQuestions);
      setInitialTime(totalSeconds);
      setTimeLeft(totalSeconds);
    } catch (error) {
      console.error('Error fetching test:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    const unanswered = questions.filter(q => !answers[q.id]);
    if (unanswered.length > 0 && !showWarning) {
      setShowWarning(true);
      return;
    }

    setSubmitting(true);
    try {
      const timeTaken = Math.max(initialTime - timeLeft, 0);
      const response = await testAPI.submitTest(testId, answers, timeTaken);
      const resultPayload = response.data?.data || {};

      navigate(`/student/test-result/${testId}`, {
        state: { result: resultPayload }
      });
    } catch (error) {
      console.error('Error submitting test:', error);
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const total = questions.length;
    if (!total) return 0;
    const answered = Object.keys(answers).length;
    return Math.round((answered / total) * 100);
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-lg text-center">
          <p className="text-lg font-medium text-gray-800 mb-2">No questions available</p>
          <p className="text-gray-600 mb-6">This test has not been configured with any questions yet. Please check back later.</p>
          <Button onClick={() => navigate('/student/tests')} variant="primary">
            Back to Tests
          </Button>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const isAnswered = answers[question?.id] !== undefined;
  const progress = getProgress();

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {test?.title}
              </h1>
              <p className="text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              timeLeft < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            }`}>
              <Clock size={20} />
              <span className="font-bold text-lg">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="absolute h-full bg-gradient-to-r from-primary-500 to-primary-600"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>{Object.keys(answers).length} answered</span>
            <span>{questions.length - Object.keys(answers).length} remaining</span>
          </div>
        </Card>

        {/* Question Card */}
        <Card className="mb-6">
          <div className="flex items-start gap-3 mb-6">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
              {currentQuestion + 1}
            </div>
            <div className="flex-1">
              <p className="text-lg text-gray-900 font-medium">
                {question?.question}
              </p>
            </div>
            {isAnswered && (
              <CheckCircle size={24} className="text-green-600 flex-shrink-0" />
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {['option_a', 'option_b', 'option_c', 'option_d'].map((optionKey, index) => {
              const optionLabel = String.fromCharCode(65 + index);
              const isSelected = answers[question?.id] === optionLabel;
              
              return (
                <motion.button
                  key={optionKey}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(question.id, optionLabel)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      isSelected
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {optionLabel}
                    </div>
                    <span className="text-gray-900">{question?.[optionKey]}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </Card>

        {/* Warning Message */}
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="border-yellow-300 bg-yellow-50">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-yellow-600 flex-shrink-0" size={24} />
                <div>
                  <p className="font-medium text-yellow-900 mb-1">
                    Unanswered Questions
                  </p>
                  <p className="text-sm text-yellow-700">
                    You have {questions.length - Object.keys(answers).length} unanswered questions. 
                    Are you sure you want to submit?
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            variant="outline"
          >
            <ArrowLeft size={18} />
            Previous
          </Button>

          <div className="flex gap-2 flex-wrap justify-center">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-lg font-medium transition-all ${
                  index === currentQuestion
                    ? 'bg-primary-600 text-white'
                    : answers[questions[index]?.id] !== undefined
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestion === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              variant="primary"
            >
              <Send size={18} />
              {submitting ? 'Submitting...' : 'Submit Test'}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
              variant="primary"
            >
              Next
              <ArrowRight size={18} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestTaking;
