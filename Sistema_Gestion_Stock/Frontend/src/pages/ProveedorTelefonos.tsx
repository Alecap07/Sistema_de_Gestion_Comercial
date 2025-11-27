import { useState, useEffect, useMemo, useCallback } from "react";
import { Modal, type ModalField } from "../components/Modal";
import { CiSearch } from "react-icons/ci";
import { IoMdArrowRoundBack } from "react-icons/io";
import ToastContainer from "../components/ToastContainer";
import { useToast } from "../hooks/useToast";
import { fetchAll, create, update, handleApiError } from '../functions/api';
import { getPageNumbers, paginateArray, getTotalPages } from '../functions/pagination';
import { filterBySearch } from '../functions/filtering';
import "../styles/PersonaCrud.css";

const API_URL = "http://localhost:5090";

export interface ProveedorTelefonoDTO {
  id?: number;
  proveedorId: number;
  telefono: string;
  observacion?: string;
  activo: boolean;
}

export default function ProveedorTelefonos({ proveedorId }: { proveedorId: number }) {
  const { toasts, addToast } = useToast();
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

  const fetchTelefonos = useCallback(async () => {
    try {
      const data = await fetchAll<ProveedorTelefonoDTO>(`${API_URL}/api/proveedores/${proveedorId}/telefonos`, addToast);
      setTelefonos(data);
    } catch (error) {
      handleApiError(error, "Error al obtener teléfonos", addToast);
    }
  }, [proveedorId, addToast]);

  useEffect(() => {
    if (proveedorId) fetchTelefonos();
  }, [proveedorId, fetchTelefonos]);

  const TelefonosFields: ModalField[] = [
    { name: "telefono", type: "text", label: "Número de teléfono", required: true },
    { name: "observacion", type: "text", label: "Observación" },
    { name: "activo", type: "checkbox", label: "Activo" },
  ];

  const telefonosFiltrados = useMemo(() => {
    return filterBySearch(telefonos, busqueda, ['telefono', 'observacion']);
  }, [telefonos, busqueda]);

  const handleModalSubmit = async (data: Record<string, any>) => {
    try {
      const payload: ProveedorTelefonoDTO = {
        proveedorId,
        telefono: data.telefono,
        observacion: data.observacion,
        activo: data.activo === true || data.activo === "true",
      };

      if (edit && id) {
        await update<ProveedorTelefonoDTO>(`${API_URL}/api/proveedores/telefonos`, id, payload, addToast);
      } else {
        await create<ProveedorTelefonoDTO>(`${API_URL}/api/proveedores/${proveedorId}/telefonos`, payload, addToast);
      }

      fetchTelefonos();
      setOpen(false);
      setSelectedTelefono(null);
      setView(false);
      setEdit(false);
    } catch (error) {
      handleApiError(error, "Error al guardar teléfono", addToast);
    }
  };

  const handleViewTelefono = async (id: number | undefined) => {
    setView(true);
    setEdit(false);
    if (id) {
      const telefono = telefonos.find(t => t.id === id);
      if (telefono) {
        setSelectedTelefono(telefono);
        setId(id);
      }
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
      const telefono = telefonos.find(t => t.id === id);
      if (telefono) {
        setSelectedTelefono(telefono);
        setId(id);
      }
    }
    setOpen(true);
  };

  const totalPages = getTotalPages(telefonosFiltrados.length, itemsPerPage);
  const telefonosPagina = useMemo(() => paginateArray(telefonosFiltrados, currentPage, itemsPerPage), [telefonosFiltrados, currentPage, itemsPerPage]);
  const pageNumbers = getPageNumbers(currentPage, totalPages, visiblePages);

  return (
    <>
      <div className='Container'>
        <div className="Sub-Container">
          <div className="Title-Container">
            <h1 className="Ttitle w-full">Teléfonos del Proveedor</h1>
            <a href="/" className="text-white text-2xl bold"><IoMdArrowRoundBack /> {"Volver Proveedores"}</a>
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

                {pageNumbers.map((page) => (
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
        onEdit={edit}
      />
      <ToastContainer toasts={toasts} />
    </>
  );
}
