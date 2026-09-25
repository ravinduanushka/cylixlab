import { useState, useEffect } from 'react';

const LEARNING_PATH_META = {
  '01': {
    title: 'Learning Path 01',
    description: 'Master essential concepts step by step through guided, hands-on modules. Complete interactive challenges and build real-world skills at your own pace.',
  },
  '02': {
    title: 'Learning Path 02',
    description: 'Deepen your foundational understanding with structured lesson walkthroughs, practical examples, and core topic analyses.',
  },
  '03': {
    title: 'Learning Path 03',
    description: 'Explore intermediate problem-solving techniques, real-world case studies, and guided exercises designed for steady advancement.',
  },
  '04': {
    title: 'Learning Path 04',
    description: 'Advance your competencies with specialized modules, in-depth documentation, and structured concept mastery materials.',
  },
  '05': {
    title: 'Learning Path 05',
    description: 'Synthesize your overall learning with comprehensive revision notes, exam checklists, and capstone summaries.',
  },
};

const LearningPathDetailView = ({ pathId = '01', onBack }) => {
  const meta = LEARNING_PATH_META[pathId] || {
    title: `Learning Path ${pathId}`,
    description: 'Master essential concepts step by step through guided, hands-on modules. Complete interactive challenges and build real-world skills at your own pace.',
  };

  // 30 minutes countdown timer (30 * 60 = 1800 seconds)
  const INITIAL_SECONDS = 30 * 60;
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS);
  const [isRunning, setIsRunning] = useState(true);

  // Check if admin pushed a PDF URL into localStorage for this path
  const [pdfUrl, setPdfUrl] = useState(() => {
    try {
      return localStorage.getItem(`cylixlab_learning_pdf_${pathId}`) || null;
    } catch {
      return null;
    }
  });

  // Countdown timer effect
  useEffect(() => {
    // Reset timer when pathId changes
    setSecondsLeft(INITIAL_SECONDS);
    setIsRunning(true);
  }, [pathId]);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  // Format mm : ss
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  return (
    <div className="lp-detail-container">
      {/* Top action row */}
      <div className="lp-top-action-bar">
        <button
          type="button"
          className="lp-back-btn"
          onClick={onBack}
          aria-label="Back to Learning Paths"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Back to Learning Paths</span>
        </button>
      </div>

      {/* Learning Path Badge on left and Time Duration in the right side corner */}
      <div className="lp-header-badge-row">
        {/* Active Learning Path Pill Badge */}
        <div className="lp-pill-badge">
          {meta.title}
        </div>

        {/* Time Duration box in the right side corner */}
        <div className="lp-timer-box compact">
          <span className="lp-timer-title">Time Duration</span>
          <span className="lp-timer-digits" aria-live="polite">
            {minutes} : {seconds}
          </span>
        </div>
      </div>

      {/* Description text */}
      <p className="lp-description-text">
        {meta.description}
      </p>

      {/* PDF Display Box (Blank for now, ready for Admin PDF push) */}
      <div className="lp-pdf-display-box">
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            title={`PDF document for ${meta.title}`}
            className="lp-pdf-iframe"
          />
        ) : (
          <div className="lp-pdf-placeholder">
            <span className="lp-pdf-placeholder-text">pdf display</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningPathDetailView;
