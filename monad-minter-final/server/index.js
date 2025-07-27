const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");

const app = express();
app.use(cors());
app.use(express.json());

// PRIVATE KEY of funded minting wallet (testnet only)
const MINT_WALLET_PRIVATE_KEY = "0xf1b57bf9028513e3dffa0946646b036ce3abf458b73d8f8c27ba46fbff205c26"; // Replace with your funded testnet wallet

app.post("/mint", async (req, res) => {
  const { recipient, quantity } = req.body;

  try {
    const provider = new ethers.providers.JsonRpcProvider("https://testnet-rpc.monad.xyz");
    const wallet = new ethers.Wallet(MINT_WALLET_PRIVATE_KEY, provider);

    const contractAddress = "0xbc8f6824fde979848ad97a52bced2d6ca1842a68";
    const abi = [
      "function mintTo(address to, uint256 quantity) public payable"
    ];

    const contract = new ethers.Contract(contractAddress, abi, wallet);

    const qty = quantity || 1;
    const mintPrice = ethers.utils.parseEther((1 * qty).toString());

    const gasEstimate = await contract.estimateGas.mintTo(recipient, qty, {
      value: mintPrice
    });

    const tx = await contract.mintTo(recipient, qty, {
      value: mintPrice,
      gasLimit: gasEstimate
    });

    const receipt = await tx.wait();
    res.send({ txHash: receipt.transactionHash });
  } catch (err) {
    res.status(500).send({ error: "Mint error: " + err.message });
  }
});

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
