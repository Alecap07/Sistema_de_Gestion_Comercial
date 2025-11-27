import React, { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import {
  IoHomeOutline,
  IoLogOutOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { TbBrandAdonisJs } from "react-icons/tb";
import { FaProjectDiagram } from "react-icons/fa";
import { BsTruck } from "react-icons/bs";
import { GiHandTruck } from "react-icons/gi";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { AiOutlineFileProtect } from "react-icons/ai";
import '../styles/PanelAdmin.css';

// ------------------ SUBCOMPONENTES ------------------
function TitleContainer() { return <div className='Title-Container'><p className='Ttitle'>Panel de stock</p></div>; }
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
      <h2 className="quickaccess-title">Accesos</h2>
      <div className="quickaccess-grid">
        <a href="http://localhost:3000" className="quickcard-button">
          <div className="quickcard-icon"><IoSettingsOutline /></div>
          <div className="quickcard-title">Inicio</div>
        </a>

        <Link to="/clientes" className="quickcard-button">
          <div className="quickcard-icon"><IoHomeOutline /></div>
          <div className="quickcard-title">Clientes</div>
        </Link>
        <Link to="/presupuesto" className="quickcard-button">
          <div className="quickcard-icon"><IoHomeOutline /></div>
          <div className="quickcard-title">Presupuesto</div>
        </Link>
        <Link to="/proveedores" className="quickcard-button">
          <div className="quickcard-icon"><BsTruck /></div>
          <div className="quickcard-title">Proveedores</div>
        </Link>
        <Link to="/categoria" className="quickcard-button">
          <div className="quickcard-icon"><GiHandTruck /></div>
          <div className="quickcard-title">Categoria</div>
        </Link>
        <Link to="/productos" className="quickcard-button">
          <div className="quickcard-icon"><MdOutlineProductionQuantityLimits /></div>
          <div className="quickcard-title">Productos</div>
        </Link>
        <Link to="/categorias" className="quickcard-button">
          <div className="quickcard-icon"><FaProjectDiagram /></div>
          <div className="quickcard-title">Categorias</div>
        </Link>
        <Link to="/marcas" className="quickcard-button">
          <div className="quickcard-icon"><TbBrandAdonisJs /></div>
          <div className="quickcard-title">Marcas</div>
        </Link>
        <Link to="/productos-crud" className="quickcard-button">
          <div className="quickcard-icon"><MdOutlineProductionQuantityLimits /></div>
          <div className="quickcard-title">Productos Crud</div>
        </Link>
        <Link to="/productos-reservados" className="quickcard-button">
          <div className="quickcard-icon"><AiOutlineFileProtect /></div>
          <div className="quickcard-title">Prod. Reservados</div>
        </Link>
        <Link to="/compras" className="quickcard-button">
          <div className="quickcard-icon"><TbBrandAdonisJs /></div>
          <div className="quickcard-title">Compras</div>
        </Link>
        <Link to="/notas-credito" className="quickcard-button">
          <div className="quickcard-icon"><TbBrandAdonisJs /></div>
          <div className="quickcard-title">Notas Credito</div>
        </Link>
        <Link to="/notas-debito" className="quickcard-button">
          <div className="quickcard-icon"><TbBrandAdonisJs /></div>
          <div className="quickcard-title">Notas Debito</div>
        </Link>
        <Link to="/notas-pedido" className="quickcard-button">
          <div className="quickcard-icon"><TbBrandAdonisJs /></div>
          <div className="quickcard-title">Notas Pedido</div>
        </Link>
        <Link to="/devoluciones" className="quickcard-button">
          <div className="quickcard-icon"><TbBrandAdonisJs /></div>
          <div className="quickcard-title">Devoluciones</div>
        </Link>
        <Link to="/remitos" className="quickcard-button">
          <div className="quickcard-icon"><TbBrandAdonisJs /></div>
          <div className="quickcard-title">Remitos</div>
        </Link>
        <Link to="/facturas" className="quickcard-button">
          <div className="quickcard-icon"><TbBrandAdonisJs /></div>
          <div className="quickcard-title">Facturas</div>
        </Link>
        <Link to="/scrap" className="quickcard-button">
          <div className="quickcard-icon"><TbBrandAdonisJs /></div>
          <div className="quickcard-title">Scrap</div>
        </Link>
        <Link to="/movimientos-historial" className="quickcard-button">
          <div className="quickcard-icon"><TbBrandAdonisJs /></div>
          <div className="quickcard-title">Movimientos Historial</div>
        </Link>
        <Link to="/productos" className="quickcard-button">
          <div className="quickcard-icon"><MdOutlineProductionQuantityLimits /></div>
          <div className="quickcard-title">Productos</div>
        </Link>
      </div>
    </div>
  );
}

// ------------------ PANEL PRINCIPAL ------------------
export default function Dashboard() {
  return (
    <div className='Container'>
      <div className='Dashboard-Top'>
        <TitleContainer />
        <QuickAccess />
      </div>
    </div>
  );
}
