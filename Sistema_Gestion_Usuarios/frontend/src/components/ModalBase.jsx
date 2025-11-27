// src/components/ModalBase.jsx
import React from "react";
import "../styles/PersonaCrud.css"; 

export default function ModalBase({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="user-crud-form" onClick={(e) => e.stopPropagation()}>
        <button className="pregunta-close-button" onClick={onClose}>×</button>
        <h2 className="PTitle">{title}</h2>
        {children}
      </div>
    </div>
  );
}
