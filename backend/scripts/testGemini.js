const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function testGeminiDirect() {
  try {
    console.log('🔑 Testing Gemini API Key\n');
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.log('❌ No API key found in .env');
      return;
    }
    
    console.log('✅ API Key found:', apiKey.substring(0, 20) + '...');
    console.log('\n🤖 Testing Gemini 2.0 Flash...\n');

    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try Gemini 2.0 Flash
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      const result = await model.generateContent('Say hello in one sentence');
      const response = await result.response;
      const text = response.text();
      console.log('✅ Gemini 2.0 Flash works!');
      console.log('Response:', text);
    } catch (error) {
      console.log('❌ Gemini 2.0 Flash failed:', error.message);
      
      // Try regular Gemini Pro
      console.log('\n🔄 Trying Gemini Pro instead...');
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent('Say hello in one sentence');
      const response = await result.response;
      const text = response.text();
      console.log('✅ Gemini Pro works!');
      console.log('Response:', text);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

testGeminiDirect();
