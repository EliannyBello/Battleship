import React from "react";
import { GameProvider } from "../src/Context/GameContext";
import Modal from "./components/modal";
import GameBoard from "./components/GameBoard";
import FinalModal from "./components/FinalModal";
import './stlyle/board.css'
import './stlyle/app.css'


function App() {
  return (
    <GameProvider>
    <header className="app-header">
      <h1>Battleship Game</h1>
      <h2>One Piece</h2>
    </header>
    <main className="app-main">
      <Modal />
      <section className="boards-container">
        <div className="board-section">
          <h2>Piratas</h2>
          <GameBoard title="Tu Tablero" type="user" />
        </div>
        <div className="board-section">
          <h2>Marina</h2>
          <GameBoard title="Tablero del Computador" type="computer" />
        </div>
      </section>
      <FinalModal />
    </main>
  </GameProvider>
  );
}

export default App;
