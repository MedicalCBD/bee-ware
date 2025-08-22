import React, { useState, useEffect } from 'react';
import { DailyGamesManager } from '../utils/DailyGamesManager';

interface DailyGamesUIProps {
  onGameStart: () => void;
}

const DailyGamesUI: React.FC<DailyGamesUIProps> = ({ onGameStart }) => {
  const [gamesRemaining, setGamesRemaining] = useState(0);
  const [timeUntilReset, setTimeUntilReset] = useState('');
  const [canPlay, setCanPlay] = useState(false);
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    const updateUI = () => {
      const remaining = DailyGamesManager.getGamesRemainingToday();
      const timeReset = DailyGamesManager.getTimeUntilResetFormatted();
      const canPlayGame = DailyGamesManager.canPlayGame();
      const isDevelopment = DailyGamesManager.isDevelopmentMode();

      setGamesRemaining(remaining);
      setTimeUntilReset(timeReset);
      setCanPlay(canPlayGame);
      setIsDev(isDevelopment);
    };

    // Update immediately
    updateUI();

    // Update every minute
    const interval = setInterval(updateUI, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleStartGame = () => {
    if (canPlay) {
      DailyGamesManager.recordGamePlayed();
      onGameStart();
    }
  };

  const handleResetGames = () => {
    if (isDev) {
      DailyGamesManager.resetGamesForTesting();
      // Force UI update
      const remaining = DailyGamesManager.getGamesRemainingToday();
      const canPlayGame = DailyGamesManager.canPlayGame();
      setGamesRemaining(remaining);
      setCanPlay(canPlayGame);
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderRadius: '10px',
      padding: '15px',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      zIndex: 1000,
      minWidth: '220px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <span style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#ffd700'
        }}>
          🎮 Daily Games
        </span>
        {isDev && (
          <span style={{
            fontSize: '10px',
            color: '#00ff00',
            marginLeft: '10px',
            backgroundColor: '#00ff00',
            color: '#000',
            padding: '2px 6px',
            borderRadius: '10px',
            fontWeight: 'bold'
          }}>
            DEV
          </span>
        )}
      </div>
      
      <div style={{
        marginBottom: '10px'
      }}>
        <div style={{
          fontSize: '14px',
          marginBottom: '5px'
        }}>
          Games Remaining: <span style={{ color: canPlay ? '#00ff00' : '#ff4444' }}>{gamesRemaining}/{DailyGamesManager.getMaxGamesPerDayDisplay()}</span>
        </div>
        
        {!isDev && (
          <div style={{
            fontSize: '12px',
            color: '#cccccc'
          }}>
            Reset in: {timeUntilReset}
          </div>
        )}

        {isDev && (
          <div style={{
            fontSize: '12px',
            color: '#00ff00'
          }}>
            Development Mode - Unlimited Games
          </div>
        )}
      </div>

      <button
        onClick={handleStartGame}
        disabled={!canPlay}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: canPlay ? '#4CAF50' : '#666666',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: canPlay ? 'pointer' : 'not-allowed',
          fontSize: '14px',
          fontWeight: 'bold',
          transition: 'background-color 0.3s',
          marginBottom: '8px'
        }}
        onMouseEnter={(e) => {
          if (canPlay) {
            e.currentTarget.style.backgroundColor = '#45a049';
          }
        }}
        onMouseLeave={(e) => {
          if (canPlay) {
            e.currentTarget.style.backgroundColor = '#4CAF50';
          }
        }}
      >
        {canPlay ? 'Start Game' : 'No Games Left'}
      </button>

      {isDev && (
        <button
          onClick={handleResetGames}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#ff9800',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f57c00';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ff9800';
          }}
        >
          Reset Games (DEV)
        </button>
      )}

      {!canPlay && !isDev && (
        <div style={{
          fontSize: '11px',
          color: '#ff8888',
          marginTop: '8px',
          textAlign: 'center'
        }}>
          Come back tomorrow for more games!
        </div>
      )}
    </div>
  );
};

export default DailyGamesUI;
