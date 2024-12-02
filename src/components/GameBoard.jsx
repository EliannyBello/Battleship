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
    <div>
      <h2>{title}</h2>
      {winner && <h3>{`${winner} ha ganado el juego!`}</h3>}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(10, 30px)",
          gap: "2px",
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleClick(rowIndex, colIndex)}
              style={{
                width: "30px",
                height: "30px",
                position: "relative",
                border: "1px solid black",
                backgroundColor:
                  cell && cell.hit
                    ? "red"  // Cambia a rojo si está en estado 'hit'
                    : cell && cell.miss
                    ? "blue"  // Cambia a azul si está en estado 'miss'
                    : "white",
              }}
            >
              {cell && cell.img && type === "user" && (
                <img
                  src={cell.img}
                  alt={cell.ship}
                  style={{
                    position: "absolute",
                    width: "30px",
                    height: "30px",
                    top: 0,
                    left: 0,
                    objectFit: "contain",
                  }}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default GameBoard;

