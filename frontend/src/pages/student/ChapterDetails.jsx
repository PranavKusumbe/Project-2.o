import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Video, 
  FileText, 
  BookOpen, 
  Play,
  Clock,
  CheckCircle,
  Download,
  Target
} from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import { curriculumAPI, notesAPI } from '../../services/api';

const ChapterDetails = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  
  const [chapter, setChapter] = useState(null);
  const [videos, setVideos] = useState([]);
  const [tests, setTests] = useState([]);
  const [practiceProblems, setPracticeProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [generatingNotes, setGeneratingNotes] = useState(false);

  useEffect(() => {
    fetchChapterDetails();
  }, [chapterId]);

  const fetchChapterDetails = async () => {
    try {
      const response = await curriculumAPI.getChapterDetails(chapterId);
      console.log('Chapter details response:', response.data);
      const data = response.data.data || response.data;
      
      setChapter(data.chapter);
      setVideos(data.videos || []);
      setTests(data.tests || []);
      setPracticeProblems(data.practiceProblems || data.practice_problems || []);
    } catch (error) {
      console.error('Error fetching chapter details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNotes = async () => {
    setGeneratingNotes(true);
    try {
      const response = await notesAPI.generateNotes(chapterId);
      // Download the PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${chapter.title || chapter.name}-notes.pdf`;
      a.click();
    } catch (error) {
      console.error('Error generating notes:', error);
      alert('Failed to generate notes. Please try again.');
    } finally {
      setGeneratingNotes(false);
    }
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  const handleTestClick = (test) => {
    navigate(`/student/test/${test.id}`);
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-primary-600 hover:text-primary-700 font-medium mb-3"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{chapter?.title || chapter?.name}</h1>
          {chapter?.description && (
            <p className="text-gray-600">{chapter.description}</p>
          )}
        </div>
        <Button
          onClick={handleGenerateNotes}
          loading={generatingNotes}
          variant="secondary"
        >
          <Download size={20} />
          Generate Notes
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hover={false} className="bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500 rounded-xl">
              <Video size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Videos</p>
              <p className="text-2xl font-bold text-blue-900">{videos.length}</p>
            </div>
          </div>
        </Card>

        <Card hover={false} className="bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500 rounded-xl">
              <FileText size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Tests</p>
              <p className="text-2xl font-bold text-green-900">{tests.length}</p>
            </div>
          </div>
        </Card>

        <Card hover={false} className="bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500 rounded-xl">
              <Target size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">Practice</p>
              <p className="text-2xl font-bold text-purple-900">{practiceProblems.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Videos Section */}
      {videos.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Video size={28} className="text-primary-600" />
            Educational Videos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  onClick={() => handleVideoClick(video)}
                  className="group cursor-pointer overflow-hidden"
                >
                  <div className="relative mb-3">
                    <img
                      src={`https://img.youtube.com/vi/${video.url?.split('v=')[1]?.split('&')[0]}/hqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-40 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/320x180?text=Video';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                        <Play size={24} className="text-primary-600 ml-1" />
                      </div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{video.duration_minutes ? `${video.duration_minutes} min` : 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen size={14} />
                      <span>{video.source || 'YouTube'}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Tests Section */}
      {tests.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText size={28} className="text-green-600" />
            Online Tests
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tests.map((test, index) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group cursor-pointer" onClick={() => handleTestClick(test)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                          <FileText size={20} className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{test.title}</h3>
                          <p className="text-sm text-gray-600">
                            {test.question_count || 0} Questions
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{test.duration || 30} mins</span>
                        </div>
                        {test.completed && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle size={14} />
                            <span>Completed</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button variant="primary" size="sm">
                      Start Test
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Practice Problems */}
      {practiceProblems.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Target size={28} className="text-purple-600" />
            Practice Problems
          </h2>
          <Card>
            <p className="text-gray-600 mb-4">
              {practiceProblems.length} practice problems available
            </p>
            <Button onClick={() => navigate(`/student/practice/${chapterId}`)}>
              Start Practice
            </Button>
          </Card>
        </div>
      )}

      {/* Video Player Modal */}
      {selectedVideo && (
        <Modal
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          title={selectedVideo.title}
          size="xl"
        >
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo.url?.split('v=')[1]?.split('&')[0]}`}
              title={selectedVideo.title}
              className="w-full h-full rounded-lg"
              allowFullScreen
            />
          </div>
          {selectedVideo.description && (
            <div className="mt-4">
              <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600">{selectedVideo.description}</p>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default ChapterDetails;
