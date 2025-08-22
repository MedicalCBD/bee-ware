import React from 'react';
import { useLoginWithAbstract } from "@abstract-foundation/agw-react";
import { useAccount } from 'wagmi';

const WalletStatus: React.FC = () => {
  const { login } = useLoginWithAbstract();
  const { address, isConnected } = useAccount();

  const handleConnect = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnect = () => {
    // Abstract Global Wallet doesn't have a direct disconnect method
    // The wallet will remain connected until the user manually disconnects
    console.log('Wallet will remain connected. User can disconnect manually from the wallet interface.');
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '20px',
      zIndex: 1000,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: '15px',
      borderRadius: '10px',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      minWidth: '250px'
    }}>
      {!isConnected ? (
        <div>
          <h3 style={{ margin: '0 0 10px 0', color: '#ffd700' }}>🔗 Connect Wallet</h3>
          <button
            onClick={handleConnect}
            style={{
              backgroundColor: '#ffd700',
              color: '#000',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ffed4e';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffd700';
            }}
          >
            Connect with Abstract Global Wallet
          </button>
        </div>
      ) : (
        <div>
          <h3 style={{ margin: '0 0 10px 0', color: '#00ff00' }}>✅ Wallet Connected</h3>
          <div style={{ fontSize: '12px', marginBottom: '8px' }}>
            <strong>Address:</strong><br />
            <span style={{ 
              fontFamily: 'monospace', 
              fontSize: '10px',
              wordBreak: 'break-all'
            }}>
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          </div>
          <button
            onClick={handleDisconnect}
            style={{
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '12px',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ff6666';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ff4444';
            }}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletStatus;
