import { useState, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';

// Client-side fallback responses for AI learning, programming, and general knowledge
const getBotResponse = (query, role = 'student') => {
  const q = query.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|good morning|good afternoon|good evening|ආයුබෝවන්)/i.test(q)) {
    return role === 'parent'
      ? 'Hello! 👋 How can I assist you with your child’s educational journey in CylixLab today?'
      : 'Hello! 👋 How can I help you with your studies today? You can ask me about AI concepts, programming, or general knowledge!';
  }

  // Who are you
  if (q.includes('who are you') || q.includes('what can you do')) {
    return role === 'parent'
      ? 'I am the CylixLab Parent Advisor AI! I assist parents in tracking student progress, understanding course roadmaps, managing study schedules, and supporting learning.'
      : 'I am the CylixLab Student Knowledge Assistant AI! I help you learn AI concepts, understand programming, answer study questions, and guide your assignments.';
  }

  // Parent specific questions
  if (role === 'parent' && (q.includes('progress') || q.includes('analyze') || q.includes('score') || q.includes('marks'))) {
    return 'You can analyze your child’s progress in real-time in the "Analyze Progress" tab. It shows completed MCQs, study streak, accuracy scores, and areas where they might need more practice!';
  }

  if (role === 'parent' && (q.includes('time') || q.includes('schedule') || q.includes('routine'))) {
    return 'A consistent 45-60 minute focused study routine with 10-minute breaks works best for young learners. You can also view the student To-Do list to verify daily goals!';
  }

  // AI & Machine Learning Questions
  if (q.includes('what is ai') || q.includes('artificial intelligence')) {
    return 'Artificial Intelligence (AI) is the simulation of human intelligence by machines and computer systems. Key branches include Machine Learning, Natural Language Processing (NLP), Computer Vision, and Robotics.';
  }
  if (q.includes('machine learning') || q.includes('what is ml')) {
    return 'Machine Learning (ML) is a subfield of AI where algorithms learn patterns from data and improve their performance over time without being explicitly programmed for every specific rule.';
  }
  if (q.includes('deep learning') || q.includes('neural network')) {
    return 'Deep Learning uses Artificial Neural Networks with multiple layers (hence "deep") to model complex patterns in large datasets, inspired by the biological neurons in the human brain.';
  }
  if (q.includes('nlp') || q.includes('natural language')) {
    return 'Natural Language Processing (NLP) enables computers to understand, interpret, and generate human language. Examples include translation tools, voice assistants, and chatbots.';
  }
  if (q.includes('computer vision')) {
    return 'Computer Vision is an AI field enabling computers to derive meaningful information from digital images, videos, and visual inputs, used in facial recognition, self-driving cars, and medical imaging.';
  }

  // Programming & Coding Questions
  if (q.includes('javascript') || q.includes('js')) {
    return 'JavaScript is the most popular programming language of the web. It powers interactive frontend experiences (like this chatbox!) and can also run on servers using Node.js.';
  }
  if (q.includes('python')) {
    return 'Python is a high-level, easy-to-read programming language widely used in AI, data science, machine learning, web backend development, and automation.';
  }
  if (q.includes('react')) {
    return 'React is a popular JavaScript library created by Meta for building modern user interfaces using reusable components and a fast virtual DOM.';
  }
  if (q.includes('html') || q.includes('css')) {
    return 'HTML (HyperText Markup Language) provides the structure and content of web pages, while CSS (Cascading Style Sheets) styles the layout, colors, typography, and responsive design.';
  }
  if (q.includes('backend') || q.includes('server') || q.includes('database')) {
    return 'The backend is the server-side part of an application that handles business logic, databases, authentication, and APIs, communicating with the frontend interface.';
  }

  // General Knowledge & Science Questions
  if (q.includes('solar system') || q.includes('planet')) {
    return 'Our Solar System consists of the Sun and 8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune, along with dwarf planets like Pluto and numerous asteroids and comets.';
  }
  if (q.includes('gravity') || q.includes('gravitational')) {
    return 'Gravity is a fundamental force of nature that attracts two bodies toward each other. On Earth, gravitational acceleration is approximately 9.8 m/s².';
  }
  if (q.includes('photosynthesis')) {
    return 'Photosynthesis is the process by which green plants and organisms use sunlight, water, and carbon dioxide to create oxygen and energy in the form of sugar.';
  }

  // CylixLab platform questions
  if (q.includes('assignment') || q.includes('learning path') || q.includes('todo') || q.includes('cylixlab')) {
    return 'In CylixLab, you can access guided Learning Paths with PDF resources, practice 30-question MCQ assignments with a 30-minute timer, and track your daily tasks in your To-Do list!';
  }

  // Thank you / Farewell
  if (q.includes('thank') || q.includes('thanks')) {
    return "You're very welcome! Keep asking questions and never stop learning! 😊";
  }
  if (q.includes('bye') || q.includes('goodbye')) {
    return 'Goodbye! Have a productive study session, and feel free to return whenever you need help!';
  }

  // General helpful intelligent fallback
  return `That's a great question regarding "${query}". Here is a helpful insight: Always break complex concepts into small, manageable parts. If you are learning this for your assignment or exams, focus on the core principles, practice hands-on problems, and review the relevant Learning Path modules in CylixLab!`;
};

