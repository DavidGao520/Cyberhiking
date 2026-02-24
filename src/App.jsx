import { useState, useCallback } from 'react';
import { GameState } from './game/gameState.js';
import { getTotalMiles, getRoutePoint } from './data/route.js';
import { examQuestions } from './data/examQuestions.js';
import MainMenu from './components/MainMenu.jsx';
import Shop from './components/Shop.jsx';
import GameView from './components/GameView.jsx';
import './App.css';

const TOTAL_MILES = getTotalMiles();

function getLntGrade(score) {
  if (score >= 160) return { grade: 'S', label: 'Trail Guardian', color: '#10b981', desc: 'You are a true steward of the wilderness. The trail is better because of you.' };
  if (score >= 130) return { grade: 'A', label: 'Leave No Trace Hero', color: '#34d399', desc: 'You practiced excellent outdoor ethics. Other hikers look up to you.' };
  if (score >= 110) return { grade: 'B', label: 'Responsible Hiker', color: '#fbbf24', desc: 'You mostly followed LNT principles. A few areas to improve.' };
  if (score >= 90)  return { grade: 'C', label: 'Average Impact', color: '#f59e0b', desc: 'Your impact was noticeable. Consider learning more about Leave No Trace.' };
  if (score >= 60)  return { grade: 'D', label: 'Careless Trekker', color: '#ef4444', desc: 'You left a significant mark on the trail. Nature needs more respect.' };
  return { grade: 'F', label: 'Trail Destroyer', color: '#dc2626', desc: 'The wilderness suffered from your passage. Please study LNT principles.' };
}

const DEFAULT_PROFILE = { totalGames: 0, completions: 0, deaths: 0, bestDistance: 0, bestLNT: 0, bestTimeDays: 0, examPassed: false, examScore: 0, history: [] };

function loadProfile() {
  try {
    const s = localStorage.getItem('cyberhiking_profile');
    return s ? { ...DEFAULT_PROFILE, ...JSON.parse(s) } : { ...DEFAULT_PROFILE };
  } catch { return { ...DEFAULT_PROFILE }; }
}

function persistProfile(p) {
  try { localStorage.setItem('cyberhiking_profile', JSON.stringify(p)); } catch {}
}

const GAME_STATES = {
  MENU: 'menu',
  SHOP: 'shop',
  GAME: 'game',
  GAME_OVER: 'game_over',
  GAME_COMPLETE: 'game_complete'
};

// Helper function to clone game state
function cloneGameState(prev) {
  const newState = new GameState();
  newState.currentLocation = prev.currentLocation;
  newState.health = prev.health;
  newState.energy = prev.energy;
  newState.mental = prev.mental;
  newState.food = prev.food;
  newState.water = prev.water;
  newState.time = prev.time;
  newState.distance = prev.distance;
  newState.isDead = prev.isDead;
  newState.isComplete = prev.isComplete;
  newState.currentEvent = prev.currentEvent ? { ...prev.currentEvent } : null;
  newState.resultMessage = prev.resultMessage ? { ...prev.resultMessage } : null;
  newState.log = [...prev.log];
  newState.equipment = [...prev.equipment];
  newState.maxWeight = prev.maxWeight;
  newState.currentWeight = prev.currentWeight;
  newState.money = prev.money;
  newState.lntScore = prev.lntScore;
  newState.dailyCalorieNeed = prev.dailyCalorieNeed;
  newState.bmr = prev.bmr;
  newState.weather = prev.weather ? { ...prev.weather } : null;
  newState.temperature = prev.temperature;
  return newState;
}

