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
    import React from 'react';
    import Card from '../../components/Card';

    const ChatRemoved = () => (
      <div className="space-y-6 animate-fade-in">
        <Card>
          <h2 className="text-xl font-bold">Chat feature has been removed.</h2>
          <p className="text-gray-600">Please use other available features from the sidebar.</p>
        </Card>
      </div>
    );

    export default ChatRemoved;
      }
