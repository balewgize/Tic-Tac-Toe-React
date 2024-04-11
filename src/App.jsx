import { useState } from "react"

function Square({ value, onSquareClick }) {

  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  )
}

function Board({ squares, handleClick }) {
  const renderSquare = (i) => (
    <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} />
  )

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

  function handleClick(index) {
    if (squares[index] || calculateWinner(squares)) return

    const nextSquares = squares.slice()
    nextSquares[index] = xIsNext ? 'X' : 'O'
    setSquares(nextSquares)
    setXIsNext(!xIsNext)
  }

  const winner = calculateWinner(squares);
  let status
  if (winner) {
    status = "Winner: " + winner
  } else if (!squares.includes(null)) {
    status = "It is a tie!"
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`
  }

  return (
    <>
      <div className="status">{status}</div>
      <Board squares={squares} handleClick={handleClick} />
    </>
  )
}

function calculateWinner(squares) {
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
      return squares[a]
    }
  }
  return null
}