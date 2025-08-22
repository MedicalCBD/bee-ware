import React, { useState } from 'react';
import './styles/App.css';
import Game from './components/Game';
import AbstractProvider from './components/AbstractProvider';
import WalletStatus from './components/WalletStatus';
import Loader from './components/Loader';
import AudioPlayer from './components/AudioPlayer';

// Define public paths for images
const headerImage = '/assets/images/ui/beeware-header.png';
const borderImage = '/assets/images/ui/beeware-border.png';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handlePlayClick = () => {
    setIsLoading(false);
  };

  return (
    <AbstractProvider>
      <div className="App">
        {isLoading ? (
          <Loader onPlayClick={handlePlayClick} />
        ) : (
          <>
            <WalletStatus />
            <AudioPlayer isPlaying={!isLoading} />
            <main>
              <div className="game-border-container">
                <img 
                  src={borderImage} 
                  alt="Game Border" 
                  className="game-border"
                />
                <div className="game-header">
                  <img 
                    src={headerImage} 
                    alt="Bee-Ware" 
                    className="header-image"
                  />
                </div>
                <div className="game-container">
                  <Game />
                </div>
              </div>
            </main>
          </>
        )}
      </div>
    </AbstractProvider>
  );
}

export default App;
