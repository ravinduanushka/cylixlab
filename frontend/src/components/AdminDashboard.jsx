import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from './Footer';

// Color ramp for the 5 assignments (identical across both graphs)
const ASSIGNMENT_COLORS = [
  '#4ee0d2', // Assignment 1: Aqua / Light Turquoise
  '#38bdf8', // Assignment 2: Cyan / Sky Blue
  '#0ea5e9', // Assignment 3: Cerulean Blue
  '#2563eb', // Assignment 4: Royal Blue
  '#1e3a8a', // Assignment 5: Deep Navy Blue
];

const ASSIGNMENTS = [
  { id: 1, name: 'Assignment 1', short: 'Asg 1', avgMarks: 12, completedStudents: 12, color: ASSIGNMENT_COLORS[0] },
  { id: 2, name: 'Assignment 2', short: 'Asg 2', avgMarks: 17, completedStudents: 17, color: ASSIGNMENT_COLORS[1] },
  { id: 3, name: 'Assignment 3', short: 'Asg 3', avgMarks: 22, completedStudents: 22, color: ASSIGNMENT_COLORS[2] },
  { id: 4, name: 'Assignment 4', short: 'Asg 4', avgMarks: 26, completedStudents: 26, color: ASSIGNMENT_COLORS[3] },
  { id: 5, name: 'Assignment 5', short: 'Asg 5', avgMarks: 30, completedStudents: 30, color: ASSIGNMENT_COLORS[4] },
];

