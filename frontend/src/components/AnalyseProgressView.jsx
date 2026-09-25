import { useState, useEffect } from 'react';

const ASSIGNMENTS_CONFIG = [
  { id: '01', label: 'Assignment 1', color: '#4dd0e1' },
  { id: '02', label: 'Assignment 2', color: '#29b6f6' },
  { id: '03', label: 'Assignment 3', color: '#0288d1' },
  { id: '04', label: 'Assignment 4', color: '#1976d2' },
  { id: '05', label: 'Assignment 5', color: '#1e3a8a' },
];

const MAX_MARKS = 30;
const Y_AXIS_TICKS = [30, 24, 18, 12, 6, 0];

const AnalyseProgressView = () => {
  const [assignmentsData, setAssignmentsData] = useState({});
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('01');

  // Load assignments data from localStorage
  const loadProgressData = () => {
    try {
      const stored = localStorage.getItem('cylixlab_assignments_data');
      if (stored) {
        setAssignmentsData(JSON.parse(stored));
      } else {
        setAssignmentsData({});
      }
    } catch {
      setAssignmentsData({});
    }
  };

  useEffect(() => {
    loadProgressData();

    const handleUpdate = () => {
      loadProgressData();
    };

    window.addEventListener('cylixlab_assignment_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('cylixlab_assignment_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);


  // Demo / Simulation helpers so user can test all 3 tiers right away
  const handleSimulateScore = (id, marks) => {
    const updated = {
      ...assignmentsData,
      [id]: {
        assignmentId: id,
        completed: true,
        marks,
        total: MAX_MARKS,
        submittedAt: new Date().toISOString(),
      },
    };
    setAssignmentsData(updated);
    setSelectedAssignmentId(id);
    localStorage.setItem('cylixlab_assignments_data', JSON.stringify(updated));
  };

  const handleSimulateAll = () => {
    const demo = {
      '01': { assignmentId: '01', completed: true, marks: 12, total: 30 },
      '02': { assignmentId: '02', completed: true, marks: 17, total: 30 },
      '03': { assignmentId: '03', completed: true, marks: 22, total: 30 },
      '04': { assignmentId: '04', completed: true, marks: 26, total: 30 },
      '05': { assignmentId: '05', completed: true, marks: 29, total: 30 },
    };
    setAssignmentsData(demo);
    setSelectedAssignmentId('01');
    localStorage.setItem('cylixlab_assignments_data', JSON.stringify(demo));
  };

  const handleResetData = () => {
    setAssignmentsData({});
    setSelectedAssignmentId('01');
    localStorage.removeItem('cylixlab_assignments_data');
  };

  return (
    <div className="ap-page-container">
      {/* Top 2 Columns: Left Bar Chart & Right Finished Works */}
      <div className="ap-top-columns">
        {/* Left Column: Assignment Marks Bar Chart */}
        <section className="ap-chart-card">
          <h2 className="ap-section-title">Assignment Marks</h2>

          <div className="ap-chart-wrapper">
            {/* Y-Axis Label */}
            <div className="ap-yaxis-title">Marks</div>

            {/* Y-Axis Scale + Grid Lines + Bars Container */}
            <div className="ap-chart-plot-area">
              {/* Y-Axis Scale Ticks */}
              <div className="ap-yaxis-ticks">
                {Y_AXIS_TICKS.map((val) => (
                  <span key={`tick-${val}`} className="ap-tick-label">
                    {val}
                  </span>
                ))}
              </div>

              {/* Grid Lines Background */}
              <div className="ap-grid-lines">
                {Y_AXIS_TICKS.map((val) => (
                  <div key={`grid-${val}`} className="ap-grid-line" />
                ))}
              </div>

              {/* 5 Vertical Bars */}
              <div className="ap-bars-group">
                {ASSIGNMENTS_CONFIG.map((asg) => {
                  const data = assignmentsData[asg.id];
                  const isCompleted = !!data?.completed;
                  const marks = isCompleted ? Math.min(Math.max(Number(data.marks || 0), 0), MAX_MARKS) : 0;
                  const barHeightPercent = isCompleted ? (marks / MAX_MARKS) * 100 : 0;
                  const isSelected = selectedAssignmentId === asg.id;

                  return (
                    <div
                      key={`bar-col-${asg.id}`}
                      className={`ap-bar-column ${isSelected ? 'ap-bar-selected' : ''}`}
                      onClick={() => setSelectedAssignmentId(asg.id)}
                      title={`${asg.label}: ${isCompleted ? `${marks} / ${MAX_MARKS} marks` : 'Not completed yet'}`}
                      role="button"
                      tabIndex={0}
                    >
                      {/* Bar Fill Area */}
                      <div className="ap-bar-track">
                        {isCompleted && (
                          <div
                            className="ap-bar-fill"
                            style={{
                              height: `${barHeightPercent}%`,
                              backgroundColor: asg.color,
                            }}
                          >
                            <span className="ap-bar-tooltip">{marks}</span>
                          </div>
                        )}
                      </div>

                      {/* X-Axis Label */}
                      <span className="ap-xaxis-label">{asg.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="ap-xaxis-title">Assignments</div>
        </section>

        {/* Right Column: Finished Works Checklist */}
        <section className="ap-finished-card">
          <h2 className="ap-section-title">Finished works</h2>

          <div className="ap-finished-box">
            {ASSIGNMENTS_CONFIG.map((asg) => {
              const isCompleted = !!assignmentsData[asg.id]?.completed;
              const isSelected = selectedAssignmentId === asg.id;

              return (
                <div
                  key={`finish-${asg.id}`}
                  className={`ap-finished-row ${isSelected ? 'ap-row-selected' : ''}`}
                  onClick={() => setSelectedAssignmentId(asg.id)}
                  role="button"
                  tabIndex={0}
                  title={`Click to view feedback for Assignment ${asg.id}`}
                >
                  <span className="ap-finished-name">Assignment {asg.id}</span>
                  <div
                    className={`ap-check-square ${isCompleted ? 'checked' : 'unchecked'}`}
                    aria-label={`Assignment ${asg.id} ${isCompleted ? 'Finished' : 'Not finished'}`}
                  >
                    {isCompleted && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="ap-check-icon">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Green Feedback Box Displaying All 3 Feedback Messages */}
      <div className="ap-green-feedback-box" role="region" aria-label="Performance feedback messages">
        <div className="ap-feedback-list">
          {/* 1. 0 - 10 marks */}
          <div className="ap-feedback-row">
            <span className="ap-asterisk" aria-hidden="true">✱</span>
            <div className="ap-feedback-text-wrap">
              <span className="ap-feedback-title">0-10 marks – </span>
              <span className="ap-feedback-message">
                Don&apos;t be discouraged! Review the lessons and foundational concepts, and try again to improve your score.
              </span>
            </div>
          </div>

          {/* 2. 10 - 20 Marks */}
          <div className="ap-feedback-row">
            <span className="ap-asterisk" aria-hidden="true">✱</span>
            <div className="ap-feedback-text-wrap">
              <span className="ap-feedback-title">10 - 20 Marks – </span>
              <span className="ap-feedback-message">
                Solid work! You have understood the key concepts well. With a little more focus, you can easily reach top marks.
              </span>
            </div>
          </div>

          {/* 3. 20 - 30 Marks */}
          <div className="ap-feedback-row">
            <span className="ap-asterisk" aria-hidden="true">✱</span>
            <div className="ap-feedback-text-wrap">
              <span className="ap-feedback-title">20 - 30 Marks – </span>
              <span className="ap-feedback-message">
                Excellent work! You have shown a deep understanding of the subject and completed your tasks with great precision.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Front-End Simulation & Testing Controls */}
      <div className="ap-test-toolbar">
        <span className="ap-test-label">🧪 Live Test & Preview:</span>
        <button
          type="button"
          className="ap-test-btn"
          onClick={() => handleSimulateScore('01', 8)}
          title="Simulate 8 Marks (0-10 tier)"
        >
          Asg 1 (8 Marks: 0-10)
        </button>
        <button
          type="button"
          className="ap-test-btn"
          onClick={() => handleSimulateScore('02', 16)}
          title="Simulate 16 Marks (10-20 tier)"
        >
          Asg 2 (16 Marks: 10-20)
        </button>
        <button
          type="button"
          className="ap-test-btn"
          onClick={() => handleSimulateScore('03', 27)}
          title="Simulate 27 Marks (20-30 tier)"
        >
          Asg 3 (27 Marks: 20-30)
        </button>
        <button
          type="button"
          className="ap-test-btn ap-test-btn-all"
          onClick={handleSimulateAll}
          title="Simulate all 5 completed assignments"
        >
          Simulate All 5
        </button>
        <button
          type="button"
          className="ap-test-btn ap-test-btn-reset"
          onClick={handleResetData}
          title="Reset to clean state"
        >
          Reset All
        </button>
      </div>
    </div>
  );
};

export default AnalyseProgressView;
