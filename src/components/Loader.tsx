import React from 'react';

interface LoaderProps {
  onPlayClick: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onPlayClick }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #1d1805 0%, #2d1b0e 100%)',
      zIndex: 9999
    }}>
      {/* Background Animation */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url(/assets/images/ui/storm.gif)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.3,
        zIndex: -1
      }} />
      
      {/* Game Title */}
      <div style={{
        marginBottom: '60px',
        textAlign: 'center',
        zIndex: 1
      }}>
        <h1 style={{
          fontSize: '64px',
          margin: '0 0 20px 0',
          color: '#00ff00',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 30px rgba(0, 255, 0, 0.6)',
          fontWeight: 'bold',
          fontFamily: '"Creepster", "Chiller", "Impact", cursive',
          letterSpacing: '3px',
          textTransform: 'uppercase'
        }}>
          Chain Survivors
        </h1>
        <p style={{
          fontSize: '20px',
          margin: '0',
          color: '#cccccc',
          opacity: 0.9,
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
          fontFamily: 'Arial, sans-serif'
        }}>
          Choose your Survivor and start how you die ..or not
        </p>
      </div>

      {/* Play Button */}
      <button
        onClick={onPlayClick}
        style={{
          padding: '20px 50px',
          fontSize: '28px',
          fontWeight: 'bold',
          backgroundColor: '#00ff00',
          color: '#000',
          border: 'none',
          borderRadius: '30px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 8px 25px rgba(0, 255, 0, 0.4), 0 0 30px rgba(0, 255, 0, 0.2)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          fontFamily: '"Creepster", "Chiller", "Impact", cursive',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 255, 0, 0.6), 0 0 40px rgba(0, 255, 0, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 255, 0, 0.4), 0 0 30px rgba(0, 255, 0, 0.2)';
        }}
      >
                 Play Game
      </button>

      {/* Loading Text */}
      <div style={{
        marginTop: '40px',
        color: '#00ff00',
        fontSize: '16px',
        opacity: 0.8,
        textAlign: 'center',
        fontFamily: 'monospace',
        textShadow: '0 0 10px rgba(0, 255, 0, 0.5)'
      }}>
        Ready to survive...
      </div>
    </div>
  );
};

export default Loader;
