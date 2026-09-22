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

// Social Media & Contact Icons
export const LinkedInIcon = ({ size = 16, color = '#ffffff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
  </svg>
);

export const FacebookIcon = ({ size = 16, color = '#ffffff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.52-.14-2.71-.14-2.77 0-4.79 1.69-4.79 4.92v2.58H7v4h3V22h4v-8.5z" />
  </svg>
);

export const YoutubeIcon = ({ size = 18, color = '#ffffff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const MailIcon = ({ size = 15, color = '#ffffff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export const PhoneIcon = ({ size = 15, color = '#ffffff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" />
  </svg>
);

export const GoogleIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

