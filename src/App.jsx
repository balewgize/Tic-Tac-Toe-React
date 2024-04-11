import { useState, useEffect } from "react"

function Square({ value, highlight, onSquareClick }) {

  return (
    <button
      className={`square ${highlight ? "winning-square" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  )
}

function Board({ squares, handleClick }) {
  const winnerLine = checkWinner(squares)

  const renderSquare = (i) => {
    const highlight = winnerLine && winnerLine.includes(i)

    return (
      <Square
        key={i}
        value={squares[i]}
        highlight={highlight}
        onSquareClick={() => handleClick(i)}
      />
    )
  }

  const rows = []
  const boardSize = 3

  for (let rowIndex = 0; rowIndex < boardSize; rowIndex++) {
    const rowSquares = []
    const rowStart = rowIndex * boardSize

    for (let colIndex = 0; colIndex < boardSize; colIndex++) {
      const squareIndex = rowStart + colIndex
      rowSquares.push(renderSquare(squareIndex))
    }

    rows.push(
      <div key={rowIndex} className="board-row">
        {rowSquares}
      </div>
    )
  }

  return <div>{rows}</div>
}


export default function Game() {
  const [xIsNext, setXIsNext] = useState(true)
  const [squares, setSquares] = useState(Array(9).fill(null))

  const winner = checkWinner(squares)
  const isDraw = !winner && !squares.includes(null)


  useEffect(() => {
    if (!xIsNext && !winner) {
      setTimeout(() => {
        makeComputerMove()
      }, 500)
    }
  }, [xIsNext, winner])


  function handleClick(index) {
    if (squares[index] || checkWinner(squares)) return

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
    // Clone the current state to avoid direct mutation
    const nextSquares = squares.slice()

    // Determine which squares are available (i.e., have null values)
    const availableSquareIndices = nextSquares
      .map((square, index) => square === null ? index : null)
      .filter(index => index !== null)

    // Select a random index from the available squares
    const randomIndex = Math.floor(Math.random() * availableSquareIndices.length)
    const randomSquareIndex = availableSquareIndices[randomIndex]

    // Make the computer's move by updating the state
    nextSquares[randomSquareIndex] = 'O'
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
      <Board squares={squares} handleClick={handleClick} />

      {(winner || isDraw) && (
        <button className="reset-btn" onClick={resetGame}>
          New Game
        </button>
      )}
    </div>
  )
}

function checkWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i]
    }
  }
  return null
}