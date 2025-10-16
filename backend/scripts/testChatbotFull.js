const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function testChatbotWithAuth() {
  try {
    console.log('🤖 Testing MahaLearn Chatbot\n');

    // Step 1: Login to get token (register if needed)
    console.log('1️⃣ Logging in as test student...');
    let token;
    try {
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        username: 'raj',
        password: 'password123'
      });
      token = loginResponse.data.token;
      console.log('✅ Login successful\n');
    } catch (loginErr) {
      const status = loginErr.response?.status;
      if (status === 400 || status === 401 || status === 404) {
        console.log('ℹ️ User missing or invalid credentials. Registering test user...');
        await axios.post('http://localhost:5000/api/auth/register', {
          username: 'raj',
          password: 'password123',
          role: 'student',
          std: 6,
          mobile: 'raj@example.com'
        });
        const retry = await axios.post('http://localhost:5000/api/auth/login', {
          username: 'raj',
          password: 'password123'
        });
        token = retry.data.token;
        console.log('✅ Registered and logged in\n');
      } else {
        throw loginErr;
      }
    }

    // Step 2: Test chatbot with various queries
    const queries = [
      'Hello',
      'How to use MahaLearn?',
      'What subjects are available?',
      'Give me a math problem',
      'Explain photosynthesis',
      'Study tips for exams'
    ];

    console.log('2️⃣ Testing chatbot responses:\n');
    
    for (const query of queries) {
      try {
        console.log(`📝 Query: "${query}"`);
        const response = await axios.post(
          'http://localhost:5000/api/chatbot/query',
          { query },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log(`🤖 Response (${response.data.source}):`);
        console.log(`   ${response.data.response.substring(0, 150)}${response.data.response.length > 150 ? '...' : ''}\n`);
      } catch (error) {
        console.log(`❌ Error: ${error.response?.data?.message || error.message}\n`);
      }
    }

    // Step 3: Test suggestions
    console.log('3️⃣ Testing chatbot suggestions:');
    const suggestionsResponse = await axios.get(
      'http://localhost:5000/api/chatbot/suggestions',
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('✅ Suggestions:', suggestionsResponse.data.suggestions);

    console.log('\n✅ All chatbot tests completed!');

  } catch (error) {
    if (error.response) {
      console.error('\n❌ API Error:');
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('\n❌ No response received from server');
      console.error('Is the backend running on http://localhost:5000?');
    } else {
      console.error('\n❌ Error:', error.message);
    }
  }
}

testChatbotWithAuth();
