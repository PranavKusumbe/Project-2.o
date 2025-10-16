import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle, Play, Award } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import { curriculumAPI } from '../../services/api';
import { useAuthStore } from '../../store/useStore';

const Tests = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      console.log('Fetching subjects for tests, standard:', user.std);
      const response = await curriculumAPI.getSubjects(user.std);
      console.log('Tests - Subjects response:', response.data);
      setSubjects(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectClick = async (subject) => {
    setSelectedSubject(subject);
    setLoading(true);
    try {
      console.log('Fetching chapters for tests, subject:', subject.id);
      const response = await curriculumAPI.getChapters(subject.id);
      console.log('Tests - Chapters response:', response.data);
      const chapters = response.data.data || response.data || [];
      
      // Fetch all tests for this subject
      const allTests = [];
      for (const chapter of chapters) {
        const chapterRes = await curriculumAPI.getChapterDetails(chapter.id);
        console.log(`Tests for chapter ${chapter.name}:`, chapterRes.data);
        const chapterData = chapterRes.data.data || chapterRes.data;
        if (chapterData.tests) {
          allTests.push(...chapterData.tests.map(t => ({ ...t, chapterName: chapter.name })));
        }
      }
      console.log('Total tests loaded:', allTests.length);
      setTests(allTests);
    } catch (error) {
      console.error('Error fetching tests:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = (test) => {
    navigate(`/student/test/${test.id}`);
  };

  const subjectColors = [
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600',
    'from-purple-500 to-purple-600',
    'from-pink-500 to-pink-600',
    'from-yellow-500 to-yellow-600',
    'from-red-500 to-red-600',
  ];

  if (loading && !selectedSubject) {
    return <Loader fullScreen />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Online Tests</h1>
          <p className="text-gray-600">
            {selectedSubject ? `${selectedSubject.name} Tests` : `Practice tests for Standard ${user?.std}`}
          </p>
        </div>
        {selectedSubject && (
          <button
            onClick={() => {
              setSelectedSubject(null);
              setTests([]);
            }}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to Subjects
          </button>
        )}
      </div>

      {!selectedSubject ? (
        /* Subject Selection */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                onClick={() => handleSubjectClick(subject)}
                className="group cursor-pointer"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${subjectColors[index % subjectColors.length]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <FileText size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {subject.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  Take practice tests
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Tests List */
        <>
          {loading ? (
            <Loader />
          ) : tests.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tests.map((test, index) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="group hover:border-primary-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                            <FileText size={24} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                              {test.title}
                            </h3>
                            {test.chapterName && (
                              <p className="text-sm text-gray-600">
                                Chapter: {test.chapterName}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <FileText size={16} />
                            <span>{test.question_count || 10} Questions</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={16} />
                            <span>{test.duration || 30} minutes</span>
                          </div>
                          {test.completed && (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle size={16} />
                              <span>Completed</span>
                            </div>
                          )}
                        </div>

                        {test.description && (
                          <p className="text-sm text-gray-600 mb-4">
                            {test.description}
                          </p>
                        )}

                        <Button
                          onClick={() => handleStartTest(test)}
                          variant="primary"
                          size="sm"
                          className="w-full sm:w-auto"
                        >
                          <Play size={18} />
                          {test.completed ? 'Retake Test' : 'Start Test'}
                        </Button>
                      </div>

                      {test.best_score && (
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                          <Award size={24} className="text-yellow-600 mx-auto mb-1" />
                          <div className="text-2xl font-bold text-yellow-700">
                            {test.best_score}%
                          </div>
                          <div className="text-xs text-yellow-600">
                            Best Score
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No tests available</p>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default Tests;
