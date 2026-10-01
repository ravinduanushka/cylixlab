import { useState, useEffect } from 'react';

// Default quotes fallback loaded from motivational quotes .txt
const DEFAULT_QUOTES = [
  {
    id: 1,
    number: '1.',
    quote: 'The only way of discovering the limits of the possible is to venture a little way past them into the impossible.',
    speaker: '― Arthur C. Clarke',
  },
  {
    id: 2,
    number: '2.',
    quote: 'Learn the rules like a pro, so you can break them like an artist.',
    speaker: '― Pablo Picasso',
  },
  {
    id: 3,
    number: '3.',
    quote: 'May your choices reflect your hopes, not your fears.',
    speaker: '― Nelson Mandela',
  },
  {
    id: 4,
    number: '4.',
    quote: 'It is not the strongest of the species that survive, nor the most intelligent, but the one most responsive to change.',
    speaker: '― Charles Darwin',
  },
  {
    id: 5,
    number: '5.',
    quote: 'The successful warrior is the average man, with laserlike focus.',
    speaker: '― Bruce Lee',
  },
  {
    id: 6,
    number: '6.',
    quote: 'Many of life’s failures are people who did not realize how close they were to success when they gave up.',
    speaker: '― Thomas A. Edison',
  },
  {
    id: 7,
    number: '7.',
    quote: 'Leadership is the art of getting someone else to do something you want done because he wants to do it.',
    speaker: '― Dwight D. Eisenhower',
  },
  {
    id: 8,
    number: '8.',
    quote: 'A leader is a dealer in hope.',
    speaker: '― Napoleon',
  },
  {
    id: 9,
    number: '9.',
    quote: 'If you really want the key to success, start by doing the opposite of what everyone else is doing.',
    speaker: '― Brad Szollose',
  },
  {
    id: 10,
    number: '10.',
    quote: 'A good leader is a person who takes a little more than his share of the blame and a little less than his share of the credit.',
    speaker: '― John Maxwell',
  },
  {
    id: 11,
    number: '11.',
    quote: 'A good plan violently executed now is better than a perfect plan executed next week.',
    speaker: '― George Patton',
  },
  {
    id: 12,
    number: '12.',
    quote: 'Silent gratitude isn’t very much to anyone.',
    speaker: '― Gertrude Stein',
  },
  {
    id: 13,
    number: '13.',
    quote: 'Average leaders raise the bar on themselves; good leaders raise the bar for others; great leaders inspire others to raise their own bar.',
    speaker: '― Orrin Woodward',
  },
  {
    id: 14,
    number: '14.',
    quote: 'Surround yourself with great people; delegate authority; get out of the way.',
    speaker: '― Ronald Reagan',
  },
  {
    id: 15,
    number: '15.',
    quote: 'In the end, it is important to remember that we cannot become what we need to be by remaining what we are.',
    speaker: '― Max De Pree',
  },
];

// Helper to parse raw text from motivational quotes .txt
const parseQuotesText = (rawText) => {
  if (!rawText) return DEFAULT_QUOTES;
  const blocks = rawText.split(/\n\s*\n+/);
  const parsed = [];

  blocks.forEach((block, index) => {
    const trimmed = block.trim();
    if (!trimmed) return;

    const numMatch = trimmed.match(/^(\d+)[\.\s“"]*/);
    const num = numMatch ? parseInt(numMatch[1], 10) : index + 1;
    let content = numMatch ? trimmed.substring(numMatch[0].length).trim() : trimmed;

    let quoteText = content;
    let speaker = '';

    const speakerMatch = content.match(/[\n\r]+[―\-]\s*(.*)$/) || content.match(/\s+[―\-]\s*([A-Za-z0-9\.\s]+)$/);
    if (speakerMatch) {
      speaker = speakerMatch[1].trim();
      quoteText = content.substring(0, speakerMatch.index).trim();
    }

    quoteText = quoteText.replace(/^[“"']+|[”"']+$/g, '').trim();

    parsed.push({
      id: num,
      number: `${num}.`,
      quote: quoteText,
      speaker: speaker ? `― ${speaker}` : '',
    });
  });

  return parsed.length > 0 ? parsed : DEFAULT_QUOTES;
};

const MotivationalQuotesView = () => {
  const [quotes, setQuotes] = useState(DEFAULT_QUOTES);

  useEffect(() => {
    // Attempt to dynamically fetch from public text file
    const fetchQuotesFile = async () => {
      try {
        let res = await fetch('/motivational quotes .txt');
        if (!res.ok) {
          res = await fetch('/motivational-quotes.txt');
        }
        if (res.ok) {
          const text = await res.text();
          const parsed = parseQuotesText(text);
          if (parsed && parsed.length > 0) {
            setQuotes(parsed);
          }
        }
      } catch {
        // Uses DEFAULT_QUOTES if network fetch is unavailable
      }
    };

    fetchQuotesFile();
  }, []);

  return (
    <div className="quotes-content-wrapper">
      {/* Background 3D Goal Illustration: fixed across desktop background */}
      <div className="quotes-fixed-bg-illustration" aria-hidden="true">
        <img
          src="/images/motivational-quotes.jpg"
          alt="Goal Puzzle Step Illustration"
          className="quotes-bg-img"
          onError={(e) => {
            if (!e.currentTarget.src.includes('motivation%20al%20quates')) {
              e.currentTarget.src = '/images/motivation al quates .jpg';
            }
          }}
        />
      </div>

      {/* Subtitle centered above the quotes stage */}
      <h2 className="quotes-main-subtitle">
        &quot;Every small step brings you closer to your goal. Complete the missing piece and keep moving forward.&quot;
      </h2>

      {/* Main stage with fully displayed quotes cards */}
      <div className="quotes-stage-wrapper">
        {/* Staggered list of 15 quotes (alternating left / right) - fully displayed */}
        <div className="quotes-staggered-list">
          {quotes.map((item, index) => {
            const isRight = index % 2 === 1;
            return (
              <div
                key={`quote-${item.id}`}
                className={`quote-pill-card ${isRight ? 'quote-card-right' : 'quote-card-left'}`}
              >
                <span className="quote-number">{item.number}</span>
                <div className="quote-text-content">
                  <p className="quote-body">&ldquo;{item.quote}&rdquo;</p>
                  {item.speaker && (
                    <span className="quote-speaker">{item.speaker}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MotivationalQuotesView;