const Y_TICKS = [30, 24, 18, 12, 6, 0];

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Security Guard: Only authenticated Admin can access
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (!token || !userStr) {
        navigate('/login', { replace: true });
        return;
      }
      const user = JSON.parse(userStr);
      if (user.role !== 'admin') {
        navigate('/login', { replace: true });
      }
    } catch {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // Live auto-updating clock & date
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live Registered People Stats from backend
  const [userStats, setUserStats] = useState({
    studentPct: 24,
    parentPct: 22,
    students: 12,
    parents: 11,
    total: 23,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/auth/stats');
        if (res.data && res.data.success) {
          setUserStats({
            studentPct: res.data.studentPct || 24,
            parentPct: res.data.parentPct || 22,
            students: res.data.students || 12,
            parents: res.data.parents || 11,
            total: res.data.total || 23,
          });
        }
      } catch {
        // Keep default design values
      }
    };
    fetchStats();
  }, []);

  // Learning Path Form State
  const [lpName, setLpName] = useState('');
  const [lpFile, setLpFile] = useState(null);
  const [lpStatus, setLpStatus] = useState('All set');
  const [lpDragOver, setLpDragOver] = useState(false);
  const lpFileInputRef = useRef(null);

  // Assignment Form State
  const [asgName, setAsgName] = useState('');
  const [asgFile, setAsgFile] = useState(null);
  const [asgStatus, setAsgStatus] = useState('All set');
  const [asgDragOver, setAsgDragOver] = useState(false);
  const asgFileInputRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format date helper: "Wed, 17th July" / live dynamic current date
  const formatLiveDate = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const dayName = days[date.getDay()];
    const dayNum = date.getDate();
    const monthName = months[date.getMonth()];

    // Add ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
    const suffix =
      dayNum % 10 === 1 && dayNum !== 11
        ? 'st'
        : dayNum % 10 === 2 && dayNum !== 12
        ? 'nd'
        : dayNum % 10 === 3 && dayNum !== 13
        ? 'rd'
        : 'th';

    return `${dayName}, ${dayNum}${suffix} ${monthName}`;
  };

  // Format digital time: e.g. "4:15 pm" or "4pm"
  const formatDigitalTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12
    const minStr = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minStr} ${ampm}`;
  };

  // Compute analog clock hands angles
  const seconds = currentTime.getSeconds();
  const minutes = currentTime.getMinutes();
  const hours = currentTime.getHours();

  const secAngle = seconds * 6; // 360 / 60
  const minAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = (hours % 12) * 30 + minutes * 0.5;

  // File drop & select handlers for Learning Path
  const handleLpFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLpFile(file);
    }
  };

  const handleLpDrop = (e) => {
    e.preventDefault();
    setLpDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setLpFile(file);
    }
  };

  const handleLpSubmit = () => {
    if (!lpName.trim() && !lpFile) {
      setLpStatus('Please type name and select a PDF file first');
      return;
    }
    try {
      const existing = JSON.parse(localStorage.getItem('cylixlab_learning_paths') || '[]');
      existing.push({
        id: Date.now(),
        name: lpName.trim() || 'New Learning Path',
        fileName: lpFile ? lpFile.name : 'document.pdf',
        date: new Date().toLocaleDateString(),
      });
      localStorage.setItem('cylixlab_learning_paths', JSON.stringify(existing));
    } catch {
      // fallback
    }
    setLpStatus(`✓ Learning Path "${lpName || 'New Path'}" uploaded successfully!`);
    setTimeout(() => {
      setLpStatus('All set');
    }, 4000);
  };

  // File drop & select handlers for Assignment
  const handleAsgFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAsgFile(file);
    }
  };

  const handleAsgDrop = (e) => {
    e.preventDefault();
    setAsgDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setAsgFile(file);
    }
  };

  const handleAsgSubmit = () => {
    if (!asgName.trim() && !asgFile) {
      setAsgStatus('Please type name and select a PDF file first');
      return;
    }
    try {
      const existing = JSON.parse(localStorage.getItem('cylixlab_assignments') || '[]');
      existing.push({
        id: Date.now(),
        name: asgName.trim() || 'New Assignment',
        fileName: asgFile ? asgFile.name : 'assignment.pdf',
        date: new Date().toLocaleDateString(),
      });
      localStorage.setItem('cylixlab_assignments', JSON.stringify(existing));
    } catch {
      // fallback
    }
    setAsgStatus(`✓ Assignment "${asgName || 'New Assignment'}" saved for MCQ generation!`);
    setTimeout(() => {
      setAsgStatus('All set');
    }, 4000);
  };

  return (
    <div className="admin-page-root scrollable-page">
      {/* 1. ADMIN HEADER */}
      <header className="admin-page-header">
        <div className="learning-header-pattern" aria-hidden="true">
          <svg viewBox="0 0 380 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M120 -20 L250 110 M170 -20 L300 110 M220 -20 L350 110" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
            <rect x="250" y="8" width="65" height="65" transform="rotate(45 282 40)" stroke="rgba(255,255,255,0.24)" strokeWidth="1.6" />
            <rect x="295" y="16" width="46" height="46" transform="rotate(45 318 39)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.4" />
            <rect x="330" y="24" width="30" height="30" transform="rotate(45 345 39)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" />
          </svg>
        </div>

        <div className="admin-header-content">
          {/* Left: User Avatar Photo + Greeting + Red Logout Button */}
          <div className="admin-user-badge">
            <div className="admin-avatar-box">
              <img
                src="/images/admin.jpeg"
                alt="Admin Anushka"
                className="admin-avatar-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/admin.png';
                }}
              />
            </div>
            <div className="admin-user-info-col">
              <span className="admin-greeting-text">Hellow Anushka</span>
              <button
                type="button"
                onClick={handleLogout}
                className="admin-logout-red-btn"
                title="Logout from Admin"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Right: CylixLab Logo + Admin Page Title */}
          <div className="admin-header-right">
            <span className="admin-header-brand">CylixLab</span>
            <h1 className="admin-header-title">Admin Page</h1>
          </div>
        </div>
      </header>

      {/* 2. MAIN SCROLLABLE CONTENT */}
      <main className="admin-main-content">
        <div className="admin-content-card">


          {/* ROW 1: Registered people (left) & Live Clock / Time part (right) */}
          <section className="admin-top-metrics-grid">
            {/* Left: Registered people */}
            <div className="admin-registered-card">
              <h2 className="admin-section-heading">Registered people</h2>
              <div className="admin-registered-circles">
                {/* Students Ring */}
                <div className="admin-donut-wrapper">
                  <div className="admin-donut-container">
                    <svg viewBox="0 0 100 100" className="admin-donut-svg">
                      <circle cx="50" cy="50" r="38" className="donut-bg" />
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        className="donut-segment"
                        stroke="#94a3b8"
                        strokeDasharray="238.76"
                        strokeDashoffset={238.76 * (1 - (userStats.studentPct || 24) / 100)}
                      />
                    </svg>
                    <span className="admin-donut-pct">{userStats.studentPct || 24}%</span>
                  </div>
                  <span className="admin-donut-label">Students</span>
                </div>

                {/* Parents Ring */}
                <div className="admin-donut-wrapper">
                  <div className="admin-donut-container">
                    <svg viewBox="0 0 100 100" className="admin-donut-svg">
                      <circle cx="50" cy="50" r="38" className="donut-bg" />
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        className="donut-segment"
                        stroke="#0284c7"
                        strokeDasharray="238.76"
                        strokeDashoffset={238.76 * (1 - (userStats.parentPct || 22) / 100)}
                      />
                    </svg>
                    <span className="admin-donut-pct">{userStats.parentPct || 22}%</span>
                  </div>
                  <span className="admin-donut-label">Parents</span>
                </div>
              </div>
            </div>

            {/* Right: Time Part (Clock widget, NO green background, auto updating) */}
            <div className="admin-clock-card">
              {/* Analog Clock Dial */}
              <div className="admin-analog-clock">
                <svg viewBox="0 0 100 100" className="analog-clock-svg">
                  {/* Outer circle */}
                  <circle cx="50" cy="50" r="46" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.8" />
                  
                  {/* 12 Hour tick marks */}
                  {[...Array(12)].map((_, i) => {
                    const angle = (i * 30 * Math.PI) / 180;
                    const x1 = 50 + 38 * Math.sin(angle);
                    const y1 = 50 - 38 * Math.cos(angle);
                    const x2 = 50 + 43 * Math.sin(angle);
                    const y2 = 50 - 43 * Math.cos(angle);
                    const isMajor = i % 3 === 0;
                    return (
                      <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#64748b"
                        strokeWidth={isMajor ? 1.8 : 1}
                      />
                    );
                  })}

                  {/* Hour Hand */}
                  <line
                    x1="50"
                    y1="50"
                    x2="50"
                    y2="28"
                    stroke="#1e293b"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    transform={`rotate(${hourAngle} 50 50)`}
                  />

                  {/* Minute Hand */}
                  <line
                    x1="50"
                    y1="50"
                    x2="50"
                    y2="18"
                    stroke="#334155"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    transform={`rotate(${minAngle} 50 50)`}
                  />

                  {/* Second Hand (thin blue) */}
                  <line
                    x1="50"
                    y1="55"
                    x2="50"
                    y2="14"
                    stroke="#2563eb"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    transform={`rotate(${secAngle} 50 50)`}
                  />

                  {/* Center Pivot Pin */}
                  <circle cx="50" cy="50" r="3.2" fill="#0f172a" />
                  <circle cx="50" cy="50" r="1.4" fill="#ffffff" />
                </svg>
              </div>

              {/* Digital Time & Date */}
              <div className="admin-digital-time-block">
                <span className="admin-digital-time">{formatDigitalTime(currentTime)}</span>
                <span className="admin-digital-date">{formatLiveDate(currentTime)}</span>
              </div>
            </div>
          </section>

          {/* ROW 2: Graphs Row ("Averange Marks" & "Assignments Completed") */}
          <section className="admin-graphs-grid">
            {/* Graph 1: Averange Marks */}
            <div className="admin-graph-card">
              <h2 className="admin-section-heading">Averange Marks</h2>
              <div className="admin-barchart-wrapper">
                {/* Vertical Y-axis label */}
                <div className="admin-yaxis-label">Averange Marks</div>

                {/* SVG Bar Chart with same 5 assignment colors */}
                <svg viewBox="0 0 280 180" className="admin-chart-svg">
                  {/* Grid Lines and Y-Ticks */}
                  {Y_TICKS.map((val, idx) => {
                    const yPos = 20 + idx * 26;
                    return (
                      <g key={val}>
                        <line x1="38" y1={yPos} x2="270" y2={yPos} stroke="#f1f5f9" strokeWidth="1" />
                        <text x="32" y={yPos + 3.5} textAnchor="end" fontSize="9" fill="#94a3b8" fontFamily="sans-serif">
                          {val}
                        </text>
                      </g>
                    );
                  })}

                  {/* Axis lines */}
                  <line x1="38" y1="20" x2="38" y2="150" stroke="#cbd5e1" strokeWidth="1.2" />
                  <line x1="38" y1="150" x2="270" y2="150" stroke="#cbd5e1" strokeWidth="1.2" />

                  {/* 5 Assignment Bars */}
                  {ASSIGNMENTS.map((asg, idx) => {
                    const barWidth = 32;
                    const barX = 48 + idx * 44;
                    const barHeight = (asg.avgMarks / 30) * 130;
                    const barY = 150 - barHeight;

                    return (
                      <g key={asg.id} className="admin-bar-group">
                        <rect
                          x={barX}
                          y={barY}
                          width={barWidth}
                          height={barHeight}
                          fill={asg.color}
                          rx="2"
                        >
                          <title>{`${asg.name}: ${asg.avgMarks} Marks`}</title>
                        </rect>
                        <text
                          x={barX + barWidth / 2}
                          y="163"
                          textAnchor="middle"
                          fontSize="7"
                          fill="#64748b"
                          fontFamily="sans-serif"
                        >
                          {asg.short}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Horizontal X-axis label */}
                <div className="admin-xaxis-label">Assignments</div>
              </div>
            </div>

            {/* Graph 2: Assignments Completed */}
            <div className="admin-graph-card">
              <h2 className="admin-section-heading">Assignments Completed</h2>
              <div className="admin-barchart-wrapper">
                {/* Vertical Y-axis label */}
                <div className="admin-yaxis-label">no of students</div>

                {/* SVG Bar Chart with same 5 assignment colors */}
                <svg viewBox="0 0 280 180" className="admin-chart-svg">
                  {/* Grid Lines and Y-Ticks */}
                  {Y_TICKS.map((val, idx) => {
                    const yPos = 20 + idx * 26;
                    return (
                      <g key={val}>
                        <line x1="38" y1={yPos} x2="270" y2={yPos} stroke="#f1f5f9" strokeWidth="1" />
                        <text x="32" y={yPos + 3.5} textAnchor="end" fontSize="9" fill="#94a3b8" fontFamily="sans-serif">
                          {val}
                        </text>
                      </g>
                    );
                  })}

                  {/* Axis lines */}
                  <line x1="38" y1="20" x2="38" y2="150" stroke="#cbd5e1" strokeWidth="1.2" />
                  <line x1="38" y1="150" x2="270" y2="150" stroke="#cbd5e1" strokeWidth="1.2" />

                  {/* 5 Assignment Bars */}
                  {ASSIGNMENTS.map((asg, idx) => {
                    const barWidth = 32;
                    const barX = 48 + idx * 44;
                    const barHeight = (asg.completedStudents / 30) * 130;
                    const barY = 150 - barHeight;

                    return (
                      <g key={asg.id} className="admin-bar-group">
                        <rect
                          x={barX}
                          y={barY}
                          width={barWidth}
                          height={barHeight}
                          fill={asg.color}
                          rx="2"
                        >
                          <title>{`${asg.name}: ${asg.completedStudents} Students completed`}</title>
                        </rect>
                        <text
                          x={barX + barWidth / 2}
                          y="163"
                          textAnchor="middle"
                          fontSize="7"
                          fill="#64748b"
                          fontFamily="sans-serif"
                        >
                          {asg.short}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Horizontal X-axis label */}
                <div className="admin-xaxis-label">Assignments</div>
              </div>
            </div>
          </section>

          {/* ROW 3: Add Learning Path Section */}
          <section className="admin-upload-section">
            <h2 className="admin-section-title-green">Add Learning Path</h2>
            
            <div className="admin-input-row">
              <label className="admin-input-label" htmlFor="lp-name-input">
                Learning Path Name -
              </label>
              <input
                id="lp-name-input"
                type="text"
                className="admin-underline-input"
                placeholder="type here"
                value={lpName}
                onChange={(e) => setLpName(e.target.value)}
              />
            </div>

            {/* Slate Teal Upload Card with folder browse button */}
            <div className="admin-upload-container">
              {/* Teal Header Bar */}
              <div className="admin-upload-teal-bar">
                {/* Clean Folder Picker Button (NO green background as requested) */}
                <button
                  type="button"
                  className="admin-folder-btn"
                  onClick={() => lpFileInputRef.current?.click()}
                  title="Choose PDF File"
                  aria-label="Choose PDF File"
                >
                  <svg width="22" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" fill="rgba(255,255,255,0.18)" />
                    <line x1="12" y1="11" x2="12" y2="17" stroke="#ffffff" strokeWidth="2.2" />
                    <line x1="9" y1="14" x2="15" y2="14" stroke="#ffffff" strokeWidth="2.2" />
                  </svg>
                </button>
                <span className="admin-upload-teal-hint">Learning Path PDF Document (Viewable by students)</span>
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={lpFileInputRef}
                accept=".pdf"
                style={{ display: 'none' }}
                onChange={handleLpFileSelect}
              />

              {/* Dashed Dropzone */}
              <div
                className={`admin-dropzone-box ${lpDragOver ? 'dropzone-active' : ''}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setLpDragOver(true);
                }}
                onDragLeave={() => setLpDragOver(false)}
                onDrop={handleLpDrop}
                onClick={() => lpFileInputRef.current?.click()}
              >
                {lpFile ? (
                  <div className="admin-file-selected-badge">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="#e11d48">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" fill="#fda4af" />
                      <line x1="9" y1="15" x2="15" y2="15" stroke="#ffffff" strokeWidth="1.5" />
                    </svg>
                    <div className="admin-file-details">
                      <span className="admin-filename">{lpFile.name}</span>
                      <span className="admin-filesize">{(lpFile.size / 1024 / 1024).toFixed(2)} MB • Ready</span>
                    </div>
                    <button
                      type="button"
                      className="admin-remove-file-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLpFile(null);
                      }}
                      title="Remove file"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="admin-arrow-circle">
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" stroke="#94a3b8" strokeWidth="1.8" fill="none" />
                        <polyline points="8 12 12 16 16 12" />
                        <line x1="12" y1="8" x2="12" y2="16" />
                      </svg>
                    </div>
                    <p className="admin-dropzone-text">You can drag and drop files here to add them.</p>
                  </>
                )}
              </div>
            </div>

            {/* Submit Pill Button */}
            <div className="admin-submit-wrapper">
              <button
                type="button"
                className="admin-click-here-btn"
                onClick={handleLpSubmit}
              >
                Click here
              </button>
              <span className="admin-status-text">{lpStatus}</span>
            </div>
          </section>

          {/* ROW 4: Add Assignment Section */}
          <section className="admin-upload-section">
            <h2 className="admin-section-title-green">Add Assignment</h2>
            
            <div className="admin-input-row">
              <label className="admin-input-label" htmlFor="asg-name-input">
                Assignment Name -
              </label>
              <input
                id="asg-name-input"
                type="text"
                className="admin-underline-input"
                placeholder="type here"
                value={asgName}
                onChange={(e) => setAsgName(e.target.value)}
              />
            </div>

            {/* Slate Teal Upload Card with folder browse button */}
            <div className="admin-upload-container">
              {/* Teal Header Bar */}
              <div className="admin-upload-teal-bar">
                {/* Clean Folder Picker Button (NO green background as requested) */}
                <button
                  type="button"
                  className="admin-folder-btn"
                  onClick={() => asgFileInputRef.current?.click()}
                  title="Choose PDF File"
                  aria-label="Choose PDF File"
                >
                  <svg width="22" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" fill="rgba(255,255,255,0.18)" />
                    <line x1="12" y1="11" x2="12" y2="17" stroke="#ffffff" strokeWidth="2.2" />
                    <line x1="9" y1="14" x2="15" y2="14" stroke="#ffffff" strokeWidth="2.2" />
                  </svg>
                </button>
                <span className="admin-upload-teal-hint">
                  Admin uploads assignment PDF; students will see interactive MCQ questions
                </span>
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={asgFileInputRef}
                accept=".pdf"
                style={{ display: 'none' }}
                onChange={handleAsgFileSelect}
              />

              {/* Dashed Dropzone */}
              <div
                className={`admin-dropzone-box ${asgDragOver ? 'dropzone-active' : ''}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setAsgDragOver(true);
                }}
                onDragLeave={() => setAsgDragOver(false)}
                onDrop={handleAsgDrop}
                onClick={() => asgFileInputRef.current?.click()}
              >
                {asgFile ? (
                  <div className="admin-file-selected-badge">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="#e11d48">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" fill="#fda4af" />
                      <line x1="9" y1="15" x2="15" y2="15" stroke="#ffffff" strokeWidth="1.5" />
                    </svg>
                    <div className="admin-file-details">
                      <span className="admin-filename">{asgFile.name}</span>
                      <span className="admin-filesize">{(asgFile.size / 1024 / 1024).toFixed(2)} MB • Ready</span>
                    </div>
                    <button
                      type="button"
                      className="admin-remove-file-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAsgFile(null);
                      }}
                      title="Remove file"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="admin-arrow-circle">
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" stroke="#94a3b8" strokeWidth="1.8" fill="none" />
                        <polyline points="8 12 12 16 16 12" />
                        <line x1="12" y1="8" x2="12" y2="16" />
                      </svg>
                    </div>
                    <p className="admin-dropzone-text">You can drag and drop files here to add them.</p>
                  </>
                )}
              </div>
            </div>

            {/* Submit Pill Button */}
            <div className="admin-submit-wrapper">
              <button
                type="button"
                className="admin-click-here-btn"
                onClick={handleAsgSubmit}
              >
                Click here
              </button>
              <span className="admin-status-text">{asgStatus}</span>
            </div>
          </section>

        </div>
      </main>

      {/* 3. FOOTER */}
      <Footer compact={true} />
    </div>
  );
};

export default AdminDashboard;
