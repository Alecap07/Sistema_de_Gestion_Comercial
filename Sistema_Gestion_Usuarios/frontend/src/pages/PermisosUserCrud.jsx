import React, { useState, useEffect } from "react";
import "../styles/PreguntaCrud.css";
import "../styles/permisos.css";
import { CiSearch } from "react-icons/ci";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5160";

function PermisosUserCrud() {
  const [usuarios, setUsuarios] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [permisosUser, setPermisosUser] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const [form, setForm] = useState({
    Id_User: "",
    Id_Permi: "",
    Fecha_Vto: "",
    Original_Id_User: null,
    Original_Id_Permi: null,
  });
  const [descripcionPermiso, setDescripcionPermiso] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Paginación
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);

  // --- Fetch inicial ---
  useEffect(() => {
    fetch(`${API_URL}/api/Usuario/solo-id-nombre`)
      .then((res) => res.json())
      .then(setUsuarios)
      .catch(() => setUsuarios([]));

    fetch(`${API_URL}/api/Permiso`)
      .then((res) => res.json())
      .then(setPermisos)
      .catch(() => setPermisos([]));

    fetchPermisosUser();
  }, []);

  const fetchPermisosUser = () => {
    fetch(`${API_URL}/api/PermisosUser`)
      .then((res) => res.json())
      .then(setPermisosUser)
      .catch(() => setPermisosUser([]));
  };

  // --- Actualiza descripción del permiso ---
  useEffect(() => {
    if (form.Id_Permi) {
      const permiso = permisos.find((p) => String(p.Id) === String(form.Id_Permi));
      setDescripcionPermiso(permiso ? permiso.Descripcion : "");
    } else setDescripcionPermiso("");
  }, [form.Id_Permi, permisos]);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleEdit = (pu) => {
    setForm({
      Id_User: String(pu.Id_User),
      Id_Permi: String(pu.Id_Permi),
      Fecha_Vto: pu.Fecha_Vto ? pu.Fecha_Vto.slice(0, 10) : "",
      Original_Id_User: pu.Id_User,
      Original_Id_Permi: pu.Id_Permi,
    });
    const permiso = permisos.find((p) => p.Id === pu.Id_Permi);
    setDescripcionPermiso(permiso ? permiso.Descripcion : "");
    setEditMode(true);
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!form.Id_User || !form.Id_Permi || !form.Fecha_Vto) {
      setError("Debe completar todos los campos.");
      return;
    }

    if (editMode) {
      // Si es edición, mostrar confirmación
      setShowConfirmModal(true);
    } else {
      // Si es alta nueva, guardar directamente
      saveOrUpdatePermiso();
    }
  };

  const saveOrUpdatePermiso = async () => {
    setError(null);
    setShowConfirmModal(false);

    try {
      const fechaISO = form.Fecha_Vto.includes("/")
        ? form.Fecha_Vto.split("/").reverse().join("-")
        : form.Fecha_Vto;

      const body = {
        Id_User: parseInt(form.Id_User),
        Id_Permi: parseInt(form.Id_Permi),
        Fecha_Vto: fechaISO,
        Original_Id_User:
          form.Original_Id_User ?? parseInt(form.Id_User),
        Original_Id_Permi:
          form.Original_Id_Permi ?? parseInt(form.Id_Permi),
      };

      const res = await fetch(`${API_URL}/api/PermisosUser`, {
        method: editMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error((await res.text()) || "Error al guardar.");

      fetchPermisosUser();
      closeModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setShowConfirmModal(false);
    setForm({
      Id_User: "",
      Id_Permi: "",
      Fecha_Vto: "",
      Original_Id_User: null,
      Original_Id_Permi: null,
    });
    setEditMode(false);
    setError(null);
  };

  const permisosFiltrados = permisosUser.filter((pu) => {
    const usuario = usuarios.find((u) => u.Id === pu.Id_User);
    return usuario?.Nombre_Usuario?.toLowerCase().includes(busqueda.toLowerCase()) ?? true;
  });

  const totalPages = Math.ceil(permisosFiltrados.length / itemsPerPage);
  const permisosPagina = permisosFiltrados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <>
      <div className="Container">
        <div className="pregunta-crud-container">
          <div className="Title-Container">
            <h1 className="Ttitle">Permisos de Usuarios</h1>
          </div>

          <div className="pregunta-container">
            <div className="search-container">
              <button
                className="add-button"
                onClick={() => {
                  setEditMode(false);
                  setForm({
                    Id_User: "",
                    Id_Permi: "",
                    Fecha_Vto: "",
                    Original_Id_User: null,
                    Original_Id_Permi: null,
                  });
                  setModalOpen(true);
                  setError(null);
                }}
              >
                Añadir
              </button>

              <input
                type="text"
                placeholder="Buscar usuario..."
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setCurrentPage(1);
                }}
                className="search-input"
              />
              <span className="search-icon">
                <CiSearch />
              </span>
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="pregunta-cards-container">
              {permisosPagina.map((pu) => {
                const usuario = usuarios.find((u) => u.Id === pu.Id_User);
                const permiso = permisos.find((p) => p.Id === pu.Id_Permi);
                return (
                  <div
                    className="pregunta-card"
                    key={`${pu.Id_User}-${pu.Id_Permi}`}
                    onClick={() => handleEdit(pu)}
                  >
                    <div className="pregunta-card-info">
                      <div className="user-avatar"></div>
                      <div className="pregunta-details">
                        <span className="pregunta-name">
                          {usuario?.Nombre_Usuario || "Usuario"}
                        </span>
                        <span className="pregunta-status">
                          Permiso: {permiso?.Permiso || "Sin permiso"}
                        </span>
                        <span className="pregunta-status">
                          Vence:{" "}
                          {pu.Fecha_Vto
                            ? new Date(pu.Fecha_Vto).toLocaleDateString()
                            : "Sin fecha"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* --- Paginación --- */}
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                &laquo;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={currentPage === page ? "active" : ""}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
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

      {/* MODAL PRINCIPAL */}
      {modalOpen && (
        <div className="pregunta-modal-overlay" onClick={closeModal}>
          <div
            className="pregunta-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="pregunta-close-button" onClick={closeModal}>
              ×
            </button>
            <h2 className="PTitle">
              {editMode ? "Editar Permiso Temporal" : "Asignar Permiso Temporal"}
            </h2>

            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit} className="pregunta-crud-form">
              <div className="pregunta-inputs-container">
                <div className="pregunta-input-wrapper">
                  <label>Usuario:</label>
                  <select
                    name="Id_User"
                    value={form.Id_User}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Seleccione...</option>
                    {usuarios.map((u) => (
                      <option key={u.Id} value={u.Id}>
                        {u.Nombre_Usuario}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pregunta-input-wrapper">
                  <label>Permiso:</label>
                  <select
                    name="Id_Permi"
                    value={form.Id_Permi}
                    onChange={handleChange}
                    className="form-select"
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
      rows={2} // ajustar según necesites
    />
  </div>
)}


                <div className="pregunta-input-wrapper">
                  <label>Fecha de vencimiento:</label>
                  <input
                    type="date"
                    name="Fecha_Vto"
                    value={form.Fecha_Vto}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="pregunta-form-buttons">
                <button type="submit" className="submit-button">
                  {editMode ? "Actualizar" : "Asignar"}
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
      <p>¿Seguro que deseas guardar los cambios del permiso temporal?</p>

      <div className="pregunta-form-buttons">
        <button className="submit-button" onClick={saveOrUpdatePermiso}>
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

export default PermisosUserCrud;
