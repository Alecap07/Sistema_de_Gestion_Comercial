import { useState, useEffect } from "react";
import { Modal, type ModalField } from "../components/Modal";
import { CiSearch } from "react-icons/ci";
import axios from "axios";
import "../styles/PersonaCrud.css";
import { IoMdArrowRoundBack } from "react-icons/io";

const API_URL = "http://localhost:5090";

export interface ProveedorTelefonoDTO {
  id?: number;
  proveedorId: number;
  telefono: string;
  observacion?: string;
  activo: boolean;
}

export default function ProveedorTelefonos({ proveedorId }: { proveedorId: number }) {
  const [telefonos, setTelefonos] = useState<ProveedorTelefonoDTO[]>([]);
  const [selectedTelefono, setSelectedTelefono] = useState<ProveedorTelefonoDTO | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(false);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState<number | null>(null);

  const itemsPerPage = 8;
  const visiblePages = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (proveedorId) fetchTelefonos();
  }, [proveedorId]);

  const fetchTelefonos = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/proveedores/${proveedorId}/telefonos`);
      if (Array.isArray(data)) {
        setTelefonos(data);
      } else if (data?.value && Array.isArray(data.value)) {
        setTelefonos(data.value);
      } else {
        setTelefonos([]);
      }
    } catch (error) {
      console.error("Error al obtener teléfonos:", error);
    }
  };

  const TelefonosFields: ModalField[] = [
    { name: "telefono", type: "text", label: "Número de teléfono", required: true },
    { name: "observacion", type: "text", label: "Observación" },
    { name: "activo", type: "checkbox", label: "Activo" },
  ];

  const telefonosFiltrados = telefonos.filter((t) =>
    [t.telefono, t.observacion ?? ""].some((field) =>
      field.toString()
      .toLowerCase()
      .replace(/\s/g, '')
      .includes(busqueda.toLowerCase().replace(/\s/g, '')) 
    )
  );

  const handleModalSubmit = async (data: Record<string, any>) => {
    try {
      const payload: ProveedorTelefonoDTO = {
        proveedorId,
        telefono: data.telefono,
        observacion: data.observacion,
        activo: data.activo === true || data.activo === "true",
      };

      if (edit && id) {
        await axios.put(`${API_URL}/api/proveedores/telefonos/${id}`, payload);
        alert("Teléfono actualizado correctamente");
      } else {
        await axios.post(`${API_URL}/api/proveedores/${proveedorId}/telefonos`, payload);
        alert("Teléfono agregado correctamente");
      }

      fetchTelefonos();
      setOpen(false);
      setSelectedTelefono(null);
      setView(false);
      setEdit(false);
    } catch (error) {
      console.error("Error al guardar teléfono:", error);
      alert("Error al guardar teléfono. Revisa la consola.");
    }
  };

  const handleViewTelefono = async (id: number | undefined) => {
    setView(true);
    setEdit(false);
    if (id) {
      const { data } = await axios.get(`${API_URL}/api/proveedores/telefonos/${id}`);
      setSelectedTelefono({
        ...data,
        activo: Boolean(data.activo),
      });
      setId(id);
    }
    setOpen(true);
  };

  const handleAddTelefono = () => {
    setEdit(false);
    setSelectedTelefono({
      proveedorId,
      telefono: "",
      observacion: "",
      activo: true,
    });
    setView(false);
    setOpen(true);
  };

  const handleEditTelefono = async (id: number | undefined) => {
    setView(false);
    setEdit(true);
    if (id) {
      const { data } = await axios.get(`${API_URL}/api/proveedores/telefonos/${id}`);
      setSelectedTelefono({
        ...data,
        activo: Boolean(data.activo),
      });
      setId(id);
    }
    setOpen(true);
  };

  const totalPages = Math.ceil(telefonosFiltrados.length / itemsPerPage);
  const telefonosPagina = telefonosFiltrados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPageNumbers = () => {
    let startPage = Math.max(currentPage - Math.floor(visiblePages / 2), 1);
    let endPage = startPage + visiblePages - 1;
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - visiblePages + 1, 1);
    }
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  return (
    <>
      <div className="Sub-Container">
        <div className="Title-Container">
          <h1 className="Ttitle w-full">Teléfonos del Proveedor</h1>
          <a href="/" className="text-white text-2xl bold"><IoMdArrowRoundBack/> {"Volver Proveedores"}</a>
        </div>

        <div className="user-crud-container">
          <div className="search-container">
            <button className="add-button" onClick={handleAddTelefono}>Añadir</button>
            <input
              type="text"
              placeholder="Buscar teléfono..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="search-input"
            />
            <span className="search-icon"><CiSearch /></span>
          </div>

          <div className="user-cards-container">
            {telefonosPagina.length > 0 ? (
              telefonosPagina.map((tel) => (
                <div
                  key={tel.id}
                  className="user-card"
                  onClick={() => handleViewTelefono(tel.id)}
                >
                  <div className="user-card-info">
                    <div className="user-avatar"></div>
                    <div className="user-details">
                      <span className="user-name">{tel.telefono}</span>
                      {tel.observacion && <p className="text-sm italic">"{tel.observacion}"</p>}
                      <p className={`estado ${tel.activo ? "activo" : "inactivo"}`}>
                        {tel.activo ? "Activo" : "Inactivo"}
                      </p>
                    </div>
                  </div>
                  <button
                    className="edit-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditTelefono(tel.id);
                    }}
                  >
                    Editar
                  </button>
                </div>
              ))
            ) : (
              <p>No hay teléfonos registrados.</p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                &laquo;
              </button>

              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  className={currentPage === page ? "active" : ""}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                &raquo;
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal
        inputs={TelefonosFields}
        onSubmit={handleModalSubmit}
        isOpen={open}
        setIsOpen={setOpen}
        View={view}
        setView={setView}
        Title={view ? "Ver Teléfono" : edit ? "Editar Teléfono" : "Añadir Teléfono"}
        defaultValues={selectedTelefono || {}}
      />
    </>
  );
}
