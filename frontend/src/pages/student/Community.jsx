import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Image as ImageIcon, Video, ThumbsUp, MessageCircle } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import { communityAPI } from '../../services/api';
import { useAuthStore } from '../../store/useStore';

const Community = () => {
  const { user } = useAuthStore();
  import React from 'react';
  import Card from '../../components/Card';

  const CommunityRemoved = () => (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <Card>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Community</h1>
        <p className="text-gray-600">The Community feature has been removed.</p>
      </Card>
    </div>
  );

  export default CommunityRemoved;
                      <div className="mt-4 space-y-3 pl-4 border-l-2 border-gray-200">
                        {post.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {reply.username?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
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
                        <Button
                          size="sm"
                          onClick={() => handleReply(post.id)}
                          loading={replying}
                        >
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
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Community;
