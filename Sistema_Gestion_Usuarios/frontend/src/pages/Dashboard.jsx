import React, { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  IoPersonAddOutline,
  IoPeopleOutline,
  IoHelp,
  IoBan,
  IoPersonOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { IoChatboxEllipses } from "react-icons/io5";
import { MdControlPoint } from "react-icons/md";
import '../styles/PanelAdmin.css';

// ------------------ SUBCOMPONENTES ------------------
function TitleContainer() { return <div className='Title-Container'><p className='Ttitle'>Panel de control</p></div>; }
function SummaryContainer() {
  return (
    <div className='Summary-Container'>
      <div className='Summary-Title'>
        <p className='STitle'>Información</p>
        <p className='SInfo'>Estos son los resúmenes del mes</p>
      </div>
      <div className='Summary-Information'>
        <div className='Information-Container'><div><p>0$</p></div><div className='CSsub-info'><p className='Ssub-info'>Ganancias Totales</p></div></div>
        <div className='Information-Container'><div><p>0$<span className='SPorc'>(0%)</span></p></div><div className='CSsub-info'><p className='Ssub-info'>Ventas</p></div></div>
        <div className='Information-Container'><div><p>0$<span className='SPorc'>(0%)</span></p></div><div className='CSsub-info'><p className='Ssub-info'>Compras</p></div></div>
        <div className='Information-Container'><p>0$<span className='SPorc'>(0%)</span></p><div className='CSsub-info'><p className='Ssub-info'>Otros</p></div></div>
      </div>
    </div>
  );
}

// ------------------ ACCESOS DIRECTOS ------------------
function QuickAccess({ permisos }) {


  return (
    <div className="quickaccess-container">
      <h2 className="quickaccess-title">Accesos Directos</h2>
      <div className="quickaccess-grid">
        <a href="http://localhost:5173/dashboard" className="quickcard-button">
          <div className="quickcard-icon"><IoSettingsOutline /></div>
          <div className="quickcard-title">Gestion Stock</div>
        </a>
        <Link to="/mensajes" className="quickcard-button">
          <div className="quickcard-icon"><IoChatboxEllipses /></div>
          <div className="quickcard-title">Mensajes</div>
        </Link>
        <Link to="/configuracion" className="quickcard-button">
          <div className="quickcard-icon"><IoSettingsOutline /></div>
          <div className="quickcard-title">Configuración</div>
        </Link>
        <Link to="/opciones-sistema" className="quickcard-button">
          <div className="quickcard-icon"><IoSettingsOutline /></div>
          <div className="quickcard-title">Opciones del Sistema</div>
        </Link>
      </div>
    </div>
  );
}

// ------------------ GRÁFICOS ------------------
function GraphicsContainer() {
  return <div className='Graphics-Container'>
    {/* tus gráficos aquí */}
  </div>;
}
function BottomContainer() { return <div className='Bottom-Container'></div>; }

// ------------------ PANEL PRINCIPAL ------------------
export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [permisos, setPermisos] = useState([]);

  useEffect(() => {
    if (!user || !user.Token) return; // <- no hay token aún

    fetch("http://localhost:5160/api/me", {
      headers: {
        "Authorization": `Bearer ${user.Token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => setPermisos(data.permisos || []))
      .catch(err => console.error(err));
  }, [user]);

  return (
    <div className='Container'>
      <div className='Dashboard-Top'>
        <TitleContainer />
        <SummaryContainer />
        <QuickAccess permisos={permisos} />

      </div>
    </div>
  );
}
