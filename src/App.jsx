import { useState, useCallback } from 'react';
import { GameState } from './game/gameState.js';
import MainMenu from './components/MainMenu.jsx';
import Shop from './components/Shop.jsx';
import GameView from './components/GameView.jsx';
import './App.css';

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

  const handleStart = () => {
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
        setTimeout(() => setCurrentView(GAME_STATES.GAME_OVER), 0);
      } else if (newState.isComplete) {
        setTimeout(() => setCurrentView(GAME_STATES.GAME_COMPLETE), 0);
      }
      
      return newState;
    });
  }, []);

  const handleRest = useCallback(() => {
    setGameState(prev => {
      const newState = cloneGameState(prev);
      newState.rest();
      
      if (newState.isDead) {
        setTimeout(() => setCurrentView(GAME_STATES.GAME_OVER), 0);
      }
      
      return newState;
    });
  }, []);

  const handleEventChoice = useCallback((optionIndex) => {
    setGameState(prev => {
      const newState = cloneGameState(prev);
      
      // Handle the event
      const handled = newState.handleEvent(optionIndex);
      
      // Explicitly ensure currentEvent is null after handling
      if (handled) {
        newState.currentEvent = null;
      }
      
      if (newState.isDead) {
        setTimeout(() => setCurrentView(GAME_STATES.GAME_OVER), 0);
      } else if (newState.isComplete) {
        setTimeout(() => setCurrentView(GAME_STATES.GAME_COMPLETE), 0);
      }
      
      return newState;
    });
  }, []);

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
        />
      )}

      {showAbout && currentView === GAME_STATES.MENU && (
        <div className="about-overlay">
          <div className="about-panel">
            <button className="close-btn" onClick={() => setShowAbout(false)}>×</button>
            <h3>About This Game</h3>
            <p>
              This is a survival simulation game based on the Pacific Crest Trail, 
              one of America's most challenging long-distance hiking trails. The game 
              uses realistic geography, weather patterns, and survival mechanics to 
              simulate the harsh reality of long-distance hiking.
            </p>
            <p>
              <strong>This game is not meant to encourage reckless adventure.</strong> 
              Instead, it aims to help players understand the power of nature and the 
              fragility of human life. Through simulation, we hope players will respect 
              nature and value life, participating in outdoor activities scientifically 
              and safely.
            </p>
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
            onConfirm={() => setCurrentView(GAME_STATES.GAME)}
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

      {currentView === GAME_STATES.GAME_OVER && (
        <div className="game-over-screen">
          <div className="game-over-content">
            <h2>Game Over</h2>
            <p>You have died on the trail.</p>
            <p className="death-message">{gameState.log[0]?.message || "Your journey has ended."}</p>
            <button onClick={handleReset} className="btn-primary">Start Over</button>
          </div>
        </div>
      )}

      {currentView === GAME_STATES.GAME_COMPLETE && (
        <div className="game-complete-screen">
          <div className="game-complete-content">
            <h2>Congratulations!</h2>
            <p>You've completed the Pacific Crest Trail!</p>
            <div className="stats-summary">
              <p>Total Distance: {gameState.distance.toFixed(1)} miles</p>
              <p>Total Time: {Math.floor(gameState.time / 24)} days {Math.floor(gameState.time % 24)} hours</p>
            </div>
            <button onClick={handleReset} className="btn-primary">Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
