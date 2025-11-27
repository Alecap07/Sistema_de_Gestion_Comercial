import React, { useEffect, useState } from 'react';
import { CiSearch } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import '../styles/PersonaCrud.css';
import '../styles/user.css'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5160';

function PersonaCrud() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [personas, setPersonas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [provincias, setProvincias] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalInfo, setShowModalInfo] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // NUEVO ESTADO
  const [selectedPersona, setSelectedPersona] = useState(null);

  // Se elimina el estado 'editable'

  const [form, setForm] = useState({
    id: 0,
    legajo: '',
    nombre: '',
    apellido: '',
    tipo_Doc: '',
    num_Doc: '',
    cuil: '',
    calle: '',
    altura: '',
    cod_Post: '',
    id_Prov: '',
    id_Partido: '',
    id_Local: '',
    genero: '',
    telefono: '',
    email_Personal: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.body.classList.add('user-crud-page');
    return () => {
      document.body.classList.remove('user-crud-page');
    };
  }, []);

  const fetchPersonas = () => {
    fetch(`${API_URL}/api/persona`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.value)) {
          setPersonas(data.value);
        } else if (Array.isArray(data)) {
          setPersonas(data);
        } else {
          setPersonas([]);
        }
      })
      .catch(() => setError('Error al obtener personas'));
  };

  useEffect(() => {
    fetchPersonas();
    fetch(`${API_URL}/api/persona/provincias`).then(res => res.json()).then(res => {
      if (Array.isArray(res.value)) {
        setProvincias(res.value);
      } else if (Array.isArray(res)) {
        setProvincias(res);
      } else {
        setProvincias([]);
      }
    });
    fetch(`${API_URL}/api/persona/partidos`).then(res => res.json()).then(res => {
      if (Array.isArray(res.value)) {
        setPartidos(res.value);
      } else if (Array.isArray(res)) {
        setPartidos(res);
      } else {
        setPartidos([]);
      }
    });
    fetch(`${API_URL}/api/persona/localidades`).then(res => res.json()).then(res => {
      if (Array.isArray(res.value)) {
        setLocalidades(res.value);
      } else if (Array.isArray(res)) {
        setLocalidades(res);
      } else {
        setLocalidades([]);
      }
    });
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    // Si está en modo edición, se pide confirmación antes de guardar
    if (editMode) {
      setShowConfirmModal(true);
      return;
    }

    // Si es un nuevo registro o confirmación de edición, llama a guardarPersona
    guardarPersona();
  };

  // Función para manejar la lógica de guardado/actualización
  const guardarPersona = () => {
    const method = editMode ? 'PUT' : 'POST';
    const url = editMode ? `${API_URL}/api/persona/${form.id}` : `${API_URL}/api/persona`;
    const data = {
      Id: form.id,
      Legajo: parseInt(form.legajo),
      Nombre: form.nombre,
      Apellido: form.apellido,
      Tipo_Doc: form.tipo_Doc,
      Num_Doc: form.num_Doc,
      Cuil: form.cuil,
      Calle: form.calle,
      Altura: form.altura,
      Cod_Post: form.cod_Post ? parseInt(form.cod_Post) : 0,
      Id_Provi: parseInt(form.id_Prov),
      Id_Partido: parseInt(form.id_Partido),
      Id_Local: parseInt(form.id_Local),
      Genero: form.genero ? parseInt(form.genero) : 0,
      Telefono: form.telefono,
      Email_Personal: form.email_Personal
    };

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(async res => {
        if (!res.ok) {
          let msg = editMode ? 'Error al actualizar persona' : 'Error al guardar persona';
          if (res.status === 400) {
            const text = await res.text();
            msg = text || msg;
          }
          throw new Error(msg);
        }
        closeModal();
        setError(null);
        fetchPersonas();
      })
      .catch(err => setError(err.message));

    setShowConfirmModal(false); // Cierra el modal de confirmación si estaba abierto
  };

  const handleEdit = persona => {
    setForm({
      id: persona.Id,
      legajo: persona.Legajo || '',
      nombre: persona.Nombre || '',
      apellido: persona.Apellido || '',
      tipo_Doc: persona.Tipo_Doc || '',
      num_Doc: persona.Num_Doc || '',
      cuil: persona.Cuil || '',
      calle: persona.Calle || '',
      altura: persona.Altura || '',
      cod_Post: persona.Cod_Post || '',
      id_Prov: persona.Id_Provi ? persona.Id_Provi.toString() : '',
      id_Partido: persona.Id_Partido ? persona.Id_Partido.toString() : '',
      id_Local: persona.Id_Local ? persona.Id_Local.toString() : '',
      genero: persona.Genero ? persona.Genero.toString() : '',
      telefono: persona.Telefono || '',
      email_Personal: persona.Email_Personal || ''
    });
    setEditMode(true);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowModalInfo(false);
    setShowConfirmModal(false); // Cierra el modal de confirmación
    setEditMode(false);
    setSelectedPersona(null);
    setForm({
      id: 0,
      legajo: '',
      nombre: '',
      apellido: '',
      tipo_Doc: '',
      num_Doc: '',
      cuil: '',
      calle: '',
      altura: '',
      cod_Post: '',
      id_Prov: '',
      id_Partido: '',
      id_Local: '',
      genero: '',
      telefono: '',
      email_Personal: ''
    })
    // Se elimina el reset de 'editable'
  };

  const openEditModal = (persona) => {
    if (persona) handleEdit(persona);
    if (showModalInfo) closeInfoModal(); // Cierra el info modal si viene de allí
    handleShowModal();
  };

  const openInfoModal = (persona) => {
    setSelectedPersona(persona);
    setShowModalInfo(true);
  };

  const closeInfoModal = () => {
    setShowModalInfo(false);
    setSelectedPersona(null);
  };

  const getGeneroText = (generoId) => {
    switch (parseInt(generoId)) {
      case 1: return 'Masculino';
      case 2: return 'Femenino';
      case 3: return 'Otro';
      default: return 'Sin especificar';
    }
  };

  const personasFiltradas = personas.filter((p) =>
    (p.Nombre || "").toLowerCase().includes(busqueda.toLowerCase()) ||
    (p.Apellido || "").toLowerCase().includes(busqueda.toLowerCase())
  );
  const itemsPerPage = 8;
  const totalPages = Math.ceil(personasFiltradas.length / itemsPerPage);
  const visiblePages = 5;
  const personasPagina = personasFiltradas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
            <h1 className="Ttitle">Personas</h1>
          </div>
          <div className="user-crud-container">
            {error && <p className="error-message">{error}</p>}


            <div className="search-container">
              <button className='add-button' onClick={showModal ? closeModal : handleShowModal}>Añadir</button>
              <input
                type="text"
                placeholder="Buscar por nombre o apellido..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="search-input"
              />
              <span className='search-icon'><CiSearch /></span>
            </div>
            <div className="user-cards-container">
              {personasFiltradas.length === 0 ? (
                <p className="no-data-message">No hay personas encontradas.</p>
              ) : (
                personasPagina.map(p => {
                  return (
                    <div key={p.Id} className="user-card" onClick={() => openInfoModal(p)}>
                      <div className="user-card-info">
                        <div className="user-avatar"></div>
                        <div className="user-details">
                          <span className="user-name">{p.Nombre} {p.Apellido}</span>
                          <span className="user-role">Legajo: {p.Legajo}</span>
                        </div>
                      </div>
                      <button className="edit-button" onClick={(e) => { e.stopPropagation(); openEditModal(p); }}>Editar</button>
                    </div>
                  );
                })
              )}
            </div>
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                &laquo;
              </button>

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

              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                &raquo;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL ÚNICO DINÁMICO (AÑADIR / EDITAR) */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <form onSubmit={handleSubmit} onClick={e => e.stopPropagation()} className="user-crud-form">
            <button className="pregunta-close-button" onClick={() => closeModal()}>×</button>
            <div className='TitleContainer'>
              <h2 className='PTitle'>{editMode ? 'Editar Persona' : 'Añadir Persona'}</h2>
            </div>

            <div className='inputs-container'>
              {/* INPUTS SIN CANDADOS */}
              {[
                { name: 'legajo', label: 'Legajo', placeholder: 'Legajo' },
                { name: 'nombre', label: 'Nombre', placeholder: 'Nombre' },
                { name: 'apellido', label: 'Apellido', placeholder: 'Apellido' },
                { name: 'tipo_Doc', label: 'Tipo Doc', placeholder: 'Tipo de documento' },
                { name: 'num_Doc', label: 'N° Doc', placeholder: 'Número de documento' },
                { name: 'cuil', label: 'CUIL', placeholder: 'CUIL' },
                { name: 'calle', label: 'Calle', placeholder: 'Calle' },
                { name: 'altura', label: 'Altura', placeholder: 'Altura' },
                { name: 'cod_Post', label: 'Cod. Postal', placeholder: 'Código Postal' },
                { name: 'telefono', label: 'Teléfono', placeholder: 'Teléfono' },
                { name: 'email_Personal', label: 'Email personal', placeholder: 'Correo electrónico' }
              ].map(field => (
                <div className='input-container' key={field.name}>
                  <label htmlFor={field.name} className='Plabel'>{field.label}</label>
                  <div className="form-input-wrapper">
                    <input
                      id={field.name}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={form[field.name]}
                      onChange={handleChange}
                      className="form-input input-full"
                      // Se elimina readOnly y la lógica del candado
                      required={['legajo', 'nombre', 'apellido'].includes(field.name)}
                    />
                    {/* Se elimina el ícono de candado */}
                  </div>
                </div>
              ))}

              {/* SELECTS SIN CANDADOS */}
              {[
                {
                  name: 'genero',
                  label: 'Género',
                  options: [
                    { value: '', label: 'Seleccione género' },
                    { value: '1', label: 'Masculino' },
                    { value: '2', label: 'Femenino' },
                    { value: '3', label: 'Otro' }
                  ]
                },
                {
                  name: 'id_Prov',
                  label: 'Provincia',
                  options: [{ value: '', label: 'Seleccione provincia' }].concat(
                    provincias.map(p => ({ value: p.Id, label: p.Nom_Pro }))
                  )
                },
                {
                  name: 'id_Partido',
                  label: 'Partido',
                  options: [{ value: '', label: 'Seleccione partido' }].concat(
                    partidos.map(p => ({ value: p.Id, label: p.Nom_Partido }))
                  )
                },
                {
                  name: 'id_Local',
                  label: 'Localidad',
                  options: [{ value: '', label: 'Seleccione localidad' }].concat(
                    localidades.map(l => ({ value: l.Id, label: l.Nom_Local }))
                  )
                },
              ].map(sel => (
                <div className='input-container' key={sel.name}>
                  <label htmlFor={sel.name} className='Plabel'>{sel.label}</label>
                  <div className="form-input-wrapper">
                    <select
                      id={sel.name}
                      name={sel.name}
                      value={form[sel.name]}
                      onChange={handleChange}
                      className="form-select input-full"
                      required
                    // Se elimina disabled y la lógica del candado
                    >
                      {sel.options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    {/* Se elimina el ícono de candado */}
                  </div>
                </div>
              ))}
            </div>

            {/* BOTONES */}
            <div className="form-buttons-container">
              <button type="submit" className="submit-button">
                {editMode ? 'Actualizar' : 'Agregar'}
              </button>
              <button type="button" className="cancel-button" onClick={closeModal}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL DE VISUALIZACIÓN DE INFORMACIÓN */}
      {showModalInfo && selectedPersona && (
        <div className="modal-overlay" onClick={closeInfoModal}>
          <div className="user-crud-form" id="user-crud-form" onClick={e => e.stopPropagation()}>
            <button className="pregunta-close-button" onClick={closeInfoModal}>×</button>
            <h2 className="PTitle">Detalles de la Persona</h2>
            <div className='inputs-container'>
              <div className="input-container">
                <label className="Plabel">Nombre</label>
                <p className="form-input input-full">{selectedPersona.Nombre}</p>
              </div>
              <div className="input-container">
                <label className="Plabel">Apellido</label>
                <p className="form-input input-full">{selectedPersona.Apellido}</p>
              </div>
              <div className="input-container">
                <label className="Plabel">Legajo</label>
                <p className="form-input input-full">{selectedPersona.Legajo}</p>
              </div>
              <div className="input-container">
                <label className="Plabel">Documento</label>
                <p className="form-input input-full">{selectedPersona.Tipo_Doc} {selectedPersona.Num_Doc}</p>
              </div>
              <div className="input-container">
                <label className="Plabel">Género</label>
                <p className="form-input input-full">{getGeneroText(selectedPersona.Genero)}</p>
              </div>
              <div className="input-container">
                <label className="Plabel">CUIL</label>
                <p className="form-input input-full">{selectedPersona.Cuil}</p>
              </div>
              <div className="input-container">
                <label className="Plabel">Teléfono</label>
                <p className="form-input input-full">{selectedPersona.Telefono}</p>
              </div>
              <div className="input-container">
                <label className="Plabel">Email</label>
                <p className="form-input input-full">{selectedPersona.Email_Personal}</p>
              </div>
              <div className="input-container">
                <label className="Plabel">Provincia</label>
                <p className="form-input input-full">{provincias.find(p => p.Id === selectedPersona.Id_Provi)?.Nom_Pro || ''}</p>
              </div>
              <div className="input-container">
                <label className="Plabel">Partido</label>
                <p className="form-input input-full">{partidos.find(p => p.Id === selectedPersona.Id_Partido)?.Nom_Partido || ''}</p>
              </div>
              <div className="input-container">
                <label className="Plabel">Localidad</label>
                <p className="form-input input-full">{localidades.find(l => l.Id === selectedPersona.Id_Local)?.Nom_Local || ''}</p>
              </div>
            </div>
            {/* BOTÓN EDITAR EN EL MODAL DE INFO */}
            <div className="form-buttons-container">
              <button
                type="button"
                className="submit-button"
                onClick={() => openEditModal(selectedPersona)}
              >
                Editar
              </button>
              <button type="button" className="cancel-button" onClick={closeInfoModal}>
                Cerrar
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
            <p>¿Seguro que deseas actualizar esta persona?</p>

            <div className="pregunta-form-buttons">
              <button
                className="submit-button"
                onClick={() => {
                  guardarPersona();
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
export default PersonaCrud;