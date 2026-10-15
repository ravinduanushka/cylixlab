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

    // Check for API Keys (support Groq, Grok/xAI, Gemini, OpenAI)
    const groqOrGrokKey =
      process.env.GROQ_API_KEY ||
      process.env.GROK_API_KEY ||
      process.env.XAI_API_KEY;

    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;

    // Define Role-specific AI System Persona - Short and concise
    const isParent = role === 'parent';
    const systemPrompt = isParent
      ? `You are the CylixLab Parent Advisor AI.
CRITICAL INSTRUCTION: Always give SHORT, DIRECT, and CONCISE answers (1 to 3 short sentences maximum).
Never write long lengthy paragraphs.
Help parents with child study routines, progress tracking, and educational support.
If asked in Sinhala, reply in short, natural Sinhala.
If asked in English, reply in short, direct English.`
      : `You are the CylixLab Student AI Assistant.
CRITICAL INSTRUCTION: Always give SHORT, DIRECT, and ACCURATE answers (1 to 2 short sentences maximum).
Never give long, lengthy, unnecessary paragraphs.
- For math questions or arithmetic (e.g. "1+2", "1+3", "12*5"), output the exact answer directly (e.g. "1 + 2 = 3").
- For programming/coding questions, give a direct 1-line answer and concise code if needed.
- For English or grammar questions, give the direct correction or explanation immediately.
- For AI or general knowledge, give a direct, clear summary in 1-2 sentences.
- If asked in Sinhala, reply in short Sinhala. If asked in English, reply in short English.`;

    const formattedHistory = (history || [])
      .filter((h) => h && h.text && (h.sender === 'user' || h.sender === 'bot'))
      .slice(-6)
      .map((h) => ({
        role: h.sender === 'user' ? 'user' : 'assistant',
        content: h.text,
      }));

    // 1. If Groq API key is provided (starts with "gsk_" or general groq key)
    if (groqOrGrokKey && groqOrGrokKey !== 'your_grok_api_key_here' && groqOrGrokKey !== 'your_groq_api_key_here') {
      const isGroq = groqOrGrokKey.startsWith('gsk_') || !groqOrGrokKey.startsWith('xai-');

      if (isGroq) {
        // GroqCloud models available
        const groqModels = [
          'openai/gpt-oss-120b',
          'openai/gpt-oss-20b',
          'qwen/qwen3.8-27b',
          'llama-3.3-70b-versatile',
          'llama-3.1-8b-instant',
        ];

        for (const model of groqModels) {
          try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${groqOrGrokKey}`,
              },
              body: JSON.stringify({
                model,
                messages: [
                  { role: 'system', content: systemPrompt },
                  ...formattedHistory,
                  { role: 'user', content: trimmedMessage },
                ],
                temperature: 0.5,
                max_tokens: 200,
              }),
            });

            if (response.ok) {
              const data = await response.json();
              const reply = data.choices?.[0]?.message?.content?.trim();
              if (reply) {
                return res.status(200).json({
                  success: true,
                  reply,
                  provider: 'groq',
                  model,
                });
              }
            } else {
              const errText = await response.text();
              console.warn(`Groq model ${model} failed (${response.status}):`, errText);
            }
          } catch (modelErr) {
            console.warn(`Groq error with model ${model}:`, modelErr.message);
          }
        }
      }

      // If xAI Grok (starts with "xai-")
      try {
        const xaiModels = ['grok-2-latest', 'grok-beta'];
        for (const model of xaiModels) {
          const response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${groqOrGrokKey}`,
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: 'system', content: systemPrompt },
                ...formattedHistory,
                { role: 'user', content: trimmedMessage },
              ],
              temperature: 0.5,
              max_tokens: 200,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const reply = data.choices?.[0]?.message?.content?.trim();
            if (reply) {
              return res.status(200).json({
                success: true,
                reply,
                provider: 'xai-grok',
                model,
              });
            }
          }
        }
      } catch (xaiErr) {
        console.warn('xAI Grok error:', xaiErr.message);
      }
    }

    // 2. If Gemini API key is available
    if (geminiKey && geminiKey !== 'your_gemini_api_key_here') {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          systemInstruction: systemPrompt,
        });

        const chatSession = model.startChat();
        const result = await chatSession.sendMessage(trimmedMessage);
        const reply = result.response.text()?.trim();

        if (reply) {
          return res.status(200).json({
            success: true,
            reply,
            provider: 'gemini',
          });
        }
      } catch (geminiError) {
        console.warn('Gemini API Error:', geminiError.message);
      }
    }

    // 3. If OpenAI API key is available
    if (openAiKey && openAiKey !== 'your_openai_api_key_here') {
      try {
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
            temperature: 0.5,
            max_tokens: 200,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content?.trim();
          if (reply) {
            return res.status(200).json({
              success: true,
              reply,
              provider: 'openai',
            });
          }
        }
      } catch (openAiError) {
        console.warn('OpenAI API Error:', openAiError.message);
      }
    }

    // 4. Smart Direct Fallback (calculates math and answers directly)
    const fallbackAnswer = getDirectShortAnswer(trimmedMessage, role);

    return res.status(200).json({
      success: true,
      reply: fallbackAnswer,
      provider: 'direct-smart-fallback',
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
 * Intelligent short answer generator for calculations and common queries
 */
function getDirectShortAnswer(query, role) {
  const trimmed = query.trim();
  const lower = trimmed.toLowerCase();

  // 1. Direct Math Solver (e.g. 1+2, 1+3, 12 * 5, 100 / 4, 50 - 20)
  // Clean query for math expressions: "whats the answer of 1+2", "1+3", "solve 5*6"
  const mathMatch = trimmed.match(/(-?\d+(?:\.\d+)?)\s*([\+\-\*\/xX\^])\s*(-?\d+(?:\.\d+)?)/);
  if (mathMatch) {
    const num1 = parseFloat(mathMatch[1]);
    const op = mathMatch[2];
    const num2 = parseFloat(mathMatch[3]);
    let result = null;

    if (op === '+') result = num1 + num2;
    else if (op === '-') result = num1 - num2;
    else if (op === '*' || op === 'x' || op === 'X') result = num1 * num2;
    else if (op === '/') result = num2 !== 0 ? num1 / num2 : 'undefined (cannot divide by zero)';
    else if (op === '^') result = Math.pow(num1, num2);

    if (result !== null) {
      return `${num1} ${op} ${num2} = ${result}`;
    }
  }

  // 2. Greetings
  if (/^(hi|hello|hey|good morning|good evening|ආයුබෝවන්)/i.test(lower)) {
    return role === 'parent'
      ? 'Hello! How can I help you support your child\'s studies today?'
      : 'Hello! Ask me any math, coding, English, or AI question!';
  }

  // 3. AI / Machine Learning
  if (lower.includes('what is ai') || lower.includes('artificial intelligence')) {
    return 'Artificial Intelligence (AI) is technology that enables computers to think, learn, and solve problems like humans.';
  }
  if (lower.includes('machine learning') || lower.includes('what is ml')) {
    return 'Machine Learning is a branch of AI where systems learn from data to make predictions without being explicitly coded.';
  }
  if (lower.includes('deep learning')) {
    return 'Deep Learning is an AI technique using multi-layered artificial neural networks inspired by the human brain.';
  }

  // 4. Programming
  if (lower.includes('python')) {
    return 'Python is a high-level, easy-to-learn programming language widely used in AI, data science, and web development.';
  }
  if (lower.includes('javascript') || lower.includes('js')) {
    return 'JavaScript is the core programming language of the web, used for frontend interactivity and backend APIs.';
  }
  if (lower.includes('react')) {
    return 'React is a popular JavaScript library created by Meta for building component-based user interfaces.';
  }
  if (lower.includes('html')) {
    return 'HTML defines the structure and elements of web pages.';
  }
  if (lower.includes('css')) {
    return 'CSS styles the appearance, colors, layout, and responsiveness of web pages.';
  }

  // 5. General Science
  if (lower.includes('speed of light')) {
    return 'The speed of light in a vacuum is 299,792,458 meters per second (approx. 300,000 km/s).';
  }
  if (lower.includes('gravity')) {
    return 'Gravity is the natural force pulling objects toward each other. On Earth, acceleration is 9.8 m/s².';
  }

  // 6. Parent queries
  if (role === 'parent' && (lower.includes('progress') || lower.includes('score'))) {
    return 'You can check your student\'s completed MCQs, time, and accuracy in the "Analyze Progress" tab.';
  }

  return `The answer to "${trimmed}" is readily explained: focus on the core rules and break it into simple steps. What specific detail would you like to know?`;
}
