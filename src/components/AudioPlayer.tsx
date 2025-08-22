import React, { useState, useEffect, useRef } from 'react';

interface AudioPlayerProps {
  isPlaying: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ isPlaying }) => {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Set volume to 30%
      audioRef.current.loop = true; // Loop the music
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && !isMuted) {
        audioRef.current.play().catch(error => {
          console.log('Audio play failed:', error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/assets/images/ui/song.mp3"
        preload="auto"
      />
      
             {/* Mute Button */}
       <button
         onClick={toggleMute}
         style={{
           position: 'fixed',
           bottom: '20px',
           right: '20px',
           zIndex: 1000,
           backgroundColor: isMuted ? '#00ff00' : '#ff4444',
           color: isMuted ? '#000' : 'white',
           border: '2px solid #00ff00',
           padding: '12px',
           borderRadius: '50%',
           cursor: 'pointer',
           fontSize: '18px',
           fontWeight: 'bold',
           width: '50px',
           height: '50px',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           transition: 'all 0.3s ease',
           boxShadow: '0 4px 15px rgba(0, 255, 0, 0.3)',
           fontFamily: 'monospace'
         }}
         onMouseEnter={(e) => {
           e.currentTarget.style.transform = 'scale(1.1)';
           e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 255, 0, 0.5)';
         }}
         onMouseLeave={(e) => {
           e.currentTarget.style.transform = 'scale(1)';
           e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 255, 0, 0.3)';
         }}
         title={isMuted ? 'Unmute' : 'Mute'}
       >
         {isMuted ? '🔊' : '🔇'}
       </button>
    </>
  );
};

export default AudioPlayer;
