import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { ethers } from "ethers";
import { useEffect, useState } from "react"
import { useAccount, useSigner, useContract, useProvider } from "wagmi";

export default function Home() {

  const [score, setScore] = useState(0);
  const { address, connector, isConnected } = useAccount();
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
    let score = localStorage.getItem("FlappyBirdBestScore")
    if (score) {
      setScore(score);
    }
  }, [])

  //this function needs some work so things happen in the right order and callbacks/errors are handled correctly
  const handleMint = async () => {
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [hash, setHash] = useState(null);

    //create ipfs instance and upload via pinata
  
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
    async function uploadToIPFS(metadata) {
      const axios = require('axios');
      const pinataBaseURL = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
      const pinataApiKey = '9246be92fe1de2189acc';
      const pinataSecretApiKey = 'ff616d3598d0b0e2a778b5e57e9b6b3502e8a4cb4f7721657f233a229ab9ca13';
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
  
    useEffect(() => {
      async function init() {
        const signer = useSigner({
          chainId: 5001, //mantle test-net chainID
        })
        setSigner(signer);

        const contractAddress = "0x72A0A69D06738D4692e9D1D1887F96351719faFC";
        const contractABI = require("contracts/mintFlappy.sol").abi;;
        const myNFT = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(myNFT);

        const metadata = await generateNFTMetadata(score, JSON.stringify(address));
        const ipfs_hash = await uploadToIPFS(metadata);
        setHash(ipfs_hash);
      
      }
      init();
    }, []);
  
    async function mintMyNFT() {
      if (!contract) return;
      const tokenUri = `https://gateway.pinata.cloud/ipfs/${ipfs_hash}`;
      let nftTxn = await myNftContract.mintNFT(signer.address, tokenUri);
      console.log(`NFT Minted! Check it out at: https://explorer.testnet.mantle.xyz/tx/${nftTxn.hash}`);
    }
  
    return (mintMyNFT);
  }
  

  return (
    <>
      {domLoaded && (
        <div>
          <div className="font-mono text-center text-[200px] pt-24">
            {`${score}`}
          </div>
          <div className="font-mono text-center text-2xl pb-12">
            Mint your prize!
          </div>
          <div className="flex justify-center">
            <div className="pb-12">
              {(isConnected) ? (
                <Button colorScheme="green" onClick={handleMint} size='lg'>
                  Mint!
                </Button>
              ) : (
                <ConnectButton />
              )}
            </div>
          </div>
          <div className="font-mono text-center text-2xl p-1 animate-bounce">
            <Link className="hover:underline" href="/html/index.html">
              Play again
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
