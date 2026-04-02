import { useState, useEffect, useRef } from 'react';
import { getRoutePoint, routeData, getTotalMiles } from '../data/route.js';
import './GameView.css';

const TOTAL_MILES = getTotalMiles();

const LANDMARKS = routeData.filter(
  p => p.type === 'resupply' || p.type === 'finish' || p.id === 11
);

// Background images per region
const REGION_BACKGROUNDS = [
  { maxMile: 150, url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=2070&q=80' },
  { maxMile: 450, url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2070&q=80' },
  { maxMile: 700, url: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&w=2070&q=80' },
  { maxMile: 1100, url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2070&q=80' },
  { maxMile: 1500, url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2070&q=80' },
  { maxMile: 1900, url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2070&q=80' },
  { maxMile: 2200, url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2070&q=80' },
  { maxMile: 9999, url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2070&q=80' },
];

function getRegionBackground(distance) {
  const region = REGION_BACKGROUNDS.find(r => distance <= r.maxMile);
  return region?.url || REGION_BACKGROUNDS[0].url;
}

const getWeatherIcon = (weatherName) => {
  const icons = {
    'Clear': '☀️', 'Sunny': '☀️', 'Cloudy': '☁️', 'Rain': '🌧️',
    'Heavy Rain': '🌧️', 'Snow': '❄️', 'Blizzard': '❄️',
    'Fog': '🌫️', 'Thunderstorm': '⛈️', 'Extreme Heat': '🔥'
  };
  return icons[weatherName] || '☁️';
};

// Event title color based on event type
const EVENT_TYPE_COLORS = {
  danger: '#ef4444',
  positive: '#10b981',
  neutral: '#fbbf24',
};

function SegmentedBar({ value, maxValue = 100, color, icon, label, flash, debuffs = [] }) {
  const pct = Math.max(0, Math.min(100, (value / maxValue) * 100));
  const segments = 10;
  return (
    <div className={`seg-bar-item ${flash ? 'seg-flash' : ''}`}>
      <span className="seg-bar-icon">{icon}</span>
      <div className="seg-bar-col">
        <div className="seg-bar-track">
          {Array.from({ length: segments }, (_, i) => {
            const segPct = ((i + 1) / segments) * 100;
            const filled = pct >= segPct;
            const partial = !filled && pct > ((i) / segments) * 100;
            return (
              <div
                key={i}
                className={`seg-bar-segment ${filled ? 'filled' : ''} ${partial ? 'partial' : ''}`}
                style={{
                  '--bar-color': color,
                  '--partial-pct': partial ? `${((pct - (i / segments) * 100) / (100 / segments)) * 100}%` : '0%'
                }}
              />
            );
          })}
        </div>
        {debuffs.length > 0 && (
          <div className="seg-bar-debuffs">
            {debuffs.map(d => (
              <span key={d.id} className="debuff-tag" style={{ background: d.color }}>{d.name}</span>
            ))}
          </div>
        )}
      </div>
      <span className="seg-bar-value" style={{ color }}>{Math.round(value)}</span>
    </div>
  );
}

function GameView({ gameState, onMoveForward, onRest, onEventChoice, onDismissResult, onResupply, onLeaveTemporarily, onAbandonChallenge, musicOn, onToggleMusic }) {
  const [activePanel, setActivePanel] = useState(null);
  const [flashBars, setFlashBars] = useState({});
  const prevStats = useRef({
    health: gameState.health,
    energy: gameState.energy,
    mental: gameState.mental || 100,
    temperature: gameState.temperature || 70,
  });

  // Detect stat changes and trigger flash animations
  useEffect(() => {
    const prev = prevStats.current;
    const changed = {};
    if (Math.round(gameState.health) !== Math.round(prev.health)) changed.health = true;
    if (Math.round(gameState.energy) !== Math.round(prev.energy)) changed.energy = true;
    if (Math.round(gameState.mental || 100) !== Math.round(prev.mental)) changed.mental = true;
    if (Math.round(gameState.temperature || 70) !== Math.round(prev.temperature)) changed.temperature = true;

    if (Object.keys(changed).length > 0) {
      setFlashBars(changed);
      const timer = setTimeout(() => setFlashBars({}), 1200);
      return () => clearTimeout(timer);
    }

    prevStats.current = {
      health: gameState.health,
      energy: gameState.energy,
      mental: gameState.mental || 100,
      temperature: gameState.temperature || 70,
    };
  }, [gameState.health, gameState.energy, gameState.mental, gameState.temperature]);

  // Update prevStats after flash clears
  useEffect(() => {
    if (Object.keys(flashBars).length === 0) {
      prevStats.current = {
        health: gameState.health,
        energy: gameState.energy,
        mental: gameState.mental || 100,
        temperature: gameState.temperature || 70,
      };
    }
  }, [flashBars, gameState.health, gameState.energy, gameState.mental, gameState.temperature]);

  const currentLocation = getRoutePoint(gameState.currentLocation) || { name: 'Unknown', elevation: 0 };
  const day = Math.floor((gameState.time || 0) / 24) + 1;
  const hour = Math.floor((gameState.time || 0) % 24);
  const minute = Math.floor(((gameState.time || 0) % 24 - hour) * 60);
  const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

  const weather = gameState.weather || { name: 'Clear', energyModifier: 0 };
  const temperature = gameState.temperature || 70;
  const progressPct = Math.min(100, ((gameState.distance || 0) / TOTAL_MILES) * 100);
  const bgUrl = getRegionBackground(gameState.distance || 0);

  const hasEvent = !!gameState.currentEvent;
  const hasResult = !!gameState.resultMessage;
  const isBlocked = hasEvent || hasResult;
  const canResupply = currentLocation.type === 'resupply' || currentLocation.type === 'camp';

  const eventType = gameState.currentEvent?.type || 'neutral';
  const eventTitleColor = EVENT_TYPE_COLORS[eventType] || EVENT_TYPE_COLORS.neutral;
  const eventBgUrl = gameState.currentEvent?.image;

  // Use event background when event is active, otherwise region background
  const activeBgUrl = hasEvent && eventBgUrl ? eventBgUrl : bgUrl;

  const togglePanel = (panel) => {
    setActivePanel(prev => prev === panel ? null : panel);
  };

  return (
    <div className="game-view">
      <div
        className={`game-background ${hasEvent ? 'event-bg-active' : ''}`}
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url('${activeBgUrl}')` }}
      >
        {/* ── Top Bar ── */}
        <div className="top-bar">
          <div className="top-bar-left">
            <span className="top-day">DAY {day}</span>
            <span className="top-sep">|</span>
            <span className="top-location">📍 {currentLocation.name}</span>
          </div>
          <div className="top-bar-right">
            <span className="top-time">{timeString}</span>
            <span className="top-weather">{getWeatherIcon(weather.name)} {temperature.toFixed(0)}°F</span>
          </div>
        </div>

        {/* ── Segmented Status Strip ── */}
        <div className="status-strip">
          <SegmentedBar value={temperature} maxValue={120} color="#3b82f6" icon="🌡️" label="Temp" flash={flashBars.temperature}
            debuffs={(gameState.debuffs || []).filter(d => d.stat === 'temperature')} />
          <SegmentedBar value={gameState.health} maxValue={100} color="#ef4444" icon="❤️" label="Health" flash={flashBars.health}
            debuffs={(gameState.debuffs || []).filter(d => d.stat === 'health')} />
          <SegmentedBar value={gameState.mental || 100} maxValue={100} color="#a855f7" icon="🧠" label="Mental" flash={flashBars.mental}
            debuffs={(gameState.debuffs || []).filter(d => d.stat === 'mental')} />
          <SegmentedBar value={gameState.energy} maxValue={100} color="#f59e0b" icon="⚡" label="Energy" flash={flashBars.energy}
            debuffs={(gameState.debuffs || []).filter(d => d.stat === 'energy')} />
        </div>

        {/* ── Center Narrative Area ── */}
        <div className="narrative-area">
          {!hasEvent && !hasResult && !activePanel && (
            <div className="narrative-card">
              <p className="narrative-location-desc">{currentLocation.description}</p>
              <div className="narrative-stats">
                <span>🗺️ {(gameState.distance || 0).toFixed(1)} / {TOTAL_MILES.toFixed(0)} mi ({progressPct.toFixed(1)}%)</span>
                <span>⛰️ {currentLocation.elevation.toLocaleString()} ft</span>
                <span>🍽️ {(gameState.food || 0).toFixed(1)}k cal</span>
                <span>💧 {(gameState.water || 0).toFixed(1)}L</span>
                <span>💰 ${(gameState.money || 0).toFixed(0)}</span>
                <span style={{ color: (gameState.lntScore || 100) > 100 ? '#10b981' : (gameState.lntScore || 100) < 100 ? '#ef4444' : '#fbbf24' }}>
                  🌲 LNT: {gameState.lntScore || 100}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── Event Card (full-screen bg takeover, bottom card like original) ── */}
        {hasEvent && (
          <div className="event-scene">
            {/* Description card */}
            <div className="event-desc-card">
              <h3 className="event-title" style={{ color: eventTitleColor }}>{gameState.currentEvent.name}</h3>
              <p className="event-description">{gameState.currentEvent.description}</p>
            </div>
            {/* Options grid */}
            <div className="event-options-grid">
              {gameState.currentEvent.options.map((option, index) => {
                const requiresItem = option.requireEquipment;
                const hasItem = !requiresItem || gameState.equipment.some(eq => eq.id === requiresItem);
                return (
                  <button
                    key={index}
                    onClick={() => hasItem && onEventChoice(index)}
                    className={`event-option-btn ${!hasItem ? 'locked' : ''}`}
                    disabled={!hasItem}
                  >
                    <span className="option-text">
                      {!hasItem && <span className="lock-icon">🔒 </span>}
                      {option.text}
                    </span>
                    {!hasItem && <span className="locked-hint">Requires gear</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Result Card (bottom-anchored, inline) ── */}
        {hasResult && !hasEvent && (
          <div className="event-overlay result-overlay">
            <div className={`result-card ${gameState.resultMessage.isSuccess ? 'success' : 'failure'}`}>
              <h3 className="result-title">{gameState.resultMessage.title}</h3>
              <p className="result-text">{gameState.resultMessage.text}</p>
              <button className="result-confirm-btn" onClick={onDismissResult}>Continue</button>
            </div>
          </div>
        )}

        {/* ── Status Dashboard Panel ── */}
        {activePanel === 'status' && (
          <div className="panel-overlay" onClick={() => setActivePanel(null)}>
            <div className="dashboard-panel" onClick={e => e.stopPropagation()}>
              <div className="panel-header">
                <h3>Status Dashboard</h3>
                <button className="panel-close" onClick={() => setActivePanel(null)}>×</button>
              </div>

              {/* Route Progress */}
              <div className="dash-section">
                <h4 className="dash-section-title">Journey Progress</h4>
                <div className="route-progress">
                  <div className="route-progress-bar">
                    <div className="route-progress-fill" style={{ width: `${progressPct}%` }}></div>
                    {LANDMARKS.map(lm => {
                      const pct = (lm.distance / TOTAL_MILES) * 100;
                      const reached = (gameState.distance || 0) >= lm.distance;
                      const isCurrent = gameState.currentLocation === lm.id;
                      return (
                        <div
                          key={lm.id}
                          className={`route-dot ${reached ? 'reached' : ''} ${isCurrent ? 'current' : ''} ${lm.type === 'pass' ? 'danger' : ''}`}
                          style={{ left: `${pct}%` }}
                          title={lm.name}
                        />
                      );
                    })}
                  </div>
                  <div className="route-progress-labels">
                    <span>🇲🇽 Campo</span>
                    <span className="route-current">{currentLocation.name} — {progressPct.toFixed(1)}%</span>
                    <span>Monument 78 🇨🇦</span>
                  </div>
                </div>
              </div>

              {/* Info Cards */}
              <div className="dash-section">
                <div className="info-grid">
                  <div className="info-card">
                    <span className="info-icon">💰</span>
                    <span className="info-value">${(gameState.money || 0).toFixed(0)}</span>
                    <span className="info-label">Money</span>
                  </div>
                  <div className="info-card">
                    <span className="info-icon">⛰️</span>
                    <span className="info-value">{currentLocation.elevation.toLocaleString()} ft</span>
                    <span className="info-label">Elevation</span>
                  </div>
                  <div className="info-card">
                    <span className="info-icon">⚖️</span>
                    <span className="info-value">{(gameState.currentWeight || 0).toFixed(1)} kg</span>
                    <span className="info-label">Pack Weight</span>
                  </div>
                  <div className={`info-card ${(gameState.debuffs || []).length > 0 ? 'info-card-warn' : 'info-card-ok'}`}>
                    <span className="info-icon">{(gameState.debuffs || []).length > 0 ? '⚠️' : '✅'}</span>
                    <span className="info-value">{(gameState.debuffs || []).length > 0 ? 'Abnormal' : 'Normal'}</span>
                    <span className="info-label">Status</span>
                  </div>
                </div>
              </div>

              {/* Active Debuffs */}
              {(gameState.debuffs || []).length > 0 && (
                <div className="dash-section">
                  <h4 className="dash-section-title">Active Conditions</h4>
                  <div className="debuff-list">
                    {gameState.debuffs.map(d => (
                      <span key={d.id} className="debuff-tag-lg" style={{ '--debuff-color': d.color }}>
                        {d.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Vital Signs */}
              <div className="dash-section">
                <h4 className="dash-section-title">Vital Signs</h4>
                <div className="vital-bars">
                  {[
                    { icon: '❤️', label: 'Health', stat: 'health', cls: 'health', pct: gameState.health, display: Math.round(gameState.health) },
                    { icon: '⚡', label: 'Energy', stat: 'energy', cls: 'energy', pct: gameState.energy, display: Math.round(gameState.energy) },
                    { icon: '🧠', label: 'Mental', stat: 'mental', cls: 'mental', pct: gameState.mental || 100, display: Math.round(gameState.mental || 100) },
                    { icon: '🍽️', label: 'Food', stat: 'food', cls: 'food', pct: Math.min(100, ((gameState.food || 0) / 50) * 100), display: `${(gameState.food || 0).toFixed(1)}k` },
                    { icon: '💧', label: 'Water', stat: 'water', cls: 'water', pct: Math.min(100, ((gameState.water || 0) / 10) * 100), display: `${(gameState.water || 0).toFixed(1)}L` },
                  ].map(v => {
                    const rowDebuffs = (gameState.debuffs || []).filter(d => d.stat === v.stat);
                    return (
                      <div key={v.stat} className="vital-row">
                        <span className="vital-icon">{v.icon}</span>
                        <span className="vital-label">{v.label}</span>
                        <div className="vital-bar-col">
                          <div className="vital-bar-track">
                            <div className={`vital-bar-fill ${v.cls}`} style={{ width: `${v.pct}%` }}></div>
                          </div>
                          {rowDebuffs.length > 0 && (
                            <div className="vital-debuffs">
                              {rowDebuffs.map(d => (
                                <span key={d.id} className="debuff-tag-sm" style={{ background: d.color }}>{d.name}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className="vital-value">{v.display}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* LNT Score */}
              <div className="dash-section">
                <h4 className="dash-section-title">Leave No Trace</h4>
                <div className="lnt-display">
                  <div className="lnt-bar-track">
                    <div
                      className="lnt-bar-fill"
                      style={{
                        width: `${Math.min(100, ((gameState.lntScore || 100) / 200) * 100)}%`,
                        background: (gameState.lntScore || 100) > 120 ? '#10b981' : (gameState.lntScore || 100) < 80 ? '#ef4444' : '#fbbf24'
                      }}
                    ></div>
                  </div>
                  <span className="lnt-score-display">{gameState.lntScore || 100} / 200</span>
                </div>
              </div>

              {/* Equipment */}
              {gameState.equipment.length > 0 && (
                <div className="dash-section">
                  <h4 className="dash-section-title">Equipment</h4>
                  <div className="equip-grid">
                    {gameState.equipment.map((eq, i) => (
                      <div key={i} className="equip-item" title={eq.description}>
                        <span className="equip-name">{eq.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Journey Log */}
              <div className="dash-section">
                <h4 className="dash-section-title">Journey Log</h4>
                <div className="dash-log">
                  {gameState.log.length === 0 ? (
                    <p className="dash-log-empty">Your journey begins...</p>
                  ) : (
                    gameState.log.slice(0, 20).map((entry, i) => (
                      <div key={i} className="dash-log-entry">
                        <span className="dash-log-day">Day {Math.floor((entry.time || 0) / 24) + 1}</span>
                        <span className="dash-log-msg">{entry.message}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Settings */}
              <div className="dash-section">
                <h4 className="dash-section-title">Settings</h4>
                <div className="settings-row">
                  <span className="settings-label">Background Music</span>
                  <button className="settings-toggle" onClick={onToggleMusic}>
                    {musicOn ? '🔊 On' : '🔇 Off'}
                  </button>
                </div>
              </div>

              {/* Save & Quit */}
              <div className="dash-section dash-actions-section">
                <button className="dash-leave-btn" onClick={() => { setActivePanel(null); onLeaveTemporarily(); }}>
                  Leave Temporarily
                </button>
                <button className="dash-abandon-btn" onClick={() => { setActivePanel(null); onAbandonChallenge(); }}>
                  Abandon Challenge
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Backpack Panel ── */}
        {activePanel === 'backpack' && (
          <div className="panel-overlay" onClick={() => setActivePanel(null)}>
            <div className="backpack-panel" onClick={e => e.stopPropagation()}>
              <div className="panel-header">
                <h3>Backpack</h3>
                <button className="panel-close" onClick={() => setActivePanel(null)}>×</button>
              </div>

              {/* Inventory */}
              <div className="dash-section">
                <h4 className="dash-section-title">Equipped Items</h4>
                {gameState.equipment.length === 0 ? (
                  <p className="dash-log-empty">No equipment</p>
                ) : (
                  <div className="equip-grid">
                    {gameState.equipment.map((eq, i) => (
                      <div key={i} className="equip-item">
                        <span className="equip-name">{eq.name}</span>
                        <span className="equip-weight">{eq.weight}kg</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="weight-display">
                  ⚖️ {(gameState.currentWeight || 0).toFixed(1)} / {gameState.maxWeight} kg
                </div>
              </div>

              {/* Supplies */}
              <div className="dash-section">
                <h4 className="dash-section-title">Supplies</h4>
                <div className="supply-grid">
                  <div className="supply-item">
                    <span className="supply-icon">🍽️</span>
                    <span className="supply-value">{(gameState.food || 0).toFixed(1)}k cal</span>
                    <span className="supply-label">Food</span>
                  </div>
                  <div className="supply-item">
                    <span className="supply-icon">💧</span>
                    <span className="supply-value">{(gameState.water || 0).toFixed(1)}L</span>
                    <span className="supply-label">Water</span>
                  </div>
                  <div className="supply-item">
                    <span className="supply-icon">💰</span>
                    <span className="supply-value">${(gameState.money || 0).toFixed(0)}</span>
                    <span className="supply-label">Money</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="dash-section">
                <h4 className="dash-section-title">Quick Actions</h4>
                <div className="quick-actions">
                  <button
                    className="quick-action-btn rest"
                    onClick={() => { setActivePanel(null); onRest(); }}
                    disabled={gameState.isDead || gameState.isComplete || isBlocked}
                  >
                    <span className="qa-icon">⏱️</span>
                    <div className="qa-text">
                      <span className="qa-title">Rest in Place</span>
                      <span className="qa-desc">8h rest, recover energy & health</span>
                    </div>
                  </button>
                  {canResupply && (
                    <button
                      className="quick-action-btn resupply"
                      onClick={() => { setActivePanel(null); onResupply(); }}
                      disabled={gameState.isDead || gameState.isComplete || isBlocked}
                    >
                      <span className="qa-icon">🏪</span>
                      <div className="qa-text">
                        <span className="qa-title">Resupply Station</span>
                        <span className="qa-desc">Buy food, water & supplies</span>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Bottom Navigation ── */}
        <div className="bottom-nav">
          <button
            className={`nav-btn ${activePanel === 'status' ? 'active' : ''}`}
            onClick={() => togglePanel('status')}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-label">Status</span>
          </button>
          <button
            className="nav-btn walk-btn"
            onClick={onMoveForward}
            disabled={gameState.isDead || gameState.isComplete || isBlocked}
          >
            <span className="nav-icon">🥾</span>
            <span className="nav-label">Walk</span>
          </button>
          <button
            className={`nav-btn ${activePanel === 'backpack' ? 'active' : ''}`}
            onClick={() => togglePanel('backpack')}
          >
            <span className="nav-icon">🎒</span>
            <span className="nav-label">Pack</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameView;
