import { useContext, useEffect, useState } from "react"

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
      <div className="text-center">{score}</div>
    </div>
  )
}
