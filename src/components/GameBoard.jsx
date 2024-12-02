import React, { useContext } from "react";
import { GameContext } from "../Context/GameContext";


function GameBoard({ title, type }) {
  const {
    userBoard,
    computerBoard,
    turn,
    winner,
    handleAttack,
  } = useContext(GameContext);

  const board = type === "user" ? userBoard : computerBoard;

  const handleClick = (row, col) => {
    if (type === "computer" && turn === "user") {
      handleAttack(row, col);
    }
  };

  return (
    <div className="board">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`board-cell ${cell?.hit ? 'hit' : ''} ${cell?.miss ? 'miss' : ''}`}
            onClick={() => handleClick(rowIndex, colIndex)}
          >
            {cell?.img && type === "user" && (
              <img
                src={cell.img}
                alt={cell.ship}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            )}
          </div>
        ))
      )}
    </div>

  );
}

export default GameBoard;

