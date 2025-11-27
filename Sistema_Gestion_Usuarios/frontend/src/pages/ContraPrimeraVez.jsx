import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/ContraPrimeraVez.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5160";

export default function ContraPrimeraVez() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [nuevaContraseña, setNuevaContraseña] = useState("");
  const [confirmarContraseña, setConfirmarContraseña] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [neutralMsg, setNeutralMsg] = useState(""); 

  useEffect(() => {
    document.body.classList.add("contra-primeraVez-body");

    if (!user?.PrimeraVez) {
      navigate("/panelUsuario");
    }

    
    setNeutralMsg("💬 Por ser su primer ingreso, debe cambiar su contraseña para continuar.");
    const timeout = setTimeout(() => setNeutralMsg(""), 4000);

    return () => {
      document.body.classList.remove("contra-primeraVez-body");
      clearTimeout(timeout);
    };
  }, [user, navigate]);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const showError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 4000);
  };

  const showNeutral = (msg) => {
    setNeutralMsg(msg);
    setTimeout(() => setNeutralMsg(""), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setNeutralMsg("");

    if (nuevaContraseña !== confirmarContraseña) {
      showError("❌ Las contraseñas no coinciden");
      return;
    }

    try {
      showNeutral("⏳ Cambiando contraseña...");

      const res = await fetch(`${API_URL}/api/usuario/cambiar-contraseña-primera-vez`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.Token}`,
        },
        body: JSON.stringify({ NuevaContraseña: nuevaContraseña }),
      });

      if (!res.ok) throw new Error(await res.text() || "Error al cambiar la contraseña");

      showSuccess("✅ Contraseña actualizada correctamente.");
      setTimeout(() => navigate("/respuesta-primera-vez"), 1500);
    } catch (err) {
      console.error(err);
      showError(err.message);
    }
  };

  return (
    <>
      <form className="contra-primeraVez-container" onSubmit={handleSubmit}>
        <h2>Cambia tu contraseña</h2>

        <div className="contra-input-wrapper">
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={nuevaContraseña}
            onChange={(e) => setNuevaContraseña(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <div className="contra-input-wrapper">
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmarContraseña}
            onChange={(e) => setConfirmarContraseña(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Guardar contraseña
        </button>
      </form>

      {/* Contenedor de toasts */}
      <div id="contra-toast-container">
        {neutralMsg && (
          <div className="contra-toast glass toast-neutral">
            {neutralMsg}
            <button className="close-toast" onClick={() => setNeutralMsg("")}>
              ×
            </button>
          </div>
        )}
        {successMsg && (
          <div className="contra-toast glass toast-success">
            {successMsg}
            <button className="close-toast" onClick={() => setSuccessMsg("")}>
              ×
            </button>
          </div>
        )}
        {errorMsg && (
          <div className="contra-toast glass toast-error">
            {errorMsg}
            <button className="close-toast" onClick={() => setErrorMsg("")}>
              ×
            </button>
          </div>
        )}
      </div>
    </>
  );
}
