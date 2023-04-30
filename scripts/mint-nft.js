// Description: Script to mint NFTs

// Create JSON for metadata
function generateNFTMetadata(score, playerName) {
    const metadata = {
      name: `${playerName}'s Flappy Score`,
      description: `A score of ${score} achieved by ${playerName} at ${new Date().toLocaleString()}.`,
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
          value: new Date().toLocaleString(),
        },
      ],
    };
    return metadata;
  }



//create ipfs instance and upload via pinata
async function uploadToIPFS(metadata) {
  require("dotenv").config();
  const axios = require('axios');
  const pinataBaseURL = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
  const pinataApiKey = '9246be92fe1de2189acc';
  const pinataSecretApiKey = process.env.pinataSecretApiKey;
  const nftMeta = JSON.stringify(metadata);
  const res = await axios.post(
    pinataBaseURL,
    {
      pinataMetadata: {
        name: "flappy",
      },
      // assuming client sends `nftMeta` json
      pinataContent: nftMeta,
    },
    {
      headers: {
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
      },
    }
  );
  return res.data.IpfsHash;
}


const { JsonRpcProvider, Signer } = require("@ethersproject/providers");
const ethers = require("ethers");
require("dotenv").config();
const rpcUrl = "https://rpc.testnet.mantle.xyz";
const chainId = 5001;
const provider = new JsonRpcProvider(rpcUrl, chainId);

// Create a signer using the private key from the environment variable
const privateKey = process.env.PRIV_KEY;
const signer = new ethers.Wallet(privateKey, provider);


// Call mintNFT function
  async function mintNFT(ipfs_hash, signer) {

    // Get contract ABI and address
    const abi = require("contracts/mintFlappy.sol").abi;
    const contractAddress = process.env.contractAddress

    // Create a contract instance
    const myNftContract = new ethers.Contract(contractAddress, abi, signer);

    const tokenUri = `https://gateway.pinata.cloud/ipfs/${ipfs_hash}`;
    let nftTxn = await myNftContract.mintNFT(signer.address, tokenUri);
    await nftTxn.wait();
    console.log(`NFT Minted! Check it out at: https://explorer.testnet.mantle.xyz/tx/${nftTxn.hash}`);
    return(`https://explorer.testnet.mantle.xyz/tx/${nftTxn.hash}`);
  }

export{uploadToIPFS, generateNFTMetadata}