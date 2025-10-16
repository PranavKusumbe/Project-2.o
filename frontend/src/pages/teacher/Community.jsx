import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Image as ImageIcon, Video, ThumbsUp, MessageCircle, User } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Loader from '../../components/Loader';
import { communityAPI } from '../../services/api';
import { useAuthStore } from '../../store/useStore';

const Community = () => {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await communityAPI.getPosts();
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    setPosting(true);
    try {
      const formData = new FormData();
      formData.append('content', newPost);
      if (mediaFile) {
        formData.append('media', mediaFile);
      }

      await communityAPI.createPost(formData);
      setNewPost('');
      setMediaFile(null);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setPosting(false);
    }
  };

  const handleReply = async (postId) => {
    if (!replyText.trim()) return;

    try {
      await communityAPI.addComment(postId, replyText);
      setReplyText('');
      setReplyingTo(null);
      fetchPosts();
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      await communityAPI.likePost(postId);
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Community</h1>
        <p className="text-gray-600">
          Engage with students and fellow teachers
        </p>
      </div>

      {/* Create Post */}
      <Card>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white font-bold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share knowledge, answer questions, or start a discussion..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all resize-none"
              rows={3}
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-2 items-center">
                <label className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setMediaFile(e.target.files[0]);
                      }
                    }}
                  />
                  <ImageIcon size={20} />
                </label>
                {mediaFile && (
                  <button
                    type="button"
                    onClick={() => setMediaFile(null)}
                    className="px-3 py-1 text-xs bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300"
                  >
                    Remove
                  </button>
                )}
              </div>
              <Button
                onClick={handleCreatePost}
                loading={posting}
                disabled={!newPost.trim()}
              >
                <Send size={18} />
                Post
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <MessageCircle size={48} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600">No posts yet. Be the first to share!</p>
            </div>
          </Card>
        ) : (
          posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                {/* Post Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {post.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{post.username}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        post.role === 'teacher' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {post.role === 'teacher' ? 'Teacher' : `Student - Std ${post.std}`}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Post Content */}
                <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

                {/* Post Media */}
                {post.media_path && (
                  <div className="mb-4">
                    {post.media_type === 'image' ? (
                      <img
                        src={`http://localhost:5000${post.media_path}`}
                        alt="Post media"
                        className="rounded-lg max-h-96 object-cover"
                      />
                    ) : post.media_type === 'video' ? (
                      <video
                        src={`http://localhost:5000${post.media_path}`}
                        controls
                        className="rounded-lg max-h-96 w-full"
                      />
                    ) : null}
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center gap-4 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <ThumbsUp size={18} />
                    <span className="text-sm">{post.likes_count || 0} Likes</span>
                  </button>
                  <button
                    onClick={() => setReplyingTo(post.id)}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <MessageCircle size={18} />
                    <span className="text-sm">{post.reply_count || 0} Replies</span>
                  </button>
                </div>

                {/* Replies */}
                {post.replies && post.replies.length > 0 && (
                  <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-3">
                    {post.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {reply.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900 text-sm">{reply.username}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              reply.role === 'teacher' 
                                ? 'bg-purple-100 text-purple-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {reply.role === 'teacher' ? 'Teacher' : `Std ${reply.std}`}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(reply.created_at).toLocaleDateString('en-IN')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input */}
                {replyingTo === post.id && (
                  <div className="mt-4 flex items-center gap-3">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      autoFocus
                    />
                    <Button size="sm" onClick={() => handleReply(post.id)}>
                      Reply
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Community;
