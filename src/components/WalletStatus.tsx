import React, { useState } from 'react';
import { useLoginWithAbstract } from "@abstract-foundation/agw-react";
import { useAccount } from 'wagmi';

const WalletStatus: React.FC = () => {
  const { login } = useLoginWithAbstract();
  const { address, isConnected } = useAccount();
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const handleConnect = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
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
         flexDirection: 'column',
         gap: '12px'
       }}>
         <a
           href="https://x.com/ChainSurvivors"
           target="_blank"
           rel="noopener noreferrer"
           style={{
             background: 'url("/assets/image.png")',
             backgroundSize: 'cover',
             backgroundPosition: 'center',
             backgroundRepeat: 'no-repeat',
             color: '#ffffff',
             border: '2px solid #8b0000',
             padding: '12px 18px',
             borderRadius: '12px',
             cursor: 'pointer',
             fontSize: '14px',
             fontWeight: 'bold',
             textDecoration: 'none',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             gap: '8px',
             transition: 'all 0.3s ease',
             boxShadow: '0 4px 8px rgba(0, 0, 0, 0.8)',
             textTransform: 'uppercase',
             letterSpacing: '2px',
             fontFamily: 'monospace',
             position: 'relative',
             overflow: 'hidden'
           }}
           onMouseEnter={(e) => {
             e.currentTarget.style.filter = 'brightness(1.2) contrast(1.1)';
             e.currentTarget.style.color = '#ffffff';
             e.currentTarget.style.transform = 'translateY(-1px)';
             e.currentTarget.style.boxShadow = '0 6px 12px rgba(139, 0, 0, 0.6)';
           }}
           onMouseLeave={(e) => {
             e.currentTarget.style.filter = 'brightness(1) contrast(1)';
             e.currentTarget.style.color = '#ffffff';
             e.currentTarget.style.transform = 'translateY(0)';
             e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.8)';
           }}
         >
           Twitter
         </a>
         <a
           href="https://t.me/ChainSurvivors"
           target="_blank"
           rel="noopener noreferrer"
           style={{
             background: 'url("/assets/image.png")',
             backgroundSize: 'cover',
             backgroundPosition: 'center',
             backgroundRepeat: 'no-repeat',
             color: '#ffffff',
             border: '2px solid #4a0080',
             padding: '12px 18px',
             borderRadius: '12px',
             cursor: 'pointer',
             fontSize: '14px',
             fontWeight: 'bold',
             textDecoration: 'none',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             gap: '8px',
             transition: 'all 0.3s ease',
             boxShadow: '0 4px 8px rgba(0, 0, 0, 0.8)',
             textTransform: 'uppercase',
             letterSpacing: '2px',
             fontFamily: 'monospace',
             position: 'relative',
             overflow: 'hidden'
           }}
           onMouseEnter={(e) => {
             e.currentTarget.style.filter = 'brightness(1.2) contrast(1.1)';
             e.currentTarget.style.color = '#ffffff';
             e.currentTarget.style.transform = 'translateY(-1px)';
             e.currentTarget.style.boxShadow = '0 6px 12px rgba(74, 0, 128, 0.6)';
           }}
           onMouseLeave={(e) => {
             e.currentTarget.style.filter = 'brightness(1) contrast(1)';
             e.currentTarget.style.color = '#ffffff';
             e.currentTarget.style.transform = 'translateY(0)';
             e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.8)';
           }}
         >
           Telegram
         </a>
                  <button
           onClick={() => setShowHowToPlay(true)}
           style={{
             background: 'url("/assets/image.png")',
             backgroundSize: 'cover',
             backgroundPosition: 'center',
             backgroundRepeat: 'no-repeat',
             color: '#ffffff',
             border: '2px solid #8b8b00',
             padding: '12px 18px',
             borderRadius: '12px',
             cursor: 'pointer',
             fontSize: '14px',
             fontWeight: 'bold',
             textDecoration: 'none',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             gap: '8px',
             transition: 'all 0.3s ease',
             boxShadow: '0 4px 8px rgba(0, 0, 0, 0.8)',
             textTransform: 'uppercase',
             letterSpacing: '2px',
             fontFamily: 'monospace',
             position: 'relative',
             overflow: 'hidden'
           }}
           onMouseEnter={(e) => {
             e.currentTarget.style.filter = 'brightness(1.2) contrast(1.1)';
             e.currentTarget.style.color = '#ffffff';
             e.currentTarget.style.transform = 'translateY(-1px)';
             e.currentTarget.style.boxShadow = '0 6px 12px rgba(139, 139, 0, 0.6)';
           }}
           onMouseLeave={(e) => {
             e.currentTarget.style.filter = 'brightness(1) contrast(1)';
             e.currentTarget.style.color = '#ffffff';
             e.currentTarget.style.transform = 'translateY(0)';
             e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.8)';
           }}
         >
           How To Play
         </button>

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
                background: 'url("/assets/image.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                color: '#cccccc',
                border: '2px solid #666666',
                padding: '12px 20px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                width: '100%',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.8)',
                fontFamily: 'monospace',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'brightness(1.2) contrast(1.1)';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.9)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'brightness(1) contrast(1)';
                e.currentTarget.style.color = '#cccccc';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.8)';
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

       {/* How To Play Modal */}
       {showHowToPlay && (
         <div style={{
           position: 'fixed',
           top: 0,
           left: 0,
           width: '100%',
           height: '100%',
           background: 'url("/assets/images/ui/background.gif")',
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundRepeat: 'no-repeat',
           zIndex: 2000,
           display: 'flex',
           justifyContent: 'center',
           alignItems: 'center',
           backdropFilter: 'blur(10px)'
         }}>
           <div style={{
             background: 'linear-gradient(145deg, #1e1e2e 0%, #2d2d44 100%)',
             border: '4px solid',
             borderImage: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #dda0dd, #98d8c8) 1',
             borderRadius: '20px',
             padding: '40px',
             maxWidth: '1200px',
             width: '95vw',
             maxHeight: '95vh',
             height: '95vh',
             overflow: 'hidden',
             position: 'relative',
             boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 107, 107, 0.3)',
             animation: 'modalSlideIn 0.5s ease-out'
           }}>
             {/* Close Button */}
             <button
               onClick={() => setShowHowToPlay(false)}
               style={{
                 position: 'fixed',
                 top: '20px',
                 right: '20px',
                 backgroundColor: 'rgba(255, 107, 107, 0.9)',
                 border: '3px solid #ff6b6b',
                 color: '#ffffff',
                 fontSize: '24px',
                 cursor: 'pointer',
                 fontWeight: 'bold',
                 borderRadius: '50%',
                 width: '45px',
                 height: '45px',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 transition: 'all 0.3s ease',
                 boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5)',
                 zIndex: 2001
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.backgroundColor = '#ff6b6b';
                 e.currentTarget.style.transform = 'scale(1.1)';
                 e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 107, 107, 0.6)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.backgroundColor = 'rgba(255, 107, 107, 0.9)';
                 e.currentTarget.style.transform = 'scale(1)';
                 e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.5)';
               }}
             >
               ×
             </button>

             {/* Header with animated background */}
             <div style={{
               background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)',
               backgroundSize: '400% 400%',
               animation: 'gradientShift 3s ease infinite',
               borderRadius: '15px',
               padding: '20px',
               marginBottom: '30px',
               textAlign: 'center',
               position: 'relative',
               overflow: 'hidden'
             }}>
               <div style={{
                 position: 'absolute',
                 top: 0,
                 left: 0,
                 right: 0,
                 bottom: 0,
                 background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                 animation: 'float 6s ease-in-out infinite'
               }}></div>
               <h2 style={{
                 color: '#ffffff',
                 fontSize: '32px',
                 fontWeight: 'bold',
                 textTransform: 'uppercase',
                 letterSpacing: '3px',
                 textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                 margin: 0,
                 position: 'relative',
                 zIndex: 1
               }}>
                 🎮 How To Play 🎮
               </h2>
             </div>

             <div style={{ 
               color: '#e0e0e0', 
               lineHeight: '1.8', 
               marginTop: '20px',
               height: 'calc(95vh - 200px)',
               overflowY: 'auto',
               paddingRight: '10px'
             }}>
               {/* Controls Section */}
               <div style={{
                 background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(78, 205, 196, 0.1) 100%)',
                 borderRadius: '15px',
                 padding: '25px',
                 marginBottom: '25px',
                 border: '2px solid rgba(255, 107, 107, 0.3)'
               }}>
                 <h3 style={{ 
                   color: '#ff6b6b', 
                   marginBottom: '15px', 
                   fontSize: '22px',
                   fontWeight: 'bold',
                   textTransform: 'uppercase',
                   letterSpacing: '1px',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   gap: '10px',
                   textAlign: 'center'
                 }}>
                   <span style={{ fontSize: '28px' }}>🎮</span> Controls
                 </h3>
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                   <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255, 107, 107, 0.2)' }}>
                     <strong style={{ color: '#ff6b6b' }}>WASD / Arrow Keys</strong>
                     <div style={{ color: '#b0b0b0', fontSize: '14px', marginTop: '5px' }}>Move your bee character</div>
                   </div>
                   <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(78, 205, 196, 0.2)' }}>
                     <strong style={{ color: '#4ecdc4' }}>Mouse</strong>
                     <div style={{ color: '#b0b0b0', fontSize: '14px', marginTop: '5px' }}>Aim and shoot projectiles</div>
                   </div>

                 </div>
               </div>

               {/* Game Mechanics Section */}
               <div style={{
                 background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.1) 0%, rgba(69, 183, 209, 0.1) 100%)',
                 borderRadius: '15px',
                 padding: '25px',
                 marginBottom: '25px',
                 border: '2px solid rgba(78, 205, 196, 0.3)'
               }}>
                 <h3 style={{ 
                   color: '#4ecdc4', 
                   marginBottom: '15px', 
                   fontSize: '22px',
                   fontWeight: 'bold',
                   textTransform: 'uppercase',
                   letterSpacing: '1px',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   gap: '10px',
                   textAlign: 'center'
                 }}>
                   <span style={{ fontSize: '28px' }}>⚡</span> Game Mechanics
                 </h3>
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                   <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(78, 205, 196, 0.2)' }}>
                     <strong style={{ color: '#4ecdc4' }}>Survive</strong>
                     <div style={{ color: '#b0b0b0', fontSize: '14px', marginTop: '5px' }}>Avoid enemies and stay alive</div>
                   </div>
                   <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(69, 183, 209, 0.2)' }}>
                     <strong style={{ color: '#45b7d1' }}>Kill Enemies</strong>
                     <div style={{ color: '#b0b0b0', fontSize: '14px', marginTop: '5px' }}>Shoot projectiles to defeat enemies</div>
                   </div>
                   <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(150, 206, 180, 0.2)' }}>
                     <strong style={{ color: '#96ceb4' }}>Collect XP</strong>
                     <div style={{ color: '#b0b0b0', fontSize: '14px', marginTop: '5px' }}>Gain experience by killing enemies</div>
                   </div>
                   <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255, 234, 167, 0.2)' }}>
                     <strong style={{ color: '#ffeaa7' }}>Level Up</strong>
                     <div style={{ color: '#b0b0b0', fontSize: '14px', marginTop: '5px' }}>Choose upgrades when you level up</div>
                   </div>
                 </div>
               </div>

               {/* Upgrades Section */}
               <div style={{
                 background: 'linear-gradient(135deg, rgba(69, 183, 209, 0.1) 0%, rgba(150, 206, 180, 0.1) 100%)',
                 borderRadius: '15px',
                 padding: '25px',
                 marginBottom: '25px',
                 border: '2px solid rgba(69, 183, 209, 0.3)'
               }}>
                 <h3 style={{ 
                   color: '#45b7d1', 
                   marginBottom: '15px', 
                   fontSize: '22px',
                   fontWeight: 'bold',
                   textTransform: 'uppercase',
                   letterSpacing: '1px',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   gap: '10px',
                   textAlign: 'center'
                 }}>
                   <span style={{ fontSize: '28px' }}>🔧</span> Upgrades Available
                 </h3>
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                   <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 107, 107, 0.2)' }}>
                     <strong style={{ color: '#ff6b6b', fontSize: '14px' }}>Increased Damage</strong>
                     <div style={{ color: '#b0b0b0', fontSize: '12px', marginTop: '3px' }}>More projectile damage</div>
                   </div>
                   <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(78, 205, 196, 0.2)' }}>
                     <strong style={{ color: '#4ecdc4', fontSize: '14px' }}>Attack Speed</strong>
                     <div style={{ color: '#b0b0b0', fontSize: '12px', marginTop: '3px' }}>Faster shooting</div>
                   </div>
                   <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(69, 183, 209, 0.2)' }}>
                     <strong style={{ color: '#45b7d1', fontSize: '14px' }}>Multi-Shot</strong>
                     <div style={{ color: '#b0b0b0', fontSize: '12px', marginTop: '3px' }}>Additional projectiles</div>
                   </div>
                   <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(150, 206, 180, 0.2)' }}>
                     <strong style={{ color: '#96ceb4', fontSize: '14px' }}>Larger Projectiles</strong>
                     <div style={{ color: '#b0b0b0', fontSize: '12px', marginTop: '3px' }}>Bigger projectile size</div>
                   </div>
                   <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 234, 167, 0.2)' }}>
                     <strong style={{ color: '#ffeaa7', fontSize: '14px' }}>Max Health</strong>
                     <div style={{ color: '#b0b0b0', fontSize: '12px', marginTop: '3px' }}>More health points</div>
                   </div>
                   <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(221, 160, 221, 0.2)' }}>
                     <strong style={{ color: '#dda0dd', fontSize: '14px' }}>Movement Speed</strong>
                     <div style={{ color: '#b0b0b0', fontSize: '12px', marginTop: '3px' }}>Faster movement</div>
                   </div>
                   <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(152, 216, 200, 0.2)' }}>
                     <strong style={{ color: '#98d8c8', fontSize: '14px' }}>Thunder Magic</strong>
                     <div style={{ color: '#b0b0b0', fontSize: '12px', marginTop: '3px' }}>Lightning strikes every 4s</div>
                   </div>
                   <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 107, 107, 0.2)' }}>
                     <strong style={{ color: '#ff6b6b', fontSize: '14px' }}>Magic Circle</strong>
                     <div style={{ color: '#b0b0b0', fontSize: '12px', marginTop: '3px' }}>Magical protection field</div>
                   </div>
                 </div>
               </div>

               {/* Tips Section */}
               <div style={{
                 background: 'linear-gradient(135deg, rgba(150, 206, 180, 0.1) 0%, rgba(255, 234, 167, 0.1) 100%)',
                 borderRadius: '15px',
                 padding: '25px',
                 marginBottom: '25px',
                 border: '2px solid rgba(150, 206, 180, 0.3)'
               }}>
                 <h3 style={{ 
                   color: '#96ceb4', 
                   marginBottom: '15px', 
                   fontSize: '22px',
                   fontWeight: 'bold',
                   textTransform: 'uppercase',
                   letterSpacing: '1px',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   gap: '10px',
                   textAlign: 'center'
                 }}>
                   <span style={{ fontSize: '28px' }}>🎯</span> Pro Tips
                 </h3>
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                   <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(150, 206, 180, 0.2)' }}>
                     <div style={{ color: '#96ceb4', fontSize: '14px' }}>Keep moving to avoid enemy attacks</div>
                   </div>
                   <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255, 234, 167, 0.2)' }}>
                     <div style={{ color: '#ffeaa7', fontSize: '14px' }}>Prioritize upgrades based on your playstyle</div>
                   </div>
                   <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(221, 160, 221, 0.2)' }}>
                     <div style={{ color: '#dda0dd', fontSize: '14px' }}>Watch for automatic thunder strikes</div>
                   </div>
                   <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(152, 216, 200, 0.2)' }}>
                     <div style={{ color: '#98d8c8', fontSize: '14px' }}>Try different character skins for variety</div>
                   </div>
                 </div>
               </div>

               {/* Character Skins Section */}
               <div style={{
                 background: 'linear-gradient(135deg, rgba(255, 234, 167, 0.1) 0%, rgba(221, 160, 221, 0.1) 100%)',
                 borderRadius: '15px',
                 padding: '25px',
                 border: '2px solid rgba(255, 234, 167, 0.3)'
               }}>
                 <h3 style={{ 
                   color: '#ffeaa7', 
                   marginBottom: '15px', 
                   fontSize: '22px',
                   fontWeight: 'bold',
                   textTransform: 'uppercase',
                   letterSpacing: '1px',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   gap: '10px',
                   textAlign: 'center'
                 }}>
                   Character Skins
                 </h3>
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                   <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255, 234, 167, 0.2)', textAlign: 'center' }}>
                     <img 
                       src="/assets/images/game/player1intro.png" 
                       alt="Survivor" 
                       style={{ 
                         width: '60px', 
                         height: '60px', 
                         marginBottom: '10px',
                         borderRadius: '8px'
                       }} 
                     />
                     <div><strong style={{ color: '#ffeaa7' }}>Survivor</strong></div>
                     <div style={{ color: '#b0b0b0', fontSize: '14px', marginTop: '5px' }}>Default character</div>
                   </div>
                   <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(221, 160, 221, 0.2)', textAlign: 'center' }}>
                     <img 
                       src="/assets/images/game/wizard1intro.png" 
                       alt="Wizard" 
                       style={{ 
                         width: '60px', 
                         height: '60px', 
                         marginBottom: '10px',
                         borderRadius: '8px'
                       }} 
                     />
                     <div><strong style={{ color: '#dda0dd' }}>Wizard</strong></div>
                     <div style={{ color: '#b0b0b0', fontSize: '14px', marginTop: '5px' }}>Magical character (premium)</div>
                   </div>
                   <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(152, 216, 200, 0.2)', textAlign: 'center' }}>
                     <img 
                       src="/assets/images/game/mesmer1intro.png" 
                       alt="Mesmer" 
                       style={{ 
                         width: '60px', 
                         height: '60px', 
                         marginBottom: '10px',
                         borderRadius: '8px'
                       }} 
                     />
                     <div><strong style={{ color: '#98d8c8' }}>Mesmer</strong></div>
                     <div style={{ color: '#b0b0b0', fontSize: '14px', marginTop: '5px' }}>Mystical character (premium)</div>
                   </div>
                 </div>
               </div>
             </div>

             <style>{`
               @keyframes modalSlideIn {
                 from {
                   opacity: 0;
                   transform: translateY(-50px) scale(0.9);
                 }
                 to {
                   opacity: 1;
                   transform: translateY(0) scale(1);
                 }
               }
               
               @keyframes gradientShift {
                 0%, 100% { background-position: 0% 50%; }
                 50% { background-position: 100% 50%; }
               }
               
               @keyframes float {
                 0%, 100% { transform: translateY(0px); }
                 50% { transform: translateY(-10px); }
               }
             `}</style>
           </div>
         </div>
       )}
      </>
   );
 };

export default WalletStatus;
