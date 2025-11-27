import { useEffect, useState } from "react";
import { Modal, type ModalField } from "../components/Modal";
import { CiSearch } from "react-icons/ci";
import ToastContainer from "../components/ToastContainer";
import { useToast } from "../hooks/useToast";
import type { MarcaDTO } from '../types/marca.types';
import { fetchAll, fetchById, create, update, handleApiError } from '../functions/api';
import { getPageNumbers, paginateArray, getTotalPages } from '../functions/pagination';
import { formatValueForInput } from '../functions/formatting';
import { filterByField } from '../functions/filtering';
import "../styles/PersonaCrud.css";

const API_URL = "http://localhost:5080";


export default function MarcasCrud() {
  const { toasts, addToast } = useToast();
  const [marcas, setMarcas] = useState<MarcaDTO[]>([]);
  const [selectedMarca, setSelectedMarca] = useState<MarcaDTO | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState(false);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState(0);
  const [busqueda, setBusqueda] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const visiblePages = 5;

  // ===== Obtener marcas =====
  const fetchMarcas = async () => {
    try {
      const data = await fetchAll<MarcaDTO>(`${API_URL}/api/marcas`, addToast);
      setMarcas(data);
    } catch (error) {
      handleApiError(error, 'Error al obtener marcas', addToast);
    }
  };

  useEffect(() => {
    fetchMarcas();
  }, []);

  // ===== Obtener marca por ID =====
  const fetchMarcaById = async (id: number, edit: boolean) => {
    try {
      const data = await fetchById<MarcaDTO>(`${API_URL}/api/marcas`, id, addToast);
      setSelectedMarca(data);
      setView(await edit);
      setIsOpen(true);
    } catch (error) {
      handleApiError(error, 'No se pudo obtener la marca', addToast);
    }
  };

  // ===== Crear nueva =====
  const openCreateModal = () => {
    setSelectedMarca(null);
    setView(false);
    setEdit(false);
    setIsOpen(true);
  };

  // ===== Campos base =====
  const marcaFieldBase: ModalField[] = [
    { name: "nombre", type: "text", label: "Nombre de la Marca", required: true, minLength: 1, maxLength: 100 },
    { name: "activo", type: "checkbox", label: "Activo", defaultValue: true }
  ];


  // ===== Inputs del modal =====
  const modalInputs: ModalField[] = marcaFieldBase.map((f) => {
    const base = { ...f } as ModalField;
    if (!selectedMarca) {
      base.defaultValue = base.defaultValue ?? (base.type === "checkbox" ? false : "");
      return base;
    }
    const raw = (selectedMarca as any)[f.name];
    const formatted = formatValueForInput(raw, f.type as string);

    base.defaultValue = formatted;
    (base as any).value = formatted;

    return base;
  });

  // ===== Crear / Editar =====
  const handleModalSubmit = async (data: Record<string, any>) => {
    try {
      const payload = {
        nombre: data.nombre,
        activo: !!data.activo,
      };

      if (edit) {
        await update<MarcaDTO>(`${API_URL}/api/marcas`, id, payload, addToast);
      } else {
        await create<MarcaDTO>(`${API_URL}/api/marcas`, payload, addToast);
      }

      fetchMarcas();
      setIsOpen(false);
      setSelectedMarca(null);
      setView(false);
    } catch (error) {
      handleApiError(error, edit ? 'Error al editar marca' : 'Error al crear marca', addToast);
    }
  };

  // ===== Filtrar marcas =====
  const marcasFiltradas = filterByField(marcas, busqueda, 'nombre');

  const totalPages = getTotalPages(marcasFiltradas.length, itemsPerPage);
  const marcasPagina = paginateArray(marcasFiltradas, currentPage, itemsPerPage);
  const pageNumbers = getPageNumbers(currentPage, totalPages, visiblePages);

  return (
    <>
      <div className='Container'>
        <div className="Sub-Container">
          <div className="Title-Container">
            <h1 className="Ttitle">Marcas</h1>
          </div>

          <div className="user-crud-container">
            <div className="search-container">
              <button className="add-button" onClick={openCreateModal}>
                Añadir
              </button>
              <input
                type="text"
                placeholder="Buscar marca por nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">
                <CiSearch />
              </span>
            </div>

            <div className="user-cards-container">
              {marcasPagina.length > 0 ? (
                marcasPagina.map((m) => (
                  <div
                    key={m.id}
                    className="user-card"
                    onClick={() => {
                      setId(m.id);
                      fetchMarcaById(m.id, true);
                      setView(false);
                      setEdit(true);
                    }}
                  >
                    <div className="user-card-info">
                      <div className="user-avatar"></div>
                      <div className="user-details">
                        <span className="user-name">{m.nombre}</span>
                        <p className="p-0">Estado: {m.activo ? "Activo" : "Inactivo"}</p>
                      </div>
                    </div>
                    <div className="flex flex-row justify-center gap-2 mt-3">
                      <button
                        className="edit-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setId(m.id);
                          fetchMarcaById(m.id, false);
                          setView(false);
                          setEdit(true);
                        }}
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No hay marcas registradas.</p>
              )}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={page === currentPage ? "active" : ""}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal dinámico */}
      <Modal
        inputs={modalInputs}
        onSubmit={handleModalSubmit}
        isOpen={isOpen}
        setIsOpen={(v) => {
          setIsOpen(v);
          if (!v) {
            setSelectedMarca(null);
            setView(false);
            setEdit(false);
          }
        }}
        Title={view ? "Ver Marca" : edit ? "Editar Marca" : "Crear Marca"}
        View={view}
        setView={setView}
        defaultValues={{}}
        onEdit={edit}
      />
      <ToastContainer toasts={toasts} />
    </>
  );
}
