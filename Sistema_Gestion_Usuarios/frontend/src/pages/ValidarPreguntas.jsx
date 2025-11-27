import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/ValidarPreguntas.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5160";

export default function ValidarPreguntas() {
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [toastMensaje, setToastMensaje] = useState("");
  const [toastError, setToastError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const token = decodeURIComponent(
    new URLSearchParams(location.search).get("token") || ""
  );

  useEffect(() => {
    document.body.classList.add("validar-preguntas-body");
    if (!token) {
      setToastError("❌ Token inválido o ausente.");
      return;
    }

    const fetchPreguntas = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/recuperarcontrasena/preguntas?token=${token}`
        );
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setPreguntas(data);
      } catch (err) {
        setToastError(err.message || "❌ Error al cargar preguntas.");
        setTimeout(() => setToastError(""), 4000);
      }
    };

    fetchPreguntas();

    return () => document.body.classList.remove("validar-preguntas-body");
  }, [token]);

  const handleChange = (id, value) => {
    setRespuestas((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToastMensaje("");
    setToastError("");

    if (!token) {
      setToastError("❌ Token inválido o ausente.");
      return;
    }

    const respuestasArray = Object.keys(respuestas).map((id) => ({
      Id_Pregun: parseInt(id),
      Respuesta: respuestas[id],
    }));

    try {
      const res = await fetch(
        `${API_URL}/api/recuperarcontrasena/validar-respuestas`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Token: token,
            Respuestas: respuestasArray,
          }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "❌ Error al validar respuestas.");
      }

      setToastMensaje("✅ Respuestas correctas. Redirigiendo...");
      setTimeout(
        () => navigate(`/cambiar-contrasena?token=${encodeURIComponent(token)}`),
        1500
      );
    } catch (err) {
      setToastError(err.message || "❌ Error al validar respuestas.");
      setTimeout(() => setToastError(""), 4000);
    }
  };

  return (
    <div className="validar-preguntas-container">
      <h3 className="validar-preguntas-titulo">
        Validar tus preguntas de seguridad
      </h3>

      {preguntas.length === 0 && !toastError && (
        <p>Cargando preguntas de seguridad...</p>
      )}

      {preguntas.length > 0 && (
        <form onSubmit={handleSubmit} className="validar-preguntas-form">
          {preguntas.map((p) => (
            <div key={p.Id_Pregun} className="validar-preguntas-item">
              <label className="validar-preguntas-label">{p.Pregunta}</label>
              <input
                type="text"
                value={respuestas[p.Id_Pregun] || ""}
                onChange={(e) => handleChange(p.Id_Pregun, e.target.value)}
                placeholder="Escribe tu respuesta..."
                className="validar-preguntas-input"
                required
              />
            </div>
          ))}

          <button type="submit" className="validar-preguntas-boton">
            Validar respuestas
          </button>
        </form>
      )}

      {toastMensaje &&
        ReactDOM.createPortal(
          <div className="validar-preguntas-toast">{toastMensaje}</div>,
          document.body
        )}
      {toastError &&
        ReactDOM.createPortal(
          <div className="validar-preguntas-toast validar-preguntas-error-toast">
            {toastError}
          </div>,
          document.body
        )}
    </div>
  );
}
