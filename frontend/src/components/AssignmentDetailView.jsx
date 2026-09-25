import { useState, useEffect } from 'react';

const AssignmentDetailView = ({ assignmentId = '01', onBack }) => {
  // 30 minutes countdown timer (30 * 60 = 1800 seconds)
  const INITIAL_SECONDS = 30 * 60;
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS);
  const [isRunning, setIsRunning] = useState(true);

  // Store selected answers: { [questionNumber]: selectedOptionIndex (1..4) }
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Check if admin pushed an assignment PDF URL
  const [pdfUrl] = useState(() => {
    try {
      return localStorage.getItem(`cylixlab_assignment_pdf_${assignmentId}`) || null;
    } catch {
      return null;
    }
  });

  // Countdown timer effect
  useEffect(() => {
    setSecondsLeft(INITIAL_SECONDS);
    setIsRunning(true);
    setSelectedAnswers({});
    setIsSubmitted(false);
  }, [assignmentId]);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0 || isSubmitted) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsSubmitted(true);
          setShowSubmitModal(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, isSubmitted]);

  // Format mm : ss
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  // Handle option selection
  const handleSelectOption = (qNum, optionIndex) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qNum]: prev[qNum] === optionIndex ? null : optionIndex, // toggle or select
    }));
  };

  // Generate 30 questions
  const totalQuestions = 30;
  const questionsList = Array.from({ length: totalQuestions }, (_, i) => {
    const numStr = String(i + 1).padStart(2, '0');
    return {
      id: i + 1,
      label: `Question ${numStr}`,
    };
  });

  const answeredCount = Object.values(selectedAnswers).filter(Boolean).length;

  const handleSubmit = () => {
    setIsSubmitted(true);
    setShowSubmitModal(true);
  };

  return (
    <div className="as-detail-container">
      {/* Top back navigation */}
      <div className="as-top-action-bar">
        <button
          type="button"
          className="as-back-btn"
          onClick={onBack}
          aria-label="Back to Learning & Assignments"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Back to Learning & Assignments</span>
        </button>
      </div>

      {/* Header Row: Assignment 01 Pill on left & Time Duration Box on right */}
      <div className="as-header-badge-row">
        <div className="as-pill-badge">
          Assignment {assignmentId}
        </div>

        <div className="as-timer-box">
          <span className="as-timer-title">Time Duration</span>
          <span className="as-timer-digits" aria-live="polite">
            {minutes} : {seconds}
          </span>
        </div>
      </div>

      {/* Instructions block */}
      <div className="as-instructions-block">
        <p className="as-instruction-line">
          + Review the provided problem statement carefully and implement the specified requirements.
        </p>
        <p className="as-instruction-line">
          + Test your implementation thoroughly to ensure all test cases pass and verify your progress.
        </p>
        <p className="as-instruction-line">
          + &quot;Mark the correct answer using the check icon (&#x2705;) corresponding to the statement.&quot;
        </p>
      </div>

      {/* Optional Admin PDF viewer (if uploaded) */}
      {pdfUrl && (
        <div className="as-pdf-wrapper">
          <iframe src={pdfUrl} title={`Assignment ${assignmentId} PDF`} className="as-pdf-frame" />
        </div>
      )}

      {/* 30 MCQ Questions */}
      <div className="as-questions-list">
        {questionsList.map((q) => {
          const selected = selectedAnswers[q.id];
          return (
            <div key={`q-${q.id}`} className="as-question-card">
              {/* Question Badge */}
              <div className="as-question-badge">
                {q.label}
              </div>

              {/* Question Container with 4 Options and Circles */}
              <div className="as-mcq-box">
                {[1, 2, 3, 4].map((optNum) => {
                  const isChecked = selected === optNum;
                  return (
                    <div
                      key={`q-${q.id}-opt-${optNum}`}
                      className={`as-option-row ${isChecked ? 'as-option-selected' : ''}`}
                      onClick={() => handleSelectOption(q.id, optNum)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSelectOption(q.id, optNum);
                        }
                      }}
                      aria-label={`Option ${optNum} for ${q.label}`}
                    >
                      <span className="as-option-number">{optNum}.</span>
                      <div className={`as-option-circle ${isChecked ? 'checked' : ''}`}>
                        {isChecked && (
                          <svg className="as-check-icon" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Submission Action Bar */}
      <div className="as-submission-bar">
        <div className="as-progress-text">
          Completed: <strong>{answeredCount}</strong> / {totalQuestions} Questions
        </div>
        <button
          type="button"
          className="as-submit-btn"
          onClick={handleSubmit}
          disabled={isSubmitted}
        >
          {isSubmitted ? 'Assignment Submitted' : 'Submit Assignment'}
        </button>
      </div>

      {/* Submission Modal Dialog */}
      {showSubmitModal && (
        <div className="as-modal-overlay">
          <div className="as-modal-card">
            <div className="as-modal-icon">
              &#x2705;
            </div>
            <h3 className="as-modal-title">Assignment {assignmentId} Submitted!</h3>
            <p className="as-modal-body">
              You answered <strong>{answeredCount}</strong> out of <strong>{totalQuestions}</strong> questions within the time duration.
            </p>
            <p className="as-modal-subbody">
              Your responses have been recorded. When the administrator publishes the answer keys and assignment PDF, full results and grading will be displayed here.
            </p>
            <button
              type="button"
              className="as-modal-close-btn"
              onClick={() => setShowSubmitModal(false)}
            >
              Review My Answers
            </button>
            <button
              type="button"
              className="as-modal-back-btn"
              onClick={onBack}
            >
              Return to Learning & Assignments
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentDetailView;
