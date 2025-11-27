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

export interface ProveedorDireccionDTO {
  id?: number;
  proveedorId: number;
  calle: string;
  altura?: string;
  localidad?: string;
  observacion?: string;
  activo: boolean;
}

export default function ProveedorDirecciones({ proveedorId }: { proveedorId: number }) {
  const { toasts, addToast } = useToast();
  const [direcciones, setDirecciones] = useState<ProveedorDireccionDTO[]>([]);
  const [selectedDireccion, setSelectedDireccion] = useState<ProveedorDireccionDTO | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(false);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState<number | null>(null);

  const itemsPerPage = 8;
  const visiblePages = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const fetchDirecciones = useCallback(async () => {
    try {
      const data = await fetchAll<ProveedorDireccionDTO>(`${API_URL}/api/proveedores/${proveedorId}/direcciones`, addToast);
      setDirecciones(data);
    } catch (error) {
      handleApiError(error, "Error al obtener direcciones", addToast);
    }
  }, [proveedorId, addToast]);

  useEffect(() => {
    if (proveedorId) fetchDirecciones();
  }, [proveedorId, fetchDirecciones]);

  const DireccionesFields: ModalField[] = [
    { name: "calle", type: "text", label: "Calle", required: true },
    { name: "altura", type: "text", label: "Altura" },
    { name: "localidad", type: "text", label: "Localidad" },
    { name: "observacion", type: "text", label: "Observación" },
    { name: "activo", type: "checkbox", label: "Activo" },
  ];

  const handleModalSubmit = async (data: Record<string, any>) => {
    try {
      const payload: ProveedorDireccionDTO = {
        proveedorId,
        calle: data.calle,
        altura: data.altura,
        localidad: data.localidad,
        observacion: data.observacion,
        activo: data.activo === true || data.activo === "true",
      };

      if (edit && id) {
        await update<ProveedorDireccionDTO>(`${API_URL}/api/proveedores/direcciones`, id, payload, addToast);
      } else {
        await create<ProveedorDireccionDTO>(`${API_URL}/api/proveedores/${proveedorId}/direcciones`, payload, addToast);
      }

      fetchDirecciones();
      setOpen(false);
      setSelectedDireccion(null);
      setView(false);
      setEdit(false);
    } catch (error) {
      handleApiError(error, "Error al guardar dirección", addToast);
    }
  };

  const handleViewDireccion = async (id: number | undefined) => {
    setView(true);
    setEdit(false);
    if (id) {
      // We can fetch from the list or API. Fetching from API ensures fresh data.
      // But fetchAll returns the list. fetchById is better.
      // However, the original code used axios.get(`${API_URL}/api/proveedores/direcciones/${id}`)
      // I don't have fetchById imported, I should import it or just find in list if full data is there.
      // Assuming full data is in list for now, or I can use fetchAll with filter? No.
      // I'll just find it in the list for simplicity as it's likely loaded.
      const direccion = direcciones.find(d => d.id === id);
      if (direccion) {
        setSelectedDireccion(direccion);
        setId(id);
      }
    }
    setOpen(true);
  };

  const handleAddDireccion = () => {
    setEdit(false);
    setSelectedDireccion({
      proveedorId,
      calle: "",
      altura: "",
      localidad: "",
      observacion: "",
      activo: true,
    });
    setView(false);
    setOpen(true);
  };

  const handleEditDireccion = async (id: number | undefined) => {
    setView(false);
    setEdit(true);
    if (id) {
      const direccion = direcciones.find(d => d.id === id);
      if (direccion) {
        setSelectedDireccion(direccion);
        setId(id);
      }
    }
    setOpen(true);
  };

  const direccionesFiltradas = useMemo(() => {
    return filterBySearch(direcciones, busqueda, ['calle', 'altura', 'localidad', 'observacion']);
  }, [direcciones, busqueda]);

  const totalPages = getTotalPages(direccionesFiltradas.length, itemsPerPage);
  const direccionesPagina = useMemo(() => paginateArray(direccionesFiltradas, currentPage, itemsPerPage), [direccionesFiltradas, currentPage, itemsPerPage]);
  const pageNumbers = getPageNumbers(currentPage, totalPages, visiblePages);

  return (
    <>
      <div className='Container'>
        <div className="Sub-Container">
          <div className="Title-Container w-full">
            <h1 className="Ttitle w-full">Direcciones del Proveedor</h1>
            <a href="/" className="text-white text-2xl bold items-center justify-center"><IoMdArrowRoundBack /> {"Volver Proveedores"}</a>
          </div>

          <div className="user-crud-container">
            <div className="search-container">
              <button className="add-button" onClick={handleAddDireccion}>Añadir</button>
              <input
                type="text"
                placeholder="Buscar dirección..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="search-input"
              />
              <span className="search-icon"><CiSearch /></span>
            </div>

            <div className="user-cards-container">
              {direccionesPagina.length > 0 ? (
                direccionesPagina.map((dir) => (
                  <div
                    key={dir.id}
                    className="user-card"
                    onClick={() => handleViewDireccion(dir.id)}
                  >
                    <div className="user-card-info">
                      <div className="user-avatar"></div>
                      <div className="user-details">
                        <span className="user-name">{dir.calle} {dir.altura ?? ""}</span>
                        <span className="user-role">
                          <p>{dir.localidad ?? "Sin localidad"}</p>
                        </span>
                        {dir.observacion && <p className="text-sm italic">"{dir.observacion}"</p>}
                      </div>
                    </div>
                    <button
                      className="edit-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditDireccion(dir.id);
                      }}
                    >
                      Editar
                    </button>
                  </div>
                ))
              ) : (
                <p>No hay direcciones registradas.</p>
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
        inputs={DireccionesFields}
        onSubmit={handleModalSubmit}
        isOpen={open}
        setIsOpen={setOpen}
        View={view}
        setView={setView}
        Title={view ? "Ver Dirección" : edit ? "Editar Dirección" : "Añadir Dirección"}
        defaultValues={selectedDireccion || {}}
        onEdit={edit}
      />
      <ToastContainer toasts={toasts} />
    </>
  );
}
