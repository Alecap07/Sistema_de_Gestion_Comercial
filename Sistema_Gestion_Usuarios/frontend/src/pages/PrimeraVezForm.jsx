import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ importamos navigate
import { AuthContext } from "../context/AuthContext";
import "../styles/PrimeraVezForm.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5160";

export default function PrimeraVezForm() {
  const { user, logout, login } = useContext(AuthContext);
  const navigate = useNavigate(); // ✅ hook para redirigir

  const [nuevaContraseña, setNuevaContraseña] = useState("");
  const [confirmarContraseña, setConfirmarContraseña] = useState("");
  const [preguntas, setPreguntas] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Bloquear acceso si no es primera vez
  useEffect(() => {
    if (!user?.PrimeraVez) {
      setError("No tiene permiso para acceder a este formulario.");
      return;
    }
    cargarPreguntas();
  }, [user]);

  // Cargar preguntas aleatorias
  const cargarPreguntas = async () => {
    try {
      const token = user?.Token;

      const res = await fetch(`${API_URL}/api/pregunta/random/6`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("No se pudieron cargar las preguntas");

      const data = await res.json();
      // Agregamos la propiedad 'Texto' para las respuestas
      const preguntasConRespuesta = data.map((p) => ({ ...p, Texto: "" }));
      setPreguntas(preguntasConRespuesta);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al cargar las preguntas.");
    }
  };

  // Manejo del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (nuevaContraseña !== confirmarContraseña) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const token = user?.Token;

    try {
      // Cambiar contraseña primera vez
      const resPass = await fetch(`${API_URL}/api/usuario/cambiar-contraseña-primera-vez`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ NuevaContraseña: nuevaContraseña }),
      });

      if (!resPass.ok) {
        const msg = await resPass.text();
        throw new Error(msg || "Error al cambiar la contraseña");
      }

      // Guardar respuestas de seguridad
      const respuestas = preguntas
        .filter((p) => p.Texto && p.Texto.trim() !== "")
        .map((p) => ({
          Id_Pregun: p.Id,
          Respuesta: p.Texto, // ✅ coincide con RespuestaDto
        }));

      if (respuestas.length > 0) {
        const resResp = await fetch(`${API_URL}/api/respuestas`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(respuestas),
        });

        if (!resResp.ok) {
          const msg = await resResp.text();
          console.warn(`No se pudieron guardar las respuestas: ${msg}`);
        }
      }

      // Actualizar flag de PrimeraVez a false
      const updatedUser = { ...user, PrimeraVez: false };
      login(updatedUser);

      setMensaje("✅ Formulario completado correctamente.");
      setNuevaContraseña("");
      setConfirmarContraseña("");

      // 🔹 REDIRIGIR AL HOME / PANEL DE USUARIO
      navigate("/panelUsuario"); // //aca cambiar si tu ruta del home es otra
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al completar el formulario");
    }
  };

  const handleRespuestaChange = (id, value) => {
    setPreguntas((prev) =>
      prev.map((p) => (p.Id === id ? { ...p, Texto: value } : p))
    );
  };

  // Bloqueo si no es primera vez
  if (!user?.PrimeraVez) {
    return (
      <div className="primera-vez-container">
        <h3>{error || "No tiene permiso para acceder a este formulario."}</h3>
        <button onClick={logout}>Cerrar sesión</button>
      </div>
    );
  }

  return (
    <div className="primera-vez-container">
      <h2>Bienvenido! Completa tu primera vez</h2>
      {error && <p className="error">{error}</p>}
      {mensaje && <p className="mensaje">{mensaje}</p>}

      <form onSubmit={handleSubmit}>
        <label>Nueva contraseña</label>
        <input
          type="password"
          value={nuevaContraseña}
          onChange={(e) => setNuevaContraseña(e.target.value)}
          required
        />

        <label>Confirmar contraseña</label>
        <input
          type="password"
          value={confirmarContraseña}
          onChange={(e) => setConfirmarContraseña(e.target.value)}
          required
        />

        <h3>Responde las preguntas de seguridad</h3>
        {preguntas.map((p) => (
          <div key={p.Id} className="pregunta-item">
            <label>{p.Pregunta}</label>
            <input
              type="text"
              value={p.Texto || ""}
              onChange={(e) => handleRespuestaChange(p.Id, e.target.value)}
              required
            />
          </div>
        ))}

        <button type="submit">Completar registro</button>
      </form>
    </div>
  );
}
