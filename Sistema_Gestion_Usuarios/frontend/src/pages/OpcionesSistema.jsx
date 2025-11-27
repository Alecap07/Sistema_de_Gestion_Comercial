import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/OpcionesSistema.css";
import { IoPersonAddOutline, IoPeopleOutline, IoHelp, IoBan, IoPersonOutline } from "react-icons/io5";
import { MdControlPoint } from "react-icons/md";

export default function OpcionesSistema() {
  const navigate = useNavigate();

  const opciones = [
    {
      title: "Usuarios",
      desc: "Administrá los usuarios registrados del sistema.",
      icon: <IoPersonAddOutline />,
      to: "/usuarios",
    },
    {
      title: "Personas",
      desc: "Gestioná la información personal de cada usuario.",
      icon: <IoPeopleOutline />,
      to: "/personas",
    },
    {
      title: "Preguntas de Seguridad",
      desc: "Modificá o agregá preguntas de recuperación de cuenta.",
      icon: <IoHelp />,
      to: "/preguntas",
    },
    {
      title: "Restricciones",
      desc: "Configurá bloqueos o restricciones de acceso.",
      icon: <IoBan />,
      to: "/restricciones",
    },
    {
      title: "Permisos",
      desc: "Asigná y controlá los permisos de cada usuario.",
      icon: <IoPersonOutline />,
      to: "/permisos-usuario",
    },
    {
      title: "Roles",
      desc: "Creá o editá roles para agrupar permisos.",
      icon: <MdControlPoint />,
      to: "/asignar-permisos",
    },
  ];

  return (
    <div className="Container">
      <div className="opciones-container">
        <div className="Title-Container">
          <h1 className="Ttitle">Configuración de tu cuenta</h1>
        </div>
        <div className="opciones-list">
          {opciones.map((op, index) => (
            <div
              key={index}
              className="opcion-item"
              onClick={() => navigate(op.to)}
            >
              <div className="opcion-info">
                <div className="opcion-icon">{op.icon}</div>
                <div className="opcion-text">
                  <h3>{op.title}</h3>
                  <p>{op.desc}</p>
                </div>
              </div>
              <div className="opcion-flecha">›</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
