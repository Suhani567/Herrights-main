import React, { useState, useEffect } from 'react';
import { connectWallet, getCurrentAccount } from '../utils/web3Config';

const WalletConnect = ({ onWalletConnected, onPointsUpdate }) => {
  const [account, setAccount] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    const currentAccount = await getCurrentAccount();
    if (currentAccount) {
      setAccount(currentAccount);
      setIsConnected(true);
      onWalletConnected(currentAccount);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const walletData = await connectWallet();
      if (walletData) {
        setAccount(walletData.account);
        setIsConnected(true);
        onWalletConnected(walletData.account);
      }
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="wallet-connect">
      {!isConnected ? (
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div className="flex items-center space-x-2">
          <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </div>
          <button
            onClick={() => {
              setIsConnected(false);
              setAccount('');
            }}
            className="px-2 py-1 text-red-600 hover:text-red-800 text-sm"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
