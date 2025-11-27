import React, { useState, useEffect, useRef, useContext } from "react";
import ReactDOM from "react-dom";
import "../styles/perfil.css";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
// Mantenemos FaLock/FaLockOpen para el botón de editar
// Usamos FaEye/FaEyeSlash para el único botón de mostrar/ocultar
import { FaLock, FaLockOpen, FaEye, FaEyeSlash, FaUser, FaHome } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5160";

export default function Perfil() {
  const { user: contextUser, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState(null);

  // Contraseña
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [passwordRepetir, setPasswordRepetir] = useState("");
  const [mensajeContraseña, setMensajeContraseña] = useState("");
  const [errorContraseña, setErrorContraseña] = useState("");
  // editable.contraseña controla si se ven los inputs de nueva contraseña
  const [editable, setEditable] = useState({ contraseña: false });

  // Mostrar/ocultar contraseña (Estado UNIFICADO para las 3 contraseñas)
  const [showPasswords, setShowPasswords] = useState(false); 

  const [fotoPreview, setFotoPreview] = useState(null);
  const [fotoFile, setFotoFile] = useState(null);
  const fileInputRef = useRef(null);

  // Detectar responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // PERFIL DATA DESDE API
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
          if (res.status === 401) return;
          throw new Error("Error al obtener los datos del perfil");
        }

        const data = await res.json();
        setPerfil(data);
        setUser({
          nombre: data.usuario?.Persona?.Nombre || "",
          apellido: data.usuario?.Persona?.Apellido || "",
          Nombre_Usuario: data.usuario?.Nombre_Usuario || "",
          Token: token,
          foto_url: contextUser?.foto_url || data.usuario?.foto_url,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
    return () => document.body.classList.remove("perfil-page-body");
  }, [contextUser]);

  const handleFotoChange = (file) => {
    setFotoPreview(URL.createObjectURL(file));
    setFotoFile(file);
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const showErrorPassword = async (error) => {
    let errMsg = "❌ Error al cambiar la contraseña. Intente de nuevo.";
    if (error instanceof Error) {
      try {
        const errorText = error.message;
        const errorData = JSON.parse(errorText);
        errMsg = `❌ ${errorData.message || errMsg}`;
      } catch {
        errMsg = error.message.includes("Error:")
          ? `❌ ${error.message.split("Error: ")[1]}`
          : `❌ ${error.message}`;
      }
    } else {
      errMsg = `❌ ${error}`;
    }
    setErrorContraseña(errMsg);
    setTimeout(() => setErrorContraseña(""), 4000);
  };

  // Actualizar perfil
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setMensajeContraseña("");
    setErrorContraseña("");
    setSuccessMsg("");

    let passwordChangeSuccessful = false;

    if (editable.contraseña) {
      if (passwordNueva !== passwordRepetir) {
        showErrorPassword("Las contraseñas no coinciden");
        return;
      }

      if (passwordNueva && passwordNueva === passwordActual) {
        showErrorPassword(
          "La nueva contraseña no puede ser igual a la contraseña actual."
        );
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/usuario/cambiar-contraseña`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.Token || contextUser?.Token}`,
          },
          body: JSON.stringify({
            ContraseñaActual: passwordActual,
            NuevaContraseña: passwordNueva,
          }),
        });

        if (!res.ok)
          throw new Error((await res.text()) || "Error al cambiar contraseña");

        setMensajeContraseña("✅ Contraseña actualizada correctamente.");
        setTimeout(() => setMensajeContraseña(""), 4000);
        passwordChangeSuccessful = true;
      } catch (err) {
        showErrorPassword(err);
        return;
      }
    }

    const sessionDataForNavbar = {
      Nombre_Usuario: user.Nombre_Usuario,
      Token: user.Token,
      foto_url: fotoPreview || contextUser?.foto_url,
    };

    login(sessionDataForNavbar);

    if (!editable.contraseña || (editable.contraseña && passwordChangeSuccessful)) {
      showSuccess("✅ Perfil actualizado correctamente");
    }

    setPasswordActual("");
    setPasswordNueva("");
    setPasswordRepetir("");
    setEditable({ contraseña: false });
    setFotoFile(null);
    setFotoPreview(null);
    // IMPORTANTE: Reiniciar el estado del ojo también
    setShowPasswords(false); 
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  // Función unificada para togglear la edición
  const toggleEditable = () => {
    setEditable((prev) => ({ ...prev, contraseña: !prev.contraseña }));
    // Opcional: limpiar las contraseñas al salir del modo edición
    if (editable.contraseña) {
        setPasswordActual("");
        setPasswordNueva("");
        setPasswordRepetir("");
    }
    // Opcional: ocultar las contraseñas al salir del modo edición
    setShowPasswords(false); 
  };
  
  // Función unificada para mostrar/ocultar todas las contraseñas
  const toggleShowPasswords = () => {
    setShowPasswords((prev) => !prev);
  };


  if (loading) return <p className="p-6">Cargando perfil...</p>;
  if (error) return <p className="p-6 perfil-error">{error}</p>;
  if (!perfil) return <p className="p-6">No se encontraron datos.</p>;

  // Detectar modo oscuro/claro
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  return (
    <div className="perfil-container">
      {/* HEADER BOTONES */}
      <div className="perfil-header">
        <div className="icon-container">
          <div className="button-wrap">
            <div className="button-shadow"></div>
            <button
              className={`neu-button ${
                location.pathname === "/perfil"
                  ? `active ${isDark ? "dark-mode" : "light-mode"}`
                  : ""
              }`}
              onClick={() => navigate("/perfil")}
            >
              <FaHome className="perfil-icon" />
              {!isMobile && <span>Inicio</span>}
            </button>
          </div>

          <div className="button-wrap">
            <div className="button-shadow"></div>
            <button
              className={`neu-button ${
                location.pathname === "/perfil/datos"
                  ? `active ${isDark ? "dark-mode" : "light-mode"}`
                  : ""
              }`}
              onClick={() => navigate("/perfil/datos")}
            >
              <FaUser className="perfil-icon" />
              {!isMobile && <span>Datos</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Avatar y nombre */}
      <div className="perfil-avatar">
        <img
          src={
            fotoPreview ||
            (user?.foto_url
              ? user.foto_url
              : `https://ui-avatars.com/api/?name=${user?.Nombre_Usuario || user?.nombre}+${user?.Apellido || user?.apellido}`)
          }
          alt="Avatar"
          className="perfil-foto"
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) =>
            e.target.files && handleFotoChange(e.target.files[0])
          }
        />
        <button
          type="button"
          className="perfil-btn-secundario"
          onClick={() => fileInputRef.current?.click()}
        >
          Cambiar foto
        </button>
      </div>

      <h1 className="perfil-nombre">
        {user?.nombre} {user?.apellido}
      </h1>
      <p className="perfil-info">{user?.Nombre_Usuario}</p>

      <form className="perfil-form" onSubmit={handleSubmit}>
        <div className="perfil-row">
          <div className="perfil-input-wrapper">
            <label>Nombre</label>
            <input type="text" value={user?.nombre || ""} readOnly />
          </div>
          <div className="perfil-input-wrapper">
            <label>Apellido</label>
            <input type="text" value={user?.apellido || ""} readOnly />
          </div>
        </div>

        <div className="perfil-input-wrapper">
          <label>Usuario</label>
          <input type="text" value={user?.Nombre_Usuario || ""} readOnly />
        </div>

        {/* --- Botón Único para Editar Contraseña --- */}
        <div className="perfil-input-wrapper perfil-edit-password-button-wrapper">
            <button
                type="button"
                className={`perfil-btn-secundario perfil-edit-password-button ${editable.contraseña ? 'active' : ''}`}
                onClick={toggleEditable}
            >
                {editable.contraseña ? <FaLockOpen className="mr-2" /> : <FaLock className="mr-2" />}
                {editable.contraseña ? 'Cancelar Edición' : 'Cambiar Contraseña'}
            </button>
        </div>
        
        {/* Contraseña Actual */}
        <div className="perfil-input-wrapper">
          <label>Contraseña actual</label>
          <div className="perfil-password-container">
            <input
              // El tipo depende del estado UNIFICADO
              type={showPasswords ? "text" : "password"} 
              value={passwordActual}
              readOnly={!editable.contraseña}
              onChange={(e) => setPasswordActual(e.target.value)}
            />
            
            {/* OJO ÚNICO para mostrar/ocultar. Se muestra solo en modo edición */}
            {editable.contraseña && (
                <span
                  className="perfil-edit-icon"
                  onClick={toggleShowPasswords}
                >
                  {showPasswords ? <FaEyeSlash /> : <FaEye />}
                </span>
            )}
            
          </div>
        </div>

        {editable.contraseña && (
          <>
            {/* Nueva contraseña */}
            <div className="perfil-input-wrapper">
              <label>Nueva contraseña</label>
              <div className="perfil-password-container">
                <input
                  // El tipo depende del estado UNIFICADO
                  type={showPasswords ? "text" : "password"} 
                  value={passwordNueva}
                  onChange={(e) => setPasswordNueva(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Confirmar nueva contraseña */}
            <div className="perfil-input-wrapper">
              <label>Confirmar nueva contraseña</label>
              <div className="perfil-password-container">
                <input
                  // El tipo depende del estado UNIFICADO
                  type={showPasswords ? "text" : "password"} 
                  value={passwordRepetir}
                  onChange={(e) => setPasswordRepetir(e.target.value)}
                  required
                />
              </div>
            </div>
          </>
        )}

        <button type="submit" className="guardar">
          <center>Guardar cambios</center>
        </button>
      </form>

      {/* TOASTS FLOTANTES */}
      {successMsg &&
        ReactDOM.createPortal(
          <div className="perfil-toast glass">{successMsg}</div>,
          document.body
        )}
      {mensajeContraseña &&
        ReactDOM.createPortal(
          <div className="perfil-toast glass">{mensajeContraseña}</div>,
          document.body
        )}
      {errorContraseña &&
        ReactDOM.createPortal(
          <div className="perfil-toast glass perfil-error-toast">
            {errorContraseña}
          </div>,
          document.body
        )}
    </div>
  );
}