import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga inicial

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const saved = localStorage.getItem("usuario");
        const token = localStorage.getItem("token");

        if (token) {
          //  Consulta al backend para validar el token y obtener datos actualizados
          const response = await fetch("/api/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data);
            localStorage.setItem("usuario", JSON.stringify(data)); // Actualiza el localStorage
          } else if (saved) {
            // Si el token no sirve pero hay usuario guardado, lo usa igual
            setUser(JSON.parse(saved));
          } else {
            setUser(null);
          }
        } else if (saved) {
          // Si no hay token pero hay usuario guardado
          setUser(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Error al verificar sesión:", error);
        setUser(null);
      } finally {
        setLoading(false); // Ya terminó la verificación
      }
    };

    fetchUser();
  }, []);

  const login = (userData) => {
    // Guarda datos y token (si llega desde el login)
    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }
    localStorage.setItem("usuario", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
