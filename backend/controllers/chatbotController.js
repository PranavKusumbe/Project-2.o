// Rule-based chatbot responses
const chatbotResponses = {
  // Greetings
  'hello': 'Hello! I am MahaLearn assistant. How can I help you today?',
  'hi': 'Hi there! Welcome to MahaLearn. What can I do for you?',
  'hey': 'Hey! How can I assist you with your learning journey?',
  'good morning': 'Good morning! Ready to learn something new today?',
  'good evening': 'Good evening! How can I help you?',

  // Platform navigation
  'how to use': 'MahaLearn is easy to use! Students can access videos, take tests, chat with teachers, and track their performance. Teachers can monitor student progress and engage with the community.',
  'what is mahalearn': 'MahaLearn is a smart learning platform for Maharashtra Board students from 1st to 8th standard. It provides video lessons, online tests, performance tracking, and teacher-student interaction.',
  'features': 'MahaLearn offers: Video lessons, Online tests, PDF notes generation, Chat with teachers, Performance tracking, Leaderboard, Community forum, and AI-powered doubt solving.',
  
  // Learning content
  'videos': 'You can find educational videos organized by subject and standard in the Learning Content section of your dashboard.',
  'tests': 'Online tests are available in the Learning Content section. After completing a test, you can view your score and download notes.',
  'notes': 'Click the "Generate Notes" button next to any video or test to download summarized PDF notes.',
  'subjects': 'We cover all major subjects including Mathematics, Science, Marathi, English, and Social Studies for standards 1-8.',

  // Performance
  'performance': 'Check your Performance Tracker to see your test scores, subject-wise analysis, and improvement trends.',
  'leaderboard': 'The Leaderboard shows top-performing students in your standard. Keep practicing to improve your rank!',
  'scores': 'All your test scores are saved in the Performance section. You can view detailed analytics there.',

  // Chat and community
  'chat': 'Students can chat with teachers in the Chat section. Teachers can help with doubts and provide guidance.',
  'community': 'The Community section allows students and teachers to post questions, share resources, and discuss topics.',
  'teacher': 'You can connect with teachers through the Chat feature. They are here to help with your doubts!',

  // Technical help
  'login': 'Use your username and password to login. If you forgot your password, contact your teacher.',
  'register': 'New users can register by providing username, role (student/teacher), standard (for students), mobile number, and password.',
  'problem': 'If you are facing technical issues, please try refreshing the page or contact support.',

  // Subjects specific
  'math': 'Mathematics resources include videos on arithmetic, algebra, geometry, and problem-solving techniques.',
  'science': 'Science section covers Physics, Chemistry, Biology, and Environmental Studies with engaging videos.',
  'marathi': 'Marathi language learning includes grammar, literature, and comprehension exercises.',
  'english': 'English section helps improve reading, writing, grammar, and communication skills.',

  // Motivation
  'motivation': 'Keep learning every day! Small consistent efforts lead to big achievements. You can do it!',
  'study tips': 'Study regularly, take breaks, practice tests, ask doubts, and revise frequently. Stay focused and positive!',

  // Default
  'default': 'I am not sure about that. Can you rephrase your question? Or you can contact a teacher for detailed help.'
};

// AI integration with Google Gemini 2.0 Flash
const getAIResponse = async (query) => {
  try {
    // Check if Gemini API is configured
    if (!process.env.GEMINI_API_KEY) {
      console.log('⚠️ Gemini API key not configured, using rule-based responses');
      return null;
    }

    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Use Gemini 2.0 Flash model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });

    const prompt = `You are a helpful learning assistant for MahaLearn, an educational platform for Maharashtra Board students (standards 1-8). 

Answer the following question concisely and helpfully: ${query}

Context about MahaLearn:
- We provide video lessons, online tests, PDF notes, chat with teachers, and performance tracking
- Subjects covered: Mathematics, Science, Marathi, English, Social Studies for standards 1-8
- Students can track their progress, see leaderboards, and participate in community discussions
- Teachers can monitor student progress and interact with students

Guidelines:
- Keep responses friendly, clear, and educational (2-4 paragraphs maximum)
- If asked about a subject topic, provide a simple explanation suitable for school students
- For math problems, show step-by-step solutions
- For study tips, give practical advice
- Use simple language appropriate for students aged 6-14 years
- Be encouraging and motivating`;

    console.log('🤖 Sending query to Gemini AI:', query);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ AI response generated successfully');
    console.log('📝 Response preview:', text.substring(0, 100) + '...');
    
    return text;
  } catch (error) {
    console.error('❌ AI response error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    return null; // Fall back to rule-based responses
  }
};

// Main chatbot function
exports.getChatbotResponse = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ 
        success: false, 
        message: 'Query is required' 
      });
    }

    console.log('\n💬 Chatbot Query Received:', query);
    const normalizedQuery = query.toLowerCase().trim();

    // Try AI response first (if configured)
    console.log('🔄 Attempting AI response...');
    const aiResponse = await getAIResponse(query); // Use original query, not normalized
    
    if (aiResponse) {
      console.log('✅ Sending AI response');
      return res.json({
        success: true,
        response: aiResponse,
        source: 'ai'
      });
    }

    console.log('⚠️ AI not available, using rule-based response');
    
    // Use rule-based responses
    let response = chatbotResponses['default'];

    // Find matching response
    for (const [key, value] of Object.entries(chatbotResponses)) {
      if (normalizedQuery.includes(key)) {
        response = value;
        console.log('📋 Matched rule:', key);
        break;
      }
    }

    res.json({
      success: true,
      response,
      source: 'rule-based'
    });

  } catch (error) {
    console.error('❌ Chatbot error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get response', 
      error: error.message 
    });
  }
};

// Get chatbot suggestions
exports.getChatbotSuggestions = async (req, res) => {
  try {
    const suggestions = [
      'How to use MahaLearn?',
      'Where can I find videos?',
      'How to take tests?',
      'Check my performance',
      'How to chat with teacher?',
      'What subjects are available?',
      'Study tips',
      'How to generate notes?'
    ];

    res.json({
      success: true,
      suggestions
    });
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get suggestions', 
      error: error.message 
    });
  }
};
