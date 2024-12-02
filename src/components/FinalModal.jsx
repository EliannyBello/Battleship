import React, { useContext } from "react";
import VictoryScreen from "./victoryScreen";
import ReactDOM from "react-dom";
import '../stlyle/finalModal.css'


function FinalModal() {
  return ReactDOM.createPortal(
    <VictoryScreen/>,
    document.getElementById("finalModal")
  );
}

export default FinalModal;