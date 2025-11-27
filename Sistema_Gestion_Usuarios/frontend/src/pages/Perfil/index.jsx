import React, { useState } from "react";
import PerfilDatos from "./PerfilDatos";
import PerfilSeguridad from "./PerfilSeguridad";
import "../../styles/Perfila.css";

export default function Perfil() {
  const [activeTab, setActiveTab] = useState("datos");

  return (
    <div className="perfil-container">
      <h2>Mi Perfil</h2>

      <div className="tabs">
        <button
          className={activeTab === "datos" ? "active" : ""}
          onClick={() => setActiveTab("datos")}
        >
          Datos
        </button>
        <button
          className={activeTab === "seguridad" ? "active" : ""}
          onClick={() => setActiveTab("seguridad")}
        >
          Seguridad
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "datos" && <PerfilDatos />}
        {activeTab === "seguridad" && <PerfilSeguridad />}
      </div>
    </div>
  );
}
