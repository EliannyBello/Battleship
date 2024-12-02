import React from "react";
import ReactDOM from "react-dom";
import PlayUserBoard from './PlayUserBoard.jsx'
import '../stlyle/modal.css'

const Modal = () => {
  return ReactDOM.createPortal(
    <PlayUserBoard />,
    document.getElementById("modal")
  );
};

export default Modal;
