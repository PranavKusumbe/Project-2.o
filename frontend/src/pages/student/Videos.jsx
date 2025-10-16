import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Play, Clock, BookOpen, Search, Filter } from 'lucide-react';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import { curriculumAPI } from '../../services/api';
import { useAuthStore } from '../../store/useStore';

const Videos = () => {
  const { user } = useAuthStore();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      console.log('Fetching subjects for standard:', user.std);
      const response = await curriculumAPI.getSubjects(user.std);
      console.log('Subjects response:', response.data);
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
      console.log('Fetching chapters for subject:', subject.id);
      const response = await curriculumAPI.getChapters(subject.id);
      console.log('Chapters response:', response.data);
      const chapterList = response.data.data || response.data || [];
      setChapters(chapterList);
      
      // Fetch all videos for this subject
      const allVideos = [];
      for (const chapter of chapterList) {
        const videoRes = await curriculumAPI.getChapterDetails(chapter.id);
        console.log(`Videos for chapter ${chapter.name}:`, videoRes.data);
        const chapterData = videoRes.data.data || videoRes.data;
        if (chapterData.videos) {
          allVideos.push(...chapterData.videos.map(v => ({ ...v, chapterName: chapter.name })));
        }
      }
      console.log('Total videos loaded:', allVideos.length);
      setVideos(allVideos);
    } catch (error) {
      console.error('Error fetching data:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.chapterName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Library</h1>
          <p className="text-gray-600">
            {selectedSubject ? `${selectedSubject.name} - Standard ${user?.std}` : `Browse educational videos for Standard ${user?.std}`}
          </p>
        </div>
        {selectedSubject && (
          <button
            onClick={() => {
              setSelectedSubject(null);
              setVideos([]);
              setChapters([]);
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
                  <Video size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {subject.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  View educational videos
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Video Grid */
        <>
          {/* Search Bar */}
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
            />
          </div>

          {loading ? (
            <Loader />
          ) : filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    onClick={() => setSelectedVideo(video)}
                    className="group cursor-pointer overflow-hidden h-full"
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
                      {video.duration_minutes && (
                        <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
                          {video.duration_minutes} min
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[3rem]">
                        {video.title}
                      </h3>
                      {video.chapterName && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <BookOpen size={14} />
                          {video.chapterName}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{video.source || 'YouTube'}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <Video size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No videos found</p>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Video Player Modal */}
      {selectedVideo && (
        <Modal
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          title={selectedVideo.title}
          size="xl"
        >
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo.url?.split('v=')[1]?.split('&')[0]}`}
              title={selectedVideo.title}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
          {selectedVideo.description && (
            <div className="mt-4">
              <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600">{selectedVideo.description}</p>
            </div>
          )}
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
            {selectedVideo.chapterName && (
              <div className="flex items-center gap-1">
                <BookOpen size={16} />
                <span>{selectedVideo.chapterName}</span>
              </div>
            )}
            {selectedVideo.duration_minutes && (
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{selectedVideo.duration_minutes} minutes</span>
              </div>
            )}
            {selectedVideo.source && (
              <span>Source: {selectedVideo.source}</span>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Videos;
