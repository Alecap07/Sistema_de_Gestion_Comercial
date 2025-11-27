import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Crear raíz
const root = ReactDOM.createRoot(document.getElementById('root'));

// Inyectar tipografía en el head (correctamente)
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Epunda+Sans:ital,wght@0,300..900;1,300..900&display=swap';
link.rel = 'stylesheet';
document.head.appendChild(link);

// Renderizar aplicación
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
