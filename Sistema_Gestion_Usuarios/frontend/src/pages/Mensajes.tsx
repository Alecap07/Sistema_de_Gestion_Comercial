import { useState, useEffect, useRef } from "react";
import '../styles/mensajes.css';

interface Usuario {
  id_usuario: number;
  nombre: string;
  avatar?: string;
}

interface Mensaje {
  id_mensaje: number;
  remitente_id: number;
  mensaje: string;
  creado_en: string;
}

export default function Mensajes() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [chatActivo, setChatActivo] = useState<Usuario | null>(null);
  const [nuevo, setNuevo] = useState("");

  const token = localStorage.getItem("token");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/usuarios", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setUsuarios)
      .catch(console.error);

    fetch("http://localhost:4000/api/mensajes", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setMensajes)
      .catch(console.error);
  }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, chatActivo]);

  const enviar = async () => {
    if (!nuevo || !chatActivo) return;

    const msg = {
      destinatario: chatActivo.id_usuario,
      mensaje: nuevo,
    };

    await fetch("http://localhost:4000/api/mensajes", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(msg)
    });

    setMensajes(prev => [
      ...prev,
      {
        id_mensaje: Date.now(),
        remitente_id: 0, // yo
        mensaje: nuevo,
        creado_en: new Date().toISOString()
      }
    ]);

    setNuevo("");
  };

  const mensajesFiltrados = chatActivo
    ? mensajes.filter(
        m => m.remitente_id === chatActivo.id_usuario || m.remitente_id === 0
      )
    : [];

  return (
    <div className="Container">
    <div className="mensajes-container-crud">
      {/* Lista de usuarios */}
      <aside className="chat-list-crud">
        {usuarios.map(u => (
          <div
            key={u.id_usuario}
            className={`chat-item-crud ${chatActivo?.id_usuario === u.id_usuario ? "active" : ""}`}
            onClick={() => setChatActivo(u)}
          >
            <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.nombre}`} alt={u.nombre} />
            <span>{u.nombre}</span>
          </div>
        ))}
      </aside>

      {/* Ventana de chat */}
      <section className="chat-window-crud">
        <div className="chat-messages-crud">
          {mensajesFiltrados.map(m => (
            <div
              key={m.id_mensaje}
              className={`mensaje-crud ${m.remitente_id === 0 ? "enviado" : "recibido"}`}
            >
              {m.remitente_id !== 0 && <span className="nombre-crud">{chatActivo?.nombre}</span>}
              {m.mensaje}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-crud">
          <input
            value={nuevo}
            onChange={(e) => setNuevo(e.target.value)}
            placeholder="Escribí un mensaje..."
            onKeyDown={(e) => e.key === "Enter" && enviar()}
          />
          <button onClick={enviar}>Enviar</button>
        </div>
      </section>
    </div>
    </div>
  );
}
