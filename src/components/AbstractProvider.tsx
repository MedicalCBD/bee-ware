import React from 'react';
import { AbstractWalletProvider } from "@abstract-foundation/agw-react";
import { abstractTestnet } from "viem/chains";

interface AbstractProviderProps {
  children: React.ReactNode;
}

const AbstractProvider: React.FC<AbstractProviderProps> = ({ children }) => {
  return (
    <AbstractWalletProvider chain={abstractTestnet}>
      {children}
    </AbstractWalletProvider>
  );
};

export default AbstractProvider;
