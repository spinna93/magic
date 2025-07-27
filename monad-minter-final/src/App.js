import React, { useState } from "react";
import axios from "axios";

function App() {
  const [wallet, setWallet] = useState("");
  const [status, setStatus] = useState("Idle");
  const [connected, setConnected] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWallet(accounts[0]);
        setConnected(true);
        setStatus("Wallet connected");
      } catch (err) {
        console.error(err);
        setStatus("Wallet connection failed");
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const startMint = async () => {
    setStatus("Minting...");
    try {
      const response = await axios.post("http://localhost:5000/mint", {
        recipient: wallet,
        quantity: 1
      });
      setStatus(`Mint Success: ${response.data.txHash}`);
    } catch (err) {
      console.error(err);
      setStatus(`Mint Failed: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Monad NFT Minter (Testnet)</h1>

      {!connected ? (
        <button
          onClick={connectWallet}
          className="bg-green-600 hover:bg-green-700 p-2 rounded mb-4"
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <p className="mb-2">Connected wallet: {wallet}</p>
          <button
            onClick={startMint}
            className="bg-purple-600 hover:bg-purple-700 p-2 rounded"
          >
            Mint 1 NFT
          </button>
        </>
      )}

      <p className="mt-4">{status}</p>
    </div>
  );
}

export default App;
