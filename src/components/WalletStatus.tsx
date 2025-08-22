import { useAbstractClient } from "@abstract-foundation/agw-react";

export default function WalletStatus() {
  const { data: client } = useAbstractClient();

  if (!client) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '15px',
      borderRadius: '10px',
      fontSize: '14px',
      zIndex: 1000,
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    }}>
      <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
        🎮 Abstract Global Wallet
      </div>
      <div style={{ fontSize: '12px', opacity: 0.8 }}>
        Status: Connected
      </div>
    </div>
  );
}
