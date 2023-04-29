require("dotenv").config();
const { JsonRpcProvider, Signer } = require("@ethersproject/providers");
const ethers = require("ethers");

// Create a JsonRpcProvider instance
const rpcUrl = "https://rpc.testnet.mantle.xyz";
const chainId = 5001;
const provider = new JsonRpcProvider(rpcUrl, chainId);

const abi = require("../artifacts/contracts/MyNFT.sol/MyNFT.json").abi;

// Create a signer using the private key from the environment variable
const privateKey = process.env.PRIV_KEY;
const signer = new ethers.Wallet(privateKey, provider);

// Get contract ABI and address
const abi = require("../artifacts/contracts/MyNFT.sol/MyNFT.json").abi;
const contractAddress = "";

// Create a contract instance
const myNftContract = new ethers.Contract(contractAddress, abi, signer);

// Create JSON for metadta and Get the NFT Metadata IPFS URL
function generateNFTMetadata(score, playerName, time) {
    const metadata = {
      name: `${playerName}'s Score`,
      description: `A score of ${score} achieved by ${playerName} at ${new Date(time).toLocaleString()}.`,
      image: ``,
      attributes: [
        {
          trait_type: "Score",
          value: score,
        },
        {
          trait_type: "Player",
          value: playerName,
        },
        {
          trait_type: "Time",
          value: new Date(time).toLocaleString(),
        },
      ],
    };
    return metadata;
  }

// Upload the metadata to IPFS and get the hash code

//create ipfs instance
const ipfsClient = require('ipfs-http-client');


async function uploadMetadataToIPFS(metadata) {
    const metadataString = JSON.stringify(metadata);
    const metadataBuffer = Buffer.from(metadataString);
    const { cid } = await ipfs.add(metadataBuffer);
    return cid.toString();
  }


// Get the NFT Metadata IPFS URL and pass it to mintNFT function
const tokenUri = "https://gateway.pinata.cloud/ipfs/<metadata-hash-code>";

// Call mintNFT function
async function mintNFT() {
  let nftTxn = await myNftContract.mintNFT(signer.address, tokenUri);
  await nftTxn.wait();
  console.log(`NFT Minted! Check it out at: https://explorer.testnet.mantle.xyz/tx/${nftTxn.hash}`);
}

mintNFT()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });