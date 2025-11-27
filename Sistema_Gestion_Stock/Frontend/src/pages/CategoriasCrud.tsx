import { useEffect, useState } from "react";
import { Modal, type ModalField } from "../components/Modal";
import { CiSearch } from "react-icons/ci";
import ToastContainer from "../components/ToastContainer";
import { useToast } from "../hooks/useToast";
import type { CategoriaDTO } from '../types/categoria.types';
import { fetchAll, fetchById, create, update, handleApiError } from '../functions/api';
import { getPageNumbers, paginateArray, getTotalPages } from '../functions/pagination';
import { formatValueForInput } from '../functions/formatting';
import { filterByField } from '../functions/filtering';
import "../styles/PersonaCrud.css";

const API_URL = "http://localhost:5080";


export default function CategoriasCrud() {
  const { toasts, addToast } = useToast();
  const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState(false);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState(0);
  const [selectedCategoria, setSelectedCategoria] = useState<CategoriaDTO | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const visiblePages = 5;

  const fetchCategorias = async () => {
    try {
      const data = await fetchAll<CategoriaDTO>(`${API_URL}/api/categorias`, addToast);
      setCategorias(data);
    } catch (error) {
      handleApiError(error, 'Error al obtener categorías', addToast);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  // ===== Obtener categoría por ID =====
  const fetchCategoriaById = async (id: number, isEdit: boolean) => {
    try {
      const data = await fetchById<CategoriaDTO>(`${API_URL}/api/categorias`, id, addToast);
      setSelectedCategoria(data);
      setView(!isEdit);
      setEdit(isEdit);
      setIsOpen(true);
    } catch (error) {
      handleApiError(error, 'Error al obtener categoría', addToast);
    }
  };

  // ===== Crear nueva =====
  const openCreateModal = () => {
    setSelectedCategoria(null);
    setView(false);
    setEdit(false);
    setIsOpen(true);
  };

  // ===== Campos del modal =====
  const categoriaFields: ModalField[] = [
    { name: "nombre", type: "text", label: "Nombre", required: true, minLength: 1, maxLength: 200 },
    { name: "activo", type: "checkbox", label: "Activo", defaultValue: true },
  ];

  // ===== Formateo para valores del modal =====
  const formatValueForInput = (value: any, type?: string) => {
    if (value === null || value === undefined) {
      if (type === "checkbox") return false;
      return "";
    }
    if (type === "checkbox") return !!value;
    return String(value);
  };

  // ===== Inputs dinámicos =====
  const modalInputs: ModalField[] = categoriaFields.map((f) => {
    const base = { ...f } as ModalField;
    if (!selectedCategoria) {
      base.defaultValue = base.defaultValue ?? (base.type === "checkbox" ? false : "");
      return base;
    }
    const raw = (selectedCategoria as any)[f.name];
    const formatted = formatValueForInput(raw, f.type as string);
    base.defaultValue = formatted;
    (base as any).value = formatted;
    return base;
  });

  // ===== Guardar (crear/editar) =====
  const handleModalSubmit = async (data: Record<string, any>) => {
    try {
      const payload = {
        nombre: data.nombre,
        activo: !!data.activo,
      };
      if (edit) {
        await update<CategoriaDTO>(`${API_URL}/api/categorias`, id, payload, addToast);
      } else {
        await create<CategoriaDTO>(`${API_URL}/api/categorias`, payload, addToast);
      }
      fetchCategorias();
      setIsOpen(false);
      setSelectedCategoria(null);
      setView(false);
      setEdit(false);
    } catch (error) {
      addToast("❌ Error al guardar categoría", "error");
    }
  };

  // ===== Filtrado, paginación =====
  const categoriasFiltradas = filterByField(categorias, busqueda, 'nombre');
  const totalPages = getTotalPages(categoriasFiltradas.length, itemsPerPage);
  const categoriasPagina = paginateArray(categoriasFiltradas, currentPage, itemsPerPage);
  const pageNumbers = getPageNumbers(currentPage, totalPages, visiblePages);

  // ===== Render =====
  return (
    <>
      <div className='Container'>
        <div className="Sub-Container">
          <div className="Title-Container">
            <h1 className="Ttitle">Categorías</h1>
          </div>

          <div className="user-crud-container">
            <div className="search-container">
              <button className="add-button" onClick={openCreateModal}>
                Añadir
              </button>
              <input
                type="text"
                placeholder="Buscar categoría por nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">
                <CiSearch />
              </span>
            </div>

            <div className="user-cards-container">
              {categoriasPagina.length > 0 ? (
                categoriasPagina.map((cat) => (
                  <div
                    key={cat.id}
                    className="user-card"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (cat.id) {
                        setId(cat.id);
                        fetchCategoriaById(cat.id, true);
                      }
                    }}
                  >
                    <div className="user-card-info">
                      <div className="user-avatar"></div>
                      <div className="user-details">
                        <span className="user-name">{cat.nombre}</span>
                        <p className="p-0">Estado: {cat.activo ? "Activo" : "Inactivo"}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No hay categorías registradas.</p>
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
            setSelectedCategoria(null);
            setView(false);
            setEdit(false);
          }
        }}
        Title={view ? "Ver Categoría" : edit ? "Editar Categoría" : "Crear Categoría"}
        View={view}
        setView={setView}
        defaultValues={{}}
        onEdit={edit}
      />
      <ToastContainer toasts={toasts} />
    </>
  );
}
