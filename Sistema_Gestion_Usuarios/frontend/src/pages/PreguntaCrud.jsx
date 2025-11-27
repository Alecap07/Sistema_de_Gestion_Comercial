import React, { useEffect, useState } from 'react';
import '../styles/PreguntaCrud.css';
import { CiSearch } from "react-icons/ci";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5160';

function PreguntaCrud() {
  const [preguntas, setPreguntas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [form, setForm] = useState({ Id: 0, Pregunta: '', Activa: true });
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const itemsPerPage = 8;

  const fetchPreguntas = () => {
    fetch(`${API_URL}/api/pregunta`)
      .then(res => res.json())
      .then(data => setPreguntas(Array.isArray(data) ? data : []))
      .catch(() => setError('Error al obtener preguntas'));
  };

  useEffect(() => {
    fetchPreguntas();
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const guardarPregunta = () => {
    const method = editMode ? 'PUT' : 'POST';
    const url = editMode ? `${API_URL}/api/pregunta/${form.Id}` : `${API_URL}/api/pregunta`;
    const body = {
      Id: form.Id,
      Pregunta: form.Pregunta,
      Activa: form.Activa
    };

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(async res => {
        if (!res.ok) {
          let msg = editMode ? 'Error al actualizar pregunta' : 'Error al agregar pregunta';
          if (res.status === 400) {
            const text = await res.text();
            msg = text || msg;
          }
          throw new Error(msg);
        }

        setForm({ Id: 0, Pregunta: '', Activa: true });
        setEditMode(false);
        setModalOpen(false);
        setShowConfirmModal(false);
        setError(null);
        fetchPreguntas();
      })
      .catch(err => {
        setError(err.message);
        setShowConfirmModal(false);
      });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setError(null);

    if (editMode) {
      setShowConfirmModal(true);
      return;
    }

    guardarPregunta();
  };

  const handleEdit = (pregunta) => {
    setForm({
      Id: pregunta.Id,
      Pregunta: pregunta.Pregunta,
      Activa: pregunta.Activa
    });
    setEditMode(true);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditMode(false);
    setForm({ Id: 0, Pregunta: '', Activa: true });
    setError(null);
  };

  const preguntasFiltradas = preguntas.filter((p) =>
    (p.Pregunta || "").toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPages = Math.ceil(preguntasFiltradas.length / itemsPerPage);
  const preguntasPagina = preguntasFiltradas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const visiblePages = 5;
  const getPageNumbers = () => {
    let startPage = Math.max(currentPage - Math.floor(visiblePages / 2), 1);
    let endPage = startPage + visiblePages - 1;
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - visiblePages + 1, 1);
    }
    const pages = [];
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  };

  return (
    <>
      <div className='Container'>
        <div className="pregunta-crud-container">
          <div className='Title-Container'>
            <h1 className="Ttitle">Preguntas</h1>
          </div>
          <div className='pregunta-container'>
           <div className="search-container">
  <button
    className="add-button"
    onClick={modalOpen ? closeModal : () => { setEditMode(false); setModalOpen(true); }}
  >
    Añadir
  </button>
  <input
    type="text"
    placeholder="Buscar pregunta..."
    value={busqueda}
    onChange={e => { setBusqueda(e.target.value); setCurrentPage(1); }}
    className="search-input"
  />
  <span className="search-icon"><CiSearch /></span>
</div>


            {error && <p className="error-message">{error}</p>}

            <div className="pregunta-cards-container">
              {preguntasPagina.map((p) => (
                <div
                  className="pregunta-card"
                  key={p.Id}
                  onClick={() => handleEdit(p)}
                >
                  <div className="pregunta-card-info">
                    <div className="pregunta-avatar">?</div>
                    <div className="pregunta-details">
                      <span className="pregunta-name">{p.Pregunta}</span>
                      <span className="pregunta-status">{p.Activa ? 'Activa' : 'Inactiva'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación */}
            <div className="pagination">
              <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>&laquo;</button>
              {getPageNumbers()[0] > 1 && <>
                <button onClick={() => handlePageChange(1)}>1</button>
                {getPageNumbers()[0] > 2 && <span className="dots">...</span>}
              </>}
              {getPageNumbers().map(page => (
                <button key={page} className={currentPage === page ? 'active' : ''} onClick={() => handlePageChange(page)}>{page}</button>
              ))}
              {getPageNumbers()[getPageNumbers().length - 1] < totalPages && <>
                {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && <span className="dots">...</span>}
                <button onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
              </>}
              <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>&raquo;</button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL AÑADIR / EDITAR --- */}
      {modalOpen && (
        <div className="pregunta-modal-overlay" onClick={closeModal}>
          <div className="pregunta-modal-content" onClick={e => e.stopPropagation()}>
            <button className="pregunta-close-button" onClick={closeModal}>×</button>
            <h2 className="PTitle">{editMode ? 'Editar Pregunta' : 'Añadir Pregunta'}</h2>

            <form onSubmit={handleSubmit} className="pregunta-crud-form">
              <div className="pregunta-inputs-container">
                <div className="form-input-wrapper">
                  <input
                    name="Pregunta"
                    placeholder="Pregunta"
                    value={form.Pregunta}
                    onChange={handleChange}
                    required
                    className="form-input"
                    id='PInput'
                  />
                </div>

                <div className="form-input-wrapper">
                  <label className="checkbox-wrapper-12">
                    <div className="cbx">
                      <input
                        name="Activa"
                        type="checkbox"
                        checked={form.Activa}
                        onChange={handleChange}
                        id="cbx-activa"
                      />
                      <label htmlFor="cbx-activa"></label>
                      <svg fill="none" viewBox="0 0 15 14" height="14" width="15">
                        <path d="M2 8.36364L6.23077 12L13 2"></path>
                      </svg>
                    </div>

                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <filter id="goo-activa">
                          <feGaussianBlur result="blur" stdDeviation="4" in="SourceGraphic"></feGaussianBlur>
                          <feColorMatrix result="goo-activa" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7" mode="matrix" in="blur"></feColorMatrix>
                          <feBlend in2="goo-activa" in="SourceGraphic"></feBlend>
                        </filter>
                      </defs>
                    </svg>

                    <p className='PCheckInfo'>{form.Activa ? 'Activa' : 'Inactiva'}</p>
                  </label>
                </div>
              </div>

              <div className="form-buttons-container">
                <button type="submit" className="submit-button">
                  {editMode ? 'Actualizar' : 'Agregar'}
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DE CONFIRMACIÓN (DISEÑO UNIFICADO) --- */}
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
            <p>¿Seguro que deseas guardar los cambios de esta pregunta?</p>

            <div className="pregunta-form-buttons">
              <button className="submit-button" onClick={guardarPregunta}>
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

export default PreguntaCrud;
