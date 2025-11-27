import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RecuperarContrasena.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5160";

export default function RecuperarContrasena() {
  const [usuario, setUsuario] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("recuperar-body");
    return () => {
      document.body.classList.remove("recuperar-body");
    };
  }, []);

  const showSuccess = (msg) => {
    setMensaje(msg);
    setTimeout(() => setMensaje(""), 4000);
  };

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/recuperarcontrasena/solicitar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre_Usuario: usuario }),
      });

      if (!res.ok) throw new Error(await res.text() || "Error al enviar correo");

      showSuccess("✅ Se envió un correo a tu cuenta. Revisa tu email.");
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <>
      <form className="recuperar-container" onSubmit={handleSubmit}>
        {/* Botón de volver */}
        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/login")}
        >
          ← Volver
        </button>

        <h2>Recuperar contraseña</h2>

        <div className="recuperar-input-wrapper">
          <input
            type="text"
            placeholder="Usuario o Email"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Enviar correo
        </button>
      </form>

      {/* Toasts flotantes */}
      <div id="recuperar-toast-container">
        {mensaje && (
          <div className="recuperar-toast toast-success">
            {mensaje}
            <button className="close-toast" onClick={() => setMensaje("")}>
              ×
            </button>
          </div>
        )}
        {error && (
          <div className="recuperar-toast toast-error">
            {error}
            <button className="close-toast" onClick={() => setError("")}>
              ×
            </button>
          </div>
        )}
      </div>
    </>
  );
}
