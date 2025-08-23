import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PERFORMANCE_CONFIG } from '../phaser/config/PerformanceConfig';

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
  const lastUpdateRef = useRef<number>(0);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUpdatingRef = useRef<boolean>(false);

  // Throttled update function to prevent excessive updates
  const updateSpells = useCallback(() => {
    if (!gameInstance || isUpdatingRef.current) {
      return;
    }

    const now = Date.now();
    if (now - lastUpdateRef.current < PERFORMANCE_CONFIG.UPGRADE_SYSTEM.UPDATE_THROTTLE_MS) {
      return;
    }

    isUpdatingRef.current = true;
    lastUpdateRef.current = now;

    try {
      const scene = gameInstance.scene.getScene('MainScene');
             if (!scene) {
         isUpdatingRef.current = false;
         return;
       }
      
             if (!scene.upgradeSystem) {
         isUpdatingRef.current = false;
         return;
       }

             // Check if game is paused to avoid updates during pause
       if (PERFORMANCE_CONFIG.PAUSE_PROTECTION.CHECK_PAUSE_STATE && scene.scene.isPaused()) {
         isUpdatingRef.current = false;
         return;
       }

      const acquiredUpgrades = scene.upgradeSystem.getAcquiredUpgrades();
      const availableUpgrades = scene.upgradeSystem.getAvailableUpgrades();
      
      if (!acquiredUpgrades || !availableUpgrades) {
        isUpdatingRef.current = false;
        return;
      }

      const spells: Spell[] = [];
      
      // Convert acquired upgrades to spells with error protection
      try {
        for (const [upgradeId, level] of acquiredUpgrades.entries()) {
          if (level > 0) {
            const upgrade = availableUpgrades.find((u: any) => u.id === upgradeId);
            if (upgrade) {
              spells.push({
                id: upgrade.id,
                name: upgrade.name,
                level: level,
                maxLevel: upgrade.maxLevel || 1,
                icon: upgrade.icon || 'magic_icon'
              });
            }
          }
        }
      } catch (error) {
        console.error('Error processing upgrades:', error);
      }
      
             setSelectedSpells(spells);
         } catch (error) {
       console.error('Error updating spells:', error);
     } finally {
      isUpdatingRef.current = false;
    }
  }, [gameInstance]);

     useEffect(() => {
     if (!gameInstance) {
       return;
     }

    // Clear any existing timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    // Initial update
    updateSpells();

         // Set up interval with error handling
     const interval = setInterval(() => {
       try {
         updateSpells();
       } catch (error) {
         console.error('Error in update interval:', error);
         // Reset the updating flag in case of error
         isUpdatingRef.current = false;
       }
     }, PERFORMANCE_CONFIG.UI_UPDATES.SPELL_PANEL_UPDATE_INTERVAL);

    return () => {
      clearInterval(interval);
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      isUpdatingRef.current = false;
    };
  }, [gameInstance, updateSpells]);

  // Don't render if no spells to prevent unnecessary DOM updates
  if (selectedSpells.length === 0) {
    return null;
  }

  // Limit the number of spells displayed to prevent performance issues
  const displaySpells = selectedSpells.slice(0, PERFORMANCE_CONFIG.UI_UPDATES.MAX_SPELLS_DISPLAYED);

  return (
    <div style={{
      position: 'fixed',
      top: '150px',
      right: '60px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxHeight: 'none',
      overflowY: 'visible'
    }}>
      {displaySpells.map((spell) => (
        <div
          key={spell.id}
          style={{
            backgroundColor: 'rgba(0, 255, 0, 0.1)',
            border: '1px solid #00ff00',
            borderRadius: '8px',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '280px',
            boxShadow: '0 4px 16px rgba(0, 255, 0, 0.3)'
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
        </div>
      ))}
    </div>
  );
};

export default SelectedSpells;
