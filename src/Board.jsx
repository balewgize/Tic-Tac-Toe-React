import PropTypes from 'prop-types'



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

export default function Board({ squares, winPatterns, checkWinner, handleClick }) {
    const winnerLine = checkWinner(squares, winPatterns)

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

Square.propTypes = {
    value: PropTypes.string,
    highlight: PropTypes.bool,
    onSquareClick: PropTypes.func
}

Board.propTypes = {
    squares: PropTypes.array,
    winPatterns: PropTypes.array,
    checkWinner: PropTypes.func,
    handleClick: PropTypes.func
}
