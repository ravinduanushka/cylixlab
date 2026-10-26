import { useState, useEffect } from 'react';
import axios from 'axios';

const AssignmentDetailView = ({ assignmentId = '01', onBack }) => {
  const safeAsgId = String(assignmentId).padStart(2, '0');

  // 30 minutes countdown timer (30 * 60 = 1800 seconds)
  const INITIAL_SECONDS = 30 * 60;
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS);
  const [isRunning, setIsRunning] = useState(true);

  // Store selected answers: { [questionNumber]: selectedOptionIndex (1..4) }
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  // Dynamic Questions list
  const [questions, setQuestions] = useState([]);

  // Fetch Parsed Questions from Backend
  useEffect(() => {
    let isMounted = true;
    setLoadingQuestions(true);

    const fetchAssignmentData = async () => {
      try {
        const res = await axios.get(`/api/courses/assignment-pdf/${safeAsgId}`);
        if (isMounted && res.data && res.data.exists) {
          if (Array.isArray(res.data.questions) && res.data.questions.length > 0) {
            setQuestions(res.data.questions);
            try {
              localStorage.setItem(`cylixlab_assignment_questions_${safeAsgId}`, JSON.stringify(res.data.questions));
            } catch {}
            setLoadingQuestions(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Could not fetch assignment from server, checking local:', err);
      }

      // Check localStorage for offline questions if available
      try {
        const local = localStorage.getItem(`cylixlab_assignment_questions_${safeAsgId}`);
        if (local && isMounted) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setQuestions(parsed);
            setLoadingQuestions(false);
            return;
          }
        }
      } catch {}

      // Fallback default 30 questions
      if (isMounted) {
        const defaultList = Array.from({ length: 30 }, (_, i) => {
          const numStr = String(i + 1).padStart(2, '0');
          return {
            id: i + 1,
            label: `Question ${numStr}`,
            question: `Question ${numStr}: Select the most appropriate option based on the study assignment.`,
            options: [
              'Statement or solution option A',
              'Statement or solution option B',
              'Statement or solution option C',
              'Statement or solution option D',
            ],
            correctAnswer: (i % 4) + 1,
          };
        });
        setQuestions(defaultList);
        setLoadingQuestions(false);
      }
    };

    fetchAssignmentData();

    return () => {
      isMounted = false;
    };
  }, [safeAsgId]);

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
      [qNum]: prev[qNum] === optionIndex ? null : optionIndex,
    }));
  };

  const [correctCount, setCorrectCount] = useState(0);

  const questionsList = Array.isArray(questions) && questions.length > 0 ? questions : [];
  const totalQuestions = questionsList.length || 30;
  const answeredCount = Object.values(selectedAnswers).filter(Boolean).length;

  // Calculate correct answers count based on actual question keys
  const getCorrectAnswersCount = () => {
    let count = 0;
    questionsList.forEach((q, idx) => {
      const qId = q.id || idx + 1;
      const userSelected = selectedAnswers[qId];
      if (userSelected !== undefined && userSelected !== null) {
        let expected = q.correctAnswer;
        if (typeof expected === 'string') {
          const map = { A: 1, B: 2, C: 3, D: 4, a: 1, b: 2, c: 3, d: 4 };
          expected = map[expected.trim()] || Number(expected);
        }
        if (Number(userSelected) === Number(expected)) {
          count++;
        }
      }
    });
    return count;
  };

  const handleSubmit = () => {
    const score = getCorrectAnswersCount();
    setCorrectCount(score);
    setIsSubmitted(true);
    setShowSubmitModal(true);
    try {
      let studentEmail = 'student@cylixlab.com';
      let studentName = 'Student';
      try {
        const u = JSON.parse(localStorage.getItem('user') || '{}');
        if (u.email) studentEmail = u.email;
        if (u.name) studentName = u.name;
      } catch {}

      const userStorageKey = `cylixlab_assignments_data_${studentEmail}`;
      const stored = localStorage.getItem(userStorageKey);
      const progressData = stored ? JSON.parse(stored) : {};
      const record = {
        assignmentId: safeAsgId,
        completed: true,
        marks: score, // ONLY CORRECT ANSWERS COUNT!
        total: totalQuestions,
        answeredCount,
        correctCount: score,
        submittedAt: new Date().toISOString(),
      };
      progressData[safeAsgId] = record;
      progressData[assignmentId] = record;
      localStorage.setItem(userStorageKey, JSON.stringify(progressData));

      // Clean up any old global unscoped storage
      localStorage.removeItem('cylixlab_assignments_data');

      window.dispatchEvent(
        new CustomEvent('cylixlab_assignment_updated', {
          detail: { assignmentId: safeAsgId, marks: score, studentEmail },
        })
      );

      // Post to backend server for Admin dashboard statistics
      axios.post('/api/courses/assignment-submit', {
        assignmentId: safeAsgId,
        studentEmail,
        studentName,
        marks: score,
        total: totalQuestions,
        answeredCount,
      }).catch((err) => console.warn('Could not post submission to server:', err.message));
    } catch (e) {
      console.error('Error saving assignment progress:', e);
    }
  };

  const scrollToQuestion = (qId) => {
    const el = document.getElementById(`question-card-${qId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
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

      {/* Main 2-column layout: Left questions & Right countdown + quiz navigation */}
      <div className="as-main-columns-wrap">
        {/* Left Column: Assignment Pill, Instructions, PDF, 30 MCQ Questions, Submit */}
        <div className="as-content-column">
          <div className="as-pill-badge">
            Assignment {assignmentId}
          </div>

          {/* Instructions block */}
          <div className="as-instructions-block">
            <p className="as-instruction-line">
              + Review the provided problem statement carefully and answer each question below.
            </p>
            <p className="as-instruction-line">
              + Test your understanding thoroughly to verify all concepts before submitting.
            </p>
            <p className="as-instruction-line">
              + &quot;Mark the correct answer using the check icon (&#x2705;) corresponding to the statement.&quot;
            </p>
          </div>

          {/* Dynamic / Parsed MCQ Questions List */}
          <div className="as-questions-list">
            {loadingQuestions && questionsList.length === 0 ? (
              <div className="as-loading-box">
                <div className="as-spinner" />
                <p>Loading questions for Assignment {assignmentId}...</p>
              </div>
            ) : (
              questionsList.map((q, idx) => {
                const qId = q.id || idx + 1;
                const qLabel = q.label || `Question ${String(qId).padStart(2, '0')}`;
                const selected = selectedAnswers[qId];
                const rawOptions = Array.isArray(q.options) && q.options.length > 0
                  ? q.options
                  : ['Option A', 'Option B', 'Option C', 'Option D'];

                return (
                  <div key={`q-${qId}`} id={`question-card-${qId}`} className="as-question-card">
                    {/* Question Header Badge */}
                    <div className="as-question-badge">
                      {qLabel}
                    </div>

                    {/* Question Statement */}
                    {q.question && (
                      <div className="as-question-text">
                        {q.question}
                      </div>
                    )}

                    {/* Review mode indicator */}
                    {isSubmitted && (
                      <div className={`as-review-tag ${selected === q.correctAnswer ? 'as-review-correct' : 'as-review-wrong'}`}>
                        {selected === q.correctAnswer ? (
                          <span>&#x2705; Correct Answer (+1 Mark)</span>
                        ) : (
                          <span>&#x274C; Incorrect &mdash; Correct Answer: Option {q.correctAnswer}</span>
                        )}
                      </div>
                    )}

                    {/* Question Container with 4 Options and Circles */}
                    <div className="as-mcq-box">
                      {[1, 2, 3, 4].map((optNum) => {
                        const isChecked = selected === optNum;
                        const optionText = rawOptions[optNum - 1] || `Option ${optNum}`;
                        const isCorrectOpt = isSubmitted && optNum === Number(q.correctAnswer);
                        const isWrongSelected = isSubmitted && isChecked && optNum !== Number(q.correctAnswer);

                        return (
                          <div
                            key={`q-${qId}-opt-${optNum}`}
                            className={`as-option-row ${isChecked ? 'as-option-selected' : ''} ${isCorrectOpt ? 'as-option-correct-highlight' : ''} ${isWrongSelected ? 'as-option-wrong-highlight' : ''}`}
                            onClick={() => handleSelectOption(qId, optNum)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleSelectOption(qId, optNum);
                              }
                            }}
                            aria-label={`Option ${optNum} for ${qLabel}`}
                          >
                            <div className="as-option-left">
                              <span className="as-option-number">{optNum}.</span>
                              <span className="as-option-label-text">{optionText}</span>
                            </div>
                            <div className={`as-option-circle ${isChecked ? 'checked' : ''} ${isCorrectOpt ? 'correct-circle' : ''}`}>
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
              })
            )}
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
        </div>

        {/* Right Sidebar Column: Countdown Timer + Quiz Navigation Table */}
        <aside className="as-sidebar-column">
          <div className="as-timer-box">
            <span className="as-timer-title">Time Duration</span>
            <span className="as-timer-digits" aria-live="polite">
              {minutes} : {seconds}
            </span>
          </div>

          {/* Quiz Navigation Table (5 Columns x 6 Rows = 30 Cells) */}
          <div className="as-quiz-nav-card">
            <h4 className="as-quiz-nav-title">Quiz navigation</h4>
            <div className="as-quiz-nav-table" role="grid" aria-label="Quiz question navigation">
              {questionsList.map((q) => {
                const isMarked = !!selectedAnswers[q.id];
                return (
                  <button
                    key={`nav-q-${q.id}`}
                    type="button"
                    className={`as-nav-cell ${isMarked ? 'as-cell-marked' : 'as-cell-unmarked'}`}
                    onClick={() => scrollToQuestion(q.id)}
                    title={`Question ${q.id}: ${isMarked ? 'Marked (Finished)' : 'Not finished yet'}`}
                    aria-label={`Question ${q.id} ${isMarked ? 'marked' : 'not yet marked'}`}
                  >
                    {q.id}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>

      {/* Submission Modal Dialog */}
      {showSubmitModal && (
        <div className="as-modal-overlay">
          <div className="as-modal-card">
            <div className="as-modal-icon">
              &#x2705;
            </div>
            <h3 className="as-modal-title">Assignment {assignmentId} Submitted!</h3>
            
            <div className="as-modal-score-card">
              <div className="as-modal-score-digits">
                <span className="as-modal-score-num">{correctCount}</span>
                <span className="as-modal-score-slash">/</span>
                <span className="as-modal-score-den">{totalQuestions}</span>
              </div>
              <div className="as-modal-score-tag">Marks (Correct Answers Only)</div>
            </div>

            <p className="as-modal-body">
              You answered <strong>{answeredCount}</strong> out of <strong>{totalQuestions}</strong> questions within the time duration.
            </p>
            <p className="as-modal-subbody">
              Your score of <strong>{correctCount} marks</strong> has been recorded in your Progress Analysis Bar Chart.
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
