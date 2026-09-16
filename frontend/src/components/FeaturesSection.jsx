import React from 'react';
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
    icon: <ReportIcon />,
    title: 'Detailed Reports',
    description: 'Visual progress tracking tools.'
  },
  {
    id: 2,
    icon: <ReminderIcon />,
    title: 'Reminders',
    description: 'Smart alerts and notifications.'
  },
  {
    id: 3,
    icon: <TodoIcon />,
    title: 'To-Do Lists',
    description: 'Effortless task management.'
  },
  {
    id: 4,
    icon: <QuoteIcon />,
    title: 'Motivational Quotes',
    description: 'Uplifting inspiration to keep going.'
  },
  {
    id: 5,
    icon: <ParentViewIcon />,
    title: 'Parent View',
    description: 'Parents view and monitor progress.'
  },
  {
    id: 6,
    icon: <ChatboxIcon />,
    title: 'Online Chatbox',
    description: 'Instant real-time communication.'
  },
  {
    id: 7,
    icon: <AILearningIcon />,
    title: 'AI Learning Platform',
    description: 'Smart personalized learning.'
  },
  {
    id: 8,
    icon: <AnalyzeProgressIcon />,
    title: 'Analyze Progress',
    description: 'Optimizes student achievement.'
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="features-section">
      <div className="features-container">
        <h2 className="features-title">Features</h2>

        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.id} className="feature-card">
              <div className="feature-icon-wrapper">
                {feature.icon}
              </div>
              <h3 className="feature-card-title">{feature.title}</h3>
              <p className="feature-card-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