function App() {
  const [gameState, setGameState] = useState(() => new GameState());
  const [currentView, setCurrentView] = useState(GAME_STATES.MENU);
  const [showAbout, setShowAbout] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showExam, setShowExam] = useState(false);
  const [profile, setProfile] = useState(loadProfile);
  const [examQ, setExamQ] = useState(0);
  const [examAnswers, setExamAnswers] = useState([]);
  const [examDone, setExamDone] = useState(false);
  const [examSelected, setExamSelected] = useState(null);

  const saveGameResult = useCallback((gs, result) => {
    const p = loadProfile();
    p.totalGames++;
    if (result === 'complete') p.completions++;
    else p.deaths++;
    p.bestDistance = Math.max(p.bestDistance, gs.distance || 0);
    p.bestLNT = Math.max(p.bestLNT, gs.lntScore || 100);
    if (result === 'complete') {
      const days = Math.floor((gs.time || 0) / 24);
      if (p.bestTimeDays === 0 || days < p.bestTimeDays) p.bestTimeDays = days;
    }
    p.history.unshift({ date: new Date().toLocaleDateString(), distance: gs.distance, lnt: gs.lntScore, result, time: gs.time });
    if (p.history.length > 20) p.history.pop();
    persistProfile(p);
    setProfile(p);
  }, []);

  const handleStart = () => {
    const gs = new GameState();
    const p = loadProfile();
    if (p.examPassed) {
      gs.lntScore = 120;
    }
    setGameState(gs);
    setCurrentView(GAME_STATES.SHOP);
  };

  const handleShopPurchase = useCallback((items, total) => {
    setGameState(prev => {
      const newState = cloneGameState(prev);
      const result = newState.purchaseEquipment(items);
      if (result.success) {
        setTimeout(() => setCurrentView(GAME_STATES.GAME), 0);
      } else {
        alert(result.message);
      }
      return newState;
    });
  }, []);

  const handleMoveForward = useCallback(() => {
    setGameState(prev => {
      const newState = cloneGameState(prev);
      newState.moveForward();
      if (newState.isDead) {
        saveGameResult(newState, 'death');
        setTimeout(() => setCurrentView(GAME_STATES.GAME_OVER), 0);
      } else if (newState.isComplete) {
        saveGameResult(newState, 'complete');
        setTimeout(() => setCurrentView(GAME_STATES.GAME_COMPLETE), 0);
      }
      return newState;
    });
  }, [saveGameResult]);

  const handleRest = useCallback(() => {
    setGameState(prev => {
      const newState = cloneGameState(prev);
      newState.rest();
      if (newState.isDead) {
        saveGameResult(newState, 'death');
        setTimeout(() => setCurrentView(GAME_STATES.GAME_OVER), 0);
      }
      return newState;
    });
  }, [saveGameResult]);

  const handleEventChoice = useCallback((optionIndex) => {
    setGameState(prev => {
      const newState = cloneGameState(prev);
      const handled = newState.handleEvent(optionIndex);
      if (handled) {
        newState.currentEvent = null;
      }
      if (newState.isDead) {
        saveGameResult(newState, 'death');
        setTimeout(() => setCurrentView(GAME_STATES.GAME_OVER), 0);
      } else if (newState.isComplete) {
        saveGameResult(newState, 'complete');
        setTimeout(() => setCurrentView(GAME_STATES.GAME_COMPLETE), 0);
      }
      return newState;
    });
  }, [saveGameResult]);

  const handleDismissResult = useCallback(() => {
    setGameState(prev => {
      const newState = cloneGameState(prev);
      newState.resultMessage = null;
      return newState;
    });
  }, []);

  const handleResupply = useCallback(() => {
    setGameState(prev => {
      const newState = cloneGameState(prev);
      newState.openResupply();
      return newState;
    });
  }, []);

  const handleReset = () => {
    setGameState(new GameState());
    setCurrentView(GAME_STATES.MENU);
  };

  return (
    <div className="app">
      {currentView === GAME_STATES.MENU && (
        <MainMenu 
          onStart={handleStart}
          onAbout={() => setShowAbout(!showAbout)}
          onProfile={() => { setShowProfile(true); setProfile(loadProfile()); }}
          onExam={() => { setShowExam(true); setExamQ(0); setExamAnswers([]); setExamDone(false); setExamSelected(null); }}
          examPassed={profile.examPassed}
        />
      )}

      {showAbout && currentView === GAME_STATES.MENU && (
        <div className="about-overlay">
          <div className="about-panel">
            <button className="close-btn" onClick={() => setShowAbout(false)}>×</button>
            <h3>About Cyber Hiking</h3>
            <p>
              Cyber Hiking is a survival simulation game set on the <strong>Pacific Crest Trail</strong> — 
              2,652 miles of wilderness stretching from the Mexican border to Canada. 
              With realistic geography, dynamic weather, and life-or-death resource management, 
              this game lets you experience the raw power and beauty of one of America's 
              most challenging long-distance trails — from your screen.
            </p>
            <p>
              But this game is about more than survival. At its core, Cyber Hiking is built around 
              the philosophy of <strong className="lnt-highlight">Leave No Trace (LNT)</strong> — the idea that every hiker 
              has a responsibility to protect the wilderness they walk through. Your every decision 
              in the game — how you handle waste, interact with wildlife, build campfires, 
              or treat the trail — is tracked by your LNT score and shapes your journey.
            </p>
            <p>
              Our mission is twofold: to help players feel the <strong>greatness of nature 
              and the fragility of human life</strong>, and to cultivate a deep awareness 
              that the wilderness is not ours to conquer — it is ours to protect. 
              We hope that after playing, you'll carry the LNT principles 
              not just in the game, but into the real outdoors.
            </p>
            <p className="about-author">
              Designed & Developed by <strong>David Gao</strong><br />
              <span>© 2026 Cyber Hiking. All Rights Reserved.</span>
            </p>
          </div>
        </div>
      )}

      {/* Profile Overlay */}
      {showProfile && currentView === GAME_STATES.MENU && (
        <div className="about-overlay" onClick={() => setShowProfile(false)}>
          <div className="profile-panel" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowProfile(false)}>×</button>
            <h3>👤 My Profile</h3>

            {profile.totalGames === 0 ? (
              <p className="profile-empty">No hikes yet. Start your first challenge!</p>
            ) : (
              <>
                <div className="profile-stats-grid">
                  <div className="profile-stat">
                    <span className="ps-val">{profile.totalGames}</span>
                    <span className="ps-label">Total Hikes</span>
                  </div>
                  <div className="profile-stat">
                    <span className="ps-val" style={{ color: '#10b981' }}>{profile.completions}</span>
                    <span className="ps-label">Completions</span>
                  </div>
                  <div className="profile-stat">
                    <span className="ps-val" style={{ color: '#ef4444' }}>{profile.deaths}</span>
                    <span className="ps-label">Deaths</span>
                  </div>
                </div>

                <div className="profile-records">
                  <div className="profile-record"><span>🗺️ Best Distance</span><span>{profile.bestDistance.toFixed(1)} mi ({(profile.bestDistance / TOTAL_MILES * 100).toFixed(1)}%)</span></div>
                  <div className="profile-record"><span>🌲 Best LNT</span><span>{profile.bestLNT} — {getLntGrade(profile.bestLNT).grade} {getLntGrade(profile.bestLNT).label}</span></div>
                  {profile.bestTimeDays > 0 && <div className="profile-record"><span>⏱️ Best Time</span><span>{profile.bestTimeDays} days</span></div>}
                  <div className="profile-record"><span>📝 Theory Exam</span><span>{profile.examPassed ? `Passed (${profile.examScore}/${examQuestions.length})` : 'Not taken'}</span></div>
                </div>

                {profile.history.length > 0 && (
                  <>
                    <h4 className="profile-history-title">Recent Hikes</h4>
                    <div className="profile-history">
                      {profile.history.slice(0, 8).map((h, i) => (
                        <div key={i} className="profile-hike">
                          <span className="ph-date">{h.date}</span>
                          <span className={`ph-result ${h.result}`}>{h.result === 'complete' ? '🏔️' : '💀'}</span>
                          <span className="ph-dist">{(h.distance || 0).toFixed(0)} mi</span>
                          <span className="ph-lnt">LNT {h.lnt || 100}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Theory Exam Overlay */}
      {showExam && currentView === GAME_STATES.MENU && (
        <div className="about-overlay" onClick={() => setShowExam(false)}>
          <div className="exam-panel" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowExam(false)}>×</button>

            {!examDone ? (() => {
              const q = examQuestions[examQ];
              return (
                <>
                  <div className="exam-header">
                    <h3>📝 Theory Exam</h3>
                    <span className="exam-progress">{examQ + 1} / {examQuestions.length}</span>
                  </div>
                  <div className="exam-progress-bar"><div className="exam-progress-fill" style={{ width: `${((examQ + 1) / examQuestions.length) * 100}%` }}></div></div>
                  <p className="exam-question">{q.question}</p>
                  <div className="exam-options">
                    {q.options.map((opt, i) => (
                      <button
                        key={i}
                        className={`exam-opt ${examSelected === i ? (i === q.answer ? 'correct' : 'wrong') : ''} ${examSelected !== null && i === q.answer ? 'correct' : ''}`}
                        onClick={() => {
                          if (examSelected !== null) return;
                          setExamSelected(i);
                        }}
                        disabled={examSelected !== null}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {examSelected !== null && (
                    <div className={`exam-explanation ${examSelected === q.answer ? 'right' : 'wrong-bg'}`}>
                      <p>{examSelected === q.answer ? '✓ Correct!' : '✗ Incorrect.'} {q.explanation}</p>
                    </div>
                  )}
                  {examSelected !== null && (
                    <button className="btn-primary exam-next" onClick={() => {
                      const newAnswers = [...examAnswers, examSelected === q.answer];
                      setExamAnswers(newAnswers);
                      setExamSelected(null);
                      if (examQ + 1 >= examQuestions.length) {
                        const score = newAnswers.filter(Boolean).length;
                        const passed = score >= 7;
                        const p = loadProfile();
                        if (passed && !p.examPassed) { p.examPassed = true; }
                        if (score > (p.examScore || 0)) { p.examScore = score; }
                        persistProfile(p);
                        setProfile(p);
                        setExamDone(true);
                      } else {
                        setExamQ(examQ + 1);
                      }
                    }}>
                      {examQ + 1 >= examQuestions.length ? 'See Results' : 'Next Question →'}
                    </button>
                  )}
                </>
              );
            })() : (() => {
              const score = examAnswers.filter(Boolean).length;
              const passed = score >= 7;
              return (
                <div className="exam-results">
                  <div className="exam-result-icon">{passed ? '🎓' : '📖'}</div>
                  <h3>{passed ? 'Exam Passed!' : 'Keep Studying'}</h3>
                  <p className="exam-score-text">Score: {score} / {examQuestions.length}</p>
                  <div className="exam-result-bar"><div className="exam-result-fill" style={{ width: `${(score / examQuestions.length) * 100}%`, background: passed ? '#10b981' : '#ef4444' }}></div></div>
                  {passed ? (
                    <p className="exam-bonus-text">🌲 Exam bonus unlocked! Your next hike starts with LNT 120 (instead of 100).</p>
                  ) : (
                    <p className="exam-fail-text">You need at least 7/{examQuestions.length} to pass. Review the explanations and try again!</p>
                  )}
                  <div className="exam-result-actions">
                    <button className="btn-primary" onClick={() => { setExamQ(0); setExamAnswers([]); setExamDone(false); setExamSelected(null); }}>Retake Exam</button>
                    <button className="btn-primary" style={{ background: 'rgba(255,255,255,0.1)' }} onClick={() => setShowExam(false)}>Close</button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {currentView === GAME_STATES.SHOP && (
        <div className="shop-view">
          <Shop
            money={gameState.money}
            maxWeight={gameState.maxWeight}
            currentWeight={gameState.currentWeight}
            onPurchase={handleShopPurchase}
          />
        </div>
      )}

      {currentView === GAME_STATES.GAME && (
        <GameView
          gameState={gameState}
          onMoveForward={handleMoveForward}
          onRest={handleRest}
          onEventChoice={handleEventChoice}
          onDismissResult={handleDismissResult}
          onResupply={handleResupply}
        />
      )}

      {currentView === GAME_STATES.GAME_OVER && (() => {
        const lnt = getLntGrade(gameState.lntScore || 100);
        const days = Math.floor((gameState.time || 0) / 24);
        const hours = Math.floor((gameState.time || 0) % 24);
        const pct = ((gameState.distance || 0) / TOTAL_MILES * 100).toFixed(1);
        const loc = getRoutePoint(gameState.currentLocation);
        const deathLog = gameState.log.find(l => l.message?.includes('died') || l.message?.includes('collapsed') || l.message?.includes('EMERGENCY'));
        const deathMsg = deathLog?.message || gameState.log[0]?.message || 'Your journey has ended.';
        return (
          <div className="game-over-screen">
            <div className="settle-card death">
              <div className="settle-icon">💀</div>
              <h2 className="settle-title death-title">Trail Ended</h2>
              <p className="settle-subtitle">{deathMsg}</p>

              <div className="settle-stats">
                <div className="settle-stat-row">
                  <div className="settle-stat"><span className="settle-stat-label">📍 Last Location</span><span className="settle-stat-value">{loc?.name || 'Unknown'}</span></div>
                  <div className="settle-stat"><span className="settle-stat-label">🗺️ Distance</span><span className="settle-stat-value">{(gameState.distance || 0).toFixed(1)} mi ({pct}%)</span></div>
                </div>
                <div className="settle-stat-row">
                  <div className="settle-stat"><span className="settle-stat-label">📅 Survived</span><span className="settle-stat-value">{days}d {hours}h</span></div>
                  <div className="settle-stat"><span className="settle-stat-label">💰 Money Left</span><span className="settle-stat-value">${(gameState.money || 0).toFixed(0)}</span></div>
                </div>
                <div className="settle-stat-row">
                  <div className="settle-stat"><span className="settle-stat-label">❤️ Health</span><span className="settle-stat-value">{Math.round(gameState.health)}</span></div>
                  <div className="settle-stat"><span className="settle-stat-label">⚡ Energy</span><span className="settle-stat-value">{Math.round(gameState.energy)}</span></div>
                </div>
              </div>

              <div className="lnt-card" style={{ borderColor: lnt.color }}>
                <div className="lnt-grade" style={{ color: lnt.color }}>{lnt.grade}</div>
                <div className="lnt-info">
                  <div className="lnt-label-title" style={{ color: lnt.color }}>🌲 {lnt.label}</div>
                  <div className="lnt-score-num">LNT Score: {gameState.lntScore || 100} / 200</div>
                  <p className="lnt-desc">{lnt.desc}</p>
                </div>
              </div>

              <div className="settle-quote">"We do not hike to challenge nature, but to rediscover nature's greatness and humanity's fragility."</div>
              <button onClick={handleReset} className="btn-primary">Try Again</button>
            </div>
          </div>
        );
      })()}

      {currentView === GAME_STATES.GAME_COMPLETE && (() => {
        const lnt = getLntGrade(gameState.lntScore || 100);
        const days = Math.floor((gameState.time || 0) / 24);
        const hours = Math.floor((gameState.time || 0) % 24);
        return (
          <div className="game-complete-screen">
            <div className="settle-card victory">
              <div className="settle-icon">🏔️</div>
              <h2 className="settle-title victory-title">Summit Reached!</h2>
              <p className="settle-subtitle">You've completed the Pacific Crest Trail — all {TOTAL_MILES.toFixed(0)} miles from Mexico to Canada.</p>

              <div className="settle-stats">
                <div className="settle-stat-row">
                  <div className="settle-stat"><span className="settle-stat-label">🗺️ Total Distance</span><span className="settle-stat-value">{gameState.distance.toFixed(1)} miles</span></div>
                  <div className="settle-stat"><span className="settle-stat-label">📅 Total Time</span><span className="settle-stat-value">{days} days {hours} hours</span></div>
                </div>
                <div className="settle-stat-row">
                  <div className="settle-stat"><span className="settle-stat-label">❤️ Final Health</span><span className="settle-stat-value">{Math.round(gameState.health)}</span></div>
                  <div className="settle-stat"><span className="settle-stat-label">🧠 Final Mental</span><span className="settle-stat-value">{Math.round(gameState.mental || 100)}</span></div>
                </div>
                <div className="settle-stat-row">
                  <div className="settle-stat"><span className="settle-stat-label">💰 Money Left</span><span className="settle-stat-value">${(gameState.money || 0).toFixed(0)}</span></div>
                  <div className="settle-stat"><span className="settle-stat-label">🍽️ Food Left</span><span className="settle-stat-value">{(gameState.food || 0).toFixed(1)}k cal</span></div>
                </div>
              </div>

              <div className="lnt-card" style={{ borderColor: lnt.color }}>
                <div className="lnt-grade" style={{ color: lnt.color }}>{lnt.grade}</div>
                <div className="lnt-info">
                  <div className="lnt-label-title" style={{ color: lnt.color }}>🌲 {lnt.label}</div>
                  <div className="lnt-score-num">LNT Score: {gameState.lntScore || 100} / 200</div>
                  <p className="lnt-desc">{lnt.desc}</p>
                </div>
              </div>

              <div className="settle-challenge">
                <h4>Next Challenge</h4>
                <p>Can you finish faster? With higher LNT? With less money spent?</p>
              </div>

              <div className="settle-quote">"The trail provides what you need — if you respect it."</div>
              <button onClick={handleReset} className="btn-primary">Play Again</button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default App;
