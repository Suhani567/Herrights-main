import Web3 from 'web3';
import { ethers } from 'ethers';

// Initialize Web3
let web3;
let provider;

export const initWeb3 = async () => {
  if (window.ethereum) {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      web3 = new Web3(window.ethereum);
      provider = new ethers.providers.Web3Provider(window.ethereum);
      return { web3, provider };
    } catch (error) {
      console.error('User denied account access');
      return null;
    }
  } else {
    console.error('MetaMask not detected');
    return null;
  }
};

export const getCurrentAccount = async () => {
  if (window.ethereum) {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts[0];
  }
  return null;
};

export const connectWallet = async () => {
  try {
    const { web3, provider } = await initWeb3();
    const accounts = await web3.eth.getAccounts();
    return {
      account: accounts[0],
      web3,
      provider
    };
  } catch (error) {
    console.error('Error connecting wallet:', error);
    return null;
  }
};

// Simple reward calculation based on story metrics
export const calculateWeb3Rewards = (storyData) => {
  const { content, title } = storyData;
  const wordCount = content.split(' ').length;

  // Base reward: 10 tokens
  let rewardTokens = 10;

  // Bonus for longer stories
  if (wordCount > 500) rewardTokens += 5;
  else if (wordCount > 200) rewardTokens += 3;

  // Bonus for meaningful keywords
  const meaningfulKeywords = ['empowerment', 'strength', 'courage', 'support', 'community', 'rights', 'justice'];
  const hasMeaningfulContent = meaningfulKeywords.some(keyword =>
    content.toLowerCase().includes(keyword) || title.toLowerCase().includes(keyword)
  );

  if (hasMeaningfulContent) rewardTokens += 5;

  return rewardTokens;
};

export default web3;
