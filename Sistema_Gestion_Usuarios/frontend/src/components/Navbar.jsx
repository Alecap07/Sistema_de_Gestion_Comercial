import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import {
  IoHomeOutline,
  IoPersonAddOutline,
  IoPeopleOutline,
  IoHelp,
  IoBan,
  IoEllipsisVertical,
  IoPersonCircleOutline,
  IoPersonOutline,
  IoSettingsOutline,
  IoLogOutOutline,
  IoChatboxEllipses
} from "react-icons/io5";
import { MdControlPoint } from "react-icons/md";
import logoBlack from "../assets/logo.png";
import logoLight from "../assets/logo-white.png";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [permisos, setPermisos] = useState([]);
  const [theme, setTheme] = useState("light"); // light / dark

  useEffect(() => {
    // Detecta tema guardado en localStorage
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      setTheme("light");
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
      localStorage.setItem("theme", "light");
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      setTheme("dark");
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  };

  useEffect(() => {
    if (!user || !user.Token) return;

    fetch("http://localhost:5160/api/me", {
      headers: {
        "Authorization": `Bearer ${user.Token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.ok ? res.json() : Promise.reject(`HTTP ${res.status}`))
      .then(data => setPermisos(data.permisos || []))
      .catch(err => console.error(err));
  }, [user]);

  const cards = [
    { to: "/usuarios", icon: <IoPersonAddOutline />, title: "Usuarios", permiso: "GestionarUsuarios" },
    { to: "/personas", icon: <IoPeopleOutline />, title: "Personas", permiso: "GestionarPersonas" },
    { to: "/preguntas", icon: <IoHelp />, title: "Preguntas", permiso: "GestionarPreguntas" },
    { to: "/restricciones", icon: <IoBan />, title: "Restricciones", permiso: "GestionarRestricciones" },
    { to: "/permisos-usuario", icon: <IoPersonOutline />, title: "Permisos", permiso: "GestionarPermisos" },
    { to: "/asignar-permisos", icon: <MdControlPoint />, title: "Roles", permiso: "GestionarRoles" },
  ];

  const avatarUrl = user?.foto_url
    ? user.foto_url
    : `https://ui-avatars.com/api/?name=${user?.Nombre_Usuario || user?.nombre || "User"}+${user?.Apellido || user?.apellido || ""}`;

  return (
    <div className="nav-bg">
      <nav className="nav-glass">
        {/* Logo */}
        <div className="nav-logo">
          <Link to="/dashboard" className="nav-logo-link">
            <img
              src={logoBlack}
              alt="logo dark"
              id="logo-black"
              style={{ display: theme === "dark" ? "inline" : "none" }}
            />
            <img
              src={logoLight}
              alt="logo light"
              id="logo-light"
              style={{ display: theme === "light" ? "inline" : "none" }}
            />
          </Link>
        </div>

        {/* Links top */}
        <ul className="nav-links-top">
          <NavItem to="/dashboard" icon={<IoHomeOutline />} text="Inicio" />
          <NavItem to="/mensajes" icon={<IoChatboxEllipses />} text="Mensajes" />
          <NavItem to="/configuracion" icon={<IoSettingsOutline />} text="Configuración" />
          <span className="line"></span>
          {/* Switch tema 
          <li className="nav-item" onClick={toggleTheme}>
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={toggleTheme}
              className="theme-checkbox"
              style={{ cursor: "pointer" }}
            />
            <span className="nav-info">{theme === "dark" ? "Modo oscuro" : "Modo claro"}</span>
          </li>
          */}
        </ul>

        {/* Links bottom (desktop) */}
        <ul className="nav-links-bottom">
          {user && (
            <li id="user-li">
              <div
                className="nav-user cursor-pointer"
                onClick={() => navigate("/perfil")}
              >
                <img src={avatarUrl} alt="User Avatar" className="nav-user-avatar" />
                <div className="nav-user-info">
                  <span className="nav-user-name">
                    {user.Nombre_Usuario || user.nombre} {user.Apellido || user.apellido}
                  </span>
                  <span className="nav-user-email">
                    {user.Email || user.email}
                  </span>
                </div>
              </div>
            </li>
          )}

          <li id="logout-li" className="nav-item">
            <button
              onClick={logout}
              className="logout-glass logout-btn"
            >
              <span className="logout-text">Cerrar sesión</span>
              <IoLogOutOutline className="logout-icon" />
            </button>
          </li>
        </ul>

        {/* Links mobile */}
        <ul className="nav-links-mobile">
          <NavItemMobile to="/dashboard" icon={<IoHomeOutline />} />
          <NavItemMobile to="/perfil" icon={<IoPersonCircleOutline />} />
          <li>
            <button
              onClick={logout}
              className="nav-item-mobile-logout"
              aria-label="Cerrar sesión"
            >
              <IoLogOutOutline />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

// NavItem top/bottom
function NavItem({ to, icon, text }) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <li className={active ? "active" : ""}>
      <Link to={to} className="nav-item">
        {icon}
        <span className="nav-info">{text}</span>
      </Link>
    </li>
  );
}

// NavItem mobile
function NavItemMobile({ to, icon }) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <li className={active ? "active" : ""}>
      <Link to={to} className="nav-item">
        {icon}
      </Link>
    </li>
  );
}
