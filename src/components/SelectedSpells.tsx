import React, { useState, useEffect } from 'react';

interface Spell {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  icon: string;
}

interface SelectedSpellsProps {
  gameInstance?: any; // Phaser game instance
}

const SelectedSpells: React.FC<SelectedSpellsProps> = ({ gameInstance }) => {
  const [selectedSpells, setSelectedSpells] = useState<Spell[]>([]);
  const [debugInfo, setDebugInfo] = useState<string>('No game instance');

  useEffect(() => {
    if (!gameInstance) {
      setDebugInfo('No game instance');
      return;
    }

    // Function to update spells from the game
    const updateSpells = () => {
      try {
        const scene = gameInstance.scene.getScene('MainScene');
        if (!scene) {
          setDebugInfo('No MainScene found');
          return;
        }
        
        if (!scene.upgradeSystem) {
          setDebugInfo('No upgradeSystem found');
          return;
        }

        const acquiredUpgrades = scene.upgradeSystem.getAcquiredUpgrades();
        const availableUpgrades = scene.upgradeSystem.getAvailableUpgrades();
        
        console.log('Acquired upgrades:', acquiredUpgrades);
        console.log('Available upgrades:', availableUpgrades);
        
        const spells: Spell[] = [];
        
        // Convert acquired upgrades to spells
        for (const [upgradeId, level] of acquiredUpgrades.entries()) {
          const upgrade = availableUpgrades.find((u: any) => u.id === upgradeId);
          if (upgrade && level > 0) {
            spells.push({
              id: upgrade.id,
              name: upgrade.name,
              level: level,
              maxLevel: upgrade.maxLevel,
              icon: upgrade.icon
            });
          }
        }
        
        setSelectedSpells(spells);
        setDebugInfo(`Found ${spells.length} spells`);
        console.log('Updated spells:', spells);
      } catch (error) {
        console.error('Error updating spells:', error);
        setDebugInfo(`Error: ${error}`);
      }
    };

    // Update spells every second
    const interval = setInterval(updateSpells, 1000);
    
    // Initial update
    updateSpells();

    return () => clearInterval(interval);
  }, [gameInstance]);

  return (
    <div style={{
      position: 'fixed',
      top: '80px', // Below Twitter/Telegram buttons
      right: '20px',
      zIndex: 1000,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      padding: '15px',
      borderRadius: '12px',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      width: '280px',
      border: '2px solid #00ff00',
      boxShadow: '0 8px 32px rgba(0, 255, 0, 0.3)',
      maxHeight: '400px',
      overflowY: 'auto'
    }}>
      <div style={{
        color: '#00ff00',
        marginBottom: '15px',
        fontWeight: 'bold',
        fontSize: '16px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        textAlign: 'center',
        borderBottom: '1px solid #00ff00',
        paddingBottom: '8px'
      }}>
        🧙‍♂️ Selected Spells
      </div>
      
      {/* Debug Info */}
      <div style={{
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        border: '1px solid #ff0000',
        borderRadius: '6px',
        padding: '8px',
        marginBottom: '10px',
        fontSize: '10px',
        color: '#ff0000'
      }}>
        Debug: {debugInfo}
      </div>
      
      {selectedSpells.length === 0 ? (
        <div style={{
          color: '#cccccc',
          fontSize: '12px',
          textAlign: 'center',
          padding: '20px'
        }}>
          No spells selected yet
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {selectedSpells.map((spell) => (
            <div
              key={spell.id}
              style={{
                backgroundColor: 'rgba(0, 255, 0, 0.1)',
                border: '1px solid #00ff00',
                borderRadius: '8px',
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              {/* Spell Icon */}
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#00ff00',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#000'
              }}>
                {spell.icon === 'damage_icon' && '⚔️'}
                {spell.icon === 'speed_icon' && '⚡'}
                {spell.icon === 'multishot_icon' && '🎯'}
                {spell.icon === 'size_icon' && '🔮'}
                {spell.icon === 'health_icon' && '❤️'}
                {spell.icon === 'movement_icon' && '👟'}
                {spell.icon === 'thunder_icon' && '⚡'}
                {spell.icon === 'magic_icon' && '🔮'}
                {!spell.icon.includes('_icon') && '✨'}
              </div>
              
              {/* Spell Info */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: '#00ff00',
                  marginBottom: '2px'
                }}>
                  {spell.name}
                </div>
                <div style={{
                  fontSize: '10px',
                  color: '#cccccc'
                }}>
                  Level {spell.level}/{spell.maxLevel}
                </div>
              </div>
              
              {/* Level Badge */}
              <div style={{
                backgroundColor: spell.level === spell.maxLevel ? '#ff6600' : '#00ff00',
                color: '#000',
                fontSize: '10px',
                fontWeight: 'bold',
                padding: '2px 6px',
                borderRadius: '4px',
                minWidth: '20px',
                textAlign: 'center'
              }}>
                {spell.level}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectedSpells;
