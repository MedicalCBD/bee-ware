import React from 'react';
import { useLoginWithAbstract } from "@abstract-foundation/agw-react";

interface ConnectWalletButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function ConnectWalletButton({ 
  className = "", 
  children = "Connect with AGW" 
}: ConnectWalletButtonProps) {
  // login function to prompt the user to sign in with AGW
  const { login } = useLoginWithAbstract();

  return (
    <button 
      onClick={login}
      className={`connect-wallet-btn ${className}`}
      style={{
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: 'bold',
        backgroundColor: '#6366f1',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#4f46e5';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#6366f1';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      }}
    >
      {children}
    </button>
  );
}
