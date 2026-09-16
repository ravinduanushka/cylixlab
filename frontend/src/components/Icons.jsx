import React from 'react';

// 1. Detailed Reports - Document with bar chart
export const ReportIcon = ({ size = 48, color = '#1e3a5f' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="10" width="22" height="30" rx="3" />
    <rect x="18" y="6" width="22" height="30" rx="3" strokeDasharray="0" />
    <line x1="24" y1="28" x2="24" y2="22" strokeWidth="2.5" />
    <line x1="29" y1="28" x2="29" y2="16" strokeWidth="2.5" />
    <line x1="34" y1="28" x2="34" y2="19" strokeWidth="2.5" />
    <path d="M22 22 L27 16 L31 19 L36 13" strokeWidth="1.8" />
  </svg>
);

// 2. Reminders - Bell with ring wave lines
export const ReminderIcon = ({ size = 48, color = '#1e3a5f' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M24 8 A8 8 0 0 0 16 16 C16 23 13 26 11 28 L37 28 C35 26 32 23 32 16 A8 8 0 0 0 24 8 Z" />
    <path d="M21 32 A3.5 3.5 0 0 0 27 32" strokeWidth="2.5" />
    {/* Sound waves left */}
    <path d="M10 14 A14 14 0 0 0 8 22" strokeWidth="2" />
    <path d="M6 10 A19 19 0 0 0 4 24" strokeWidth="2" />
    {/* Sound waves right */}
    <path d="M38 14 A14 14 0 0 1 40 22" strokeWidth="2" />
    <path d="M42 10 A19 19 0 0 1 44 24" strokeWidth="2" />
  </svg>
);

// 3. To-Do Lists - Clipboard with checklist
export const TodoIcon = ({ size = 48, color = '#1e3a5f' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="11" y="10" width="26" height="32" rx="3" />
    {/* Clip top */}
    <path d="M18 10 V7 A2 2 0 0 1 20 5 H28 A2 2 0 0 1 30 7 V10" />
    <circle cx="24" cy="9" r="1.5" fill={color} />
    {/* Checklist lines */}
    <path d="M16 19 L18 21 L22 17" strokeWidth="2" />
    <line x1="25" y1="19" x2="33" y2="19" strokeWidth="2.2" />
    <path d="M16 26 L18 28 L22 24" strokeWidth="2" />
    <line x1="25" y1="26" x2="33" y2="26" strokeWidth="2.2" />
    <path d="M16 33 L18 35 L22 31" strokeWidth="2" />
    <line x1="25" y1="33" x2="33" y2="33" strokeWidth="2.2" />
  </svg>
);

// 4. Motivational Quotes - Speech bubble with quotes
export const QuoteIcon = ({ size = 48, color = '#1e3a5f' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="8" width="32" height="26" rx="13" />
    <path d="M16 34 L12 40 L22 34" />
    {/* Quotes */}
    <text x="17" y="24" fontFamily="serif" fontSize="16" fontWeight="bold" fill={color} stroke="none">“</text>
    <text x="25" y="27" fontFamily="serif" fontSize="16" fontWeight="bold" fill={color} stroke="none">”</text>
  </svg>
);

// 5. Parent View - Parent & child
export const ParentViewIcon = ({ size = 48, color = '#1e3a5f' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    {/* Parent */}
    <circle cx="18" cy="14" r="5" />
    <path d="M10 34 C10 26 14 23 20 23 C22 23 23 23.5 24.5 24.5" />
    <path d="M13 14 C13 10 16 7 21 8" strokeWidth="1.8" />
    {/* Child */}
    <circle cx="32" cy="20" r="4" />
    <path d="M25 34 C25 28 28 26 33 26 C38 26 40 28 40 34" />
    <line x1="8" y1="38" x2="42" y2="38" strokeWidth="2" />
  </svg>
);

// 6. Online Chatbox - Speech bubble with 3 dots
export const ChatboxIcon = ({ size = 48, color = '#1e3a5f' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 12 A4 4 0 0 1 12 8 H36 A4 4 0 0 1 40 12 V28 A4 4 0 0 1 36 32 H24 L16 38 V32 H12 A4 4 0 0 1 8 28 Z" />
    <circle cx="18" cy="20" r="2" fill={color} />
    <circle cx="24" cy="20" r="2" fill={color} />
    <circle cx="30" cy="20" r="2" fill={color} />
  </svg>
);

// 7. AI Learning Platform - AI Brain Robot head
export const AILearningIcon = ({ size = 48, color = '#1e3a5f' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    {/* Head outline */}
    <rect x="13" y="14" width="22" height="24" rx="6" />
    {/* Antennas */}
    <line x1="24" y1="14" x2="24" y2="9" />
    <circle cx="24" cy="7" r="2" fill={color} />
    <line x1="13" y1="24" x2="9" y2="24" />
    <circle cx="7" cy="24" r="1.5" fill={color} />
    <line x1="35" y1="24" x2="39" y2="24" />
    <circle cx="41" cy="24" r="1.5" fill={color} />
    {/* Brain/circuit details inside */}
    <circle cx="19" cy="23" r="2.5" />
    <circle cx="29" cy="23" r="2.5" />
    <path d="M19 31 Q24 35 29 31" />
    <path d="M20 18 Q24 16 28 18" strokeWidth="1.8" />
  </svg>
);

// 8. Analyze Progress - Magnifying glass over node trend graph
export const AnalyzeProgressIcon = ({ size = 48, color = '#1e3a5f' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    {/* Graph nodes and lines */}
    <circle cx="14" cy="28" r="2.5" fill={color} />
    <circle cx="22" cy="18" r="2.5" fill={color} />
    <circle cx="32" cy="12" r="2.5" fill={color} />
    <circle cx="38" cy="20" r="2.5" fill={color} />
    <polyline points="14,28 22,18 32,12 38,20" strokeWidth="2" />
    {/* Magnifying glass */}
    <circle cx="29" cy="25" r="9" strokeWidth="2.4" />
    <line x1="36" y1="32" x2="43" y2="39" strokeWidth="3" />
    {/* Arrow */}
    <path d="M30 9 L36 9 L36 15" strokeWidth="2" />
  </svg>
);

// Social Media & Phone Icons
export const LinkedInIcon = ({ size = 28 }) => (
  <div style={{
    width: size,
    height: size,
    backgroundColor: '#000',
    color: '#fff',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '15px',
    fontFamily: 'sans-serif'
  }}>
    in
  </div>
);

export const FacebookIcon = ({ size = 28 }) => (
  <div style={{
    width: size,
    height: size,
    backgroundColor: '#000',
    color: '#fff',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '17px',
    fontFamily: 'sans-serif'
  }}>
    f
  </div>
);

export const YoutubeIcon = ({ size = 28 }) => (
  <div style={{
    width: size,
    height: size,
    backgroundColor: '#000',
    color: '#fff',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <svg width="16" height="14" viewBox="0 0 24 24" fill="#fff">
      <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 20c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 4c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/>
    </svg>
  </div>
);

export const PhoneIcon = ({ size = 20 }) => (
  <div style={{
    width: '28px',
    height: '28px',
    backgroundColor: '#000',
    color: '#fff',
    borderRadius: '5px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '8px'
  }}>
    <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff">
      <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z"/>
    </svg>
  </div>
);
