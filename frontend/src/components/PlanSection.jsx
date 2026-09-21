import { useEffect, useRef, useState } from 'react';

const planSteps = [
  {
    id: 1,
    position: 'left',
    image: '/images/stress.png',
    alt: 'Struggling to manage workload',
    lines: [
      'Struggling to manage your workload and schedule?',
      'Let CylixLab help you find clarity and take control.'
    ]
  },
  {
    id: 2,
    position: 'right',
    image: '/images/learn.png',
    alt: 'Roadmap to success',
    lines: [
      'our roadmap to success: personalized study schedules',
      'tailored to your unique goals and learning style.'
    ]
  },
  {
    id: 3,
    position: 'left',
    image: '/images/parents.png',
    alt: 'Gain valuable insights for parents',
    lines: [
      "Gain valuable insights into your child's progress.",
      'Empowering parents with data and understanding.'
    ]
  },
  {
    id: 4,
    position: 'right',
    image: '/images/sucess.png',
    alt: 'Celebrate victory and milestone',
    lines: [
      'From effort to victory: Celebrate every milestone',
      'and step confidently toward a bright future.'
    ]
  }
];

const PlanSection = () => {
  const containerRef = useRef(null);
  const [visibleSteps, setVisibleSteps] = useState({});

  useEffect(() => {
    // Re-triggers on scroll down and scroll up again
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        const stepId = entry.target.getAttribute('data-step-id');
        if (stepId) {
          setVisibleSteps((prev) => ({
            ...prev,
            [stepId]: entry.isIntersecting
          }));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.18,
      rootMargin: '0px 0px -40px 0px'
    });

    const stepElements = containerRef.current?.querySelectorAll('.plan-step-row');
    stepElements?.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section id="plan" className="plan-section">
      <h2 className="plan-title">PLAN</h2>

      <div className="plan-timeline-container" ref={containerRef}>
        {/* Solid Static Vertical Line in #3333FF */}
        <div className="plan-center-stem"></div>

        <div className="plan-steps-wrapper">
          {planSteps.map((step) => {
            const isLeft = step.position === 'left';
            const isRevealed = !!visibleSteps[step.id];

            return (
              <div
                key={step.id}
                data-step-id={step.id}
                className={`plan-step-row ${isLeft ? 'row-left' : 'row-right'} ${
                  isRevealed ? 'is-revealed' : ''
                }`}
              >
                {/* Left Side Container */}
                <div className="plan-col plan-col-left">
                  {isLeft && (
                    <div className="plan-card plan-card-left">
                      <div className="plan-image-box">
                        <img src={step.image} alt={step.alt} className="plan-img" />
                        {/* Branch line connecting to center stem */}
                        <div className="plan-branch branch-left">
                          <div className="branch-line"></div>
                          <div className="branch-node"></div>
                        </div>
                      </div>
                      <div className="plan-caption">
                        {step.lines.map((line, idx) => (
                          <span
                            key={idx}
                            className="caption-rotate-line"
                            style={{ transitionDelay: `${0.12 + idx * 0.08}s` }}
                          >
                            {line}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side Container */}
                <div className="plan-col plan-col-right">
                  {!isLeft && (
                    <div className="plan-card plan-card-right">
                      <div className="plan-image-box">
                        <img src={step.image} alt={step.alt} className="plan-img" />
                        {/* Branch line connecting from center stem */}
                        <div className="plan-branch branch-right">
                          <div className="branch-node"></div>
                          <div className="branch-line"></div>
                        </div>
                      </div>
                      <div className="plan-caption">
                        {step.lines.map((line, idx) => (
                          <span
                            key={idx}
                            className="caption-rotate-line"
                            style={{ transitionDelay: `${0.12 + idx * 0.08}s` }}
                          >
                            {line}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PlanSection;
