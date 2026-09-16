import React, { useEffect, useRef, useState } from 'react';

const planSteps = [
  {
    id: 1,
    position: 'left',
    image: '/images/stress.png',
    alt: 'Struggling to manage workload',
    text: (
      <>
        Struggling to manage your workload and schedule?
        <br />
        Let CylixLab help you find clarity and take control.
      </>
    )
  },
  {
    id: 2,
    position: 'right',
    image: '/images/learn.png',
    alt: 'Roadmap to success',
    text: (
      <>
        our roadmap to success: personalized study schedules tailored to your unique goals and learning style.
      </>
    )
  },
  {
    id: 3,
    position: 'left',
    image: '/images/parents.png',
    alt: 'Gain valuable insights for parents',
    text: (
      <>
        Gain valuable insights into your child's progress.
        <br />
        Empowering parents with data and understanding.
      </>
    )
  },
  {
    id: 4,
    position: 'right',
    image: '/images/sucess.png',
    alt: 'Celebrate victory and milestone',
    text: (
      <>
        From effort to victory: Celebrate every milestone and step confidently toward a bright future.
      </>
    )
  }
];

const PlanSection = () => {
  const containerRef = useRef(null);
  const [lineHeight, setLineHeight] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState({});

  useEffect(() => {
    // 1. Scroll-driven dynamic path height calculation
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // When the top of the container reaches 70% of viewport, progress begins
      const startOffset = windowHeight * 0.7;
      const totalHeight = rect.height * 0.9;
      const currentScroll = startOffset - rect.top;

      const progress = Math.min(Math.max(currentScroll / totalHeight, 0), 1);
      setLineHeight(progress * 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 2. IntersectionObserver to slowly display/reveal each of the 4 images and text
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const stepId = entry.target.getAttribute('data-step-id');
          if (stepId) {
            setVisibleSteps((prev) => ({ ...prev, [stepId]: true }));
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    const stepElements = containerRef.current.querySelectorAll('.plan-step-row');
    stepElements.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <section id="plan" className="plan-section">
      <h2 className="plan-title">PLAN</h2>

      <div className="plan-timeline-container" ref={containerRef}>
        {/* Background Track Guide Line */}
        <div className="plan-center-stem-track"></div>

        {/* Animated Drawing Path (fills slowly as you scroll down) */}
        <div
          className="plan-center-stem-fill"
          style={{ height: `${lineHeight}%` }}
        >
          <div className="stem-glow-tip"></div>
        </div>

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
                      <p className="plan-caption">{step.text}</p>
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
                      <p className="plan-caption">{step.text}</p>
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
