const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/mint", async (req, res) => {
  const { privateKey, mintUrl } = req.body;

  try {
    const provider = new ethers.providers.JsonRpcProvider("https://testnet-rpc.monad.xyz");
    const wallet = new ethers.Wallet(privateKey, provider);

    const contractAddress = "0xMINT_CONTRACT_ADDRESS"; // Replace with actual contract
    const abi = []; // Insert correct ABI

    const contract = new ethers.Contract(contractAddress, abi, wallet);
    const tx = await contract.mint(); // Replace with actual function
    const receipt = await tx.wait();

    res.send({ txHash: receipt.transactionHash });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
