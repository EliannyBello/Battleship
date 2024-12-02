import React from "react";
import { GameProvider } from "../src/Context/GameContext";
import Modal from "./components/modal";
import GameBoard from "./components/GameBoard";
import FinalModal from "./components/FinalModal";

function App() {
  return (
    <GameProvider>
      <h1>Battleship Game</h1>
      <Modal />
      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        <GameBoard title="Tu Tablero" type="user" />
        <GameBoard title="Tablero del Computador" type="computer" />
      </div>
    <FinalModal/>
    </GameProvider>
  );
}

export default App;
