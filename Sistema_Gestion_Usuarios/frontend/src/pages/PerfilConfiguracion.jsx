import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/PerfilConfiguracion.css";
import "../styles/Configuracion.css";
import { FaUserShield, FaSun, FaMoon, FaSignOutAlt, FaUserCog } from "react-icons/fa";
import ModalBase from "../components/ModalBase";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5160";

export default function PerfilConfiguracion() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [modalSeguridad, setModalSeguridad] = useState(false);
  const [preguntas, setPreguntas] = useState([]);
  const [errores, setErrores] = useState({});
  const [toastMensaje, setToastMensaje] = useState("");
  const [toastError, setToastError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      setIsDark(false);
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }

    if (user) cargarPreguntas();
  }, [user]);

  const handleToggleDarkMode = () => {
    if (isDark) {
      setIsDark(false);
      localStorage.setItem("theme", "light");
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      setIsDark(true);
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  };

  const cargarPreguntas = async () => {
    try {
      const res = await fetch(`${API_URL}/api/respuestas`, {
        headers: { Authorization: `Bearer ${user?.Token}` },
      });
      if (!res.ok) throw new Error("Error al cargar preguntas");
      const data = await res.json();
      setPreguntas(data);
    } catch (err) {
      setToastError(err.message);
      setTimeout(() => setToastError(""), 4000);
    }
  };

  const handleGuardarRespuestas = async () => {
    let valid = true;
    const nuevosErrores = {};
    preguntas.forEach((p) => {
      if (!p.Respuesta || p.Respuesta.trim() === "") {
        nuevosErrores[p.Id_Pregun] = "Esta respuesta no puede estar vacía.";
        valid = false;
      }
    });
    setErrores(nuevosErrores);
    if (!valid) return;

    try {
      const respuestasParaEnviar = preguntas.map((p) => ({
        Id_Pregun: p.Id_Pregun,
        Respuesta: p.Respuesta,
      }));

      const res = await fetch(`${API_URL}/api/respuestas/masivo`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.Token}`,
        },
        body: JSON.stringify(respuestasParaEnviar),
      });

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(`Error al guardar: ${errorData || res.statusText}`);
      }

      setToastMensaje("Respuestas guardadas correctamente");
      setModalSeguridad(false);
      setErrores({});
      setTimeout(() => setToastMensaje(""), 4000);
      cargarPreguntas();
    } catch (err) {
      setToastError(err.message);
      setTimeout(() => setToastError(""), 4000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const opciones = [
    {
      title: "Tema del sistema",
      desc: isDark ? "Modo oscuro activado" : "Modo claro activado",
      icon: isDark ? <FaMoon /> : <FaSun />,
      action: handleToggleDarkMode,
      isSwitch: true,
    },
    {
      title: "Preguntas de seguridad",
      desc: "Administrar tus preguntas de recuperación",
      icon: <FaUserShield />,
      action: () => setModalSeguridad(true),
    },
    {
      title: "Autenticación en dos pasos",
      desc: "Configurar autenticador de seguridad",
      icon: <FaUserShield />,
      action: () => alert("🔐 Próximamente disponible"),
    },
    {
      title: "Mi usuario",
      desc: "Editar información personal o credenciales",
      icon: <FaUserCog />,
      action: () => navigate("/perfil"),
    },
    {
      title: "Cerrar sesión",
      desc: "Salir de la cuenta actual",
      icon: <FaSignOutAlt />,
      action: handleLogout,
    },
  ];

  return (
    <div className="Container">
      <div className="opciones-container">
        <div className="Title-Container">
          <h1 className="Ttitle">Configuración de tu cuenta</h1>
        </div>

        <div className="opciones-list">
          {opciones.map((op, i) => (
            <div
              key={i}
              className="opcion-item"
              onClick={op.isSwitch ? handleToggleDarkMode : op.action}
            >
              <div className="opcion-info">
                <div className="opcion-icon">{op.icon}</div>
                <div className="opcion-text">
                  <h3>{op.title}</h3>
                  <p>{op.desc}</p>
                </div>
              </div>
              <div className="opcion-flecha">
                {op.isSwitch ? (
                  <input
                    type="checkbox"
                    className="theme-checkbox"
                    checked={isDark}
                    onChange={handleToggleDarkMode}
                  />
                ) : (
                  "›"
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalSeguridad &&
        ReactDOM.createPortal(
          <ModalBase
            title="Respuestas de seguridad"
            onClose={() => setModalSeguridad(false)}
          >
            <div className="perfil-crud-form">
              {preguntas.length > 0 ? (
                preguntas.map((p) => (
                  <div key={p.Id_Pregun} className="perfil-form-input-wrapper">
                    <label>{p.Pregunta}</label>
                    <input
                      type="text"
                      value={p.Respuesta || ""}
                      className={errores[p.Id_Pregun] ? "input-error" : ""}
                      onChange={(e) =>
                        setPreguntas((prev) =>
                          prev.map((pr) =>
                            pr.Id_Pregun === p.Id_Pregun
                              ? { ...pr, Respuesta: e.target.value }
                              : pr
                          )
                        )
                      }
                      placeholder="Escribe tu respuesta..."
                    />
                    {errores[p.Id_Pregun] && (
                      <span className="error-text">{errores[p.Id_Pregun]}</span>
                    )}
                  </div>
                ))
              ) : (
                <p>Cargando preguntas...</p>
              )}
            </div>

            <div className="perfil-form-buttons">
              <button
                className="submit-button"
                onClick={handleGuardarRespuestas}
              >
                Guardar
              </button>
              <button
                className="cancel-button"
                onClick={() => setModalSeguridad(false)}
              >
                Cerrar
              </button>
            </div>
          </ModalBase>,
          document.body
        )}
    </div>
  );
}
