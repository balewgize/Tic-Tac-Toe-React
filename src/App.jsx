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
    let chosenSquare = null

    let blockingSquare = findBlockingMove(nextSquares, winPatterns)
    let winningSquare = findWinningMove(nextSquares, winPatterns)

    if (winningSquare !== null) {
      // Check if there's a winning move available first
      chosenSquare = winningSquare
    } else if (blockingSquare !== null) {
      chosenSquare = blockingSquare
    } else {
      // If no blocking or winning move is found, proceed with the random selection
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
  // 'X' is the player symbol to block
  return findStrategicMove(squares, winPatterns, 'X');
}

function findWinningMove(squares, winPatterns) {
  // 'O' is the computer symbol to win
  return findStrategicMove(squares, winPatterns, 'O');
}

function findStrategicMove(squares, winPatterns, playerSymbol) {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern

    if (squares[a] === playerSymbol && squares[b] === playerSymbol && squares[c] === null) {
      return c // Return the index for the strategic move
    } else if (squares[a] === playerSymbol && squares[c] === playerSymbol && squares[b] === null) {
      return b
    } else if (squares[b] === playerSymbol && squares[c] === playerSymbol && squares[a] === null) {
      return a
    }
  }

  return null; // No strategic move found
}
