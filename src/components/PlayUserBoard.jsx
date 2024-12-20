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
import Swal from 'sweetalert2'

const BOARD_SIZE = 10

const shipsConfig = [
  { name: "Luffy", size: 3, img: luffyShip, avatar: LuffyAvatar },
  { name: "Big Mama", size: 2, img: mamaShip, avatar: BigMomAvatar },
  { name: "Kid", size: 2, img: kidShip, avatar: KidAvatar },
  { name: "Shanks", size: 3, img: shanksShip, avatar: ShanksAvatar },
];

function PlayUserBoard() {
  const { isModalOpen, handleUserShipsPlacement, userBoard, setUserBoard } = useContext(GameContext);


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
      Swal.fire({
        title: "Ya existe un barco aquí",
        icon: "error",
        draggable: true
      });
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
      Swal.fire({
        title: "Asegurate de colocar todos tus barcos",
        icon: "error",
        draggable: true
      });
      return

      
    } else {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "¡Que comience la batalla!",
        showConfirmButton: false,
        timer: 1500
      });
      handleUserShipsPlacement(userBoard);
    }

  };



  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Coloca tus barcos</h2>
        <div className="ships-container">
          {shipsConfig.map((ship) => (
            <div key={ship.name} className="ship-info">
              <img
                src={ship.avatar}
                alt={`${ship.name} Avatar`}
                className={`ship ${selectedShip === ship ? "selected" : ""}`}
                draggable
                onDragStart={() => handleDragStart(ship)}
              />
              <h4 className="ship-name">{ship.name}</h4>
              <p className="ship-size">Casillas:{ship.size}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setIsHorizontal(!isHorizontal)}>
          Cambiar a {isHorizontal ? "Vertical" : "Horizontal"}
        </button>
        <div className="board">
          {userBoard.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`board-cell ${cell ? "occupied" : ""}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(rowIndex, colIndex)}
              >
                {cell?.img && (
                  <img src={cell.img} alt={cell.ship} style={{ width: "100%", height: "100%" }} />
                )}
              </div>
            ))
          )}
        </div>
        <button onClick={handlePlaceShips}>Comenzar</button>
      </div>
    </div>

  );
}

export default PlayUserBoard;