const OnlineChatbox = ({ role: propRole }) => {
  // Determine effective user role ('student' or 'parent')
  const effectiveRole = useMemo(() => {
    if (propRole) return propRole;
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.role) return parsed.role;
      }
      const lastRole = localStorage.getItem('lastRegisteredRole');
      if (lastRole) return lastRole;
    } catch {
      // fallback
    }
    return 'student';
  }, [propRole]);

  const initialGreeting = useMemo(() => {
    if (effectiveRole === 'parent') {
      return 'Hello! 👋 Ask me any questions about supporting your child\'s learning, study schedules, or platform features.';
    }
    return 'Hello! Ask me any questions about AI learning, programming, or general knowledge.';
  }, [effectiveRole]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: initialGreeting,
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of messages container
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || isTyping) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: trimmed,
      time: currentTime,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setIsTyping(true);

    try {
      // Prepare previous conversation history for context
      const historyContext = updatedMessages.slice(-6).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      // Send to backend /api/chat with fallback
      let replyText = '';
      try {
        const response = await axios.post(
          '/api/chat',
          {
            message: trimmed,
            role: effectiveRole,
            history: historyContext,
          },
          { timeout: 15000 }
        );

        if (response.data && response.data.reply) {
          replyText = response.data.reply;
        }
      } catch (err) {
        // Direct fallback to port 5000 if relative path failed
        try {
          const directResponse = await axios.post(
            'http://localhost:5000/api/chat',
            {
              message: trimmed,
              role: effectiveRole,
              history: historyContext,
            },
            { timeout: 15000 }
          );
          if (directResponse.data && directResponse.data.reply) {
            replyText = directResponse.data.reply;
          }
        } catch (directErr) {
          console.warn('Backend chat not reachable, using smart fallback', directErr.message || err.message);
        }
      }

      // If backend didn't return text (e.g. server offline or initial setup), use smart local fallback
      if (!replyText) {
        replyText = getBotResponse(trimmed, effectiveRole);
      }

      const botReply = {
        id: Date.now() + 1,
        sender: 'bot',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (globalErr) {
      console.error('Chat error:', globalErr);
      const errorReply = {
        id: Date.now() + 1,
        sender: 'bot',
        text: getBotResponse(trimmed, effectiveRole),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-blue-window">
      {/* Messages Scrollable Area */}
      <div className="chat-messages-area">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-bubble-row ${msg.sender === 'user' ? 'user-row' : 'bot-row'}`}
          >
            <div className={`chat-message-bubble ${msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
              <p className="chat-message-text">{msg.text}</p>
              <span className="chat-message-time">{msg.time}</span>
            </div>
          </div>
        ))}

        {/* Animated Typing Indicator */}
        {isTyping && (
          <div className="chat-bubble-row bot-row">
            <div className="chat-typing-indicator">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input Bar matching screenshot */}
      <form className="chat-input-bar" onSubmit={handleSendMessage}>
        <input
          ref={inputRef}
          type="text"
          className="chat-text-input"
          placeholder="Type here ......."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isTyping}
          aria-label="Type your message"
        />
        <button
          type="submit"
          className="chat-send-btn"
          disabled={isTyping || !inputText.trim()}
          aria-label="Send message"
        >
          {/* Triangular play/send icon matching screenshot */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="6 3 20 12 6 21 6 3" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default OnlineChatbox;
