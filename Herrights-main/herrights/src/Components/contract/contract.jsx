import { ethers } from "ethers";
import { useState } from "react";

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0x9a73C03FCE18f237b54e78805917dE30Eae04684";

// ABI from the WomenEmpowerment contract
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

const ComplaintForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRewardsPopup, setShowRewardsPopup] = useState(false);
  const [web3Rewards, setWeb3Rewards] = useState(0);

  // Function to calculate rewards (placeholder implementation)
  const calculateWeb3Rewards = (storyData) => {
    // Example: Calculate rewards based on content length
    const baseReward = 10; // Base reward points
    const lengthBonus = Math.min(storyData.title.length + storyData.content.length, 100); // Cap at 100
    return baseReward + lengthBonus;
  };

  const submitComplaint = async () => {
    if (!title.trim() || !content.trim()) {
      setMessage("Please fill in both title and content");
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
      const walletAddress = await signer.getAddress();

      // Initialize contract
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Calculate Web3 rewards
      const complaintData = { title, content };
      const calculatedRewards = calculateWeb3Rewards(complaintData);
      setWeb3Rewards(calculatedRewards);

      // Submit complaint to the blockchain
      const tx = await contract.submitComplaint(title, content);
      await tx.wait(); // Wait for transaction confirmation

      setMessage("Complaint submitted successfully!");
      setTitle("");
      setContent("");
      setShowRewardsPopup(true); // Show rewards popup
    } catch (err) {
      console.error(err);
      setMessage(err.reason || err.message || "Error submitting complaint");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Submit a Complaint</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Complaint Title"
        disabled={isSubmitting}
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Complaint Description"
        disabled={isSubmitting}
      />
      <button onClick={submitComplaint} disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Complaint"}
      </button>
      {message && <p>{message}</p>}
      {showRewardsPopup && (
        <div>
          <p>Rewards Earned: {web3Rewards} points</p>
          <button onClick={() => setShowRewardsPopup(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default ComplaintForm;