const { pool } = require('../config/database');
const path = require('path');
const fs = require('fs');

// Get chat messages between two users
exports.getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.params;

    const [messages] = await pool.query(
      `SELECT m.*, 
              sender.name as sender_name, sender.role as sender_role,
              receiver.name as receiver_name, receiver.role as receiver_role
       FROM chat_messages m
       JOIN users sender ON m.sender_id = sender.id
       JOIN users receiver ON m.receiver_id = receiver.id
       WHERE ((m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?))
       ORDER BY m.created_at ASC`,
      [userId, otherUserId, otherUserId, userId]
    );

    res.json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch messages', 
      error: error.message 
    });
  }
};

// Get list of users to chat with
exports.getChatUsers = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // Students can chat with teachers, teachers can chat with students
    const targetRole = userRole === 'student' ? 'teacher' : 'student';

    const [users] = await pool.query(
      `SELECT DISTINCT u.id, u.name as username, u.role, u.std,
              (SELECT COUNT(*) FROM chat_messages 
               WHERE sender_id = u.id AND receiver_id = ? AND is_read = FALSE) as unread_count,
              (SELECT message FROM chat_messages 
               WHERE (sender_id = u.id AND receiver_id = ?) OR (sender_id = ? AND receiver_id = u.id)
               ORDER BY created_at DESC LIMIT 1) as last_message,
              (SELECT created_at FROM chat_messages 
               WHERE (sender_id = u.id AND receiver_id = ?) OR (sender_id = ? AND receiver_id = u.id)
               ORDER BY created_at DESC LIMIT 1) as last_message_time
       FROM users u
       WHERE u.role = ? AND u.id != ?
       ORDER BY last_message_time DESC`,
      [userId, userId, userId, userId, userId, targetRole, userId]
    );

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Get chat users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch chat users', 
      error: error.message 
    });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ 
        success: false, 
        message: 'Receiver ID and content are required' 
      });
    }

    // Check if receiver exists
    const [receivers] = await pool.query(
      'SELECT id, role FROM users WHERE id = ?',
      [receiverId]
    );

    if (receivers.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Receiver not found' 
      });
    }

    const [result] = await pool.query(
      'INSERT INTO chat_messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
      [senderId, receiverId, content]
    );

    const [newMessage] = await pool.query(
      `SELECT m.*, 
              sender.name as sender_name, sender.role as sender_role,
              receiver.name as receiver_name, receiver.role as receiver_role
       FROM chat_messages m
       JOIN users sender ON m.sender_id = sender.id
       JOIN users receiver ON m.receiver_id = receiver.id
       WHERE m.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage[0]
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message', 
      error: error.message 
    });
  }
};

// Edit a message
exports.editMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { messageId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ 
        success: false, 
        message: 'Content is required' 
      });
    }

    // Check if message belongs to user
    const [messages] = await pool.query(
      'SELECT * FROM chat_messages WHERE id = ? AND sender_id = ?',
      [messageId, userId]
    );

    if (messages.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found or unauthorized' 
      });
    }

    await pool.query(
      'UPDATE chat_messages SET message = ? WHERE id = ?',
      [content, messageId]
    );

    res.json({
      success: true,
      message: 'Message updated successfully'
    });
  } catch (error) {
    console.error('Edit message error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to edit message', 
      error: error.message 
    });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { messageId } = req.params;

    // Check if message belongs to user
    const [messages] = await pool.query(
      'SELECT * FROM chat_messages WHERE id = ? AND sender_id = ?',
      [messageId, userId]
    );

    if (messages.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found or unauthorized' 
      });
    }

    await pool.query(
      'UPDATE chat_messages SET message = "This message was deleted" WHERE id = ?',
      [messageId]
    );

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete message', 
      error: error.message 
    });
  }
};

// Upload image for chat
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No image file provided' 
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl
    });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload image', 
      error: error.message 
    });
  }
};
