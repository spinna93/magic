const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/mint", async (req, res) => {
  const { privateKey } = req.body;

  try {
    const provider = new ethers.providers.JsonRpcProvider("https://testnet-rpc.monad.xyz");
    const wallet = new ethers.Wallet(privateKey, provider);

    const contractAddress = "0xbc8f6824fde979848ad97a52bced2d6ca1842a68";
    const abi = ["function mint() public payable"]; // standard interface

    const contract = new ethers.Contract(contractAddress, abi, wallet);

    const mintPrice = ethers.utils.parseEther("1.0");  // 1 MON mint price :contentReference[oaicite:1]{index=1}

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
