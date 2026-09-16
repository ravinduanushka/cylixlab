import React from 'react';

const planSteps = [
  {
    id: 1,
    position: 'left',
    image: '/images/stress.png',
    alt: 'Struggling with workload',
    text: (
      <>
        Struggling to manage your workload and schedule?<br />
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
        Gain valuable insights into your child's progress.<br />
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
  return (
    <section id="plan" className="plan-section">
      <h2 className="plan-title">PLAN</h2>

      <div className="timeline-container">
        {/* Central Vertical Line */}
        <div className="timeline-vertical-line"></div>

        <div className="timeline-steps">
          {planSteps.map((step) => (
            <div key={step.id} className={`timeline-row timeline-row-${step.position}`}>
              
              {step.position === 'left' ? (
                <>
                  {/* Content on Left */}
                  <div className="timeline-item timeline-item-left">
                    <div className="timeline-image-box">
                      <img src={step.image} alt={step.alt} className="timeline-img" />
                    </div>
                    <p className="timeline-text">{step.text}</p>
                  </div>

                  {/* Connector to Center */}
                  <div className="timeline-connector connector-left">
                    <div className="connector-line"></div>
                    <div className="connector-node"></div>
                  </div>

                  {/* Empty Right Column for balance */}
                  <div className="timeline-item timeline-item-spacer"></div>
                </>
              ) : (
                <>
                  {/* Empty Left Column for balance */}
                  <div className="timeline-item timeline-item-spacer"></div>

                  {/* Connector to Center */}
                  <div className="timeline-connector connector-right">
                    <div className="connector-node"></div>
                    <div className="connector-line"></div>
                  </div>

                  {/* Content on Right */}
                  <div className="timeline-item timeline-item-right">
                    <div className="timeline-image-box">
                      <img src={step.image} alt={step.alt} className="timeline-img" />
                    </div>
                    <p className="timeline-text">{step.text}</p>
                  </div>
                </>
              )}

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlanSection;
