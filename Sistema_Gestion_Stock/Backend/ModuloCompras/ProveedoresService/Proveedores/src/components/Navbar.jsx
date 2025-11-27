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
import { BsTruck } from "react-icons/bs";
import { GiHandTruck } from "react-icons/gi";
import { MdControlPoint } from "react-icons/md";
import logoBlack from "../assets/logo.png";
import logoLight from "../assets/logo-white.png";

export default function Navbar() {
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

  return (
    <div className="nav-bg">
      <nav className="nav-glass">
        {/* Logo */}
        <div className="nav-logo">
          <Link to="/" className="nav-logo-link">
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
          <NavItem to="/" icon={<BsTruck />} text="Proveedores" />
          <NavItem to="/categoria" icon={<GiHandTruck />} text="Categoria" />
          <span className="line"></span>
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
        </ul>

        {/* Links bottom (desktop) */}
        <ul className="nav-links-bottom">
          <li id="logout-li" className="nav-item">
            <button
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
