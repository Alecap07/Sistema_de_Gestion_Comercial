import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Contextos
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './context/ProtectedRoute';

// Componentes
import Navbar from './components/Navbar';

// Páginas de Usuario / Sesión
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Perfil from './pages/Perfil';
import PerfilDatos from './pages/PerfilDatos';
import PerfilConfiguracion from './pages/PerfilConfiguracion';
import PrimeraVezForm from './pages/PrimeraVezForm';
import ContraPrimeraVez from './pages/ContraPrimeraVez';
import RespuestaPrimeraVez from './pages/RespuestaPrimeraVez';

// Páginas de Administración (Cruds)
import PreguntaCrud from './pages/PreguntaCrud';
import RestriccionCrud from './pages/RestriccionCrud';
import AsignarPermisosRol from './pages/AsignarPermisosRol';
import PermisosUserCrud from './pages/PermisosUserCrud';
import UserCrud from './pages/UserCrud';
import PersonaCrud from './pages/PersonaCrud';

// Páginas de recuperación de contraseña (públicas)
import RecuperarContrasena from './pages/RecuperarContrasena';
import ValidarPreguntas from './pages/ValidarPreguntas';
import CambiarContrasena from './pages/CambiarContrasena';
import Mensajes from './pages/Mensajes.tsx';

// 🔹 Nueva página de Configuración del Sistema
import OpcionesSistema from './pages/OpcionesSistema';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* ===============================
              Rutas de Acceso y Recuperación (PÚBLICAS)
              =============================== */}
          <Route path="/login" element={<Login />} />
          <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
          <Route path="/validar-preguntas" element={<ValidarPreguntas />} />
          <Route path="/cambiar-contrasena" element={<CambiarContrasena />} />

          {/* ===============================
              Rutas Protegidas (Requieren Login)
              =============================== */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          {/* Rutas de Perfil */}
          <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
          <Route path="/perfil/datos" element={<ProtectedRoute><PerfilDatos /></ProtectedRoute>} />
          <Route path="/configuracion" element={<ProtectedRoute><PerfilConfiguracion /></ProtectedRoute>} />
          <Route path="/mensajes" element={<ProtectedRoute><Mensajes /></ProtectedRoute>} />

          {/* Rutas de Primera Vez */}
          <Route path="/primera-vez" element={<ProtectedRoute><PrimeraVezForm /></ProtectedRoute>} />
          <Route path="/contra-primera-vez" element={<ProtectedRoute><ContraPrimeraVez /></ProtectedRoute>} />
          <Route path="/respuesta-primera-vez" element={<ProtectedRoute><RespuestaPrimeraVez /></ProtectedRoute>} />

          {/* 🔹 Nueva ruta de Configuración del Sistema */}
          <Route path="/opciones-sistema" element={<ProtectedRoute><OpcionesSistema /></ProtectedRoute>} />

          {/* Rutas de CRUDS y Administración */}
          <Route path="/preguntas" element={<ProtectedRoute><PreguntaCrud /></ProtectedRoute>} />
          <Route path="/restricciones" element={<ProtectedRoute><RestriccionCrud /></ProtectedRoute>} />
          <Route path="/asignar-permisos" element={<ProtectedRoute><AsignarPermisosRol /></ProtectedRoute>} />
          <Route path="/permisos-usuario" element={<ProtectedRoute><PermisosUserCrud /></ProtectedRoute>} />
          <Route path="/usuarios" element={<ProtectedRoute><UserCrud /></ProtectedRoute>} />
          <Route path="/personas" element={<ProtectedRoute><PersonaCrud /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
