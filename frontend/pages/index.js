import { Button } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react"
import { useAccount } from "wagmi";

export default function Home() {

  const [score, setScore] = useState(0);
  const {address, connector, isConnected} = useAccount();

  useEffect(() => {
    let score = localStorage.getItem("FlappyBirdBestScore")
    if (score) {
      setScore(score);
    }
  }, [])

  const handleMint = async () => {
    // TODO: Handle mint
  }

  return (
    <div>
      <div className="font-mono text-center text-[200px] pt-24">
        {`${score}`}
      </div>
      <div className="font-mono text-center text-2xl pb-12">
        Mint your prize!
      </div>
      <div className="flex justify-center">
        {(isConnected) ? (
          <Button onClick={handleMint}>
            Mint!
          </Button>
        ) : (
          <ConnectButton />
        )}
      </div>
    </div>
  )
}
