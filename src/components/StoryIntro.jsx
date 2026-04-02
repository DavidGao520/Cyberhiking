import { useState, useEffect } from 'react';
import './StoryIntro.css';

const STORY_PARAGRAPHS = [
  "Another Monday. Another 9-to-5 in a windowless office. The fluorescent lights hum overhead as you stare at spreadsheets that blur together. Your coffee is cold. Your inbox is overflowing. Somewhere outside, the sun is shining — but you wouldn't know.",
  "One night, scrolling through your phone at 2 AM, you stumble on a photo: a lone hiker standing at the edge of a granite cliff, arms outstretched, the Sierra Nevada stretching endlessly behind them. The caption reads: \"Mile 812. PCT. The world makes sense out here.\"",
  "Something inside you breaks open. You start reading. The Pacific Crest Trail — 2,652 miles from the Mexican border to Canada. Through scorching deserts, over snow-choked passes at 13,000 feet, through ancient forests where the only sound is wind through the pines.",
  "People quit their jobs for this. They sell their apartments. They walk for five months straight, carrying everything they need on their backs. Some don't make it. Some come back changed forever.",
  "You hand in your resignation the next morning. Your boss thinks you're crazy. Your parents are worried. Your friends don't understand. But for the first time in years, you feel awake.",
  "You spend weeks researching gear, studying maps, reading trail journals. You learn about Leave No Trace — the philosophy that the wilderness is not yours to conquer, but yours to protect. Every footprint matters. Every choice on the trail echoes through the ecosystem.",
  "Now the day has arrived. Your pack is ready. Your boots are broken in. Standing at the Mexican border in Campo, California, you look north. Somewhere beyond the heat shimmer and the distant mountains lies Monument 78 — the Canadian border. Your finish line.",
  "2,652 miles. One pair of legs. Let's see what you're made of.",
];

function StoryIntro({ onContinue }) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount < STORY_PARAGRAPHS.length) {
      const timer = setTimeout(() => {
        setVisibleCount(prev => prev + 1);
      }, visibleCount === 0 ? 600 : 1800);
      return () => clearTimeout(timer);
    }
  }, [visibleCount]);

  const allVisible = visibleCount >= STORY_PARAGRAPHS.length;

  return (
    <div className="story-intro">
      <div className="story-bg-layer" />
      <div className="story-content">
        <div className="story-paragraphs">
          {STORY_PARAGRAPHS.map((text, i) => (
            <p
              key={i}
              className={`story-paragraph ${i < visibleCount ? 'visible' : ''}`}
            >
              {text}
            </p>
          ))}
        </div>

        <div className={`story-actions ${allVisible ? 'visible' : ''}`}>
          <button className="story-continue-btn" onClick={onContinue}>
            Head to the Outfitter
            <span className="story-arrow">→</span>
          </button>
        </div>

        {!allVisible && (
          <button className="story-skip-btn" onClick={() => setVisibleCount(STORY_PARAGRAPHS.length)}>
            Skip
          </button>
        )}
      </div>
    </div>
  );
}

export default StoryIntro;
