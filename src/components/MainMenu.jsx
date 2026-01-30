import { useState } from 'react';
import './MainMenu.css';

function MainMenu({ onStart, onAbout }) {
  const [musicEnabled, setMusicEnabled] = useState(false);

  return (
    <div className="main-menu">
      <div className="main-menu-content">
        <h1 className="main-title">Cyber Hiking</h1>
        <h2 className="main-subtitle">Pacific Crest Trail</h2>
        <p className="main-tagline">
          "We do not hike to challenge nature, nor to boast...<br />
          But to rediscover nature's greatness and humanity's fragility."
        </p>
        
        <div className="main-buttons">
          <button className="btn-start" onClick={onStart}>
            <span className="btn-icon">▶</span>
            Start Challenge
          </button>
          <button className="btn-menu" onClick={() => {}}>
            <span className="btn-icon">👤</span>
            My Profile
          </button>
          <button className="btn-menu" onClick={() => setMusicEnabled(!musicEnabled)}>
            <span className="btn-icon">{musicEnabled ? '🔊' : '🔇'}</span>
            Background Music: {musicEnabled ? 'On' : 'Off'}
          </button>
        </div>

        <div className="main-footer">
          <div className="footer-links">
            <a href="#" onClick={(e) => { e.preventDefault(); onAbout(); }}>FAQ</a>
            <a href="#">Theory Exam</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onAbout(); }}>About Game</a>
          </div>
          <div className="footer-legal">
            <span>Privacy Policy | Terms of Use | Disclaimer</span>
            <span>© 2026 Cyber Hiking. All Rights Reserved.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainMenu;

