import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import MainScene from '../phaser/scenes/MainScene';
import SkinSelection from './SkinSelection';
import SelectedSpells from './SelectedSpells';

// Define available skins
export interface Skin {
  id: string;
  name: string;
  image: string;
  preview: string;
}

export const AVAILABLE_SKINS: Skin[] = [
  {
    id: 'default',
    name: 'Survivor',
    image: '/assets/images/game/player1.png',
    preview: '/assets/images/game/player1intro.png'
  },
  {
    id: 'wizard',
    name: 'Wizard',
    image: '/assets/images/game/wizard1.png',
    preview: '/assets/images/game/wizard1intro.png'
  },
  {
    id: 'mesmer',
    name: 'Mesmer',
    image: '/assets/images/game/mesmer1.png',
    preview: '/assets/images/game/mesmer1intro.png'
  }
];

const Game: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<'selection' | 'playing'>('selection');
  const [selectedSkin, setSelectedSkin] = useState<Skin>(AVAILABLE_SKINS[0]);

  const startGame = (skin: Skin) => {
    setSelectedSkin(skin);
    setGameState('playing');
  };

  const stopGame = () => {
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }
    setGameState('selection');
  };

  useEffect(() => {
    // Only create the game when in playing state
    if (gameState !== 'playing' || gameRef.current !== null) {
      return;
    }

    // Create a custom scene class that knows about the selected skin
    class GameScene extends MainScene {
      constructor() {
        super();
        this.setSelectedSkin(selectedSkin);
      }
    }

    // Game configuration
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1024,
      height: 768,
      parent: gameContainerRef.current || undefined,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      },
      backgroundColor: '#1d1805',
      scene: [GameScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    // Create new game instance
    gameRef.current = new Phaser.Game(config);

    // Cleanup function
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [gameState, selectedSkin]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {gameState === 'selection' ? (
        <SkinSelection 
          skins={AVAILABLE_SKINS}
          selectedSkin={selectedSkin}
          onSkinSelect={setSelectedSkin}
          onStartGame={startGame}
        />
      ) : (
        <>
          <div ref={gameContainerRef} style={{ width: '100%', height: '100%' }} />
          <SelectedSpells gameInstance={gameRef.current} />
          <button
            onClick={stopGame}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              padding: '10px 20px',
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              zIndex: 1000
            }}
          >
            Exit Game
          </button>
        </>
      )}
    </div>
  );
};

export default Game; 