import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react"

export default function Home() {

  const [score, setScore] = useState(0);

  useEffect(() => {
    let score = localStorage.getItem("FlappyBirdBestScore")
    if (score) {
      setScore(score);
    }
  }, [])

  return (
    <div>
      <div className="font-mono text-center text-[200px] pt-24">
        {`${score}`}
      </div>
      <div className="font-mono text-center text-2xl pb-12">
        Mint your prize!
      </div>
      <div className="flex justify-center">
        <ConnectButton />
      </div>
    </div>
  )
}
