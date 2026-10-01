import { useState, useEffect } from 'react';
import Footer from './Footer';
import TodoListManager from './TodoListManager';
import LearningPathDetailView from './LearningPathDetailView';
import AssignmentDetailView from './AssignmentDetailView';
import OnlineChatbox from './OnlineChatbox';
import MotivationalQuotesView from './MotivationalQuotesView';
import AnalyseProgressView from './AnalyseProgressView';

// Icons
const IconUser = ({ color = '#ffffff' }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill={color}>
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
  </svg>
);

const IconTodo = ({ color = '#ffffff', size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="4" width="14" height="17" rx="2.5" />
    <path d="M9 4.5V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1.5" />
    <path d="M8 9.2l1.5 1.5 2.5-2.5" />
    <line x1="13.5" y1="9.5" x2="16.5" y2="9.5" />
    <path d="M8 13.7l1.5 1.5 2.5-2.5" />
    <line x1="13.5" y1="14" x2="16.5" y2="14" />
    <path d="M8 18.2l1.5 1.5 2.5-2.5" />
    <line x1="13.5" y1="18.5" x2="16.5" y2="18.5" />
  </svg>
);

const IconLearning = ({ color = '#ffffff', size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <circle cx="12" cy="4.5" r="2.5" />
    <path d="M12 8.5c-3.3 0-6.2 1.4-7.5 3.6V19.5c2-1 4.5-1.5 7.5-1.5s5.5.5 7.5 1.5v-7.4C18.2 9.9 15.3 8.5 12 8.5z" />
  </svg>
);

const IconChat = ({ color = '#ffffff', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 0 1-3.12-.5L4 21l1.42-3.79C4.52 15.82 4 14 4 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    <circle cx="8.5" cy="12" r="1.2" fill={color} stroke="none" />
    <circle cx="12" cy="12" r="1.2" fill={color} stroke="none" />
    <circle cx="15.5" cy="12" r="1.2" fill={color} stroke="none" />
  </svg>
);

const IconQuotes = ({ color = '#ffffff', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 12c0 3.866-3.582 7-8 7-1.12 0-2.19-.2-3.15-.57L4 19.5l1.3-3.25C4.5 15.02 4 13.58 4 12c0-3.866 3.582-7 8-7s8 3.134 8 7z" />
    <path d="M9 10.5h2.5M8 13.5h4" strokeWidth="1.8" />
  </svg>
);

const IconProgress = ({ color = '#ffffff', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" fill={color} />
    <circle cx="5" cy="7" r="2.2" />
    <circle cx="19" cy="7" r="2.2" />
    <circle cx="12" cy="20" r="2.2" />
    <line x1="7" y1="8.5" x2="10" y2="10.5" />
    <line x1="17" y1="8.5" x2="14" y2="10.5" />
    <line x1="12" y1="15" x2="12" y2="17.8" />
  </svg>
);

const features = [
  {
    id: 'personal',
    title: 'Personal Details',
    icon: <IconUser />,
  },
  {
    id: 'todo',
    title: 'To-Do Lists',
    icon: <IconTodo />,
  },
  {
    id: 'learning',
    title: 'Learning & Assignment',
    icon: <IconLearning />,
  },
  {
    id: 'chat',
    title: 'Online Chatbox',
    icon: <IconChat />,
  },
  {
    id: 'quotes',
    title: 'Motivational Quotes',
    icon: <IconQuotes />,
  },
  {
    id: 'progress',
    title: 'Analyze Progress',
    icon: <IconProgress />,
  },
];

const StudentDashboard = ({ initialView = 'dashboard' }) => {
  // 'dashboard' = 6 features list + arrows + 6 icons
  // 'personal' = Personal Details view on same page
  // 'todo' = Manage Your To-Do List view (scrollable page)
  const [currentView, setCurrentView] = useState(initialView);
  const [activeLearningPath, setActiveLearningPath] = useState(null);
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [userData, setUserData] = useState({
    name: 'User',
    age: '14',
    email: '123@gmail.com',
    gender: 'male',
  });
  const [activeCycleIndex, setActiveCycleIndex] = useState(-1);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUserData((prev) => ({
          name: parsed.name || prev.name,
          age: parsed.age || prev.age,
          email: parsed.email || prev.email,
          gender: parsed.gender || prev.gender,
        }));
      } else {
        const lastRegName = localStorage.getItem('lastRegisteredName');
        const lastRegEmail = localStorage.getItem('lastRegisteredEmail');
        if (lastRegName || lastRegEmail) {
          setUserData((prev) => ({
            ...prev,
            name: lastRegName || prev.name,
            email: lastRegEmail || prev.email,
          }));
        }
      }
    } catch {
      // fallback
    }
  }, []);

  // After full loading, start cycle only if on dashboard view
  useEffect(() => {
    if (currentView !== 'dashboard') {
      setActiveCycleIndex(-1);
      return;
    }

    let intervalId;
    const startTimer = setTimeout(() => {
      setActiveCycleIndex(0);
      intervalId = setInterval(() => {
        setActiveCycleIndex((prev) => (prev + 1) % 12);
      }, 450);
    }, 2000);

    return () => {
      clearTimeout(startTimer);
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentView]);

  return (
    <div className={`student-dashboard-page ${(currentView === 'todo' || currentView === 'progress' || activeAssignment) ? 'scrollable-page' : ''}`}>
      {/* 1. UNIFIED HEADER FOR ALL STUDENT DASHBOARD PAGES */}
      <header className="student-dashboard-header">
        <div className="learning-header-pattern" aria-hidden="true">
          <svg viewBox="0 0 380 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M120 -20 L250 110 M170 -20 L300 110 M220 -20 L350 110" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
            <rect x="250" y="8" width="65" height="65" transform="rotate(45 282 40)" stroke="rgba(255,255,255,0.24)" strokeWidth="1.6" />
            <rect x="295" y="16" width="46" height="46" transform="rotate(45 318 39)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.4" />
            <rect x="330" y="24" width="30" height="30" transform="rotate(45 345 39)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" />
          </svg>
        </div>
        <h1 className="learning-header-title">
          {currentView === 'personal'
            ? `Hello ${userData.name || 'User'} , See your details`
            : currentView === 'todo'
            ? 'Manage Your To-Do List'
            : currentView === 'learning'
            ? 'Learning & Assignments'
            : currentView === 'chat'
            ? 'Online Chatbox'
            : currentView === 'quotes'
            ? 'Motivational Quotes'
            : currentView === 'progress'
            ? 'Analyse Progress'
            : `welcome back , ${userData.name ? userData.name.toLowerCase() : 'user'} !`}
        </h1>
        <span className="learning-header-logo">CylixLab</span>
      </header>

      {/* 2. MAIN CONTENT (SAME PAGE IN-PLACE SWITCH) */}
      <main className={`student-dashboard-main ${currentView === 'todo' ? 'todo-view-main' : currentView === 'learning' ? 'learning-view-main' : currentView === 'chat' ? 'chat-view-main' : currentView === 'quotes' ? 'quotes-view-main' : currentView === 'progress' ? 'progress-view-main' : ''}`}>
        {/* Back to Student Dashboard below header in black color */}
        {(currentView === 'personal' || currentView === 'todo' || currentView === 'chat' || currentView === 'quotes' || currentView === 'progress' || (currentView === 'learning' && !activeLearningPath && !activeAssignment)) && (
          <button
            className="dashboard-back-link-below"
            onClick={() => {
              setCurrentView('dashboard');
              setActiveLearningPath(null);
              setActiveAssignment(null);
            }}
            aria-label="Back to Student Dashboard"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Back to Student Dashboard</span>
          </button>
        )}

        {/* Learning view title "What you do?" centered above */}
        {currentView === 'learning' && !activeLearningPath && !activeAssignment && (
          <h2 className="learning-main-title">What you do?</h2>
        )}


        {currentView === 'learning' && activeLearningPath ? (
          <LearningPathDetailView
            pathId={activeLearningPath}
            onBack={() => setActiveLearningPath(null)}
          />
        ) : currentView === 'learning' && activeAssignment ? (
          <AssignmentDetailView
            assignmentId={activeAssignment}
            onBack={() => setActiveAssignment(null)}
          />
        ) : (
          <div className={`student-content-container ${currentView === 'todo' ? 'todo-content-container' : currentView === 'learning' ? 'learning-content-container' : currentView === 'chat' ? 'chat-content-container' : currentView === 'quotes' ? 'quotes-content-container' : currentView === 'progress' ? 'progress-content-container' : ''}`}>
            {/* Left Icon Pill Capsule */}
            <aside className={`student-icon-capsule ${currentView === 'todo' ? 'todo-capsule-sticky' : currentView === 'learning' ? 'learning-capsule' : currentView === 'chat' ? 'chat-capsule' : currentView === 'quotes' ? 'quotes-capsule' : currentView === 'progress' ? 'progress-capsule' : ''}`} aria-label="Feature navigation icons">
            {currentView === 'personal' ? (
              // In Personal Details view: ONLY the first icon (User Icon) displays at top
              <div
                className="capsule-slot single-active-slot"
                onClick={() => setCurrentView('dashboard')}
                title="Click to go back to feature list"
                style={{ cursor: 'pointer' }}
              >
                <div className="capsule-icon-wrapper">
                  <IconUser color="#ffffff" />
                </div>
              </div>
            ) : currentView === 'todo' ? (
              // In To-Do List view: Display in the 2nd place (2nd slot), perfectly matching feature list order
              <>
                <div className="capsule-slot" aria-hidden="true" style={{ pointerEvents: 'none', visibility: 'hidden' }} />
                <div
                  className="capsule-slot single-active-slot"
                  onClick={() => setCurrentView('dashboard')}
                  title="Click to go back to Student Dashboard"
                  style={{ cursor: 'pointer' }}
                >
                  <div className="capsule-icon-wrapper">
                    <IconTodo color="#ffffff" size={26} />
                  </div>
                </div>
              </>
            ) : currentView === 'learning' ? (
              // In Learning & Assignment view: Display in the 3rd place (3rd slot)
              <>
                <div className="capsule-slot" aria-hidden="true" style={{ pointerEvents: 'none', visibility: 'hidden' }} />
                <div className="capsule-slot" aria-hidden="true" style={{ pointerEvents: 'none', visibility: 'hidden' }} />
                <div
                  className="capsule-slot single-active-slot learning-active-slot"
                  onClick={() => setCurrentView('dashboard')}
                  title="Click to go back to Student Dashboard"
                  style={{ cursor: 'pointer' }}
                >
                  <div className="capsule-icon-wrapper">
                    <IconLearning color="#ffffff" size={26} />
                  </div>
                </div>
              </>
            ) : currentView === 'chat' ? (
              // In Online Chatbox view: Display in the 4th place (4th slot)
              <>
                <div className="capsule-slot" aria-hidden="true" style={{ pointerEvents: 'none', visibility: 'hidden' }} />
                <div className="capsule-slot" aria-hidden="true" style={{ pointerEvents: 'none', visibility: 'hidden' }} />
                <div className="capsule-slot" aria-hidden="true" style={{ pointerEvents: 'none', visibility: 'hidden' }} />
                <div
                  className="capsule-slot single-active-slot chat-active-slot"
                  onClick={() => setCurrentView('dashboard')}
                  title="Click to go back to Student Dashboard"
                  style={{ cursor: 'pointer' }}
                >
                  <div className="capsule-icon-wrapper">
                    <IconChat color="#ffffff" size={26} />
                  </div>
                </div>
              </>
            ) : currentView === 'quotes' ? (
              // In Motivational Quotes view: Display in the 5th place (5th slot)
              <>
                <div className="capsule-slot" aria-hidden="true" style={{ pointerEvents: 'none', visibility: 'hidden' }} />
                <div className="capsule-slot" aria-hidden="true" style={{ pointerEvents: 'none', visibility: 'hidden' }} />
                <div className="capsule-slot" aria-hidden="true" style={{ pointerEvents: 'none', visibility: 'hidden' }} />
                <div className="capsule-slot" aria-hidden="true" style={{ pointerEvents: 'none', visibility: 'hidden' }} />
                <div
                  className="capsule-slot single-active-slot quotes-active-slot"
                  onClick={() => setCurrentView('dashboard')}
                  title="Click to go back to Student Dashboard"
                  style={{ cursor: 'pointer' }}
                >
                  <div className="capsule-icon-wrapper">
                    <IconQuotes color="#ffffff" size={26} />
                  </div>
                </div>
                <div className="capsule-slot" aria-hidden="true" style={{ pointerEvents: 'none', visibility: 'hidden' }} />
              </>
            ) : currentView === 'progress' ? (
              // In Analyze Progress view: Display in the 6th place (6th slot)
              <>
                <div className="capsule-slot" aria-hidden="true" style={{ pointerEvents: 'none', visibility: 'hidden' }} />
                <div className="capsule-slot" aria-hidden="true" style={{ pointerEvents: 'none', visibility: 'hidden' }} />
                <div className="capsule-slot" aria-hidden="true" style={{ pointerEvents: 'none', visibility: 'hidden' }} />
                <div className="capsule-slot" aria-hidden="true" style={{ pointerEvents: 'none', visibility: 'hidden' }} />
                <div className="capsule-slot" aria-hidden="true" style={{ pointerEvents: 'none', visibility: 'hidden' }} />
                <div
                  className="capsule-slot single-active-slot progress-active-slot"
                  onClick={() => setCurrentView('dashboard')}
                  title="Click to go back to Student Dashboard"
                  style={{ cursor: 'pointer' }}
                >
                  <div className="capsule-icon-wrapper">
                    <IconProgress color="#ffffff" size={26} />
                  </div>
                </div>
              </>
            ) : (
              // In Dashboard view: All 6 icons display and cycle
              features.map((item, index) => {
                const isPulsing = activeCycleIndex === index;
                return (
                  <div
                    key={item.id}
                    className={`capsule-slot ${isPulsing ? 'pulse-active' : ''}`}
                    onClick={() => {
                      if (item.id === 'personal') setCurrentView('personal');
                      else if (item.id === 'todo') setCurrentView('todo');
                      else if (item.id === 'learning') setCurrentView('learning');
                      else if (item.id === 'chat') setCurrentView('chat');
                      else if (item.id === 'quotes') setCurrentView('quotes');
                      else if (item.id === 'progress') setCurrentView('progress');
                    }}
                    title={
                      item.id === 'personal'
                        ? 'Click to open Personal Details'
                        : item.id === 'todo'
                        ? 'Click to open To-Do Lists'
                        : item.id === 'learning'
                        ? 'Click to open Learning & Assignments'
                        : item.id === 'chat'
                        ? 'Click to open Online Chatbox'
                        : item.id === 'quotes'
                        ? 'Click to open Motivational Quotes'
                        : item.id === 'progress'
                        ? 'Click to open Analyse Progress'
                        : item.title
                    }
                  >
                    <div className="capsule-icon-wrapper">
                      {item.icon}
                    </div>
                  </div>
                );
              })
            )}
          </aside>

          {/* Center Blinking Directional Arrows (Only shown in dashboard view) */}
          {currentView === 'dashboard' && (
            <div className="blinking-arrows-wrapper" aria-hidden="true">
              <div className="blinking-arrows-container">
                <span className="arrow-item arrow-1">
                  <svg width="22" height="30" viewBox="0 0 20 28" fill="currentColor">
                    <path d="M3 4 L17 14 L3 24 Z" />
                  </svg>
                </span>
                <span className="arrow-item arrow-2">
                  <svg width="22" height="30" viewBox="0 0 20 28" fill="currentColor">
                    <path d="M3 4 L17 14 L3 24 Z" />
                  </svg>
                </span>
                <span className="arrow-item arrow-3">
                  <svg width="22" height="30" viewBox="0 0 20 28" fill="currentColor">
                    <path d="M3 4 L17 14 L3 24 Z" />
                  </svg>
                </span>
                <span className="arrow-item arrow-4">
                  <svg width="22" height="30" viewBox="0 0 20 28" fill="currentColor">
                    <path d="M3 4 L17 14 L3 24 Z" />
                  </svg>
                </span>
              </div>
            </div>
          )}

          {/* Right Content Area: Personal Details Card OR To-Do List Manager OR 6 Feature Buttons */}
          {currentView === 'personal' ? (
            <div className="personal-details-card">
              <div className="detail-row">
                <span className="detail-label">Full Name</span>
                <div className="detail-value-box">{userData.name || 'User'}</div>
              </div>

              <div className="detail-row">
                <span className="detail-label">Age</span>
                <div className="detail-value-box">{userData.age || '14'}</div>
              </div>

              <div className="detail-row">
                <span className="detail-label">Email</span>
                <div className="detail-value-box">{userData.email || '123@gmail.com'}</div>
              </div>

              <div className="detail-row">
                <span className="detail-label">Gender</span>
                <div className="detail-value-box">{userData.gender || 'male'}</div>
              </div>
            </div>
          ) : currentView === 'todo' ? (
            <div className="todo-content-wrapper">
              <TodoListManager />
            </div>
          ) : currentView === 'learning' ? (
            <div className="learning-cards-row">
              {/* Card 1: Learning Path */}
              <div className="learning-card-box">
                <h3 className="learning-card-title">Learning Path</h3>
                <div className="learning-buttons-list">
                  {['01', '02', '03', '04', '05'].map((num) => (
                    <button
                      key={`lp-${num}`}
                      type="button"
                      className="learning-action-red-btn"
                      onClick={() => setActiveLearningPath(num)}
                    >
                      Learning Path {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card 2: Assignment */}
              <div className="learning-card-box">
                <h3 className="learning-card-title">Assignment</h3>
                <div className="learning-buttons-list">
                  {['01', '02', '03', '04', '05'].map((num) => (
                    <button
                      key={`as-${num}`}
                      type="button"
                      className="learning-action-red-btn"
                      onClick={() => setActiveAssignment(num)}
                    >
                      Assignment {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : currentView === 'chat' ? (
            <div className="chat-content-wrapper">
              <h2 className="chat-main-subtitle">&quot;Ask questions, share updates, and collaborate instantly.&quot;</h2>
              <OnlineChatbox />
            </div>
          ) : currentView === 'quotes' ? (
            <MotivationalQuotesView />
          ) : currentView === 'progress' ? (
            <AnalyseProgressView />
          ) : (
            <div className="student-features-list">
              {features.map((feature, index) => {
                const isPulsing = activeCycleIndex === (index + 6);
                return (
                  <button
                    key={feature.id}
                    className={`feature-action-btn ${isPulsing ? 'pulse-active' : ''}`}
                    style={{
                      animationDelay: `${0.22 * index}s`,
                    }}
                    onClick={() => {
                      if (feature.id === 'personal') {
                        setCurrentView('personal');
                      } else if (feature.id === 'todo') {
                        setCurrentView('todo');
                      } else if (feature.id === 'learning') {
                        setCurrentView('learning');
                      } else if (feature.id === 'chat') {
                        setCurrentView('chat');
                      } else if (feature.id === 'quotes') {
                        setCurrentView('quotes');
                      } else if (feature.id === 'progress') {
                        setCurrentView('progress');
                      } else {
                        console.log(`Selected feature: ${feature.title}`);
                      }
                    }}
                  >
                    <span className="feature-btn-title">{feature.title}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </main>

      {/* 3. FOOTER (COMPACT HEIGHT) */}
      <Footer compact={true} className="student-dashboard-footer" />
    </div>
  );
};

export default StudentDashboard;
