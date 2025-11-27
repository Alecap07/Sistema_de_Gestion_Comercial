import React, { useEffect, useState } from 'react';
// import { FaLock } from 'react-icons/fa'; // Se elimina FaLock
import '../styles/restricciones.css';

const API_BASE_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/$/, '') : 'http://localhost:5160';
const apiUrl = `${API_BASE_URL}/api/restriccion`;

function RestriccionCrud() {
  const [restricciones, setRestricciones] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [editForm, setEditForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // NUEVO ESTADO para el modal de confirmación

  // Se eliminan los estados de lockedFields
  // const [lockedFields, setLockedFields] = useState({ ... });

  useEffect(() => {
    fetchRestricciones();
    fetchTipos();
  }, []);

  const fetchTipos = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/TipoRestriccion`);
      const data = await res.json();
      setTipos(data || []);
    } catch {
      setTipos([]);
    }
  };

  const fetchRestricciones = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      setRestricciones(data || []);
    } catch {
      setRestricciones([]);
    }
    setLoading(false);
  };

  const handleEditClick = (r) => {
    setEditForm({ ...r });
    // Se elimina la inicialización de lockedFields
  };

  const handleCloseModal = () => {
    setEditForm(null);
    setShowConfirmModal(false); // Asegura que se cierre si estaba abierto
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  // Se elimina la función toggleLock

  // Lógica de actualización separada (se llama desde el modal de confirmación)
  const actualizarRestriccion = async () => {
    try {
      const res = await fetch(`${apiUrl}/${editForm.Id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editForm,
          Id_TipoRestri: Number(editForm.Id_TipoRestri),
          Cantidad: Number(editForm.Cantidad),
        })
      });

      if (!res.ok) {
        throw new Error('Error al actualizar la restricción');
      }
    } catch (error) {
      console.error(error);
      alert('Hubo un error al guardar los cambios.');
    } finally {
      // Cerrar modales y recargar datos después de la operación (exitosa o fallida)
      setEditForm(null);
      setShowConfirmModal(false);
      fetchRestricciones();
    }
  };
  
  // Función llamada al enviar el formulario (ahora solo abre el modal de confirmación)
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
    // Nota: La actualización real se hace en la función 'actualizarRestriccion'
  };

  return (
    <>
      <div className='Container'>
        <div className="pregunta-crud-page">
          <div className="pregunta-crud-container">
            <div className='Title-Container'>
              <h2 className="Ttitle">Restricciones</h2>
            </div>
            <div className='pregunta-container'>
              {loading ? (
                <div className="empty-table">Cargando...</div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Descripcion</th>
                      <th>Tipo de Restriccion</th>
                      <th>Activa</th>
                      <th>Cantidad</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {restricciones.map(r => {
                      const tipo = tipos.find(t => String(t.Id) === String(r.Id_TipoRestri));
                      return (
                        <tr key={r.Id}>
                          <td data-label="Descripción">{r.Descripcion}</td>
                          <td data-label="Tipo de Restricción">{tipo ? tipo.Tipo : ''}</td>
                          <td data-label="Activa">{r.Activa ? 'Sí' : 'No'}</td>
                          <td data-label="Cantidad">{r.Cantidad}</td>
                          <td data-label="Acciones">
                            <button className="edit-button" onClick={() => handleEditClick(r)}>Editar</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE EDICIÓN */}
      {editForm && (
        <div className="pregunta-modal-overlay" onClick={handleCloseModal}>
          <div className="pregunta-modal-content" onClick={e => e.stopPropagation()}>
            <button className="pregunta-close-button" onClick={handleCloseModal}>×</button>

            <form className="pregunta-crud-form" onSubmit={handleSubmit}>
              <h2 className="PTitle">Editar Restricción</h2>

              {/* DESCRIPCIÓN (Solo lectura) */}
              <div className='input-container'>
                <label className="Plabel">Descripción</label>
                <div className="form-input-wrapper">
                  <p className="form-input">
                    {editForm.Descripcion}
                  </p>
                </div>
              </div>

              {/* ACTIVA (CHECKBOX ESTILIZADO SIN CANDADO) */}
              <div className="form-input-wrapper">
                <label className="checkbox-wrapper-12">
                  <div className="cbx">
                    <input
                      name="Activa"
                      type="checkbox"
                      checked={editForm.Activa}
                      onChange={handleChange}
                      id="cbx-activa"
                      // Se elimina disabled
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
                        <feColorMatrix result="goo-activa" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 22 -7" mode="matrix" in="blur"></feColorMatrix>
                        <feBlend in2="goo-activa" in="SourceGraphic"></feBlend>
                      </filter>
                    </defs>
                  </svg>

                  <p className='PCheckInfo'>{editForm.Activa ? 'Activa' : 'Inactiva'}</p>
                </label>
                {/* Se elimina el icono de candado */}
              </div>

              {/* CANTIDAD */}
              <div className='input-container'>
                <label className="Plabel">Cantidad</label>
                <div className="form-input-wrapper">
                  <input
                    type="number"
                    name="Cantidad"
                    value={editForm.Cantidad}
                    onChange={handleChange}
                    // Se elimina disabled
                    className="form-input"
                  />
                  {/* Se elimina el icono de candado */}
                </div>
              </div>

              {/* TIPO DE RESTRICCIÓN */}
              <div className='input-container'>
                <label className="Plabel">Tipo de Restricción</label>
                <div className="form-input-wrapper">
                  <select
                    name="Id_TipoRestri"
                    value={editForm.Id_TipoRestri}
                    onChange={handleChange}
                    // Se elimina disabled
                    className="form-select"
                  >
                    <option value="">Seleccione...</option>
                    {tipos.map(t => (
                      <option key={t.Id} value={t.Id}>{t.Tipo}</option>
                    ))}
                  </select>
                  {/* Se elimina el icono de candado */}
                </div>
              </div>

              {/* BOTONES */}
              <div className="form-buttons-container">
                <button type="submit" className="submit-button">Guardar</button>
                <button type="button" className="cancel-button" onClick={handleCloseModal}>
                  Cancelar
                </button>
              </div>
            </form>
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
      <p>¿Seguro que deseas actualizar esta restricción?</p>

      <div className="pregunta-form-buttons">
        <button className="submit-button" onClick={actualizarRestriccion}>
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

export default RestriccionCrud;