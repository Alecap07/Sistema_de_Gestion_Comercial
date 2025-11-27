import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/Perfila.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5160";

export default function PerfilSeguridad() {
  const { user, logout } = useContext(AuthContext);

  // Estado de contraseña
  const [contraseñaActual, setContraseñaActual] = useState("");
  const [nuevaContraseña, setNuevaContraseña] = useState("");
  const [confirmarContraseña, setConfirmarContraseña] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Estado de preguntas y respuestas
  const [preguntas, setPreguntas] = useState([]);

  // Cargar preguntas al montar el componente
  useEffect(() => {
    if (user) cargarPreguntas();
  }, [user]);

  // 🔹 Cargar preguntas y respuestas del usuario
  const cargarPreguntas = async () => {
    try {
      const res = await fetch(`${API_URL}/api/respuestas`, {
        headers: { Authorization: `Bearer ${user?.Token}` },
      });
      if (!res.ok) throw new Error("Error al cargar preguntas");
      const data = await res.json();
      // Cada item: { Id_Pregun, Pregunta, Respuesta }
      setPreguntas(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // 🔹 Manejar cambio de contraseña
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (nuevaContraseña !== confirmarContraseña) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/usuario/cambiar-contraseña`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.Token}`,
        },
        body: JSON.stringify({
          ContraseñaActual: contraseñaActual,
          NuevaContraseña: nuevaContraseña,
        }),
      });

      if (!res.ok) throw new Error(await res.text() || "Error al cambiar contraseña");

      setMensaje("✅ Contraseña actualizada correctamente.");
      setContraseñaActual("");
      setNuevaContraseña("");
      setConfirmarContraseña("");
    } catch (err) {
      setError(err.message);
    }
  };

  // 🔹 Manejar cambios en las respuestas localmente
  const handleRespuestaChange = (idPregun, value) => {
    setPreguntas(prev =>
      prev.map(p => (p.Id_Pregun === idPregun ? { ...p, Respuesta: value } : p))
    );
  };

  // 🔹 Guardar respuestas actualizadas (PUT masivo)
  const handleGuardarRespuestas = async () => {
    setMensaje("");
    setError("");

    try {
      // Enviar todas las respuestas en un solo PUT masivo
      const res = await fetch(`${API_URL}/api/respuestas/masivo`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.Token}`,
        },
        body: JSON.stringify(
          preguntas.map(p => ({
            Id_Pregun: p.Id_Pregun,
            Respuesta: p.Respuesta
          }))
        ),
      });

      if (!res.ok) throw new Error(await res.text() || "Error al actualizar respuestas");

      setMensaje("✅ Respuestas actualizadas correctamente.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="perfil-seguridad">
      {/* 🔹 Cambiar contraseña */}
      <form className="perfil-form" onSubmit={handleChangePassword}>
        <h3 className="perfil-subtitulo">Cambiar contraseña</h3>
        {error && <p className="perfil-error">{error}</p>}
        {mensaje && <p className="perfil-mensaje">{mensaje}</p>}

        <label>Contraseña actual</label>
        <input
          type="password"
          value={contraseñaActual}
          onChange={e => setContraseñaActual(e.target.value)}
          required
        />

        <label>Nueva contraseña</label>
        <input
          type="password"
          value={nuevaContraseña}
          onChange={e => setNuevaContraseña(e.target.value)}
          required
        />

        <label>Confirmar nueva contraseña</label>
        <input
          type="password"
          value={confirmarContraseña}
          onChange={e => setConfirmarContraseña(e.target.value)}
          required
        />

        <button type="submit" className="perfil-guardar">Actualizar contraseña</button>
      </form>

      <div className="perfil-divider"></div>

      {/* 🔹 Respuestas de seguridad */}
      <div className="perfil-form">
        <h3 className="perfil-subtitulo">Respuestas de seguridad</h3>
        {preguntas.map(p => (
          <div key={p.Id_Pregun} style={{ marginBottom: "10px" }}>
            <strong>{p.Pregunta}</strong> {/* mostrar la pregunta arriba del input */}
            <input
              type="text"
              value={p.Respuesta || ""}
              onChange={e => handleRespuestaChange(p.Id_Pregun, e.target.value)}
              style={{ width: "100%", marginTop: "5px" }}
            />
          </div>
        ))}
        <button onClick={handleGuardarRespuestas} className="perfil-guardar">
          Guardar respuestas
        </button>
      </div>

      <div className="perfil-divider"></div>

      {/* 🔹 Cerrar sesión */}
      <div className="perfil-logout">
        <h3 className="perfil-subtitulo">Cerrar sesión</h3>
        <button onClick={logout} className="perfil-logout-btn">
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
