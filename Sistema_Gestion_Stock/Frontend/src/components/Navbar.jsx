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
import styled from 'styled-components';


const StyledWrapper = styled.div`
  .switch {
   --button-width: 2.2em;
   --button-height: 1.2em;
   --toggle-diameter: 0.9em;
   --button-toggle-offset: calc((var(--button-height) - var(--toggle-diameter)) / 2);
   --toggle-shadow-offset: 10px;
   --toggle-wider: 2em;
   --color-grey: #cccccc;
   --color-green: #4296f4;
  }

  .slider {
   display: inline-block;
   width: var(--button-width);
   height: var(--button-height);
   background-color: var(--color-grey);
   border-radius: calc(var(--button-height) / 2);
   position: relative;
   transition: 0.3s all ease-in-out;
  }

  .slider::after {
   content: "";
   display: inline-block;
   width: var(--toggle-diameter);
   height: var(--toggle-diameter);
   background-color: #fff;
   border-radius: calc(var(--toggle-diameter) / 2);
   position: absolute;
   top: var(--button-toggle-offset);
   transform: translateX(var(--button-toggle-offset));
   box-shadow: var(--toggle-shadow-offset) 0 calc(var(--toggle-shadow-offset) * 4) rgba(0, 0, 0, 0.1);
   transition: 0.3s all ease-in-out;
  }

  .switch input[type="checkbox"]:checked + .slider {
   background-color: var(--color-green);
  }

  .switch input[type="checkbox"]:checked + .slider::after {
   transform: translateX(calc(var(--button-width) - var(--toggle-diameter) - var(--button-toggle-offset)));
   box-shadow: calc(var(--toggle-shadow-offset) * -1) 0 calc(var(--toggle-shadow-offset) * 4) rgba(0, 0, 0, 0.1);
  }

  .switch input[type="checkbox"] {
   display: none;
  }

  .switch input[type="checkbox"]:active + .slider::after {
   width: var(--toggle-wider);
  }

  .switch input[type="checkbox"]:checked:active + .slider::after {
   transform: translateX(calc(var(--button-width) - var(--toggle-wider) - var(--button-toggle-offset)));
  }`;

export default function Navbar() {
  const navigate = useNavigate();
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

  const cards = [
    { to: "/usuarios", icon: <IoPersonAddOutline />, title: "Usuarios", permiso: "GestionarUsuarios" },
    { to: "/personas", icon: <IoPeopleOutline />, title: "Personas", permiso: "GestionarPersonas" },
    { to: "/preguntas", icon: <IoHelp />, title: "Preguntas", permiso: "GestionarPreguntas" },
    { to: "/restricciones", icon: <IoBan />, title: "Restricciones", permiso: "GestionarRestricciones" },
    { to: "/permisos-usuario", icon: <IoPersonOutline />, title: "Permisos", permiso: "GestionarPermisos" },
    { to: "/asignar-permisos", icon: <MdControlPoint />, title: "Roles", permiso: "GestionarRoles" },
  ];
  return (
    <div className="nav-bg">
      <nav className="nav-glass">
        {/* Logo */}
        <div className="nav-logo">
          <Link to="http://localhost:3000/dashboard" className="nav-logo-link">
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
          <NavItemExternal href="http://localhost:3000/mensajes" icon={<IoChatboxEllipses />} text="Mensajes" />
          <NavItemExternal href="http://localhost:3000/configuracion" icon={<IoSettingsOutline />} text="Configuración" />
          <li className="nav-item">
            <StyledWrapper>
              <label className="switch">
                <input
                  type="checkbox"
                  onChange={toggleTheme}
                  checked={theme === "dark"}
                />
                <span className="slider" />
              </label>
            </StyledWrapper>
          </li>
        </ul>

        {/* Links bottom (desktop) */}
        <ul className="nav-links-bottom">
        </ul>

        {/* Links mobile */}
        <ul className="nav-links-mobile">
          <NavItemMobile to="/dashboard" icon={<IoHomeOutline />} />
          <NavItemMobile to="/perfil" icon={<IoPersonCircleOutline />} />
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

function NavItemExternal({ href, icon, text }) {
  return (
    <li>
      <a href={href} className="nav-item">
        {icon}
        <span className="nav-info">{text}</span>
      </a>
    </li>
  );
}
