import React, { useState, useEffect } from 'react';
import { CiSearch } from "react-icons/ci";
import '../styles/AsignarPermisosRol.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5160';

function AsignarPermisosRol() {
  const [roles, setRoles] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // Nuevo estado para la búsqueda, si deseas implementarla visualmente
  const [busqueda, setBusqueda] = useState(''); 

  const [form, setForm] = useState({
    Id_Rol: '',
    Id_Permi: '',
  });

  const [descripcionPermiso, setDescripcionPermiso] = useState('');

  useEffect(() => {
    fetchRoles();
    fetchPermisos();
    fetchAsignaciones();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await fetch(`${API_URL}/api/RolPersona/roles`);
      if (!res.ok) throw new Error();
      setRoles(await res.json());
    } catch {
      setRoles([]);
    }
  };

  const fetchPermisos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/Permiso`);
      if (!res.ok) throw new Error();
      setPermisos(await res.json());
    } catch {
      setPermisos([]);
    }
  };

  const fetchAsignaciones = async () => {
    try {
      const res = await fetch(`${API_URL}/api/PermisosRol`);
      if (!res.ok) throw new Error();
      setAsignaciones(await res.json());
    } catch {
      setAsignaciones([]);
    }
  };

  const openModal = (index = null) => {
    if (index !== null) {
      const asignacion = asignaciones[index];
      setForm({
        Id_Rol: String(asignacion.Id_Rol),
        Id_Permi: String(asignacion.Id_Permi),
      });
      const permiso = permisos.find((p) => String(p.Id) === String(asignacion.Id_Permi));
      setDescripcionPermiso(permiso ? permiso.Descripcion : '');
      setEditIndex(index);
    } else {
      setForm({ Id_Rol: '', Id_Permi: '' });
      setDescripcionPermiso('');
      setEditIndex(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm({ Id_Rol: '', Id_Permi: '' });
    setDescripcionPermiso('');
    setEditIndex(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'Id_Permi') {
      const permiso = permisos.find((p) => String(p.Id) === String(value));
      setDescripcionPermiso(permiso ? permiso.Descripcion : '');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.Id_Rol || !form.Id_Permi) return;
    if (editIndex !== null) {
      // Abrir modal de confirmación
      setConfirmModalOpen(true);
    } else {
      guardarAsignacion();
    }
  };

  const guardarAsignacion = async () => {
    try {
      if (editIndex !== null) {
        const asignacion = asignaciones[editIndex];
        await fetch(`${API_URL}/api/PermisosRol/${asignacion.Id_PermisosRol}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            Id_Rol: parseInt(form.Id_Rol),
            Id_Permi: parseInt(form.Id_Permi),
            Nombre: asignacion.Nombre || '',
          }),
        });
      } else {
        await fetch(`${API_URL}/api/PermisosRol`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            Id_Rol: parseInt(form.Id_Rol),
            Id_Permi: parseInt(form.Id_Permi),
            Nombre: '',
          }),
        });
      }
      setConfirmModalOpen(false);
      closeModal();
      fetchAsignaciones();
    } catch {
      alert('Error al guardar la asignación');
    }
  };

  return (
    <>
      <div className="Container">
        <div className="pregunta-crud-container">
          <div className="Title-Container">
            <h1 className="Ttitle">Asignar permisos a rol</h1>
          </div>
          <div className="crud-container">
            {/* INICIO DEL CÓDIGO MODIFICADO */}
           <div className="search-container">
  <button className="add-button" onClick={() => openModal()}>
    Añadir
  </button>
 
</div>
            {/* FIN DEL CÓDIGO MODIFICADO */}


            <div className="crud-permisos-table" style={{ marginTop: '24px' }}>
              <table className="tabla">
                <thead>
                  <tr>
                    <th>Rol</th>
                    <th>Permiso</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {asignaciones.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="empty-table">
                        No hay asignaciones aún.
                      </td>
                    </tr>
                  ) : (
                    asignaciones.map((a, i) => (
                      <tr key={i}>
                        <td data-label="Rol">
                          {roles.find((r) => r.Id === a.Id_Rol)?.Rol || ''}
                        </td>
                        <td data-label="Permiso">
                          {permisos.find((p) => p.Id === a.Id_Permi)?.Permiso || a.Id_Permi}
                        </td>
<td data-label="Acciones">
  <div className="acciones-container">
    <button className="edit-button" onClick={() => openModal(i)}>
      Editar
    </button>
    {/* Si agregás más botones */}
  </div>
</td>


                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL PRINCIPAL --- */}
      {modalOpen && (
        <div className="pregunta-modal-overlay" onClick={closeModal}>
          <div className="pregunta-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="pregunta-close-button" onClick={closeModal}>
              ×
            </button>
            <h2 className="PTitle">{editIndex !== null ? 'Editar Asignación' : 'Asignar Permiso'}</h2>

            <form className="pregunta-crud-form" onSubmit={handleSubmit}>
              {/* Rol */}
              <div className="pregunta-input-wrapper">
                <label>Rol:</label>
                <select
                  name="Id_Rol"
                  value={form.Id_Rol}
                  onChange={handleChange}
                  className="pregunta-form-input"
                >
                  <option value="">Seleccione...</option>
                  {roles.map((r) => (
                    <option key={r.Id} value={r.Id}>
                      {r.Rol}
                    </option>
                  ))}
                </select>
              </div>

              {/* Permiso */}
              <div className="pregunta-input-wrapper">
                <label>Permiso:</label>
                <select
                  name="Id_Permi"
                  value={form.Id_Permi}
                  onChange={handleChange}
                  className="pregunta-form-input"
                >
                  <option value="">Seleccione...</option>
                  {permisos.map((p) => (
                    <option key={p.Id} value={p.Id}>
                      {p.Permiso}
                    </option>
                  ))}
                </select>
              </div>
{descripcionPermiso && (
  <div className="pregunta-input-wrapper">
    <label>Descripción:</label>
    <textarea
      value={descripcionPermiso}
      readOnly
      className="pregunta-form-input pregunta-textarea"
      rows={2} // Ajusta según necesites
    />
  </div>
)}

              <div className="pregunta-form-buttons">
                <button type="submit" className="submit-button">
                  {editIndex !== null ? 'Actualizar' : 'Asignar'}
                </button>
                <button type="button" className="cancel-button" onClick={closeModal}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DE CONFIRMACIÓN --- */}
      {confirmModalOpen && (
        <div className="pregunta-modal-overlay" onClick={() => setConfirmModalOpen(false)}>
          <div className="pregunta-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="PTitle">¿Confirmar actualización?</h3>
            <p>¿Seguro que deseas actualizar esta asignación de permiso?</p>
            <div className="pregunta-form-buttons">
              <button className="submit-button" onClick={guardarAsignacion}>
                Confirmar
              </button>
              <button className="cancel-button" onClick={() => setConfirmModalOpen(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AsignarPermisosRol;