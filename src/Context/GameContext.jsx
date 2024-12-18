import React, { createContext, useState, useEffect } from "react";
import { userShips as userShipsData } from "../data";
import { computerShips as computerShipsData } from "../data";
import Swal from 'sweetalert2'


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



  const checkWinCondition = (remainingShips, player) => {
    if (remainingShips === 0 && !winner) {
      setWinner(player);
      setTurn(null);
    }
  };


  //logica de ataque del usuario

  const handleAttack = (row, col) => {
    if (turn === "user" && !winner) {
      const board = [...computerBoard];

      if (board[row][col]?.hit || board[row][col]?.miss) {
        Swal.fire({
          title: "Ya atacaste esta celda, elige",
          icon: "error",
          draggable: true
        });
        return; 
      }

      if (board[row][col] && board[row][col].ship) {
        const shipName = board[row][col].ship;

        
        board[row][col] = { ...board[row][col], hit: true };
        setUserHits((prev) => [...prev, { row, col }]);

       
        setComputerShipStatus((prevStatus) => {
          const updatedStatus = prevStatus.map((s) =>
            s.name === shipName ? { ...s, hits: s.hits + 1 } : s
          );

          const currentShip = updatedStatus.find((s) => s.name === shipName);
          if (currentShip && currentShip.hits === currentShip.size && !currentShip.sunk) {
            setComputerShipsLeft((prev) => prev - currentShip.size);
            
            return updatedStatus.map((s) =>
              s.name === shipName ? { ...s, sunk: true } : s
            );
          }

          return updatedStatus;
        });
      } else if (!board[row][col]) {
        board[row][col] = { miss: true };
      }

      setComputerBoard(board);

      
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
  
      if (pendingAttacks.length > 0) {
        const nextAttack = pendingAttacks.shift();
        ({ r: row, c: col } = nextAttack);
      } else {
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
        const shipName = board[row][col].ship;
        board[row][col] = { ...board[row][col], hit: true };
        setComputerHits((prev) => [...prev, { row, col }]);
        setUserShipStatus((prevStatus) =>
          prevStatus.map((ship) =>
            ship.name === shipName
              ? {
                  ...ship,
                  hits: ship.hits + 1,
                  sunk: ship.hits + 1 === ship.size,
                }
              : ship
          )
        );
  
        if (userShipStatus.some(ship => ship.name === shipName && ship.hits + 1 === ship.size)) {
          setUserShips((prev) => prev - userShipStatus.find(ship => ship.name === shipName).size);
        }
  
        const validAdjacents = getAdjacentCells(row, col).filter(
          ({ r, c }) =>
            r >= 0 &&
            c >= 0 &&
            r < 10 &&
            c < 10 &&
            (!board[r][c] || (!board[r][c].hit && !board[r][c].miss))
        );
        setPendingAttacks((prev) => [...prev, ...validAdjacents]);
      } else {
        board[row][col] = { miss: true };
      }
  
      setUserBoard(board);
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
      
      return;
    }

    setUserBoard(updatedBoard);
    setIsModalOpen(false);
  };



  const placeComputerShips = () => {
    const board = initialBoard();

    const updatedShipStatus = [...computerShipStatus]; 

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

    setComputerBoard([...board]);
    setComputerShipStatus(updatedShipStatus); 
  };


  const placeShipOnBoard = (board, row, col, size, horizontal, shipName) => {
    
    for (let i = 0; i < size; i++) {
      const r = horizontal ? row : row + i;
      const c = horizontal ? col + i : col;

      if (r >= 10 || c >= 10 || board[r][c] !== null) {

        return false;
      }
    }

   
    for (let i = 0; i < size; i++) {
      const r = horizontal ? row : row + i;
      const c = horizontal ? col + i : col;
      board[r][c] = { ship: shipName, hit: false };
    }

    return true;
  };


  const resetGame = () => {
    // Resetea el estado del tablero del usuario y la computadora
    setUserBoard(initialBoard());
    setComputerBoard(initialBoard());
    
    // Resetea el estado de los barcos del usuario y la computadora
    setUserShips(userShipsData.reduce((sum, ship) => sum + ship.size, 0));
    setComputerShipsLeft(computerShipsData.reduce((sum, ship) => sum + ship.size, 0));
  
    // Resetea el estado de los impactos
    setUserHits([]);
    setComputerHits([]);
    setPendingAttacks([]);
  
    // Resetea el estado de los barcos
    setUserShipStatus(
      userShipsData.map((ship) => ({
        name: ship.name,
        size: ship.size,
        hits: 0,
        placed: false,
        sunk: false,
      }))
    );
    setComputerShipStatus(
      computerShipsData.map((ship) => ({
        name: ship.name,
        size: ship.size,
        hits: 0,
        placed: false,
        sunk: false,
      }))
    );
  
    // Resetea el turno y el ganador
    setTurn("user");
    setWinner(null);
  
    // Abre el modal para permitir la colocación de los barcos nuevamente
    setIsModalOpen(true);
  
    // Coloca los barcos del computador nuevamente
    placeComputerShips();
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
