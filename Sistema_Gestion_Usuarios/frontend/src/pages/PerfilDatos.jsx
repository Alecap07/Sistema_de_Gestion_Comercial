import React, { useState, useEffect, useContext } from "react";
import "../styles/PerfilDatos.css";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaHome, FaUser, FaCog } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5160";
// Detectar modo oscuro/claro
const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

export default function PerfilDatos() {
  const { user: contextUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.body.classList.add("perfil-page-body");

    const fetchPerfil = async () => {
      try {
        const token = contextUser?.Token || localStorage.getItem("token");
        if (!token) throw new Error("Token no encontrado");

        const res = await fetch(`${API_URL}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 401) {
            logout();
            return;
          }
          throw new Error("Error al obtener los datos del perfil");
        }

        const data = await res.json();
        setPerfil(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
    return () => document.body.classList.remove("perfil-page-body");
  }, [contextUser, logout]);

  if (loading) return <p className="p-6">Cargando datos...</p>;
  if (error) return <p className="p-6 perfil-error">{error}</p>;
  if (!perfil) return <p className="p-6">No se encontraron datos.</p>;

  // 🔹 Ajuste a la nueva estructura
  const persona = perfil.usuario?.Persona || {};
  const nombreUsuario = perfil.usuario?.Nombre_Usuario || "";

return (
  <div className="perfil-container">
    {/* HEADER BOTONES */}
    <div className="perfil-header">
      <div className="icon-container">
        <button
          className={`neu-button ${
            location.pathname === "/perfil"
              ? `active ${isDark ? "dark-mode" : "light-mode"}`
              : ""
          }`}
          onClick={() => navigate("/perfil")}
        >
          <FaHome className="perfil-icon" />
          <span className="perfil-btn-text">Inicio</span>
        </button>

        <button
          className={`neu-button ${
            location.pathname === "/perfil/datos"
              ? `active ${isDark ? "dark-mode" : "light-mode"}`
              : ""
          }`}
          onClick={() => navigate("/perfil/datos")}
        >
          <FaUser className="perfil-icon" />
          <span className="perfil-btn-text">Datos</span>
        </button>
      </div>
    </div>


      {/* FORMULARIO DE DATOS */}
      <form className="perfil-form">
        <div className="perfil-row">
          <div className="perfil-input-wrapper">
            <label>Nombre</label>
            <input
              type="text"
              value={persona.Nombre || ""}
              readOnly
              className="glass-input"
            />
          </div>
          <div className="perfil-input-wrapper">
            <label>Apellido</label>
            <input
              type="text"
              value={persona.Apellido || ""}
              readOnly
              className="glass-input"
            />
          </div>
        </div>

        <div className="perfil-row">
          <div className="perfil-input-wrapper">
            <label>Usuario</label>
            <input
              type="text"
              value={nombreUsuario}
              readOnly
              className="glass-input"
            />
          </div>
          <div className="perfil-input-wrapper">
            <label>Correo</label>
            <input
              type="email"
              value={persona.Email_Personal || ""}
              readOnly
              className="glass-input"
            />
          </div>
        </div>

        <div className="perfil-row">
          <div className="perfil-input-wrapper">
            <label>Teléfono</label>
            <input
              type="text"
              value={persona.Telefono || ""}
              readOnly
              className="glass-input"
            />
          </div>
          <div className="perfil-input-wrapper">
            <label>Documento</label>
            <input
              type="text"
              value={persona.Num_Doc || ""}
              readOnly
              className="glass-input"
            />
          </div>
        </div>

        <div className="perfil-row">
          <div className="perfil-input-wrapper">
            <label>CUIL</label>
            <input
              type="text"
              value={persona.Cuil || ""}
              readOnly
              className="glass-input"
            />
          </div>
          <div className="perfil-input-wrapper">
            <label>Provincia</label>
            <input
              type="text"
              value={persona.ProvinciaNombre || ""}
              readOnly
              className="glass-input"
            />
          </div>
        </div>

        <div className="perfil-row">
          <div className="perfil-input-wrapper">
            <label>Partido</label>
            <input
              type="text"
              value={persona.PartidoNombre || ""}
              readOnly
              className="glass-input"
            />
          </div>
          <div className="perfil-input-wrapper">
            <label>Localidad</label>
            <input
              type="text"
              value={persona.LocalidadNombre || ""}
              readOnly
              className="glass-input"
            />
          </div>
        </div>

        <div className="perfil-row">
          <div className="perfil-input-wrapper">
            <label>Creado en</label>
            <input
              type="text"
              value={
                perfil.usuario?.Fecha_Usu_Cambio
                  ? new Date(perfil.usuario.Fecha_Usu_Cambio).toLocaleDateString()
                  : "-"
              }
              readOnly
              className="glass-input"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
