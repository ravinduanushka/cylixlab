import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

const ASSIGNMENTS_CONFIG = [
  { id: '01', num: 1, label: 'Assignment 1', shortLabel: 'Asg 1', cycleColor: '#f59e0b' }, // 1. Orange
  { id: '02', num: 2, label: 'Assignment 2', shortLabel: 'Asg 2', cycleColor: '#fde047' }, // 2. Peach / Light Yellow
  { id: '03', num: 3, label: 'Assignment 3', shortLabel: 'Asg 3', cycleColor: '#fb7185' }, // 3. Coral Pink
  { id: '04', num: 4, label: 'Assignment 4', shortLabel: 'Asg 4', cycleColor: '#10b981' }, // 4. Green
  { id: '05', num: 5, label: 'Assignment 5', shortLabel: 'Asg 5', cycleColor: '#cbd5e1' }, // 5. Grey
];

const MAX_MARKS = 30;
const PASSING_THRESHOLD = 20;
const Y_AXIS_TICKS = [30, 24, 18, 12, 6, 0];

// Default sample data showcasing all 3 states: pass (green), not pass (red), not yet (blue)
const DEFAULT_PROGRESS_DATA = {
  '01': { assignmentId: '01', completed: true, marks: 24 }, // Pass (>=20) -> Green
  '02': { assignmentId: '02', completed: true, marks: 14 }, // Not Pass (<20) -> Red
  '03': { assignmentId: '03', completed: true, marks: 28 }, // Pass (>=20) -> Green
  '04': { assignmentId: '04', completed: true, marks: 21 }, // Pass (>=20) -> Green
  '05': { assignmentId: '05', completed: false, marks: 0 },  // Not yet -> Blue
};

