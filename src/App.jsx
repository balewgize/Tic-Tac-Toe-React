import { useState, useEffect } from "react"
import Board from "./Board.jsx"


export default function Game() {
  const [xIsNext, setXIsNext] = useState(true)
  const [squares, setSquares] = useState(Array(9).fill(null))

  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]            // Diagonals
  ]

  const winner = checkWinner(squares, winPatterns)
  const isDraw = !winner && !squares.includes(null)


  useEffect(() => {
    if (!xIsNext && !winner) {
      setTimeout(() => makeComputerMove(), 500)
    }
  }, [xIsNext, winner])


  function handleClick(index) {
    if (squares[index] || checkWinner(squares, winPatterns)) return

    const nextSquares = squares.slice()
    nextSquares[index] = 'X'
    setSquares(nextSquares)
    setXIsNext(!xIsNext)
  }

  function resetGame() {
    setSquares(Array(9).fill(null))
    setXIsNext(true)
  }

  function makeComputerMove() {
    const nextSquares = squares.slice()
    let chosenSquare = findBlockingMove(nextSquares, winPatterns)

    if (chosenSquare === null) {
      // If no blocking move is found, proceed with the random selection
      const availableSquareIndices = nextSquares
        .map((square, index) => square === null ? index : null)
        .filter(index => index !== null)

      const randomIndex = Math.floor(Math.random() * availableSquareIndices.length)
      chosenSquare = availableSquareIndices[randomIndex]
    }

    nextSquares[chosenSquare] = 'O'
    setSquares(nextSquares)
    setXIsNext(!xIsNext)
  }


  function getStatus() {
    let status = ""
    if (winner) {
      status = "Winner: " + squares[winner[0]]
    } else if (isDraw) {
      status = <strong>Draw!</strong>
    } else {
      status = `Next player: ${xIsNext ? "X" : "O"}`
    }
    return status
  }

  return (
    <div className="game">
      <div className="status">{getStatus()}</div>
      <Board
        squares={squares}
        winPatterns={winPatterns}
        checkWinner={checkWinner}
        handleClick={handleClick}
      />

      {(winner || isDraw) && (
        <button className="reset-btn" onClick={resetGame}>
          New Game
        </button>
      )}
    </div>
  )
}

function checkWinner(squares, winPatterns) {

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return pattern
    }
  }
  return null
}

function findBlockingMove(squares, winPatterns) {

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern

    if (squares[a] === 'X' && squares[b] === 'X' && squares[c] === null) {
      return c // Return the index to block
    } else if (squares[a] === 'X' && squares[c] === 'X' && squares[b] === null) {
      return b
    } else if (squares[b] === 'X' && squares[c] === 'X' && squares[a] === null) {
      return a
    }
  }

  return null // No blocking move found
}
