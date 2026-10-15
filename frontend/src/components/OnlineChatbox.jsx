import { useState, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';

// Client-side fallback responses for AI learning, programming, and general knowledge
const getBotResponse = (query, role = 'student') => {
  const trimmed = query.trim();
  const q = trimmed.toLowerCase();

  // 1. Direct Math Solver (e.g. 1+2, 1+3, 12*5, 100/4)
  const mathMatch = trimmed.match(/(-?\d+(?:\.\d+)?)\s*([\+\-\*\/xX\^])\s*(-?\d+(?:\.\d+)?)/);
  if (mathMatch) {
    const num1 = parseFloat(mathMatch[1]);
    const op = mathMatch[2];
    const num2 = parseFloat(mathMatch[3]);
    let result = null;
    if (op === '+') result = num1 + num2;
    else if (op === '-') result = num1 - num2;
    else if (op === '*' || op === 'x' || op === 'X') result = num1 * num2;
    else if (op === '/') result = num2 !== 0 ? num1 / num2 : 'undefined';
    else if (op === '^') result = Math.pow(num1, num2);
    if (result !== null) return `${num1} ${op} ${num2} = ${result}`;
  }

  // Greetings
  if (/^(hi|hello|hey|good morning|good afternoon|good evening|ආයුබෝවන්)/i.test(q)) {
    return role === 'parent'
      ? 'Hello! 👋 How can I assist you with your child’s educational journey today?'
      : 'Hello! 👋 How can I help you with your studies, maths, or programming today?';
  }

  // Who are you
  if (q.includes('who are you') || q.includes('what can you do')) {
    return role === 'parent'
      ? 'I am the CylixLab Parent Advisor AI, here to assist with student progress and guidance.'
      : 'I am the CylixLab Student Assistant AI! Ask me any questions on maths, coding, English, or AI.';
  }

  // AI & Machine Learning
  if (q.includes('what is ai') || q.includes('artificial intelligence')) {
    return 'Artificial Intelligence (AI) enables computers to perform smart tasks like learning, reasoning, and problem-solving.';
  }
  if (q.includes('machine learning') || q.includes('what is ml')) {
    return 'Machine Learning is a subset of AI where systems learn patterns from data to make predictions automatically.';
  }
  if (q.includes('deep learning')) {
    return 'Deep Learning uses multi-layered artificial neural networks modeled after the human brain.';
  }

  // Programming
  if (q.includes('python')) {
    return 'Python is an easy-to-read programming language widely used in AI, data science, and automation.';
  }
  if (q.includes('javascript') || q.includes('js')) {
    return 'JavaScript is the core programming language for web interactivity and application logic.';
  }

  // Short intelligent fallback
  return `Answer for "${trimmed}": Please make sure the backend server is running (npm run dev) to get live Groq AI answers.`;
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
