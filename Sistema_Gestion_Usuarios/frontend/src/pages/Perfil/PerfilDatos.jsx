import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/Perfila.css";


const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5160";

export default function PerfilDatos() {
  const { user, logout } = useContext(AuthContext);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = user?.Token || localStorage.getItem("token");
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
  }, [user, logout]);

  if (loading) return <div className="perfil-container">Cargando datos...</div>;
  if (error) return <div className="perfil-container error">{error}</div>;
  if (!perfil) return <div className="perfil-container">No se encontraron datos.</div>;

  const persona = perfil.Persona || {};

  return (
    <div className="perfil-info">
      <div className="perfil-item">
        <span className="label">Usuario:</span>
        <span>{perfil.Nombre_Usuario}</span>
      </div>
      <div className="perfil-item">
        <span className="label">Nombre y apellido:</span>
        <span>{`${persona.Nombre || ""} ${persona.Apellido || ""}`}</span>
      </div>
      <div className="perfil-item">
        <span className="label">Email:</span>
        <span>{persona.Email_Personal || "No registrado"}</span>
      </div>
      <div className="perfil-item">
        <span className="label">Teléfono:</span>
        <span>{persona.Telefono || "No registrado"}</span>
      </div>
      <div className="perfil-item">
        <span className="label">Documento:</span>
        <span>{persona.Num_Doc || "-"}</span>
      </div>
      <div className="perfil-item">
        <span className="label">CUIL:</span>
        <span>{persona.Cuil || "-"}</span>
      </div>
      <div className="perfil-item">
        <span className="label">Provincia:</span>
        <span>{persona.ProvinciaNombre || "-"}</span>
      </div>
      <div className="perfil-item">
        <span className="label">Partido:</span>
        <span>{persona.PartidoNombre || "-"}</span>
      </div>
      <div className="perfil-item">
        <span className="label">Localidad:</span>
        <span>{persona.LocalidadNombre || "-"}</span>
      </div>
      <div className="perfil-item">
        <span className="label">Creado en:</span>
        <span>
          {perfil.Fecha_Usu_Cambio
            ? new Date(perfil.Fecha_Usu_Cambio).toLocaleDateString()
            : "-"}
        </span>
      </div>
    </div>
  );
}
