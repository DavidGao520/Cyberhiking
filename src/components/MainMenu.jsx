import './MainMenu.css';

function MainMenu({ onStart, onResume, hasSavedGame, onAbout, onProfile, onExam, examPassed, musicOn, onToggleMusic }) {
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
          {hasSavedGame && (
            <button className="btn-resume" onClick={onResume}>
              <span className="btn-icon">🥾</span>
              Resume Hike
            </button>
          )}
          <button className="btn-start" onClick={onStart}>
            <span className="btn-icon">▶</span>
            {hasSavedGame ? 'New Challenge' : 'Start Challenge'}
          </button>
          <button className="btn-menu" onClick={onProfile}>
            <span className="btn-icon">👤</span>
            My Profile
          </button>
          <button className="btn-menu" onClick={onExam}>
            <span className="btn-icon">📝</span>
            Theory Exam {examPassed && <span className="exam-badge">Passed</span>}
          </button>
        </div>

        <div className="main-footer">
          <div className="footer-links">
            <a href="#" onClick={(e) => { e.preventDefault(); onAbout(); }}>FAQ</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onExam(); }}>Theory Exam</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onAbout(); }}>About Game</a>
          </div>
          <div className="footer-legal">
            <span>Privacy Policy | Terms of Use | Disclaimer</span>
            <span>© 2026 Cyber Hiking. All Rights Reserved.</span>
          </div>
        </div>
      </div>

      {/* Music Toggle */}
      <button className="music-toggle" onClick={onToggleMusic} title={musicOn ? 'Mute music' : 'Play music'}>
        {musicOn ? '🔊' : '🔇'}
      </button>
    </div>
  );
}

export default MainMenu;
