import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5160";

function Login() {
  const navigate = useNavigate();
  const { user, login, logout, loading } = useContext(AuthContext);

  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState(null);
  const [mostrarContraseña, setMostrarContraseña] = useState(false);

  // Evitar que el login parpadee mientras se verifica el usuario
  useEffect(() => {
    if (!loading && user) {
      switch (user.Id_Rol) {
        case 1:
          navigate("/dashboard");
          break;
        case 2:
          navigate("/dashboard");
          break;
        default:
          navigate("/");
      }
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    document.body.classList.add("login-page-body");
    return () => document.body.classList.remove("login-page-body");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Usuario: usuario, Contraseña: contraseña }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Usuario o contraseña incorrectos");
      }

      const data = await res.json();
      if (!data.Token) throw new Error("No se recibió token del servidor");
      console.log("✅ Token JWT recibido:", data.Token);

      login(data); // Guarda usuario + token en contexto/localStorage

      // 🔹 Si es primera vez, redirige al cambio de contraseña
      if (data.PrimeraVez) {
        navigate("/contra-primera-vez");
        return;
      }

      // 🔹 Si NO es primera vez, sigue flujo normal
      switch (data.Id_Rol) {
        case 2:
          navigate("/dashboard");
          break;
        case 1:
          navigate("/dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>Cargando...</div>
    );

  // Si ya hay usuario logueado
  if (user) {
    return (
      <div className="login-container">
        <h2 className="login-title">Sesión iniciada</h2>
        <p>
          <strong>Usuario:</strong> {user.Nombre_Usuario}
        </p>
        <p>
          <strong>Rol:</strong> {user.Id_Rol}
        </p>
        <p>
          <strong>Bloqueado:</strong>{" "}
          {user.Usuario_Bloqueado ? "Sí" : "No"}
        </p>
        <div
          style={{
            marginTop: "1.5rem",
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          <button className="submit-button" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="login-container" onSubmit={handleLogin}>
      <h2 className="login-title">Login</h2>
      {error && <p className="error-message">{error}</p>}
      <input
        placeholder="Usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        className="form-input input-full"
        required
      />
      <div style={{ position: "relative" }}>
        <input
          type={mostrarContraseña ? "text" : "password"}
          placeholder="Contraseña"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          className="form-input input-full"
          required
        />
        <button
          type="button"
          onClick={() => setMostrarContraseña(!mostrarContraseña)}
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            color: "var(--accent-color)",
            cursor: "pointer",
          }}
        >
          {mostrarContraseña ? (
            <FaRegEye className="icon" />
          ) : (
            <FaRegEyeSlash className="icon" />
          )}
        </button>
      </div>
      <button type="submit" className="submit-button">
        Ingresar
      </button>
      <p style={{ marginTop: 10 }}>
        <a
          href="/recuperar-contrasena"
          style={{
            color: "var(--current-accent-color)",
            textDecoration: "none",
          }}
        >
          Olvidé mi contraseña
        </a>
      </p>
    </form>
  );
}

export default Login;
