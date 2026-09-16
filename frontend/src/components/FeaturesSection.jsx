import React, { useState, useEffect } from 'react';
import {
  ReportIcon,
  ReminderIcon,
  TodoIcon,
  QuoteIcon,
  ParentViewIcon,
  ChatboxIcon,
  AILearningIcon,
  AnalyzeProgressIcon
} from './Icons';

const features = [
  {
    id: 1,
    icon: <ReportIcon color="#3333FF" />,
    title: 'Detailed Reports',
    description: 'Visual progress tracking tools.'
  },
  {
    id: 2,
    icon: <ReminderIcon color="#3333FF" />,
    title: 'Reminders',
    description: 'Smart alerts and notifications.'
  },
  {
    id: 3,
    icon: <TodoIcon color="#3333FF" />,
    title: 'To-Do Lists',
    description: 'Effortless task management.'
  },
  {
    id: 4,
    icon: <QuoteIcon color="#3333FF" />,
    title: 'Motivational Quotes',
    description: 'Uplifting inspiration to keep going.'
  },
  {
    id: 5,
    icon: <ParentViewIcon color="#3333FF" />,
    title: 'Parent View',
    description: 'Parents view and monitor progress.'
  },
  {
    id: 6,
    icon: <ChatboxIcon color="#3333FF" />,
    title: 'Online Chatbox',
    description: 'Instant real-time communication.'
  },
  {
    id: 7,
    icon: <AILearningIcon color="#3333FF" />,
    title: 'AI Learning Platform',
    description: 'Smart personalized learning.'
  },
  {
    id: 8,
    icon: <AnalyzeProgressIcon color="#3333FF" />,
    title: 'Analyze Progress',
    description: 'Optimizes student achievement.'
  }
];

const FeaturesSection = () => {
  // Always maintained 1-8 then 8-1 pulse wave
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  useEffect(() => {
    let current = 0;
    let step = 1; // 1 for 1-8, -1 for 8-1

    const interval = setInterval(() => {
      current += step;
      if (current >= features.length - 1) {
        current = features.length - 1;
        step = -1; // reverse direction: 8 to 1
      } else if (current <= 0) {
        current = 0;
        step = 1; // forward direction: 1 to 8
      }
      setActiveCardIndex(current);
    }, 650);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="features" className="features-section">
      <div className="features-container">
        <h2 className="features-title">Features</h2>

        <div className="features-grid">
          {features.map((feature, index) => {
            const isActive = index === activeCardIndex;
            return (
              <div
                key={feature.id}
                className={`feature-card ${isActive ? 'card-pulse-large' : ''}`}
              >
                <div className="feature-icon-wrapper">
                  {feature.icon}
                </div>
                <h3 className="feature-card-title">{feature.title}</h3>
                <p className="feature-card-desc">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
