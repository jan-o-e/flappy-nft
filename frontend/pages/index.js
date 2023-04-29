import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useEffect, useState } from "react"
import { useAccount } from "wagmi";

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

  const handleMint = async () => {
    // TODO: Handle mint
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
