import { useState } from 'react';
import { getRoutePoint, routeData, getTotalMiles } from '../data/route.js';
import './GameView.css';

const TOTAL_MILES = getTotalMiles();

const LANDMARKS = routeData.filter(
  p => p.type === 'resupply' || p.type === 'finish' || p.id === 11
);

function GameView({ gameState, onMoveForward, onRest, onEventChoice, onDismissResult, onResupply }) {
  const [logOpen, setLogOpen] = useState(false);
  const currentLocation = getRoutePoint(gameState.currentLocation) || { name: 'Unknown', elevation: 0 };
  const day = Math.floor((gameState.time || 0) / 24) + 1;
  const hour = Math.floor((gameState.time || 0) % 24);
  const minute = Math.floor(((gameState.time || 0) % 24 - hour) * 60);
  const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

  const weather = gameState.weather || { name: 'Clear', energyModifier: 0 };
  const temperature = gameState.temperature || 70;
  const progressPct = Math.min(100, ((gameState.distance || 0) / TOTAL_MILES) * 100);

  const getWeatherIcon = (weatherName) => {
    const icons = {
      'Clear': '☀️', 'Sunny': '☀️', 'Cloudy': '☁️', 'Rain': '🌧️',
      'Heavy Rain': '🌧️', 'Snow': '❄️', 'Blizzard': '❄️',
      'Fog': '🌫️', 'Thunderstorm': '⛈️', 'Extreme Heat': '🔥'
    };
    return icons[weatherName] || '☁️';
  };

  const hasEvent = !!gameState.currentEvent;
  const hasResult = !!gameState.resultMessage;
  const isBlocked = hasEvent || hasResult;

  return (
    <div className="game-view">
      <div className="game-background">
        <div className="game-status-bar">
          <div className="status-left">
            <span className="day-label">DAY {day}</span>
            <span className="location-label">📍 {currentLocation.name}</span>
          </div>
          <div className="status-center">
            <div className="status-item">
              <span className="status-icon">🔥</span>
              <div className="status-bar-container">
                <div className="status-bar-fill temp" style={{ width: `${Math.max(0, Math.min(100, (temperature / 100) * 100))}%` }}></div>
                <span className="status-value">{temperature.toFixed(1)}°F</span>
              </div>
            </div>
            <div className="status-item">
              <span className="status-icon">❤️</span>
              <div className="status-bar-container">
                <div className="status-bar-fill health" style={{ width: `${gameState.health}%` }}></div>
                <span className="status-value">{Math.round(gameState.health)}</span>
              </div>
            </div>
            <div className="status-item">
              <span className="status-icon">🧠</span>
              <div className="status-bar-container">
                <div className="status-bar-fill mental" style={{ width: `${gameState.mental || 100}%` }}></div>
                <span className="status-value">{Math.round(gameState.mental || 100)}</span>
              </div>
            </div>
            <div className="status-item">
              <span className="status-icon">⚡</span>
              <div className="status-bar-container">
                <div className="status-bar-fill energy" style={{ width: `${gameState.energy}%` }}></div>
                <span className="status-value">{Math.round(gameState.energy)}</span>
              </div>
            </div>
          </div>
          <div className="status-right">
            <span className="time-label">🕐 {timeString}</span>
            <span className="weather-label">
              {getWeatherIcon(weather.name)} {weather.name} {temperature.toFixed(0)}°
            </span>
            <span className="lnt-label" style={{ color: (gameState.lntScore || 100) > 100 ? '#10b981' : (gameState.lntScore || 100) < 100 ? '#ef4444' : '#fbbf24' }}>
              🌲 LNT: {gameState.lntScore || 100}
            </span>
            <span className="food-label">
              🍽️ Food: {(gameState.food || 0).toFixed(1)}k cal
            </span>
            <span className="money-label">
              💰 ${(gameState.money || 0).toFixed(0)}
            </span>
          </div>
        </div>

        {/* PCT Progress Bar */}
        <div className="progress-bar-wrapper">
          <div className="progress-bar-labels">
            <span>Campo 🇲🇽</span>
            <span className="progress-miles">{(gameState.distance || 0).toFixed(1)} / {TOTAL_MILES.toFixed(0)} mi ({progressPct.toFixed(1)}%)</span>
            <span>Monument 78 🇨🇦</span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progressPct}%` }}></div>
            {LANDMARKS.map(lm => {
              const pct = (lm.distance / TOTAL_MILES) * 100;
              const reached = (gameState.distance || 0) >= lm.distance;
              return (
                <div
                  key={lm.id}
                  className={`progress-landmark ${reached ? 'reached' : ''}`}
                  style={{ left: `${pct}%` }}
                  title={`${lm.name} (mi ${lm.distance})`}
                >
                  <div className="landmark-dot"></div>
                  <span className="landmark-name">{lm.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {hasEvent && (
          <div className="event-overlay">
            <div className="event-card">
              <h3 className="event-title">{gameState.currentEvent.name}</h3>
              <p className="event-description">{gameState.currentEvent.description}</p>
              <div className="event-options">
                {gameState.currentEvent.options.map((option, index) => (
                  <button key={index} onClick={() => onEventChoice(index)} className="event-option-btn">
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {hasResult && !hasEvent && (
          <div className="event-overlay">
            <div className={`result-card ${gameState.resultMessage.isSuccess ? 'success' : 'failure'}`}>
              <h3 className="result-title">{gameState.resultMessage.title}</h3>
              <p className="result-text">{gameState.resultMessage.text}</p>
              <button className="result-confirm-btn" onClick={onDismissResult}>Continue</button>
            </div>
          </div>
        )}

        {/* Log Toggle Button */}
        <button className="log-toggle-btn" onClick={() => setLogOpen(!logOpen)}>
          📜 {logOpen ? 'Hide' : 'Log'} {!logOpen && gameState.log.length > 0 && <span className="log-badge">{gameState.log.length}</span>}
        </button>

        {/* Log Panel */}
        {logOpen && (
          <div className="log-panel-overlay">
            <div className="log-panel-game">
              <div className="log-panel-header">
                <h3>Journey Log</h3>
                <button className="log-close-btn" onClick={() => setLogOpen(false)}>×</button>
              </div>
              <div className="log-panel-content">
                {gameState.log.length === 0 ? (
                  <p className="log-empty">Your journey begins...</p>
                ) : (
                  gameState.log.map((entry, i) => (
                    <div key={i} className="log-entry-game">
                      <span className="log-time-game">Day {Math.floor((entry.time || 0) / 24) + 1}</span>
                      <span className="log-msg-game">{entry.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        <div className="game-actions">
          <button onClick={onMoveForward} className="action-btn primary" disabled={gameState.isDead || gameState.isComplete || isBlocked}>
            Move Forward
          </button>
          <button onClick={onRest} className="action-btn secondary" disabled={gameState.isDead || gameState.isComplete || isBlocked}>
            Rest
          </button>
          {currentLocation.type === 'resupply' || currentLocation.type === 'camp' ? (
            <button onClick={onResupply} className="action-btn resupply" disabled={gameState.isDead || gameState.isComplete || isBlocked}>
              🏪 Resupply
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default GameView;
