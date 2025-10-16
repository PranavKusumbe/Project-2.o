import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image as ImageIcon, Trash2, Edit2, X, User } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { chatAPI } from '../../services/api';
import { useAuthStore } from '../../store/useStore';
import io from 'socket.io-client';

const Chat = () => {
  const { user } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    fetchChatUsers();
    
    // Initialize Socket.io
    socketRef.current = io('http://localhost:5000');
    
    socketRef.current.on('connect', () => {
      console.log('Connected to chat');
      socketRef.current.emit('join', user.id);
    });

    socketRef.current.on('new_message', (data) => {
      if (selectedUser && (data.senderId === selectedUser.id || data.receiverId === selectedUser.id)) {
        fetchMessages(selectedUser.id);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id);
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatUsers = async () => {
    try {
      const response = await chatAPI.getUsers();
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId) => {
    try {
      const response = await chatAPI.getMessages(otherUserId);
      setMessages(response.data.messages || []);
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      await chatAPI.sendMessage({
        receiverId: selectedUser.id,
        content: newMessage
      });
      
      setNewMessage('');
      fetchMessages(selectedUser.id);
      
      // Emit socket event
      if (socketRef.current) {
        socketRef.current.emit('sendMessage', {
          receiverId: selectedUser.id,
          senderId: user.id,
          content: newMessage
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleEditMessage = async (messageId) => {
    if (!editText.trim()) return;

    try {
      await chatAPI.editMessage(messageId, { content: editText });
      setEditingId(null);
      setEditText('');
      fetchMessages(selectedUser.id);
    } catch (error) {
      console.error('Error editing message:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Delete this message?')) return;

    try {
      await chatAPI.deleteMessage(messageId);
      fetchMessages(selectedUser.id);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Users List */}
      <Card className="w-80 flex flex-col overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {user.role === 'student' ? 'Teachers' : 'Students'}
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {users.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No {user.role === 'student' ? 'teachers' : 'students'} available
            </div>
          ) : (
            users.map((chatUser) => (
              <motion.div
                key={chatUser.id}
                whileHover={{ backgroundColor: '#f3f4f6' }}
                className={`p-4 cursor-pointer border-b transition-colors ${
                  selectedUser?.id === chatUser.id ? 'bg-primary-50 border-primary-200' : ''
                }`}
                onClick={() => setSelectedUser(chatUser)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <User size={20} className="text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {chatUser.username || chatUser.name}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">
                      {chatUser.role} {chatUser.std ? `- Std ${chatUser.std}` : ''}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <User size={20} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedUser.username || selectedUser.name}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {selectedUser.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              <AnimatePresence>
                {messages.map((message) => {
                  const isOwn = message.sender_id === user.id;
                  const isEditing = editingId === message.id;

                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] space-y-1`}>
                        {!isOwn && (
                          <p className="text-xs text-gray-500 px-2">
                            {message.sender_name}
                          </p>
                        )}
                        
                        <div className={`rounded-2xl px-4 py-2 ${
                          isOwn 
                            ? 'bg-primary-600 text-white' 
                            : 'bg-white text-gray-900 shadow-sm'
                        }`}>
                          {isEditing ? (
                            <div className="space-y-2">
                              <textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="w-full p-2 border rounded text-gray-900 resize-none"
                                rows={2}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditMessage(message.id)}
                                  className="text-xs px-2 py-1 bg-green-500 text-white rounded"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="text-xs px-2 py-1 bg-gray-500 text-white rounded"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="whitespace-pre-wrap break-words">{message.message}</p>
                              {isOwn && (
                                <div className="flex gap-2 mt-2">
                                  <button
                                    onClick={() => {
                                      setEditingId(message.id);
                                      setEditText(message.message);
                                    }}
                                    className={`text-xs ${isOwn ? 'text-white' : 'text-gray-600'} hover:underline`}
                                  >
                                    <Edit2 size={12} className="inline" /> Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMessage(message.id)}
                                    className={`text-xs ${isOwn ? 'text-white' : 'text-gray-600'} hover:underline`}
                                  >
                                    <Trash2 size={12} className="inline" /> Delete
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        
                        <p className={`text-xs text-gray-500 px-2 ${isOwn ? 'text-right' : ''}`}>
                          {formatTime(message.created_at)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={1}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="px-6"
                >
                  <Send size={20} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <User size={48} className="mx-auto mb-4 text-gray-400" />
              <p>Select a {user.role === 'student' ? 'teacher' : 'student'} to start chatting</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Chat;
