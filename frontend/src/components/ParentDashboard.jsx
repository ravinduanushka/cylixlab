import { useState, useEffect } from 'react';
import Footer from './Footer';
import OnlineChatbox from './OnlineChatbox';
import MotivationalQuotesView from './MotivationalQuotesView';
import ParentStudentProgressView from './ParentStudentProgressView';

// Vector Icons
const IconUser = ({ color = '#ffffff' }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill={color}>
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
  </svg>
);

const IconQuotes = ({ color = '#ffffff', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 12c0 3.866-3.582 7-8 7-1.12 0-2.19-.2-3.15-.57L4 19.5l1.3-3.25C4.5 15.02 4 13.58 4 12c0-3.866 3.582-7 8-7s8 3.134 8 7z" />
    <path d="M9 10.5h2.5M8 13.5h4" strokeWidth="1.8" />
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

// 4 Parent Features: Personal Details, Motivational Quotes, Online Chatbox, Analyze Progress
const parentFeatures = [
  {
    id: 'personal',
    title: 'Personal Details',
    icon: <IconUser />,
  },
  {
    id: 'quotes',
    title: 'Motivational Quotes',
    icon: <IconQuotes />,
  },
  {
    id: 'chat',
    title: 'Online Chatbox',
    icon: <IconChat />,
  },
  {
    id: 'progress',
    title: 'Analyze Progress',
    icon: <IconProgress />,
  },
];

const ParentDashboard = ({ initialView = 'dashboard' }) => {
  const [currentView, setCurrentView] = useState(initialView);
  const [userData, setUserData] = useState({
    name: 'Kamal',
    email: 'kamal@gmail.com',
    gender: 'Male',
    studentName: 'Student',
  });
  const [activeCycleIndex, setActiveCycleIndex] = useState(-1);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUserData((prev) => ({
          name: parsed.name || prev.name,
          email: parsed.email || prev.email,
          gender: parsed.gender || localStorage.getItem('lastRegisteredGender') || prev.gender,
          studentName: parsed.studentName || localStorage.getItem('lastRegisteredStudentName') || prev.studentName,
        }));
      } else {
        const lastRegName = localStorage.getItem('lastRegisteredName');
        const lastRegEmail = localStorage.getItem('lastRegisteredEmail');
        const lastRegGender = localStorage.getItem('lastRegisteredGender');
        const lastRegStudent = localStorage.getItem('lastRegisteredStudentName');
        if (lastRegName || lastRegEmail || lastRegGender || lastRegStudent) {
          setUserData((prev) => ({
            ...prev,
            name: lastRegName || prev.name,
            email: lastRegEmail || prev.email,
            gender: lastRegGender || prev.gender,
            studentName: lastRegStudent || prev.studentName,
          }));
        }
      }
    } catch {
      // fallback to defaults
    }
  }, []);

  // Slower, smooth cycle through 4 capsule slots (0..3) and 4 buttons (4..7)
  useEffect(() => {
    if (currentView !== 'dashboard') {
      setActiveCycleIndex(-1);
      return;
    }

    let intervalId;
    const startTimer = setTimeout(() => {
      setActiveCycleIndex(0);
      intervalId = setInterval(() => {
        setActiveCycleIndex((prev) => (prev + 1) % 8);
      }, 500);
    }, 1800);

    return () => {
      clearTimeout(startTimer);
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentView]);

  // Gender salutation helper: Mr / Ms based on gender preference
  const getSalutation = () => {
    const g = (userData.gender || '').trim().toLowerCase();
    if (g === 'male' || g === 'm') {
      return 'Mr';
    } else if (g === 'female' || g === 'f') {
      return 'Ms';
    }
    return 'Mr / Ms';
  };

  const salutation = getSalutation();
  const displayName = userData.name ? userData.name.toLowerCase() : 'kamal';

  return (
    <div className={`student-dashboard-page parent-dashboard-page ${(currentView === 'progress' || currentView === 'quotes') ? 'scrollable-page' : ''}`}>
      {/* 1. UNIFIED HEADER */}
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
            ? `Hello ${salutation} ${userData.name || 'Kamal'} , See your details`
            : currentView === 'quotes'
            ? 'Motivational Quotes'
            : currentView === 'chat'
            ? 'Online Chatbox'
            : currentView === 'progress'
            ? 'Student Progress'
            : `welcome back , ${salutation} ${displayName} !`}
        </h1>
        <span className="learning-header-logo">CylixLab</span>
      </header>

      {/* 2. MAIN CONTENT (SAME PAGE IN-PLACE SWITCH) */}
      <main className={`student-dashboard-main ${currentView === 'quotes' ? 'quotes-view-main' : currentView === 'chat' ? 'chat-view-main' : currentView === 'progress' ? 'progress-view-main' : ''}`}>
        {/* Back to Parent Dashboard button when in a subview */}
        {(currentView === 'personal' || currentView === 'quotes' || currentView === 'chat' || currentView === 'progress') && (
          <button
            className="dashboard-back-link-below"
            onClick={() => {
              setCurrentView('dashboard');
            }}
            aria-label="Back to Parent Dashboard"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Back to Parent Dashboard</span>
          </button>
        )}

        <div className={`student-content-container parent-content-container ${currentView === 'quotes' ? 'quotes-content-container' : currentView === 'chat' ? 'chat-content-container' : currentView === 'progress' ? 'progress-content-container' : ''}`}>
          {/* Left Icon Pill Capsule (4 slots for parent dashboard) */}
          <aside className={`student-icon-capsule parent-capsule ${currentView === 'quotes' ? 'quotes-capsule' : currentView === 'chat' ? 'chat-capsule' : currentView === 'progress' ? 'progress-capsule' : ''}`} aria-label="Feature navigation icons">
            {currentView === 'personal' ? (
              // In Personal Details view: 1st slot active
              <div
                className="capsule-slot single-active-slot"
                onClick={() => setCurrentView('dashboard')}
                title="Click to go back to features"
                style={{ cursor: 'pointer' }}
              >
                <div className="capsule-icon-wrapper">
                  <IconUser color="#ffffff" />
                </div>
              </div>
            ) : currentView === 'quotes' ? (
              // In Motivational Quotes view: 2nd slot active
              <>
                <div className="capsule-slot" aria-hidden="true" style={{ pointerEvents: 'none', visibility: 'hidden' }} />
                <div
                  className="capsule-slot single-active-slot quotes-active-slot"
                  onClick={() => setCurrentView('dashboard')}
                  title="Click to go back to features"
                  style={{ cursor: 'pointer' }}
                >
                  <div className="capsule-icon-wrapper">
                    <IconQuotes color="#ffffff" size={26} />
                  </div>
                </div>
              </>
            ) : currentView === 'chat' ? (
              // In Chat view: 3rd slot active
              <>
                <div className="capsule-slot" aria-hidden="true" style={{ pointerEvents: 'none', visibility: 'hidden' }} />
                <div className="capsule-slot" aria-hidden="true" style={{ pointerEvents: 'none', visibility: 'hidden' }} />
                <div
                  className="capsule-slot single-active-slot chat-active-slot"
                  onClick={() => setCurrentView('dashboard')}
                  title="Click to go back to features"
                  style={{ cursor: 'pointer' }}
                >
                  <div className="capsule-icon-wrapper">
                    <IconChat color="#ffffff" size={26} />
                  </div>
                </div>
              </>
            ) : currentView === 'progress' ? (
              // In Progress view: 4th slot active
              <>
                <div className="capsule-slot" aria-hidden="true" style={{ pointerEvents: 'none', visibility: 'hidden' }} />
                <div className="capsule-slot" aria-hidden="true" style={{ pointerEvents: 'none', visibility: 'hidden' }} />
                <div className="capsule-slot" aria-hidden="true" style={{ pointerEvents: 'none', visibility: 'hidden' }} />
                <div
                  className="capsule-slot single-active-slot progress-active-slot"
                  onClick={() => setCurrentView('dashboard')}
                  title="Click to go back to features"
                  style={{ cursor: 'pointer' }}
                >
                  <div className="capsule-icon-wrapper">
                    <IconProgress color="#ffffff" size={26} />
                  </div>
                </div>
              </>
            ) : (
              // In Dashboard view: All 4 icons display and cycle
              parentFeatures.map((item, index) => {
                const isPulsing = activeCycleIndex === index;
                return (
                  <div
                    key={item.id}
                    className={`capsule-slot ${isPulsing ? 'pulse-active' : ''}`}
                    onClick={() => {
                      if (item.id === 'personal') setCurrentView('personal');
                      else if (item.id === 'quotes') setCurrentView('quotes');
                      else if (item.id === 'chat') setCurrentView('chat');
                      else if (item.id === 'progress') setCurrentView('progress');
                    }}
                    title={`Click to open ${item.title}`}
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

          {/* Right Content Area: Personal Details Card OR Quotes OR Chat OR Progress OR 4 Feature Buttons */}
          {currentView === 'personal' ? (
            <div className="personal-details-card">
              <div className="detail-row">
                <span className="detail-label">Parent Name</span>
                <div className="detail-value-box">{userData.name || 'Kamal'}</div>
              </div>

              <div className="detail-row">
                <span className="detail-label">Email</span>
                <div className="detail-value-box">{userData.email || 'kamal@gmail.com'}</div>
              </div>

              <div className="detail-row">
                <span className="detail-label">Gender</span>
                <div className="detail-value-box">{userData.gender || 'Male'}</div>
              </div>

              <div className="detail-row">
                <span className="detail-label">Student Name</span>
                <div className="detail-value-box">{userData.studentName || 'Student'}</div>
              </div>
            </div>
          ) : currentView === 'quotes' ? (
            <MotivationalQuotesView />
          ) : currentView === 'chat' ? (
            <div className="chat-content-wrapper">
              <h2 className="chat-main-subtitle">&quot;Ask questions, share updates, and collaborate instantly.&quot;</h2>
              <OnlineChatbox role="parent" />
            </div>
          ) : currentView === 'progress' ? (
            <ParentStudentProgressView onBack={() => setCurrentView('dashboard')} />
          ) : (
            <div className="student-features-list parent-features-list">
              {parentFeatures.map((feature, index) => {
                const isPulsing = activeCycleIndex === (index + 4);
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
                      } else if (feature.id === 'quotes') {
                        setCurrentView('quotes');
                      } else if (feature.id === 'chat') {
                        setCurrentView('chat');
                      } else if (feature.id === 'progress') {
                        setCurrentView('progress');
                      }
                    }}
                  >
                    {feature.title}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* 3. FOOTER */}
      <Footer compact={true} className="student-dashboard-footer" />
    </div>
  );
};

export default ParentDashboard;
