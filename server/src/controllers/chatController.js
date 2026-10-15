const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Handle incoming chat message from student or parent
 */
exports.handleChatMessage = async (req, res) => {
  try {
    const { message, role = 'student', history = [] } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required.',
      });
    }

    const trimmedMessage = message.trim();

    // Check for API Keys
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;

    // Define Role-specific AI System Persona
    const isParent = role === 'parent';
    const systemPrompt = isParent
      ? `You are the friendly, insightful CylixLab Parent Advisor AI.
You assist parents who want to support their child's education, study routines, motivation, screen time balance, and academic roadmap.
Respond politely, encouragingly, and clearly. Keep answers easy to understand.
If asked in Sinhala, reply in natural, polite Sinhala.
If asked in English, reply in clear, professional English.`
      : `You are the friendly, encouraging CylixLab Student Learning Assistant AI.
You help students learn programming, AI concepts, mathematics, science, and school studies.
Explain concepts step-by-step with simple examples.
If asked about assignments or exams, explain the method and concepts rather than just doing the work for them.
Keep explanations concise, encouraging, and clear.
If asked in Sinhala, reply in natural, friendly Sinhala.
If asked in English, reply in clear, engaging English.`;

    // 1. If Gemini API key is available
    if (geminiKey && geminiKey !== 'your_gemini_api_key_here') {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        // Use gemini-1.5-flash for fast responses
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          systemInstruction: systemPrompt,
        });

        // Format history for Gemini chat if present
        let chatSession;
        if (Array.isArray(history) && history.length > 0) {
          const formattedHistory = history
            .filter((h) => h && h.text && (h.sender === 'user' || h.sender === 'bot'))
            .slice(-8)
            .map((h) => ({
              role: h.sender === 'user' ? 'user' : 'model',
              parts: [{ text: h.text }],
            }));

          chatSession = model.startChat({
            history: formattedHistory,
          });
        } else {
          chatSession = model.startChat();
        }

        const result = await chatSession.sendMessage(trimmedMessage);
        const reply = result.response.text();

        return res.status(200).json({
          success: true,
          reply,
          provider: 'gemini',
        });
      } catch (geminiError) {
        console.error('Gemini API Error:', geminiError.message);
        // If Gemini quota/model error, fallback to other providers or rule-based
      }
    }

    // 2. If OpenAI API key is available as fallback/alternative
    if (openAiKey && openAiKey !== 'your_openai_api_key_here') {
      try {
        const formattedHistory = (history || [])
          .filter((h) => h && h.text && (h.sender === 'user' || h.sender === 'bot'))
          .slice(-8)
          .map((h) => ({
            role: h.sender === 'user' ? 'user' : 'assistant',
            content: h.text,
          }));

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openAiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              ...formattedHistory,
              { role: 'user', content: trimmedMessage },
            ],
            temperature: 0.7,
            max_tokens: 600,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return res.status(200).json({
              success: true,
              reply,
              provider: 'openai',
            });
          }
        }
      } catch (openAiError) {
        console.error('OpenAI API Error:', openAiError.message);
      }
    }

    // 3. Fallback when API key is not configured or during initial setup
    const educationalFallback = getIntelligentFallback(trimmedMessage, role);

    const keyNotice = (!geminiKey || geminiKey === 'your_gemini_api_key_here') && (!openAiKey || openAiKey === 'your_openai_api_key_here')
      ? '\n\n💡 (Note: Live AI API key is not configured yet in server/.env. Add your GEMINI_API_KEY to enable live Gemini AI answers.)'
      : '';

    return res.status(200).json({
      success: true,
      reply: educationalFallback + keyNotice,
      provider: 'fallback',
      requiresApiKey: !geminiKey && !openAiKey,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process chat message.',
      error: error.message,
    });
  }
};

/**
 * Built-in intelligent fallback for common learning queries
 */
function getIntelligentFallback(query, role) {
  const q = query.toLowerCase().trim();

  if (/^(hi|hello|hey|good morning|good evening|ආයුබෝවන්)/i.test(q)) {
    return role === 'parent'
      ? 'Hello! 👋 Welcome to CylixLab Parent Support. How can I help you support your child’s educational journey today?'
      : 'Hello! 👋 Welcome to CylixLab Student Assistant. What would you like to explore or study today? (AI, programming, math, science)';
  }

  if (q.includes('ai') || q.includes('artificial intelligence')) {
    return 'Artificial Intelligence (AI) refers to computer systems that perform tasks requiring human intelligence, such as recognizing speech, analyzing images, and solving complex problems. Machine Learning and Deep Learning are two core subsets of AI.';
  }

  if (q.includes('programming') || q.includes('coding') || q.includes('code')) {
    return 'Programming is giving instructions to a computer to solve problems. In CylixLab, you can learn JavaScript, Python, and web technologies through practical modules and MCQ challenges!';
  }

  if (q.includes('python')) {
    return 'Python is a very popular, beginner-friendly programming language widely used in AI, data analysis, web development, and automation because of its clean, readable syntax.';
  }

  if (q.includes('javascript') || q.includes('react')) {
    return 'JavaScript is the primary programming language of the interactive web, and React is a powerful library used to build modern, responsive frontends like CylixLab!';
  }

  if (role === 'parent' && (q.includes('progress') || q.includes('marks') || q.includes('child'))) {
    return 'As a parent in CylixLab, you can monitor your student’s completed MCQ assignments, time spent on learning paths, and progress trends in the "Analyze Progress" tab of your dashboard!';
  }

  return `Great question about "${query}"! In CylixLab, we recommend breaking this concept down step-by-step. Review the interactive Learning Path materials, try practice questions, and don't hesitate to ask more details!`;
}
