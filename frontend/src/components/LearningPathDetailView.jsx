import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';

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

const getCleanPdfUrl = (url, page = 1, zoom = 100) => {
  if (!url) return '';
  const base = url.split('#')[0];
  // #toolbar=0 hides Edge/Chrome toolbar (drawing, pen, rotate, summarize)
  // #navpanes=0 hides the left thumbnails pane
  // #scrollbar=1 keeps smooth scrolling throughout document
  // #view=FitH fits width to screen
  return `${base}#page=${page}&zoom=${zoom}&toolbar=0&navpanes=0&scrollbar=1&view=FitH`;
};

const LearningPathDetailView = ({ pathId = '01', onBack }) => {
  const safePathId = String(pathId).padStart(2, '0');
  const meta = LEARNING_PATH_META[safePathId] || {
    title: `Learning Path ${safePathId}`,
    description: 'Master essential concepts step by step through guided, hands-on modules. Complete interactive challenges and build real-world skills at your own pace.',
  };

  // 30 minutes countdown timer (30 * 60 = 1800 seconds)
  const INITIAL_SECONDS = 30 * 60;
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS);
  const [isRunning, setIsRunning] = useState(true);

  // Full display (portal to body) state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // PDF Page & Zoom controls (Matching Image 1)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(12);
  const [zoomLevel, setZoomLevel] = useState(100);

  // PDF URL state: loads from localStorage or backend
  const [pdfUrl, setPdfUrl] = useState(() => {
    try {
      return localStorage.getItem(`cylixlab_learning_pdf_${safePathId}`) || null;
    } catch {
      return null;
    }
  });

  // Countdown timer effect
  useEffect(() => {
    setSecondsLeft(INITIAL_SECONDS);
    setIsRunning(true);
    setCurrentPage(1);
    setZoomLevel(100);
  }, [safePathId]);

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

  // Load and sync PDF from server or localStorage
  useEffect(() => {
    let isMounted = true;

    try {
      const local = localStorage.getItem(`cylixlab_learning_pdf_${safePathId}`);
      if (local) {
        setPdfUrl(local);
      }
    } catch {}

    const fetchServerPdf = async () => {
      try {
        const res = await axios.get(`/api/courses/learning-path-pdf/${safePathId}`);
        if (isMounted && res.data && res.data.exists && res.data.url) {
          setPdfUrl(res.data.url);
          if (res.data.totalPages) {
            setTotalPages(res.data.totalPages);
          }
          try {
            localStorage.setItem(`cylixlab_learning_pdf_${safePathId}`, res.data.url);
          } catch {}
        }
      } catch (err) {
        // Fallback to local
      }
    };

    fetchServerPdf();

    const handlePdfUploaded = (e) => {
      if (e.detail && String(e.detail.pathId).padStart(2, '0') === safePathId) {
        fetchServerPdf();
        try {
          const updated = localStorage.getItem(`cylixlab_learning_pdf_${safePathId}`);
          if (updated) setPdfUrl(updated);
        } catch {}
      }
    };

    window.addEventListener('cylixlab_pdf_uploaded', handlePdfUploaded);
    return () => {
      isMounted = false;
      window.removeEventListener('cylixlab_pdf_uploaded', handlePdfUploaded);
    };
  }, [safePathId]);

  // Handle body scroll locking and Escape key for full display
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  // Format mm : ss
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  // Zoom handlers
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(220, prev + 15));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(60, prev - 15));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const cleanPdfUrlNormal = getCleanPdfUrl(pdfUrl, 1, 100);
  const cleanPdfUrlFullscreen = getCleanPdfUrl(pdfUrl, currentPage, zoomLevel);

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
        <div className="lp-pill-badge">
          {meta.title}
        </div>

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

      {/* PDF Display Box (Normal View) */}
      <div className="lp-pdf-display-box">
        {/* Large corner expand icon */}
        <button
          type="button"
          className="lp-expand-corner-btn"
          onClick={() => setIsFullscreen(true)}
          title="Click to view full display and scroll whole PDF"
          aria-label="Click to view full display and scroll whole PDF"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </button>

        {cleanPdfUrlNormal ? (
          <iframe
            src={cleanPdfUrlNormal}
            title={`PDF document for ${meta.title}`}
            className="lp-pdf-iframe"
          />
        ) : (
          <div className="lp-pdf-placeholder">
            <span className="lp-pdf-placeholder-text">pdf display</span>
          </div>
        )}
      </div>

      {/* FULL DISPLAY OVERLAY (Rendered to document.body to cover 100% of the screen) */}
      {isFullscreen &&
        createPortal(
          <div
            className="lp-fullscreen-portal-overlay"
            role="dialog"
            aria-modal="true"
          >
            {/* Top Bar: Left = Title Badge, Center = Image 1 Controls, Right = Close Button (Image 2) */}
            <div className="lp-fullscreen-topbar">
              {/* LEFT: Title Badge */}
              <div className="lp-fullscreen-title-badge">
                <span className="lp-fullscreen-title-text">{meta.title}</span>
              </div>

              {/* CENTER: Image 1 Icons Display (1 / 12 | - +) */}
              <div className="lp-header-center-controls">
                {/* Page indicator with prev/next step */}
                <div className="lp-page-stepper">
                  <button
                    type="button"
                    className="lp-page-arrow-btn"
                    onClick={handlePrevPage}
                    disabled={currentPage <= 1}
                    title="Previous page"
                    aria-label="Previous page"
                  >
                    ◀
                  </button>
                  <span className="lp-page-current-badge">{currentPage}</span>
                  <span className="lp-page-slash-total">/ {totalPages}</span>
                  <button
                    type="button"
                    className="lp-page-arrow-btn"
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages}
                    title="Next page"
                    aria-label="Next page"
                  >
                    ▶
                  </button>
                </div>

                {/* Vertical Divider Line */}
                <div className="lp-controls-separator" aria-hidden="true" />

                {/* Zoom Controls: - and + */}
                <div className="lp-zoom-btn-group">
                  <button
                    type="button"
                    className="lp-ctrl-icon-btn"
                    onClick={handleZoomOut}
                    title="Zoom Out (-)"
                    aria-label="Zoom Out"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="lp-ctrl-icon-btn"
                    onClick={handleZoomIn}
                    title="Zoom In (+)"
                    aria-label="Zoom In"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* RIGHT: Close Button (Image 2) */}
              <button
                type="button"
                className="lp-fullscreen-close-btn"
                onClick={() => setIsFullscreen(false)}
                title="Exit Full Display (Esc)"
                aria-label="Exit Full Display"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                <span className="lp-close-btn-label">Close</span>
              </button>
            </div>

            {/* Main Fullscreen PDF Canvas (Takes 100% of remaining screen with full scroll) */}
            <div className="lp-fullscreen-canvas">
              {cleanPdfUrlFullscreen ? (
                <iframe
                  key={`pdf-${currentPage}-${zoomLevel}`}
                  src={cleanPdfUrlFullscreen}
                  title={`Full Display PDF - ${meta.title}`}
                  className="lp-fullscreen-pdf-iframe"
                />
              ) : (
                <div className="lp-pdf-placeholder fullscreen-placeholder">
                  <span className="lp-pdf-placeholder-text">pdf display</span>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default LearningPathDetailView;
