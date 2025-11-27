// src/components/ModalBase.jsx
import React, { useEffect } from "react";
import "../styles/PersonaCrud.css"; 

export default function ModalBase({ title, onClose, children }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

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
