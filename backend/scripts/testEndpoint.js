const axios = require('axios');

async function testEndpoint() {
  try {
    console.log('🧪 Testing chatbot endpoint accessibility\n');
    
    // Test 1: Check if server is running
    console.log('1️⃣ Testing server health...');
    try {
      await axios.get('http://localhost:5000/api');
    } catch (err) {
      if (err.response) {
        console.log('✅ Server is responding');
      } else {
        console.log('❌ Server not accessible:', err.message);
        return;
      }
    }

    // Test 2: Check chatbot endpoint (should fail with 401 - no auth)
    console.log('\n2️⃣ Testing chatbot endpoint (without auth)...');
    try {
      const response = await axios.post('http://localhost:5000/api/chatbot/query', {
        query: 'hello'
      });
      console.log('Response:', response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        console.log('✅ Endpoint exists (auth required as expected)');
      } else {
        console.log('❌ Error:', err.response?.status, err.response?.data || err.message);
      }
    }

    console.log('\n✅ Endpoint tests complete!');
    console.log('If you see 401 error above, that means the endpoint is working.');
    console.log('The frontend just needs to send the auth token properly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testEndpoint();
