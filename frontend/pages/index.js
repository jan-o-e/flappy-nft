import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { ethers } from "ethers";
import { useEffect, useState } from "react"
import { useAccount, useSigner, useContract, useProvider } from "wagmi";
import {uploadToIPFS, generateNFTMetadata} from 'scripts/mint-nft.js';

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
