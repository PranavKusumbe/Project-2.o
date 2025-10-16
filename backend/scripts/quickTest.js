const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function quickTest() {
  try {
    console.log('🧪 Quick Chatbot Test\n');

    // Get a user token from database
    const mysql = require('mysql2/promise');
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const [users] = await conn.query("SELECT id, name, email FROM users WHERE email LIKE '%@%' LIMIT 1");
    await conn.end();

    if (users.length === 0) {
      console.log('❌ No valid user found');
      return;
    }

    const user = users[0];
    console.log('👤 Using user:', user.name, '<' + user.email + '>');

    // Login
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: user.email,
      password: 'password123'
    });

    const token = loginRes.data.token;
    console.log('✅ Login successful\n');

    // Test chatbot
    console.log('💬 Testing: "give me 1+100 numbers"');
    const chatRes = await axios.post(
      'http://localhost:5000/api/chatbot/query',
      { query: 'give me 1+100 numbers' },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('\n🤖 Response:');
    console.log('Source:', chatRes.data.source);
    console.log('Answer:', chatRes.data.response);

  } catch (error) {
    if (error.response) {
      console.error('❌ Error:', error.response.status, error.response.data);
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

quickTest();
