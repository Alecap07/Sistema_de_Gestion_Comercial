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

export interface ProveedorCategoriaDTO {
  id?: number;
  proveedorId: number;
  categoriaId: number;
  activo: boolean;
}

export interface ProveedorCategoriaCreateDTO {
  categoriaId: number;
  activo: boolean;
}

export interface CategoriaDTO {
  id: number;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
}

interface Props {
  proveedorId: number;
}

export default function ProveedorCategorias({ proveedorId }: Props) {
  const { toasts, addToast } = useToast();
  const [categorias, setCategorias] = useState<ProveedorCategoriaDTO[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<ProveedorCategoriaDTO | null>(null);
  const [hubCategoria, setHubCategoria] = useState<CategoriaDTO[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(false);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const visiblePages = 5;

  const fetchCategorias2 = useCallback(async () => {
    try {
      const data = await fetchAll<CategoriaDTO>(`${API_URL}/api/categorias`, addToast);
      setHubCategoria(data);
    }
    catch (error) {
      handleApiError(error, "Error al obtener categorías del hub", addToast);
    }
  }, [addToast]);

  const fetchCategorias = useCallback(async (catId?: number) => {
    try {
      if (catId) {
        await fetchAll<ProveedorCategoriaDTO>(`${API_URL}/api/proveedores/categorias/${catId}`, addToast);
      } else {
        const data = await fetchAll<ProveedorCategoriaDTO>(`${API_URL}/api/proveedores/${proveedorId}/categorias`, addToast);
        setCategorias(data);
      }
    } catch (error) {
      handleApiError(error, "Error al obtener categorías del proveedor", addToast);
    }
  }, [proveedorId, addToast]);

  useEffect(() => {
    fetchCategorias();
    fetchCategorias2();
  }, [proveedorId, fetchCategorias, fetchCategorias2]);

  const handleModalSubmit = async (data: Record<string, any>) => {
    try {
      const payload: ProveedorCategoriaCreateDTO = {
        categoriaId: Number(data.categoriaId),
        activo: !!data.activo,
      };

      if (edit && id != null) {
        await update<ProveedorCategoriaCreateDTO>(`${API_URL}/api/proveedores/categorias`, id, payload, addToast);
      } else {
        await create<ProveedorCategoriaCreateDTO>(`${API_URL}/api/proveedores/${proveedorId}/categorias`, payload, addToast);
      }

      fetchCategorias();
      setOpen(false);
      setSelectedCategoria(null);
      setEdit(false);
      setView(false);
    } catch (error) {
      handleApiError(error, "Error al guardar la asociación", addToast);
    }
  };

  const handleView = async (catId?: number) => {
    if (catId == null) return;
    setView(true);
    setEdit(false);
    setId(catId);
    const cat = categorias.find(c => c.id === catId);
    if (cat) setSelectedCategoria(cat);
    setOpen(true);
  };

  const handleAdd = () => {
    setEdit(false);
    setView(false);
    setSelectedCategoria(null);
    setOpen(true);
  };

  const handleEdit = async (catId?: number) => {
    if (catId == null) return;
    setView(false);
    setEdit(true);
    setId(catId);
    const cat = categorias.find(c => c.id === catId);
    if (cat) setSelectedCategoria(cat);
    setOpen(true);
  };

  const CategoriasFieldBase: ModalField[] = [
    {
      name: "categoriaId",
      type: "select",
      label: "Categoría ID",
      required: true,
      options: hubCategoria.map((p) => ({
        value: p.id.toString(),
        label: `${p.id} - ${p.nombre} ${p.descripcion}`,
      })),
    },
    { name: "activo", type: "checkbox", label: "Activo" },
  ];

  const categoriasFiltradas = useMemo(() => {
    const enriched = categorias.map(assoc => {
      const cat = hubCategoria.find(h => h.id === assoc.categoriaId);
      return {
        ...assoc,
        nombre: cat?.nombre || 'Unknown',
        descripcion: cat?.descripcion
      };
    });

    return filterBySearch(enriched, busqueda, ['nombre', 'categoriaId']);
  }, [categorias, hubCategoria, busqueda]);

  const totalPages = getTotalPages(categoriasFiltradas.length, itemsPerPage);
  const categoriasPagina = useMemo(() => paginateArray(categoriasFiltradas, currentPage, itemsPerPage), [categoriasFiltradas, currentPage, itemsPerPage]);
  const pageNumbers = getPageNumbers(currentPage, totalPages, visiblePages);

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <>
      <div className='Container'>
        <div className="Sub-Container">
          <div className="Title-Container">
            <h1 className="Ttitle w-full">Categorías del Proveedor #{proveedorId}</h1>
            <a href="/" className="text-white text-2xl bold"><IoMdArrowRoundBack /> {"Volver Proveedores"}</a>
          </div>

          <div className="user-crud-container">
            <div className="search-container">
              <button className="add-button" onClick={handleAdd}>
                Añadir Asociación
              </button>
              <input
                type="text"
                placeholder="Buscar por nombre de categoría..."
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
                categoriasPagina.map((c) => (
                  <div key={c.id} className="user-card" onClick={() => handleView(c.id)}>
                    <div className="user-card-info">
                      <div className="user-avatar"></div>
                      <div className="user-details">
                        <span className="user-name">{c.nombre} #{c.categoriaId}</span>
                        <p className="p-0">Activo: {c.activo ? "Sí" : "No"}</p>
                      </div>
                    </div>
                    <button
                      className="edit-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(c.id);
                      }}
                    >
                      Editar
                    </button>
                  </div>
                ))
              ) : (
                <p>No hay categorías asociadas a este proveedor.</p>
              )}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  &laquo;
                </button>

                {pageNumbers.map((page) => (
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
            )}
          </div>
        </div>
      </div>

      <Modal
        inputs={CategoriasFieldBase}
        onSubmit={handleModalSubmit}
        isOpen={open}
        setIsOpen={setOpen}
        View={view}
        setView={setView}
        Title={view ? "Ver Asociación" : edit ? "Editar Asociación" : "Añadir Asociación"}
        defaultValues={selectedCategoria ? {
          categoriaId: selectedCategoria.categoriaId.toString(),
          activo: selectedCategoria.activo
        } : {}}
        onEdit={edit}
      />
      <ToastContainer toasts={toasts} />
    </>
  );
}
