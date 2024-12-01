'use client'
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import CreateCampaign from '@/components/CreateCampaign';
import CampaignList from '@/components/CampaignList';
import WalletConnection from '@/components/WalletConnection';

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setIsConnected(true);
          setAddress(accounts[0]);
        }
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Crowdfunding DApp
      </h1>
      <WalletConnection
        isConnected={isConnected}
        address={address}
        setIsConnected={setIsConnected}
        setAddress={setAddress}
      />
      {isConnected && (
        <>
          <CreateCampaign />
          <CampaignList />
        </>
      )}
    </div>
  );
}
