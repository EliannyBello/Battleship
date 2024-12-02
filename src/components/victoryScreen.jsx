import React, { useContext } from "react";
import { GameContext } from "../Context/GameContext";

function VictoryScreen() {
  const { winner, resetGame } = useContext(GameContext);

  if (!winner) return null;

  return (
    <div className="finalmodal">
      <h2>{winner} ganó el juego</h2>
      <button onClick={resetGame}>Reiniciar</button>
    </div>
  );
}

export default VictoryScreen;

