const axios = require('axios');

async function testChatbot() {
  try {
    console.log('🔍 Testing chatbot API...\n');

    // Test without authentication first
    console.log('1. Testing endpoint accessibility...');
    try {
      const response = await axios.post('http://localhost:5000/api/chatbot/query', {
        query: 'hello'
      });
      console.log('✅ Response:', response.data);
    } catch (error) {
      if (error.response) {
        console.log(`❌ Status: ${error.response.status}`);
        console.log(`❌ Error: ${JSON.stringify(error.response.data)}`);
        
        if (error.response.status === 401) {
          console.log('\n⚠️  Authentication required! This is expected.');
        }
      } else {
        console.log('❌ Network error:', error.message);
      }
    }

    // Check if backend is running
    console.log('\n2. Checking backend server...');
    try {
      const healthCheck = await axios.get('http://localhost:5000/api/auth/check');
      console.log('✅ Backend is running');
    } catch (error) {
      console.log('❌ Backend not responding');
    }

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testChatbot();
