import React, { useState } from "react";
import axios from "axios";

function App() {
  const [wallet, setWallet] = useState("");
  const [mintUrl, setMintUrl] = useState("https://magiceden.us/launchpad/monad-testnet/momo");
  const [status, setStatus] = useState("Idle");

  const startMint = async () => {
    setStatus("Minting...");
    try {
      const response = await axios.post("http://localhost:5000/mint", {
        privateKey: wallet,
        mintUrl,
      });
      setStatus(`Mint Success: ${response.data.txHash}`);
    } catch (err) {
      setStatus(`Mint Failed: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Monad NFT Minter (Testnet)</h1>

      <input
        className="border p-2 w-96 mb-2 text-black"
        placeholder="Paste Wallet Private Key"
        value={wallet}
        onChange={(e) => setWallet(e.target.value)}
      />

      <input
        className="border p-2 w-96 mb-4 text-black"
        value={mintUrl}
        onChange={(e) => setMintUrl(e.target.value)}
      />

      <button
        onClick={startMint}
        className="bg-purple-600 hover:bg-purple-700 p-2 rounded"
      >
        Start Minting
      </button>

      <p className="mt-4">{status}</p>
    </div>
  );
}

export default App;
