import React, { createContext, useState, useEffect } from "react";
import { userShips as userShipsData } from "../data";
import { computerShips as computerShipsData } from "../data";

export const GameContext = createContext();

const initialBoard = () =>
  Array(10)
    .fill(null)
    .map(() => Array(10).fill(null));

export const GameProvider = ({ children }) => {
  const [userBoard, setUserBoard] = useState(initialBoard());
  const [computerBoard, setComputerBoard] = useState(initialBoard());
  const [turn, setTurn] = useState("user");
  const [winner, setWinner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [userHits, setUserHits] = useState([]);
  const [computerHits, setComputerHits] = useState([]);
  const [userShips, setUserShips] = useState(
    userShipsData.reduce((sum, ship) => sum + ship.size, 0)
  );
  const [computerShipsLeft, setComputerShipsLeft] = useState(
    computerShipsData.reduce((sum, ship) => sum + ship.size, 0)
  );

  const [pendingAttacks, setPendingAttacks] = useState([]);
  const [userShipStatus, setUserShipStatus] = useState(
    userShipsData.map((ship) => ({
      name: ship.name,
      size: ship.size,
      hits: 0,
    }))
  );

  const [computerShipStatus, setComputerShipStatus] = useState(
    computerShipsData.map((ship) => ({
      name: ship.name,
      size: ship.size,
      hits: 0,
      placed: false,
    }))
  );

  useEffect(() => {
    placeComputerShips();
    console.log("Tablero del computador:", computerBoard);
  }, []);

  useEffect(() => {
    if (computerShipsLeft === 0) {
      setWinner("Jugador");
    }
  }, [computerShipsLeft]);

  useEffect(() => {
    if (userShips === 0) {
      setWinner("Computador");
    }
  }, [userShips]);

  useEffect(() => {
    console.log("Estado actualizado del tablero del computador:", computerBoard);
    console.log("Estado de los barcos del computador:", computerShipStatus);
  }, [computerBoard, computerShipStatus]);

  const checkWinCondition = (remainingShips, player) => {
    if (remainingShips === 0 && !winner) {
      setWinner(player);
      setTurn(null);
      alert(`${player} ha ganado el juego!`);
    }
  };

  const handleAttack = (row, col) => {
    if (turn === "user" && !winner) {
      const board = [...computerBoard];
  
      if (board[row][col] && board[row][col].ship) {
        const shipName = board[row][col].ship;
  
        // Marca la celda como golpeada
        board[row][col] = { ...board[row][col], hit: true };
        setUserHits((prev) => [...prev, { row, col }]);
  
        // Actualiza el estado del barco golpeado
        setComputerShipStatus((prevStatus) => {
          const updatedStatus = prevStatus.map((s) =>
            s.name === shipName ? { ...s, hits: s.hits + 1 } : s
          );
  
          const currentShip = updatedStatus.find((s) => s.name === shipName);
          if (currentShip && currentShip.hits === currentShip.size) {
            setComputerShipsLeft((prev) => prev - 1);
          
          }
  
          return updatedStatus;
        });
      } else if (!board[row][col]) {
        // Marca la celda como fallida
        board[row][col] = { miss: true };
      }
  
      setComputerBoard(board);
  
      // Cambia el turno al computador si no hay ganador
      if (!winner) {
        setTurn("computer");
        setTimeout(computerAttack, 500);
      }
    }
  };
  const computerAttack = () => {
    if (!winner) {
      const board = [...userBoard];
      let row, col;
  
      // Si hay ataques pendientes, selecciona el siguiente
      if (pendingAttacks.length > 0) {
        const nextAttack = pendingAttacks.shift();
        ({ r: row, c: col } = nextAttack);
      } else {
        // Selecciona una celda al azar que no haya sido atacada
        let valid = false;
        while (!valid) {
          row = Math.floor(Math.random() * 10);
          col = Math.floor(Math.random() * 10);
          if (!board[row][col] || (!board[row][col].hit && !board[row][col].miss)) {
            valid = true;
          }
        }
      }
  
      if (board[row][col] && board[row][col].ship) {
        // Marca la celda como golpeada
        board[row][col] = { ...board[row][col], hit: true };
  
        setComputerHits((prev) => [...prev, { row, col }]);
  
        // Reduce el número de barcos restantes del usuario
        setUserShips((prev) => {
          const newShipsLeft = prev - 1;
          checkWinCondition(newShipsLeft, "Computador");
          return newShipsLeft;
        });
  
        // Agrega celdas adyacentes para futuros ataques
        const adjacent = getAdjacentCells(row, col);
        const validAdjacents = adjacent.filter(
          ({ r, c }) =>
            r >= 0 &&
            c >= 0 &&
            r < 10 &&
            c < 10 &&
            (!board[r][c] || (!board[r][c].hit && !board[r][c].miss))
        );
        setPendingAttacks((prev) => [...prev, ...validAdjacents]);
      } else {
        // Marca la celda como fallida
        board[row][col] = { miss: true };
      }
  
      setUserBoard(board);
  
      // Cambia el turno al usuario si no hay ganador
      if (!winner) {
        setTurn("user");
      }
    }
  };
    

  const getAdjacentCells = (row, col) => [
    { r: row - 1, c: col },
    { r: row + 1, c: col },
    { r: row, c: col - 1 },
    { r: row, c: col + 1 },
  ];

  const handleUserShipsPlacement = (updatedBoard) => {
    const placedShips = new Set(
      updatedBoard.flat().filter((cell) => cell && cell.ship).map((cell) => cell.ship)
    );

    if (placedShips.size !== 4) {
      alert("Debes colocar exactamente 4 barcos.");
      return;
    }

    setUserBoard(updatedBoard);
    setIsModalOpen(false);
  };

  const placeComputerShips = () => {
    const board = initialBoard();

    const updatedShipStatus = [...computerShipStatus]; // Copia para actualizar

    computerShipsData.forEach((ship, index) => {
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 100) {
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);
        const horizontal = Math.random() > 0.5;

        placed = placeShipOnBoard(board, row, col, ship.size, horizontal, ship.name);
        attempts++;
      }

      if (placed) {
        updatedShipStatus[index] = { ...ship, hits: 0, placed: true };
      } else {
        console.error(`No se pudo colocar el barco: ${ship.name} después de 100 intentos.`);
      }
    });

    setComputerBoard([...board]); // Actualiza el tablero
    setComputerShipStatus(updatedShipStatus); // Actualiza el estado de los barcos
  };

  const placeShipOnBoard = (board, row, col, size, horizontal, shipName) => {
    // Verifica que el barco cabe en la posición seleccionada
    for (let i = 0; i < size; i++) {
      const r = horizontal ? row : row + i;
      const c = horizontal ? col + i : col;
  
      if (r >= 10 || c >= 10 || board[r][c] !== null) {

        return false;
      }
    }
  
    // Coloca el barco en el tablero
    for (let i = 0; i < size; i++) {
      const r = horizontal ? row : row + i;
      const c = horizontal ? col + i : col;
      board[r][c] = { ship: shipName, hit: false};
    }
  
    return true;
  };
  

  const resetGame = () => {
    setUserBoard(initialBoard());
    setComputerBoard(initialBoard());
    setUserShips(4);
    setComputerShipsLeft(4);
    setUserHits([]);
    setComputerHits([]);
    setPendingAttacks([]);
    setWinner(null);
    setIsModalOpen(true);
  };

  return (
    <GameContext.Provider
      value={{
        userBoard,
        computerBoard,
        turn,
        winner,
        isModalOpen,
        userHits,
        computerHits,
        userShips,
        computerShipsLeft,
        setUserBoard,
        setComputerBoard,
        setTurn,
        handleAttack,
        placeComputerShips,
        setWinner,
        handleUserShipsPlacement,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};