const ParentStudentProgressView = ({ standalone = false, onBack = null }) => {
  const navigate = useNavigate();
  const [assignmentsData, setAssignmentsData] = useState(DEFAULT_PROGRESS_DATA);
  const [studentName, setStudentName] = useState('Student');
  const [selectedAsgId, setSelectedAsgId] = useState(null);

  // Load student name and any stored progress data
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.studentName) {
          setStudentName(parsed.studentName);
        }
      } else {
        const lastRegStudent = localStorage.getItem('lastRegisteredStudentName');
        if (lastRegStudent) {
          setStudentName(lastRegStudent);
        }
      }

      const storedProgress = localStorage.getItem('cylixlab_parent_progress_data');
      if (storedProgress) {
        setAssignmentsData(JSON.parse(storedProgress));
      }
    } catch {
      // fallback
    }
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/parent-dashboard');
    }
  };

  // Toggle completion of an assignment
  const handleToggleComplete = (id) => {
    setAssignmentsData((prev) => {
      const current = prev[id] || { assignmentId: id, completed: false, marks: 0 };
      const nextCompleted = !current.completed;
      const nextMarks = nextCompleted ? (current.marks > 0 ? current.marks : 22) : 0;
      const updated = {
        ...prev,
        [id]: {
          ...current,
          completed: nextCompleted,
          marks: nextMarks,
        },
      };
      localStorage.setItem('cylixlab_parent_progress_data', JSON.stringify(updated));
      return updated;
    });
  };

  // Simulation controls for live testing
  const handleSimulateState = (type) => {
    let updated;
    if (type === 'sample') {
      updated = DEFAULT_PROGRESS_DATA;
    } else if (type === 'all_pass') {
      updated = {
        '01': { assignmentId: '01', completed: true, marks: 25 },
        '02': { assignmentId: '02', completed: true, marks: 22 },
        '03': { assignmentId: '03', completed: true, marks: 28 },
        '04': { assignmentId: '04', completed: true, marks: 26 },
        '05': { assignmentId: '05', completed: true, marks: 30 },
      };
    } else if (type === 'reset') {
      updated = {
        '01': { assignmentId: '01', completed: false, marks: 0 },
        '02': { assignmentId: '02', completed: false, marks: 0 },
        '03': { assignmentId: '03', completed: false, marks: 0 },
        '04': { assignmentId: '04', completed: false, marks: 0 },
        '05': { assignmentId: '05', completed: false, marks: 0 },
      };
    }
    setAssignmentsData(updated);
    localStorage.setItem('cylixlab_parent_progress_data', JSON.stringify(updated));
  };

  // Determine status color for an assignment: pass (green), not pass (red), not yet (blue)
  const getStatusInfo = (id) => {
    const data = assignmentsData[id];
    if (!data || !data.completed) {
      return { status: 'notyet', label: 'not yet', color: '#2b5c8f' }; // Blue
    }
    if (Number(data.marks || 0) >= PASSING_THRESHOLD) {
      return { status: 'pass', label: 'pass', color: '#22c55e' }; // Green
    }
    return { status: 'fail', label: 'not pass', color: '#ef4444' }; // Red
  };

  // Donut SVG calculations for 5 color segments
  const radius = 68;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius; // ~427.26
  const segmentLength = circumference / 5; // ~85.45
  const segmentGap = 4; // subtle gap between segments for modern look
  const visibleSegmentLength = segmentLength - segmentGap;

  const contentJSX = (
    <div className="psp-main-content">
      {/* Back button to Parent Dashboard */}
      <button
        type="button"
        className="dashboard-back-link-below psp-back-btn"
        onClick={handleBack}
        aria-label="Back to Parent Dashboard"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>Back to Parent Dashboard</span>
      </button>

      {/* Student Name Title */}
      <div className="psp-student-name-row">
        <h2 className="psp-student-name-heading">Student Name - {studentName || 'Student'}</h2>
      </div>

      {/* SECTION 1: Top Row -> Left: Bar Chart | Right: Finished Works & pass/no/notyet */}
      <div className="psp-top-grid">
        {/* Left: Assignment Marks Bar Chart */}
        <div className="psp-card psp-barchart-card">
          <h3 className="psp-card-title">Assignment Marks</h3>

          <div className="psp-barchart-container">
            {/* Y-Axis Label */}
            <div className="psp-yaxis-label">Marks</div>

            <div className="psp-barchart-plot">
              {/* Y-Axis Ticks */}
              <div className="psp-yaxis-ticks">
                {Y_AXIS_TICKS.map((val) => (
                  <span key={`tick-${val}`} className="psp-tick-number">
                    {val}
                  </span>
                ))}
              </div>

              {/* Background Grid Lines */}
              <div className="psp-grid-lines">
                {Y_AXIS_TICKS.map((val) => (
                  <div key={`grid-${val}`} className="psp-grid-line" />
                ))}
              </div>

              {/* 5 Vertical Bars */}
              <div className="psp-bars-wrapper">
                {ASSIGNMENTS_CONFIG.map((asg) => {
                  const data = assignmentsData[asg.id];
                  const isCompleted = !!data?.completed;
                  const marks = isCompleted ? Math.min(Math.max(Number(data.marks || 0), 0), MAX_MARKS) : 0;
                  const heightPercent = (marks / MAX_MARKS) * 100;
                  const status = getStatusInfo(asg.id);

                  return (
                    <div
                      key={`bar-${asg.id}`}
                      className="psp-bar-col"
                      onClick={() => handleToggleComplete(asg.id)}
                      title={`${asg.label}: ${isCompleted ? `${marks} / 30 marks (${status.label})` : 'Not completed yet (Click to toggle)'}`}
                    >
                      <div className="psp-bar-slot">
                        {isCompleted && (
                          <div
                            className="psp-bar-bar"
                            style={{
                              height: `${heightPercent}%`,
                              backgroundColor: asg.cycleColor,
                            }}
                          >
                            <span className="psp-bar-score-tag">{marks}</span>
                          </div>
                        )}
                      </div>
                      <span className="psp-bar-x-label">{asg.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="psp-xaxis-label">Assignments</div>
        </div>

        {/* Right: Finished Works & pass/no/notyet side-by-side boxes */}
        <div className="psp-finished-and-status-row">
          {/* Card 1: Finished Works Checklist */}
          <div className="psp-grey-box psp-finished-box">
            <h4 className="psp-grey-box-title">Finished works</h4>
            <div className="psp-grey-box-list">
              {ASSIGNMENTS_CONFIG.map((asg) => {
                const isCompleted = !!assignmentsData[asg.id]?.completed;
                return (
                  <div
                    key={`fw-${asg.id}`}
                    className="psp-fw-row"
                    onClick={() => handleToggleComplete(asg.id)}
                    title={`Click to mark Assignment ${asg.id} as ${isCompleted ? 'unfinished' : 'finished'}`}
                    role="button"
                    tabIndex={0}
                  >
                    <span className="psp-fw-name">Assignment {asg.id}</span>
                    <div className={`psp-checkbox-square ${isCompleted ? 'is-checked' : ''}`}>
                      {isCompleted && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" className="psp-check-svg">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 2: pass/no/notyet Colored Rectangles */}
          <div className="psp-grey-box psp-status-box">
            <h4 className="psp-grey-box-title">pass/no/notyet</h4>
            <div className="psp-grey-box-list">
              {ASSIGNMENTS_CONFIG.map((asg) => {
                const status = getStatusInfo(asg.id);
                return (
                  <div key={`st-${asg.id}`} className="psp-status-row">
                    <div
                      className="psp-status-rect"
                      style={{ backgroundColor: status.color }}
                      title={`Assignment ${asg.id}: ${status.label} (${assignmentsData[asg.id]?.completed ? `${assignmentsData[asg.id]?.marks || 0} marks` : 'not submitted'})`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Middle Row -> Left: Marks Cycle (5-Color Donut) | Right: Legend & Passing Note */}
      <div className="psp-middle-grid">
        {/* Left: Marks Cycle 5-Color Ring */}
        <div className="psp-card psp-cycle-card">
          <div className="psp-cycle-wrapper">
            <h3 className="psp-cycle-title">Marks Cycle</h3>

            <div className="psp-donut-container">
              <svg viewBox="0 0 200 200" className="psp-donut-svg" aria-label="Marks cycle chart with 5 assignment colors">
                {/* 5 Segments in 5 distinct colors matching user Image 2 */}
                {ASSIGNMENTS_CONFIG.map((asg, index) => {
                  const data = assignmentsData[asg.id];
                  const isCompleted = !!data?.completed;
                  const marks = isCompleted ? data.marks : 0;
                  // Start at top-right (-90 deg + index * 72 deg)
                  const rotationAngle = -90 + index * 72;
                  const isSelected = selectedAsgId === asg.id;

                  return (
                    <circle
                      key={`cycle-seg-${asg.id}`}
                      cx="100"
                      cy="100"
                      r={radius}
                      fill="none"
                      stroke={asg.cycleColor}
                      strokeWidth={isSelected ? strokeWidth + 4 : strokeWidth}
                      strokeDasharray={`${visibleSegmentLength} ${circumference - visibleSegmentLength}`}
                      strokeDashoffset={0}
                      transform={`rotate(${rotationAngle} 100 100)`}
                      className="psp-donut-segment"
                      onClick={() => setSelectedAsgId(asg.id === selectedAsgId ? null : asg.id)}
                      style={{
                        cursor: 'pointer',
                        transition: 'stroke-width 0.2s ease, opacity 0.2s ease',
                        opacity: isCompleted ? 1 : 0.85,
                      }}
                    >
                      <title>{`${asg.label}: ${isCompleted ? `${marks} / 30 marks` : 'Not completed yet'}`}</title>
                    </circle>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Right: Legend (pass / not pass / not yet) + Passing Requirement Pill Note */}
        <div className="psp-legend-and-note-card">
          {/* Legend Table matching user Image 3: Text on Left, Square on Right */}
          <div className="psp-legend-table">
            <div className="psp-legend-row">
              <span className="psp-legend-text">pass</span>
              <span className="psp-legend-square psp-square-pass" />
            </div>
            <div className="psp-legend-row">
              <span className="psp-legend-text">not pass</span>
              <span className="psp-legend-square psp-square-fail" />
            </div>
            <div className="psp-legend-row">
              <span className="psp-legend-text">not yet</span>
              <span className="psp-legend-square psp-square-notyet" />
            </div>
          </div>

          {/* Yellow Requirement Note Pill matching user Image 1 & 3 */}
          <div className="psp-yellow-note-pill">
            A student must score at least 20 marks to pass the assignment.
          </div>
        </div>
      </div>

      {/* SECTION 3: Bottom Row -> Green Grading & Feedback Box matching Image 1 */}
      <div className="psp-green-card" role="region" aria-label="Performance grading scale and feedback">
        <div className="psp-green-row">
          <span className="psp-green-asterisk" aria-hidden="true">✱</span>
          <p className="psp-green-text">
            <strong>0-10 marks – </strong>
            Don&apos;t be discouraged! Review the lessons and foundational concepts, and try again to improve your score.
          </p>
        </div>

        <div className="psp-green-row">
          <span className="psp-green-asterisk" aria-hidden="true">✱</span>
          <p className="psp-green-text">
            <strong>10 - 20 Marks – </strong>
            Solid work! You have understood the key concepts well. With a little more focus, you can easily reach top marks.
          </p>
        </div>

        <div className="psp-green-row">
          <span className="psp-green-asterisk" aria-hidden="true">✱</span>
          <p className="psp-green-text">
            <strong>20 - 30 Marks – </strong>
            Excellent work! You have shown a deep understanding of the subject and completed your tasks with great precision.
          </p>
        </div>
      </div>

      {/* SECTION 4: Live Development Simulation Controls */}
      <div className="psp-dev-toolbar">
        <span className="psp-dev-label">🧪 Live UI Preview:</span>
        <button
          type="button"
          className="psp-dev-btn"
          onClick={() => handleSimulateState('sample')}
          title="Load default mixed states: Pass (Green), Not Pass (Red), and Not Yet (Blue)"
        >
          Sample Data (Pass/Fail/Not yet)
        </button>
        <button
          type="button"
          className="psp-dev-btn"
          onClick={() => handleSimulateState('all_pass')}
          title="Mark all 5 assignments as Passed"
        >
          All 5 Passed
        </button>
        <button
          type="button"
          className="psp-dev-btn psp-dev-btn-reset"
          onClick={() => handleSimulateState('reset')}
          title="Reset to not started yet"
        >
          Reset
        </button>
      </div>
    </div>
  );

  // If viewed as standalone page (/parent-progress)
  if (standalone) {
    return (
      <div className="student-dashboard-page parent-dashboard-page scrollable-page">
        {/* Header */}
        <header className="student-dashboard-header">
          <div className="learning-header-pattern" aria-hidden="true">
            <svg viewBox="0 0 380 90" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M120 -20 L250 110 M170 -20 L300 110 M220 -20 L350 110" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
              <rect x="250" y="8" width="65" height="65" transform="rotate(45 282 40)" stroke="rgba(255,255,255,0.24)" strokeWidth="1.6" />
              <rect x="295" y="16" width="46" height="46" transform="rotate(45 318 39)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.4" />
              <rect x="330" y="24" width="30" height="30" transform="rotate(45 345 39)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" />
            </svg>
          </div>
          <h1 className="learning-header-title">Student Progress</h1>
          <span className="learning-header-logo">CylixLab</span>
        </header>

        {/* Scrollable Main Area */}
        <main className="student-dashboard-main psp-page-main">
          {contentJSX}
        </main>

        {/* Footer */}
        <Footer compact={true} className="student-dashboard-footer" />
      </div>
    );
  }

  // If embedded inside ParentDashboard.jsx
  return contentJSX;
};

export default ParentStudentProgressView;
