import React from 'react';
import { Skin } from './Game';
import { DailyGamesManager } from '../utils/DailyGamesManager';

interface SkinSelectionProps {
  skins: Skin[];
  selectedSkin: Skin;
  onSkinSelect: (skin: Skin) => void;
  onStartGame: (skin: Skin) => void;
}

const SkinSelection: React.FC<SkinSelectionProps> = ({
  skins,
  selectedSkin,
  onSkinSelect,
  onStartGame
}) => {
  const canPlay = DailyGamesManager.canPlayGame();
  const isDev = DailyGamesManager.isDevelopmentMode();
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #1d1805 0%, #2d1b0e 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Title */}
      <div style={{
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '48px',
          margin: '0 0 10px 0',
          color: '#ffd700',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          fontWeight: 'bold'
        }}>
          BEE-WARE
        </h1>
        <p style={{
          fontSize: '18px',
          margin: '0',
          color: '#cccccc',
          opacity: 0.8
        }}>
          Choose your bee and start the adventure!
        </p>
        {!isDev && (
          <p style={{
            fontSize: '14px',
            margin: '10px 0 0 0',
            color: '#ffd700',
            opacity: 0.9
          }}>
            🎮 3 games per day • Reset at midnight
          </p>
        )}
        {isDev && (
          <p style={{
            fontSize: '14px',
            margin: '10px 0 0 0',
            color: '#00ff00',
            opacity: 0.9
          }}>
            🛠️ Development Mode • Unlimited Games
          </p>
        )}
      </div>

      {/* Skin Selection */}
      <div style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '40px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {skins.map((skin) => (
          <div
            key={skin.id}
            onClick={() => onSkinSelect(skin)}
            style={{
              width: '150px',
              height: '200px',
              border: selectedSkin.id === skin.id ? '3px solid #ffd700' : '2px solid #666',
              borderRadius: '15px',
              padding: '15px',
              cursor: 'pointer',
              backgroundColor: selectedSkin.id === skin.id ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255, 255, 255, 0.05)',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Skin Image */}
            <div style={{
              width: '80px',
              height: '80px',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '10px'
            }}>
              <img
                src={skin.preview}
                alt={skin.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'
                }}
              />
            </div>

                         {/* Skin Name */}
             <h3 style={{
               margin: '0',
               fontSize: '16px',
               fontWeight: 'bold',
               textAlign: 'center',
               color: selectedSkin.id === skin.id ? '#ffd700' : '#ffffff'
             }}>
               {skin.name}
             </h3>
             
                           {/* Special Ability */}
              <p style={{
                margin: '5px 0 0 0',
                fontSize: '12px',
                textAlign: 'center',
                color: '#cccccc',
                opacity: 0.8
              }}>
                {skin.id === 'wizard' ? '✨ HP Regen +1/s' : 
                 skin.id === 'mesmer' ? '🔮 HP Regen +1/2s + Purple Trail' : 
                 '⚔️ Balanced'}
              </p>

            {/* Selection Indicator */}
            {selectedSkin.id === skin.id && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                width: '20px',
                height: '20px',
                backgroundColor: '#ffd700',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#000'
              }}>
                ✓
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Play Button */}
      <button
        onClick={() => onStartGame(selectedSkin)}
        disabled={!canPlay}
        style={{
          padding: '15px 40px',
          fontSize: '24px',
          fontWeight: 'bold',
          backgroundColor: canPlay ? '#ffd700' : '#666666',
          color: canPlay ? '#000' : '#999',
          border: 'none',
          borderRadius: '25px',
          cursor: canPlay ? 'pointer' : 'not-allowed',
          transition: 'all 0.3s ease',
          boxShadow: canPlay ? '0 4px 15px rgba(255, 215, 0, 0.3)' : 'none',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}
        onMouseEnter={(e) => {
          if (canPlay) {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (canPlay) {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.3)';
          }
        }}
      >
        {canPlay ? '🎮 Play Game' : 'No Games Left'}
      </button>

      {/* Instructions */}
      <div style={{
        marginTop: '30px',
        textAlign: 'center',
        opacity: 0.7
      }}>
        <p style={{
          margin: '5px 0',
          fontSize: '14px'
        }}>
          Use WASD or Arrow Keys to move
        </p>
        <p style={{
          margin: '5px 0',
          fontSize: '14px'
        }}>
          Collect experience orbs to level up
        </p>
        <p style={{
          margin: '5px 0',
          fontSize: '14px'
        }}>
          Survive as long as possible!
        </p>
      </div>
    </div>
  );
};

export default SkinSelection;
