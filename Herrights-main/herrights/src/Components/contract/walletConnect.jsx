import { useState } from "react";
import { Wallet } from "lucide-react";

const WalletConnect = ({ onWalletConnected }) => {
  const [error, setError] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("Please install MetaMask or another Web3 wallet");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const address = accounts[0];
      onWalletConnected(address);
      setError("");
    } catch (err) {
      setError("Failed to connect wallet");
      console.error(err);
    }
  };

  return (
    <div>
      <button
        onClick={connectWallet}
        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
      >
        <Wallet className="w-4 h-4 inline-block mr-2" />
        Connect via WalletConnect
      </button>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default WalletConnect;