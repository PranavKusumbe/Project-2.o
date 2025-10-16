import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, Video, FileText, Search } from 'lucide-react';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import { curriculumAPI } from '../../services/api';
import { useAuthStore, useLearningStore } from '../../store/useStore';

const Learning = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { setCurrentSubject, setCurrentChapter } = useLearningStore();
  
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await curriculumAPI.getSubjects(user.std);
      console.log('Subjects response:', response.data);
      setSubjects(response.data.data || response.data.subjects || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectClick = async (subject) => {
    setSelectedSubject(subject);
    setCurrentSubject(subject);
    setLoading(true);
    
    try {
      const response = await curriculumAPI.getChapters(subject.id);
      console.log('Chapters response:', response.data);
      setChapters(response.data.data || response.data.chapters || []);
    } catch (error) {
      console.error('Error fetching chapters:', error);
      setChapters([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChapterClick = (chapter) => {
    setCurrentChapter(chapter);
    navigate(`/student/chapter/${chapter.id}`);
  };

  const subjectColors = [
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600',
    'from-purple-500 to-purple-600',
    'from-pink-500 to-pink-600',
    'from-yellow-500 to-yellow-600',
    'from-red-500 to-red-600',
  ];

  const filteredChapters = chapters.filter(chapter =>
    (chapter.title || chapter.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && !selectedSubject) {
    return <Loader fullScreen />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Center</h1>
        <p className="text-gray-600">
          Browse subjects and chapters for Standard {user?.std}
        </p>
      </div>

      {!selectedSubject ? (
        /* Subject Selection */
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select a Subject</h2>
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
                    <BookOpen size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {subject.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {subject.description || 'Click to view chapters'}
                  </p>
                  <div className="flex items-center text-primary-600 font-medium">
                    <span>View Chapters</span>
                    <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        /* Chapter Selection */
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <button
                onClick={() => {
                  setSelectedSubject(null);
                  setChapters([]);
                }}
                className="text-primary-600 hover:text-primary-700 font-medium mb-2 flex items-center gap-2"
              >
                ← Back to Subjects
              </button>
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedSubject.name} - Chapters
              </h2>
            </div>
            
            {/* Search */}
            <div className="relative w-64">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search chapters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
              />
            </div>
          </div>

          {loading ? (
            <Loader />
          ) : filteredChapters.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredChapters.map((chapter, index) => (
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    onClick={() => handleChapterClick(chapter)}
                    className="group cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 flex-1">
                            {chapter.title || chapter.name}
                          </h3>
                        </div>
                        
                        {chapter.description && (
                          <p className="text-gray-600 text-sm mb-4">
                            {chapter.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2 text-blue-600">
                            <Video size={16} />
                            <span>{chapter.video_count || 0} Videos</span>
                          </div>
                          <div className="flex items-center gap-2 text-green-600">
                            <FileText size={16} />
                            <span>{chapter.test_count || 0} Tests</span>
                          </div>
                        </div>
                      </div>
                      
                      <ChevronRight 
                        size={24} 
                        className="text-gray-400 group-hover:text-primary-600 group-hover:translate-x-2 transition-all" 
                      />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No chapters found</p>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Learning;
