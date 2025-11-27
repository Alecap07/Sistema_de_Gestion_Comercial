import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/RespuestaPrimeraVez.css";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5160";

export default function RespuestaPrimeraVez() {
  const { user, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [preguntas, setPreguntas] = useState([]);
  const [toastMensaje, setToastMensaje] = useState("");
  const [toastError, setToastError] = useState("");

  useEffect(() => {
    if (!user?.PrimeraVez) {
      navigate("/dashboard");
      return;
    }
    document.body.classList.add("respuesta-primeraVez-body");
    if (user) cargarPreguntas();

    return () => document.body.classList.remove("respuesta-primeraVez-body");
  }, [user, navigate]);

  const cargarPreguntas = async () => {
    try {
      const res = await fetch(`${API_URL}/api/pregunta/random/6`, {
        headers: { Authorization: `Bearer ${user?.Token}` },
      });
      if (!res.ok) throw new Error("No se pudieron cargar las preguntas");
      const data = await res.json();
      const preguntasConRes = data.map((p) => ({ ...p, Texto: "" }));
      setPreguntas(preguntasConRes);
    } catch (err) {
      setToastError(err.message);
      setTimeout(() => setToastError(""), 4000);
    }
  };

  const handleRespuestaChange = (id, value) => {
    setPreguntas((prev) =>
      prev.map((p) => (p.Id === id ? { ...p, Texto: value } : p))
    );
  };

  const handleGuardarRespuestas = async () => {
    setToastMensaje("");
    setToastError("");

    const respuestas = preguntas
      .filter((p) => p.Texto && p.Texto.trim() !== "")
      .map((p) => ({
        Id_Pregun: p.Id,
        Respuesta: p.Texto,
      }));

    if (respuestas.length < preguntas.length) {
      setToastError("❌ Debes responder todas las preguntas.");
      setTimeout(() => setToastError(""), 4000);
      return;
    }

    try {
      // Borrar respuestas anteriores (si las hubiera)
      await fetch(`${API_URL}/api/respuestas/usuario/${user.Id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.Token}` },
      });

      // Guardar nuevas respuestas
      const res = await fetch(`${API_URL}/api/respuestas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.Token}`,
        },
        body: JSON.stringify(respuestas),
      });

      if (!res.ok)
        throw new Error((await res.text()) || "Error al guardar respuestas");

      // Mostrar confirmación y cerrar sesión
      setToastMensaje("✅ Respuestas guardadas correctamente. Cerrando sesión...");

      setTimeout(() => {
        logout(); // 🔹 Cierra sesión y limpia el contexto/localStorage
        navigate("/login"); // 🔹 Redirige al login
      }, 2000);
    } catch (err) {
      setToastError("❌ Error al guardar respuestas");
      setTimeout(() => setToastError(""), 4000);
    }
  };

  return (
    <div className="respuesta-primeraVez-container">
      <h3 className="respuesta-primeraVez-subtitulo">
        Respuestas de seguridad para recuperación
      </h3>

      {preguntas.length > 0 ? (
        preguntas.map((p) => (
          <div key={p.Id} className="respuesta-primeraVez-item">
            <label className="respuesta-primeraVez-label">{p.Pregunta}</label>
            <input
              type="text"
              value={p.Texto || ""}
              onChange={(e) => handleRespuestaChange(p.Id, e.target.value)}
              placeholder="Escribe tu respuesta..."
              className="respuesta-primeraVez-input"
              required
            />
          </div>
        ))
      ) : (
        <p>Cargando preguntas de seguridad...</p>
      )}

      <button
        onClick={handleGuardarRespuestas}
        className="respuesta-primeraVez-guardar"
      >
        Guardar respuestas
      </button>

      {toastMensaje &&
        ReactDOM.createPortal(
          <div className="respuesta-primeraVez-toast glass">{toastMensaje}</div>,
          document.body
        )}
      {toastError &&
        ReactDOM.createPortal(
          <div className="respuesta-primeraVez-toast glass respuesta-primeraVez-error-toast">
            {toastError}
          </div>,
          document.body
        )}
    </div>
  );
}
