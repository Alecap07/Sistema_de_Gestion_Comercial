import React, { useEffect, useState } from 'react';
import { CiSearch } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import '../styles/PersonaCrud.css'; 

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5160';

function UserCrud() {
  useEffect(() => {
    document.body.classList.add('user-crud-page');
    return () => document.body.classList.remove('user-crud-page');
  }, []);

  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [roles, setRoles] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [form, setForm] = useState({
    Id: 0,
    Nombre_Usuario: '',
    Id_Rol: '',
    Id_Per: '',
    Usuario_Bloqueado: false,
    PrimeraVez: false,
    Fecha_Block: '',
    Fecha_Usu_Cambio: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalInfo, setShowModalInfo] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(usuarios.length / itemsPerPage);
  const visiblePages = 5;

  const usuariosPagina = usuarios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // =======================
  // FETCH USERS, ROLES, PERSONAS
  // =======================
  const fetchUsuarios = (nombre = "") => {
    const url = nombre.trim()
      ? `${API_URL}/api/usuario/con-nombres?nombre=${encodeURIComponent(nombre)}`
      : `${API_URL}/api/usuario/con-nombres`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.value)) {
          setUsuarios(data.value);
        } else if (Array.isArray(data)) {
          setUsuarios(data);
        } else {
          setUsuarios([]);
        }
      })
      .catch(() => setError('Error al obtener usuarios'));
  };

  useEffect(() => {
    fetchUsuarios();
    fetch(`${API_URL}/api/rol`).then(res => res.json()).then(setRoles);
    fetch(`${API_URL}/api/persona`).then(res => res.json()).then(setPersonas);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsuarios(busqueda);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [busqueda]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // =======================
  // SUBMIT FORM
  // =======================
  const handleSubmit = e => {
    e.preventDefault();

    // Si está en modo edición, pedir confirmación antes de guardar
    if (editMode) {
      setShowConfirmModal(true);
      return;
    }

    guardarUsuario();
  };

  // =======================
  // GUARDAR USUARIO
  // =======================
  const guardarUsuario = () => {
    const usuarioExistente = usuarios.find(u => 
      u.Nombre_Usuario.toLowerCase() === form.Nombre_Usuario.toLowerCase()
    );

    if (!editMode && usuarioExistente) {
      setError('El usuario ya existe');
      return;
    }

    const method = editMode ? 'PUT' : 'POST';
    const url = editMode ? `${API_URL}/api/usuario/${form.Id}` : `${API_URL}/api/usuario`;

    const data = {
      Id: form.Id,
      Nombre_Usuario: form.Nombre_Usuario,
      Id_Rol: parseInt(form.Id_Rol),
      Id_Per: parseInt(form.Id_Per),
      Usuario_Bloqueado: form.Usuario_Bloqueado,
      PrimeraVez: form.PrimeraVez,
      Fecha_Block: form.Usuario_Bloqueado
        ? (form.Fecha_Block || new Date().toISOString())
        : null,
      Fecha_Usu_Cambio: new Date().toISOString()
    };

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(async res => {
        if (!res.ok) {
          const errorData = await res.json();
          if (res.status === 409) {
            throw new Error('El usuario ya existe');
          } else {
            throw new Error(errorData?.message || 'Error al guardar usuario');
          }
        }
        setForm({
          Id: 0,
          Nombre_Usuario: '',
          Id_Rol: '',
          Id_Per: '',
          Usuario_Bloqueado: false,
          PrimeraVez: false,
          Fecha_Block: '',
          Fecha_Usu_Cambio: ''
        });
        setEditMode(false);
        setError(null);
        fetchUsuarios();
        closeModal();
      })
      .catch(err => setError(err.message));
  };

  const handleEdit = usuario => {
    setForm({
      Id: usuario.Id,
      Nombre_Usuario: usuario.Nombre_Usuario || '',
      Id_Rol: usuario.Id_Rol ? usuario.Id_Rol.toString() : '',
      Id_Per: usuario.Id_Per ? usuario.Id_Per.toString() : '',
      Usuario_Bloqueado: usuario.Usuario_Bloqueado,
      PrimeraVez: usuario.PrimeraVez,
      Fecha_Block: usuario.Fecha_Block || '',
      Fecha_Usu_Cambio: usuario.Fecha_Usu_Cambio || ''
    });
    setEditMode(true);
    setShowModal(true);
  };
  
  const handleCardClick = (usuario) => {
    setSelectedUser(usuario);
    setShowModalInfo(true);
  };

  const handleShowModal = () => setShowModal(true);

  const closeModal = () => {
    setShowModal(false);
    setShowModalInfo(false);
    setSelectedUser(null);
    setEditMode(false);
    setForm({
      Id: 0,
      Nombre_Usuario: '',
      Id_Rol: '',
      Id_Per: '',
      Usuario_Bloqueado: false,
      PrimeraVez: false,
      Fecha_Block: '',
      Fecha_Usu_Cambio: ''
    });
  };

  // Enter = confirmar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showConfirmModal && e.key === "Enter") {
        guardarUsuario();
        setShowConfirmModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showConfirmModal, form]);

  const getPageNumbers = () => {
    let startPage = Math.max(currentPage - Math.floor(visiblePages / 2), 1);
    let endPage = startPage + visiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - visiblePages + 1, 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <>
      <div className='Container'>
        <div className="Sub-Container">
          <div className='Title-Container'>
            <h1 className="Ttitle">Usuarios</h1>
          </div>
          <div className="user-crud-container">
            {error && <p className="error-message">{error}</p>}
            <div className="search-container">
              <button className='add-button' onClick={showModal ? closeModal : handleShowModal}>Añadir</button>
              <input
                type="text"
                placeholder="Buscar por nombre de usuario..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="search-input"
              />
              <span className='search-icon'><CiSearch /></span>
            </div>

            <div className="user-cards-container">
              {usuariosPagina.map(u => (
                <div key={u.Id} className="user-card" onClick={() => handleCardClick(u)}>
                  <div className="user-card-info">
                    <div className="user-avatar"></div>
                    <div className="user-details">
                      <span className="user-name">{u.Nombre_Usuario}</span>
                      <span className="user-role">
                        {(roles.find(r => r.Id === u.Id_Rol)?.Nombre) || 'Sin rol'}
                      </span>
                    </div>
                  </div>
                  <button
                    className='edit-button'
                    onClick={(e) => { e.stopPropagation(); handleEdit(u); }}
                  >
                    Editar
                  </button>
                </div>
              ))}
            </div>

            {/* Paginación */}
            <div className="pagination">
              <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>&laquo;</button>
              {getPageNumbers()[0] > 1 && (
                <>
                  <button onClick={() => handlePageChange(1)}>1</button>
                  {getPageNumbers()[0] > 2 && <span className="dots">...</span>}
                </>
              )}
              {getPageNumbers().map(page => (
                <button
                  key={page}
                  className={currentPage === page ? 'active' : ''}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
              {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                <>
                  {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && <span className="dots">...</span>}
                  <button onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
                </>
              )}
              <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>&raquo;</button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL CREAR / EDITAR */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <form onSubmit={handleSubmit} onClick={e => e.stopPropagation()} className="user-crud-form">
            <button className="pregunta-close-button" onClick={closeModal}>×</button>
            <h2 className='PTitle'>{editMode ? 'Editar Usuario' : 'Añadir Usuario'}</h2>

            {/* NOMBRE DE USUARIO */}
            <div className='input-container'>
              <label className='Plabel'>Nombre de usuario</label>
              <input
                name="Nombre_Usuario"
                placeholder="Ej: juanperez"
                value={form.Nombre_Usuario}
                onChange={handleChange}
                required
                className="form-input input-full"
              />
            </div>

            {/* ROL */}
            <div className='input-container'>
              <label className='Plabel'>Rol</label>
              <select
                name="Id_Rol"
                value={form.Id_Rol}
                onChange={handleChange}
                required
                className="form-select input-full"
              >
                <option value="">Seleccione rol</option>
                {roles.map(r => <option key={r.Id} value={r.Id}>{r.Nombre}</option>)}
              </select>
            </div>

            {/* PERSONA */}
            <div className='input-container'>
              <label className='Plabel'>Persona</label>
              <select
                name="Id_Per"
                value={form.Id_Per}
                onChange={handleChange}
                required
                className="form-select input-full"
              >
                <option value="">Seleccione persona</option>
                {personas.map(p => (
                  <option key={p.Id} value={p.Id}>{p.Nombre} {p.Apellido}</option>
                ))}
              </select>
            </div>

            {/* BLOQUEADO */}
            <div className='form-input-wrapper'>
              <label className="checkbox-wrapper-12">
                <div className="cbx">
                  <input
                    name="Usuario_Bloqueado"
                    type="checkbox"
                    checked={form.Usuario_Bloqueado}
                    onChange={handleChange}
                    id="cbx-12"
                  /> 
                  <label htmlFor="cbx-12"></label>
                  <svg fill="none" viewBox="0 0 15 14" height="14" width="15">
                    <path d="M2 8.36364L6.23077 12L13 2"></path>
                  </svg>
                </div>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <filter id="goo-12">
                      <feGaussianBlur result="blur" stdDeviation="4" in="SourceGraphic"></feGaussianBlur>
                      <feColorMatrix result="goo-12" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7" mode="matrix" in="blur"></feColorMatrix>
                      <feBlend in2="goo-12" in="SourceGraphic"></feBlend>
                    </filter>
                  </defs>
                </svg>
                <p className='PCheckInfo'>Bloqueado</p>
              </label>
            </div>

            {/* BOTONES */}
            <div className="form-buttons-container">
              <button type="submit" className="submit-button">
                {editMode ? 'Actualizar' : 'Agregar'}
              </button>
              {editMode && (
                <button type="button" className="cancel-button" onClick={closeModal}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* MODAL SOLO VISTA */}
      {selectedUser && showModalInfo && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="user-crud-form" onClick={e => e.stopPropagation()}>
            <button className="pregunta-close-button" onClick={closeModal}>×</button>
            <h2 className="PTitle">Detalles del Usuario</h2>

            <div className="input-container">
              <label className='Plabel'>Nombre de usuario</label>
              <p className="form-input input-full">{selectedUser.Nombre_Usuario}</p>
            </div>

            <div className="input-container">
              <label className='Plabel'>Rol</label>
              <p className="form-input input-full">{roles.find(r => r.Id === selectedUser.Id_Rol)?.Nombre || 'Sin rol'}</p>
            </div>

            <div className="input-container">
              <label className='Plabel'>Persona</label>
              <p className="form-input input-full">
                {personas.find(p => p.Id === selectedUser.Id_Per)
                  ? `${personas.find(p => p.Id === selectedUser.Id_Per).Nombre} ${personas.find(p => p.Id === selectedUser.Id_Per).Apellido}`
                  : 'Sin persona asociada'}
              </p>
            </div>

            <div className="input-container">
              <label className='Plabel'>Bloqueado</label>
              <p className="form-input input-full">{selectedUser.Usuario_Bloqueado ? 'Sí' : 'No'}</p>
            </div>

            <div className="input-container">
              <label className='Plabel'>Primera vez</label>
              <p className="form-input input-full">{selectedUser.PrimeraVez ? 'Sí' : 'No'}</p>
            </div>

            {selectedUser.Fecha_Block && (
              <div className="input-container">
                <label className='Plabel'>Fecha de bloqueo</label>
                <p className="form-input input-full">{new Date(selectedUser.Fecha_Block).toLocaleString()}</p>
              </div>
            )}

            {selectedUser.Fecha_Usu_Cambio && (
              <div className="input-container">
                <label className='Plabel'>Último cambio</label>
                <p className="form-input input-full">{new Date(selectedUser.Fecha_Usu_Cambio).toLocaleString()}</p>
              </div>
            )}

            <div className="form-buttons-container">
              <button
                className="submit-button"
                onClick={() => {
                  handleEdit(selectedUser);
                  setShowModalInfo(false);
                }}
              >
                Editar
              </button>
            </div>
          </div>
        </div>
      )}
{/* --- MODAL DE CONFIRMACIÓN --- */}
{showConfirmModal && (
  <div
    className="pregunta-modal-overlay"
    onClick={() => setShowConfirmModal(false)}
  >
    <div
      className="pregunta-modal-content"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="PTitle">¿Confirmar actualización?</h3>
      <p>¿Seguro que deseas actualizar este usuario?</p>

      <div className="pregunta-form-buttons">
        <button
          className="submit-button"
          onClick={() => {
            guardarUsuario();
            setShowConfirmModal(false);
          }}
        >
          Confirmar
        </button>
        <button
          className="cancel-button"
          onClick={() => setShowConfirmModal(false)}
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
}

export default UserCrud;
