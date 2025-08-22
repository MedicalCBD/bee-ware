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
    <>
             {/* Social Media Buttons */}
       <div style={{
         position: 'fixed',
         top: '20px',
         right: '20px',
         zIndex: 1000,
         display: 'flex',
         gap: '12px'
       }}>
         <a
           href="https://twitter.com/bee_ware_game"
           target="_blank"
           rel="noopener noreferrer"
           style={{
             backgroundColor: '#2d5a2d',
             color: '#00ff00',
             border: '2px solid #00ff00',
             padding: '12px 18px',
             borderRadius: '8px',
             cursor: 'pointer',
             fontSize: '14px',
             fontWeight: 'bold',
             textDecoration: 'none',
             display: 'flex',
             alignItems: 'center',
             gap: '8px',
             transition: 'all 0.3s ease',
             boxShadow: '0 4px 8px rgba(0, 255, 0, 0.2)',
             textTransform: 'uppercase',
             letterSpacing: '1px'
           }}
           onMouseEnter={(e) => {
             e.currentTarget.style.backgroundColor = '#00ff00';
             e.currentTarget.style.color = '#000';
             e.currentTarget.style.transform = 'translateY(-2px)';
             e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 255, 0, 0.4)';
           }}
           onMouseLeave={(e) => {
             e.currentTarget.style.backgroundColor = '#2d5a2d';
             e.currentTarget.style.color = '#00ff00';
             e.currentTarget.style.transform = 'translateY(0)';
             e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 255, 0, 0.2)';
           }}
         >
           Twitter
         </a>
         <a
           href="https://t.me/bee_ware_game"
           target="_blank"
           rel="noopener noreferrer"
           style={{
             backgroundColor: '#2d5a2d',
             color: '#00ff00',
             border: '2px solid #00ff00',
             padding: '12px 18px',
             borderRadius: '8px',
             cursor: 'pointer',
             fontSize: '14px',
             fontWeight: 'bold',
             textDecoration: 'none',
             display: 'flex',
             alignItems: 'center',
             gap: '8px',
             transition: 'all 0.3s ease',
             boxShadow: '0 4px 8px rgba(0, 255, 0, 0.2)',
             textTransform: 'uppercase',
             letterSpacing: '1px'
           }}
           onMouseEnter={(e) => {
             e.currentTarget.style.backgroundColor = '#00ff00';
             e.currentTarget.style.color = '#000';
             e.currentTarget.style.transform = 'translateY(-2px)';
             e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 255, 0, 0.4)';
           }}
           onMouseLeave={(e) => {
             e.currentTarget.style.backgroundColor = '#2d5a2d';
             e.currentTarget.style.color = '#00ff00';
             e.currentTarget.style.transform = 'translateY(0)';
             e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 255, 0, 0.2)';
           }}
         >
           Telegram
         </a>
       </div>

             {/* Wallet Status */}
       <div style={{
         position: 'fixed',
         top: '20px',
         left: '20px',
         zIndex: 1000,
         display: 'flex',
         flexDirection: 'column',
         gap: '15px'
       }}>
         <div style={{
           backgroundColor: 'rgba(0, 0, 0, 0.9)',
           padding: '15px',
           borderRadius: '12px',
           color: 'white',
           fontFamily: 'Arial, sans-serif',
           width: '300px',
           border: '2px solid #00ff00',
           boxShadow: '0 8px 32px rgba(0, 255, 0, 0.3)'
         }}>
       {!isConnected ? (
         <div>
            <button
              onClick={handleConnect}
              style={{
                backgroundColor: '#00ff00',
                color: '#000',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                width: '100%',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0, 255, 0, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2d5a2d';
                e.currentTarget.style.color = '#00ff00';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 255, 0, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#00ff00';
                e.currentTarget.style.color = '#000';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 255, 0, 0.4)';
              }}
            >
              Connect
            </button>
         </div>
       ) : (
                   <div>
            <h3 style={{ 
              margin: '0 0 12px 0', 
              color: '#00ff00', 
              fontSize: '16px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              textAlign: 'center'
            }}>
              ✅ Connected
            </h3>
            
            <div style={{ 
              fontSize: '11px', 
              marginBottom: '12px',
              backgroundColor: 'rgba(0, 255, 0, 0.1)',
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #00ff00',
              textAlign: 'center'
            }}>
              <strong style={{ color: '#00ff00', fontSize: '10px' }}>Address:</strong><br />
              <span style={{ 
                fontFamily: 'monospace', 
                fontSize: '9px',
                wordBreak: 'break-all',
                color: '#cccccc'
              }}>
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
            

          </div>
       )}
         </div>
         
         {/* Notice Container */}
         <div style={{
           backgroundColor: 'rgba(0, 0, 0, 0.9)',
           padding: '15px',
           borderRadius: '12px',
           color: 'white',
           fontFamily: 'Arial, sans-serif',
           width: '300px',
           border: '2px solid #00ff00',
           boxShadow: '0 8px 32px rgba(0, 255, 0, 0.3)'
         }}>
           <div style={{
             backgroundColor: 'rgba(0, 255, 0, 0.1)',
             border: '1px solid #00ff00',
             borderRadius: '6px',
             padding: '12px',
             fontSize: '14px',
             lineHeight: '1.5'
           }}>
             <div style={{ color: '#00ff00', marginBottom: '10px', fontWeight: 'bold', fontSize: '15px' }}>
               ⚠️ Notice
             </div>
             <div style={{ color: '#cccccc', fontSize: '13px' }}>
               • Ignore wallet until tomorrow<br/>
               • All skins unlocked for testing<br/>
               • Wizard & Mesmer locked tomorrow<br/>
               • Premium skins for purchasers only<br/>
               • 50% of purchases goes to $CHAIN<br/>
               • 50% goes to team
             </div>
           </div>
         </div>
       </div>
      </>
   );
 };

export default WalletStatus;
