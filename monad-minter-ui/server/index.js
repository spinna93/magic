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
    const abi = [
      "function mintTo(address to, uint256 quantity) public payable"
    ];

    const contract = new ethers.Contract(contractAddress, abi, wallet);

    const recipient = wallet.address;
    const quantity = 1;
    const mintPrice = ethers.utils.parseEther("1.0"); // 1 MON per NFT

    const gasEstimate = await contract.estimateGas.mintTo(recipient, quantity, {
      value: mintPrice
    });

    const tx = await contract.mintTo(recipient, quantity, {
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
