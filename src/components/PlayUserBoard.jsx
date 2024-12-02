import React, { useContext, useState } from "react";
import { GameContext } from "../Context/GameContext";
import luffyShip from '../image/luffyShip.png';
import mamaShip from '../image/mamaShip.png';
import kidShip from '../image/kidShip.png';
import shanksShip from '../image/shanksShip.png';
import BigMomAvatar from '../image/BigMomAvatar.webp';
import KidAvatar from '../image/KidAvatar.jpg';
import LuffyAvatar from '../image/luffyAvatar.jpg';
import ShanksAvatar from '../image/ShanksAvatar.jpg';

const BOARD_SIZE = 10

const shipsConfig = [
  { name: "Luffy", size: 3, img: luffyShip, avatar: LuffyAvatar },
  { name: "Big Mama", size: 2, img: mamaShip, avatar: BigMomAvatar },
  { name: "Kid", size: 2, img: kidShip, avatar: KidAvatar },
  { name: "Shanks", size: 3, img: shanksShip, avatar: ShanksAvatar },
];

function PlayUserBoard() {
  const { isModalOpen, handleUserShipsPlacement, userBoard,setUserBoard} = useContext(GameContext);


  const [selectedShip, setSelectedShip] = useState(null);
  const [isHorizontal, setIsHorizontal] = useState(true);

  if (!isModalOpen) return null;

  const handleDragStart = (ship) => {
    setSelectedShip(ship);
  };

  const handleDrop = (row, col) => {
    if (!selectedShip) return;

    const newBoard = [...userBoard.map((r) => [...r])];

    if (canPlaceShip(newBoard, row, col, selectedShip.size, isHorizontal)) {
      placeShip(newBoard, row, col, selectedShip, isHorizontal);
      setUserBoard(newBoard);
      setSelectedShip(null);
    } else {
      alert("No puedes colocar el barco aquí.");
    }
  };

  const canPlaceShip = (board, row, col, size, horizontal) => {
    for (let i = 0; i < size; i++) {
      const r = horizontal ? row : row + i;
      const c = horizontal ? col + i : col;

      if (
        r < 0 || // Fuera del límite superior
        c < 0 || // Fuera del límite izquierdo
        r >= BOARD_SIZE || // Fuera del límite inferior
        c >= BOARD_SIZE || // Fuera del límite derecho
        board[r][c] !== null // Celda ya ocupada
      ) {
        return false;
      }
    }
    return true;
  };

  const placeShip = (board, row, col, ship, horizontal) => {
    for (let i = 0; i < ship.size; i++) {
      const r = horizontal ? row : row + i;
      const c = horizontal ? col + i : col;
      board[r][c] = { img: ship.img, ship: ship.name };
    }
  };

  const handlePlaceShips = () => {
    const placedShips = new Set(
      userBoard.flat().filter((cell) => cell && cell.ship).map((cell) => cell.ship)
    );

    const allShipsPlaced = shipsConfig.every((ship) => placedShips.has(ship.name));

    if (!allShipsPlaced) {
      alert("Asegúrate de colocar todos los barcos antes de comenzar.");
      return;
    }
    handleUserShipsPlacement(userBoard);
  };



  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Coloca tus barcos</h2>

        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          {shipsConfig.map((ship) => (
            <div key={ship.name}>
              <img
                src={ship.avatar}
                alt={`${ship.name} Avatar`}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  border: selectedShip === ship ? "2px solid blue" : "1px solid gray",
                }}
                draggable
                onDragStart={() => handleDragStart(ship)}
              />
              <p style={{ textAlign: "center", fontSize: "12px" }}>{ship.name}</p>
            </div>
          ))}
        </div>

       
        <button onClick={() => setIsHorizontal(!isHorizontal)}>
          Cambiar a {isHorizontal ? "Vertical" : "Horizontal"}
        </button>

     
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${BOARD_SIZE}, 30px)`,
            gap: "2px",
            marginTop: "20px",
          }}
        >
          {userBoard.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                style={{
                  width: "30px",
                  height: "30px",
                  position: "relative",
                  border: "1px solid black",
                  backgroundColor: cell ? "#d9edf7" : "white",
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(rowIndex, colIndex)}
              >
                {cell && (
                  <img
                    src={cell.img}
                    alt={cell.ship}
                    style={{
                      position: "absolute",
                      width: "30px",
                      height: "30px",
                      top: 0,
                      left: 0,
                    }}
                  />
                )}
              </div>
            ))
          )}
        </div>

 
        <button onClick={handlePlaceShips} style={{ marginTop: "20px" }}>
          Comenzar
        </button>
      </div>
    </div>
  );
}

export default PlayUserBoard;
