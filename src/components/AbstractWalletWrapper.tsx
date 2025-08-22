import React from 'react';
import { AbstractWalletProvider } from "@abstract-foundation/agw-react";
import { abstractTestnet } from "viem/chains"; // Use abstract for mainnet

interface AbstractWalletWrapperProps {
  children: React.ReactNode;
}

export default function AbstractWalletWrapper({
  children,
}: AbstractWalletWrapperProps) {
  return (
    <AbstractWalletProvider chain={abstractTestnet}>
      {children}
    </AbstractWalletProvider>
  );
}
