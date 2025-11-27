import { useState, useEffect } from "react";
import { Modal, type ModalField } from "../components/Modal";
import { CiSearch } from "react-icons/ci";
import axios from "axios";
import "../styles/PersonaCrud.css";
import { IoMdArrowRoundBack } from "react-icons/io";

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

export interface ProveedorCategoriaUpdateDTO {
  categoriaId: number;
  activo: boolean;
}
export interface CategoriaDTO
{
    id : number;
    nombre : string;
    descripcion : string | null;
    activo : boolean;
}

interface Props {
  proveedorId: number;
}

export default function ProveedorCategorias({ proveedorId }: Props) {
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

  useEffect(() => {
    fetchCategorias();
    fetchCategorias2();
  }, [proveedorId]);

  const fetchCategorias2 = async () => {
    try {
        const { data } = await axios.get(`${API_URL}/api/categorias`);
        setSelectedCategoria(data);
        if (Array.isArray(data)) {
          setHubCategoria(data);
        } else if (data?.value && Array.isArray(data.value)) {
          setHubCategoria(data.value);
        } else {
          setHubCategoria([]);
        }
      }
    catch (error) {
      console.error("Error al obtener categorías del proveedor:", error);
    }
  };
  const fetchCategorias = async (catId?: number) => {
    try {
      if (catId) {
        const { data } = await axios.get(`${API_URL}/api/proveedores/categorias/${catId}`);
        setSelectedCategoria(data);
      } else {
        const { data } = await axios.get(`${API_URL}/api/proveedores/${proveedorId}/categorias`);
        if (Array.isArray(data)) {
          setCategorias(data);
        } else if (data?.value && Array.isArray(data.value)) {
          setCategorias(data.value);
        } else {
          setCategorias([]);
        }
      }
    } catch (error) {
      console.error("Error al obtener categorías del proveedor:", error);
    }
  };

  const handleModalSubmit = async (data: Record<string, any>) => {
    try {
      const payload: ProveedorCategoriaCreateDTO = {
        categoriaId: Number(data.categoriaId),
        activo: !!data.activo,
      };

      if (edit && id != null) {
        await axios.put(`${API_URL}/api/proveedores/categorias/${id}`, payload);
        alert("Asociación actualizada correctamente");
      } else {
        await axios.post(`${API_URL}/api/proveedores/${proveedorId}/categorias`, payload);
        alert("Asociación creada correctamente");
      }

      fetchCategorias();
      setOpen(false);
      setSelectedCategoria(null);
      setEdit(false);
      setView(false);
    } catch (error) {
      console.error("Error al guardar la asociación:", error);
      alert("Error al guardar la asociación. Revisa la consola.");
    }
  };

  const handleView = async (catId?: number) => {
    if (catId == null) return;
    setView(true);
    setEdit(false);
    setId(catId);
    await fetchCategorias(catId);
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
    await fetchCategorias(catId);
    setOpen(true);
  };

  const CategoriasFieldBase: ModalField[] = [
  {
    name: "categoriaId",
    type: "select",
    label: "Categoría ID",
    required: true,
    options: hubCategoria.map((p) => ({
      value: p.id,
      label: `${p.id} - ${p.nombre} ${p.descripcion}`,
    })),
  },
    { name: "activo", type: "checkbox", label: "Activo" },
  ];

  const categoriasFiltradas = hubCategoria.filter((c) =>
    c.nombre
      .toString()
      .toLowerCase()
      .replace(/\s/g, '')
      .includes(busqueda.toLowerCase().replace(/\s/g, '')) 
  );

  const totalPages = Math.ceil(categoriasFiltradas.length / itemsPerPage);
  const categoriasPagina = categoriasFiltradas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => setCurrentPage(page);

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
      <div className="Sub-Container">
        <div className="Title-Container">
          <h1 className="Ttitle w-full">Categorías del Proveedor #{proveedorId}</h1>
          <a href="/" className="text-white text-2xl bold"><IoMdArrowRoundBack/> {"Volver Proveedores"}</a>
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
                      <span className="user-name">{c.nombre} #{c.id}</span>
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

              {getPageNumbers()[0] > 1 && (
                <>
                  <button onClick={() => handlePageChange(1)}>1</button>
                  {getPageNumbers()[0] > 2 && <span className="dots">...</span>}
                </>
              )}

              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  className={currentPage === page ? "active" : ""}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}

              {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                <>
                  {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                    <span className="dots">...</span>
                  )}
                  <button onClick={() => handlePageChange(totalPages)}>
                    {totalPages}
                  </button>
                </>
              )}

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

      <Modal
        inputs={CategoriasFieldBase}
        onSubmit={handleModalSubmit}
        isOpen={open}
        setIsOpen={setOpen}
        View={view}
        setView={setView}
        Title={view ? "Ver Asociación" : edit ? "Editar Asociación" : "Añadir Asociación"}
        defaultValues={selectedCategoria || {}}
      />
    </>
  );
}
