import { getRoutePoint } from '../data/route.js';
import './GameView.css';

function GameView({ gameState, onMoveForward, onRest, onEventChoice, onDismissResult, onResupply }) {
  const currentLocation = getRoutePoint(gameState.currentLocation) || { name: 'Unknown', elevation: 0 };
  const day = Math.floor((gameState.time || 0) / 24) + 1;
  const hour = Math.floor((gameState.time || 0) % 24);
  const minute = Math.floor(((gameState.time || 0) % 24 - hour) * 60);
  const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  
  // Safe access to weather
  const weather = gameState.weather || { name: 'Clear', energyModifier: 0 };
  const temperature = gameState.temperature || 70;

  const getWeatherIcon = (weatherName) => {
    const icons = {
      'Clear': '☀️',
      'Sunny': '☀️',
      'Cloudy': '☁️',
      'Rain': '🌧️',
      'Heavy Rain': '🌧️',
      'Snow': '❄️',
      'Blizzard': '❄️',
      'Fog': '🌫️',
      'Thunderstorm': '⛈️',
      'Extreme Heat': '🔥'
    };
    return icons[weatherName] || '☁️';
  };

  // Check if there's a blocking UI element
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
                <div 
                  className="status-bar-fill temp"
                  style={{ width: `${Math.max(0, Math.min(100, (temperature / 100) * 100))}%` }}
                ></div>
                <span className="status-value">{temperature.toFixed(1)}°F</span>
              </div>
            </div>
            <div className="status-item">
              <span className="status-icon">❤️</span>
              <div className="status-bar-container">
                <div 
                  className="status-bar-fill health"
                  style={{ width: `${gameState.health}%` }}
                ></div>
                <span className="status-value">{Math.round(gameState.health)}</span>
              </div>
            </div>
            <div className="status-item">
              <span className="status-icon">🧠</span>
              <div className="status-bar-container">
                <div 
                  className="status-bar-fill mental"
                  style={{ width: `${gameState.mental || 100}%` }}
                ></div>
                <span className="status-value">{Math.round(gameState.mental || 100)}</span>
              </div>
            </div>
            <div className="status-item">
              <span className="status-icon">⚡</span>
              <div className="status-bar-container">
                <div 
                  className="status-bar-fill energy"
                  style={{ width: `${gameState.energy}%` }}
                ></div>
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

        {/* Event Card */}
        {hasEvent && (
          <div className="event-overlay">
            <div className="event-card">
              <h3 className="event-title">{gameState.currentEvent.name}</h3>
              <p className="event-description">{gameState.currentEvent.description}</p>
              <div className="event-options">
                {gameState.currentEvent.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => onEventChoice(index)}
                    className="event-option-btn"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Result Message Card */}
        {hasResult && !hasEvent && (
          <div className="event-overlay">
            <div className={`result-card ${gameState.resultMessage.isSuccess ? 'success' : 'failure'}`}>
              <h3 className="result-title">{gameState.resultMessage.title}</h3>
              <p className="result-text">{gameState.resultMessage.text}</p>
              <button 
                className="result-confirm-btn"
                onClick={onDismissResult}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        <div className="game-actions">
          <button 
            onClick={onMoveForward} 
            className="action-btn primary"
            disabled={gameState.isDead || gameState.isComplete || isBlocked}
          >
            Move Forward
          </button>
          <button 
            onClick={onRest} 
            className="action-btn secondary"
            disabled={gameState.isDead || gameState.isComplete || isBlocked}
          >
            Rest
          </button>
          {currentLocation.type === 'resupply' || currentLocation.type === 'camp' ? (
            <button 
              onClick={onResupply} 
              className="action-btn resupply"
              disabled={gameState.isDead || gameState.isComplete || isBlocked}
            >
              🏪 Resupply
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default GameView;
