import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { CheckCircle, X, Gift, Wallet } from "lucide-react";
import WalletConnect from "./contract/walletConnect";

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0x9a73C03FCE18f237b54e78805917dE30Eae04684";

// ABI for the WomenEmpowerment contract
const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "complaintId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "complainant",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "ComplaintSubmitted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "complaints",
    "outputs": [
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "complainant",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getComplaintCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "getComplaint",
    "outputs": [
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "complainant",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      }
    ],
    "name": "submitComplaint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Placeholder calculateWeb3Rewards function (replace with your implementation)
const calculateWeb3Rewards = (storyData) => {
  const baseReward = 10; // Base reward
  const lengthBonus = Math.min(storyData.title.length + storyData.content.length, 100); // Cap at 100
  return baseReward + lengthBonus;
};

export default function StorySubmit() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [points, setPoints] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRewardsPopup, setShowRewardsPopup] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [web3Rewards, setWeb3Rewards] = useState(0);
  const [walletError, setWalletError] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  // Handle wallet connection from WalletConnect component
  const handleWalletConnected = (address) => {
    setWalletAddress(address);
    setWalletError("");
  };

  // Connect wallet within the component
  const connectWallet = async () => {
    setIsConnecting(true);
    setWalletError("");

    if (!window.ethereum) {
      setWalletError("Please install MetaMask or another Web3 wallet");
      setIsConnecting(false);
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const address = accounts[0];
      setWalletAddress(address);
      setWalletError("");
    } catch (err) {
      setWalletError("Failed to connect wallet");
      console.error(err);
    } finally {
      setIsConnecting(false);
    }
  };

  const submitStory = async () => {
    if (!title.trim() || !content.trim()) {
      setMessage("Please fill in both title and content");
      return;
    }

    if (!walletAddress) {
      setMessage("Please connect your wallet");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      // Check if MetaMask or another wallet is available
      if (!window.ethereum) {
        setMessage("Please install MetaMask or another Web3 wallet");
        return;
      }

      // Initialize provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Initialize contract
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Calculate Web3 rewards
      const storyData = { title, content };
      const calculatedRewards = calculateWeb3Rewards(storyData);
      setWeb3Rewards(calculatedRewards);
      setPoints(calculatedRewards); // Assuming points are the same as web3Rewards for UI consistency

      // Submit complaint to the blockchain
      const tx = await contract.submitComplaint(title, content);
      await tx.wait(); // Wait for transaction confirmation

      setMessage("Story submitted successfully!");
      setTitle("");
      setContent("");
      setShowRewardsPopup(true); // Show rewards popup
    } catch (err) {
      console.error(err);
      setMessage(err.reason || err.message || "Error submitting story");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeRewardsPopup = () => {
    setShowRewardsPopup(false);
  };

  const goToRewards = () => {
    setShowRewardsPopup(false);
    navigate('/rewards');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header with Wallet Connection */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Share Your Story</h1>
              <p className="text-gray-600 mt-1">Share your experience and earn Web3 rewards</p>
            </div>
            <div className="flex items-center space-x-4">
              {walletAddress && (
                <span className="text-green-600 font-medium">
                  Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              )}
              <WalletConnect onWalletConnected={handleWalletConnected} />
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 text-pink-600 hover:text-pink-700 font-medium"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Story Details</h2>
              <p className="text-gray-600">Share your experience to help and inspire other women in our community.</p>
            </div>

            {/* Wallet Status and Connect Button */}
            <div className="mb-6">
              {walletAddress ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <Wallet className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">
                      Wallet Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    Estimated Web3 Rewards: {web3Rewards} tokens
                  </p>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isConnecting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Connecting...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Wallet className="w-4 h-4 mr-2" />
                      Connect Wallet
                    </div>
                  )}
                </button>
              )}
              {walletError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <span className="text-red-800 font-medium">{walletError}</span>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Story Title *
                </label>
                <input
                  type="text"
                  placeholder="Give your story a meaningful title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Story *
                </label>
                <textarea
                  placeholder="Share your experience, journey, or message. Your story can inspire and help others..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows="8"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>

              {message && (
                <div className={`p-4 rounded-lg border-l-4 ${
                  message.includes('Error')
                    ? 'bg-red-50 border-red-400 text-red-700'
                    : 'bg-green-50 border-green-400 text-green-700'
                }`}>
                  {message}
                </div>
              )}

              <div className="flex justify-center pt-4">
                <button
                  onClick={submitStory}
                  disabled={isSubmitting || !walletAddress}
                  className="px-8 py-3 bg-pink-600 text-white font-semibold rounded-lg shadow-md hover:bg-pink-700 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting Story...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Submit Story & Earn Rewards
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Help Section */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Web3 Rewards Guide</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <p className="font-medium mb-1">Connect Your Wallet:</p>
                <ul className="space-y-1">
                  <li>• Connect MetaMask to earn rewards</li>
                  <li>• Rewards are calculated automatically</li>
                  <li>• Tokens are sent to your wallet</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-1">Reward System:</p>
                <ul className="space-y-1">
                  <li>• Base reward: 10 tokens</li>
                  <li>• Bonus for longer stories</li>
                  <li>• Extra for meaningful content</li>
                  <li>• All rewards are automatic</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Popup */}
      {showRewardsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Congratulations! 🎉</h3>
              <p className="text-gray-600 mb-4">Your story has been submitted successfully!</p>
            </div>

            <div className="bg-pink-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">You earned</p>
              <p className="text-3xl font-bold text-pink-600">{points} Points!</p>
              <p className="text-sm text-gray-600 mt-1">+ {web3Rewards} Web3 Tokens</p>
              <p className="text-sm text-gray-600 mt-1">Keep sharing to earn more rewards</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={goToRewards}
                className="flex-1 px-6 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition"
              >
                View All Rewards
              </button>
              <button
                onClick={closeRewardsPopup}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}