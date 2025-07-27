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

    // Placeholder contract data – update with real info
    const contractAddress = "0xYourContractAddressHere";
    const abi = [
      // Replace with actual ABI
      "function mint() public payable"
    ];

    const contract = new ethers.Contract(contractAddress, abi, wallet);

    // Estimate gas and get mint cost (simulate)
    let mintPrice = ethers.utils.parseEther("0.01"); // replace with actual cost
    let gasEstimate;
    try {
      gasEstimate = await contract.estimateGas.mint({ value: mintPrice });
    } catch (e) {
      return res.status(500).send({ error: "Gas estimation failed: " + e.message });
    }

    const tx = await contract.mint({
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
