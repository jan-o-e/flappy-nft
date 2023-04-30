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
  const [txnHash, setTxnHash] = useState('');
  const [mintSuccess, setMintSuccess] = useState(false);

  const {data: signer} = useSigner({
    chainId: 5001, //mantle test-net chainID
  })
  const contractAddress = "0x72A0A69D06738D4692e9D1D1887F96351719faFC";
  const contractABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approved",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "tokenURI",
          "type": "string"
        }
      ],
      "name": "mintNFT",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

  const myNftContract = useContract({
    address: contractAddress,
    abi: contractABI,
    signerOrProvider: signer,
  })

  useEffect(() => {
    setDomLoaded(true);
    let score = localStorage.getItem("FlappyBirdBestScore")
    if (score) {
      setScore(score);
    }
  }, [])

  //this function needs some work so things happen in the right order and callbacks/errors are handled correctly
  const handleMint = async () => {

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
  
    
    let metadata = generateNFTMetadata(score, JSON.stringify(address));
    let ipfs_hash = await uploadToIPFS(metadata);
  
  
    async function mintMyNFT() {
      if (!myNftContract) return;
      let tokenUri = `https://gateway.pinata.cloud/ipfs/${ipfs_hash}`;
      let nftTxn = await myNftContract.mintNFT(signer.address, tokenUri);
      setTxnHash(nftTxn.hash);
      setMintSuccess(true);
      console.log(`NFT Minted! Check it out at: https://explorer.testnet.mantle.xyz/tx/${nftTxn.hash}`);
    }

    await mintMyNFT();
  
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
                (!mintSuccess) ? (
                <Button colorScheme="green" onClick={handleMint} size='lg'>
                  Mint!
                </Button>
                ) : (
                  <Link className="hover:underline text-lg font-mono" href={`https://explorer.testnet.mantle.xyz/tx/${txnHash}`}>
                    View Your NFT!
                  </Link>
                )
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
