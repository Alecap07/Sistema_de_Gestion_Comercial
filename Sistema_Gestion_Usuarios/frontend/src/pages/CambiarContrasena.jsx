import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/CambiarContrasena.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5160";

export default function CambiarContrasena() {
  const [nuevaContraseña, setNuevaContraseña] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();
  const token = decodeURIComponent(
    new URLSearchParams(useLocation().search).get("token") || ""
  );

  useEffect(() => {
    document.body.classList.add("cambiar-contra-body");
    return () => document.body.classList.remove("cambiar-contra-body");
  }, []);

  const showToast = (msg, type = "success") => {
    if (type === "error") setErrorMsg(msg);
    else setSuccessMsg(msg);
    setTimeout(() => {
      setErrorMsg("");
      setSuccessMsg("");
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (nuevaContraseña !== confirmar) {
      showToast("❌ Las contraseñas no coinciden", "error");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/recuperarcontrasena/cambiar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Token: token,
          NuevaContraseña: nuevaContraseña,
        }),
      });

      if (!res.ok)
        throw new Error((await res.text()) || "Error al cambiar la contraseña");

      showToast("✅ Contraseña cambiada correctamente", "success");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <>
      <form className="cambiar-contra-container" onSubmit={handleSubmit}>
        <h2>Restablecer contraseña</h2>

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
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Cambiar contraseña
        </button>
      </form>

      <div id="toast-container">
        {successMsg && (
          <div className="toast glass toast-success">
            {successMsg}
            <button className="close-toast" onClick={() => setSuccessMsg("")}>
              ×
            </button>
          </div>
        )}
        {errorMsg && (
          <div className="toast glass toast-error">
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
