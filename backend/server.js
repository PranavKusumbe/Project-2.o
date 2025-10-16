const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: '../.env' });

const { testConnection } = require('./config/database');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS
const io = socketio(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const authRoutes = require('./routes/authRoutes');
const curriculumRoutes = require('./routes/curriculumRoutes');
const contentRoutes = require('./routes/contentRoutes');
const videoRoutes = require('./routes/videoRoutes');
const testRoutes = require('./routes/testRoutes');
const notesRoutes = require('./routes/notesRoutes');
const chatRoutes = require('./routes/chatRoutes');
const communityRoutes = require('./routes/communityRoutes');
const performanceRoutes = require('./routes/performanceRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/curriculum', curriculumRoutes); // New comprehensive curriculum API
app.use('/api/content', contentRoutes); // Legacy content API
app.use('/api/videos', videoRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'MahaLearn API is running',
    timestamp: new Date().toISOString()
  });
});

// Socket.io connection handling
const connectedUsers = new Map(); // userId -> socketId

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // User joins with their ID
  socket.on('join', (userId) => {
    connectedUsers.set(userId.toString(), socket.id);
    console.log(`User ${userId} joined with socket ${socket.id}`);
  });

  // Send message event
  socket.on('sendMessage', (data) => {
    const { receiverId, message, senderId } = data;
    const receiverSocketId = connectedUsers.get(receiverId.toString());
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', {
        message,
        senderId,
        timestamp: new Date()
      });
    }
  });

  // Typing indicator
  socket.on('typing', (data) => {
    const { receiverId, senderId } = data;
    const receiverSocketId = connectedUsers.get(receiverId.toString());
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('userTyping', { senderId });
    }
  });

  socket.on('stopTyping', (data) => {
    const { receiverId, senderId } = data;
    const receiverSocketId = connectedUsers.get(receiverId.toString());
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('userStoppedTyping', { senderId });
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    // Remove user from connected users
    for (let [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Start server
    server.listen(PORT, () => {
      console.log('='.repeat(50));
      console.log(`🚀 MahaLearn Server running on port ${PORT}`);
      console.log(`📚 API: http://localhost:${PORT}/api`);
      console.log(`💬 Socket.io: Connected and ready`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('='.repeat(50));
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Export for testing
module.exports = { app, server, io };
