import React from 'react';
import './styles/App.css';
import Game from './components/Game';
import AbstractProvider from './components/AbstractProvider';
import WalletStatus from './components/WalletStatus';

// Define public paths for images
const headerImage = '/assets/images/ui/beeware-header.png';
const borderImage = '/assets/images/ui/beeware-border.png';

const App: React.FC = () => {
  return (
    <AbstractProvider>
      <div className="App">
        <WalletStatus />
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
      </div>
    </AbstractProvider>
  );
}

export default App;
