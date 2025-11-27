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
const API_PRODUCTOS_URL = "http://localhost:5080";

export interface ProveedorProductoDTO {
  id?: number;
  proveedorId: number;
  productoId: number;
  precioCompra: number;
  catalogoUrl?: string | null;
  fechaDesde?: string | null;
  activo: boolean;
}
export interface ProductoDTO {
  id: number;
  codigo: string;
  nombre: string;
  categoriaId: number;
  marcaId: number;
  descripcion?: string | null;
  lote?: string | null;
  fechaVencimiento?: string | null;
  unidadesAviso?: number | null;
  precioCompra: number;
  precioVenta?: number | null;
  stockActual: number;
  stockMinimo?: number | null;
  stockIdeal?: number | null;
  stockMaximo?: number | null;
  tipoStock?: string | null;
  activo: boolean;
}

export default function ProveedorProductos({ proveedorId }: { proveedorId: number }) {
  const { toasts, addToast } = useToast();
  const [productos, setProductos] = useState<ProveedorProductoDTO[]>([]);
  const [hubproductos, setHubProductos] = useState<ProductoDTO[]>([]);
  const [selectedProducto, setSelectedProducto] = useState<ProveedorProductoDTO | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(false);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState<number | null>(null);

  const itemsPerPage = 8;
  const visiblePages = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const fetchHubProductos = useCallback(async () => {
    try {
      const data = await fetchAll<ProductoDTO>(`${API_PRODUCTOS_URL}/api/productos`, addToast);
      setHubProductos(data);
    } catch (error) {
      handleApiError(error, "Error al obtener productos del hub", addToast);
    }
  }, [addToast]);

  const fetchProductos = useCallback(async () => {
    try {
      const data = await fetchAll<ProveedorProductoDTO>(`${API_URL}/api/proveedores/${proveedorId}/productos`, addToast);
      setProductos(data);
    } catch (error) {
      handleApiError(error, "Error al obtener productos", addToast);
    }
  }, [proveedorId, addToast]);

  useEffect(() => {
    if (proveedorId) fetchProductos();
    fetchHubProductos();
  }, [proveedorId, fetchProductos, fetchHubProductos]);

  const ProductoFields: ModalField[] = [
    {
      name: "productoId",
      type: "select",
      label: "ID del Producto",
      required: true,
      options: hubproductos.map((p) => ({
        value: p.id.toString(),
        label: `${p.id} - ${p.nombre} ${p.codigo}`,
      })),
    },
    { name: "precioCompra", type: "number", label: "Precio de Compra", required: true },
    { name: "catalogoUrl", type: "text", label: "Catálogo (URL)", required: false },
    { name: "fechaDesde", type: "date", label: "Fecha Desde", required: false },
    { name: "activo", type: "checkbox", label: "Activo" },
  ];

  const productosFiltrados = useMemo(() => {
    return filterBySearch(productos, busqueda, ['productoId', 'precioCompra', 'catalogoUrl']);
  }, [productos, busqueda]);

  const handleModalSubmit = async (data: Record<string, any>) => {
    try {
      const payload: ProveedorProductoDTO = {
        proveedorId,
        productoId: Number(data.productoId),
        precioCompra: Number(data.precioCompra),
        catalogoUrl: data.catalogoUrl || null,
        fechaDesde: data.fechaDesde || null,
        activo: data.activo === true || data.activo === "true",
      };

      if (edit && id) {
        await update<ProveedorProductoDTO>(`${API_URL}/api/proveedores/productos`, id, payload, addToast);
      } else {
        await create<ProveedorProductoDTO>(`${API_URL}/api/proveedores/${proveedorId}/productos`, payload, addToast);
      }

      fetchProductos();
      setOpen(false);
      setSelectedProducto(null);
      setView(false);
      setEdit(false);
      setId(null);
    } catch (error) {
      handleApiError(error, "Error al guardar producto", addToast);
    }
  };

  const handleViewProducto = async (id: number | undefined) => {
    setView(true);
    setEdit(false);
    if (id) {
      const producto = productos.find(p => p.id === id);
      if (producto) {
        setSelectedProducto(producto);
        setId(id);
      }
    }
    setOpen(true);
  };

  const handleAddProducto = () => {
    setEdit(false);
    setSelectedProducto(null);
    setView(false);
    setOpen(true);
  };

  const handleEditProducto = async (id: number | undefined) => {
    setView(false);
    setEdit(true);
    if (id) {
      const producto = productos.find(p => p.id === id);
      if (producto) {
        setSelectedProducto(producto);
        setId(id);
      }
    }
    setOpen(true);
  };

  const totalPages = getTotalPages(productosFiltrados.length, itemsPerPage);
  const productosPagina = useMemo(() => paginateArray(productosFiltrados, currentPage, itemsPerPage), [productosFiltrados, currentPage, itemsPerPage]);
  const pageNumbers = getPageNumbers(currentPage, totalPages, visiblePages);

  return (
    <>
      <div className='Container'>
        <div className="Sub-Container">
          <div className="Title-Container">
            <h1 className="Ttitle w-full">Productos del Proveedor</h1>
            <a href="/" className="text-white text-2xl bold"><IoMdArrowRoundBack /> {"Volver Proveedores"}</a>
          </div>

          <div className="user-crud-container">
            <div className="search-container">
              <button className="add-button" onClick={handleAddProducto}>
                Añadir
              </button>
              <input
                type="text"
                placeholder="Buscar por ID de producto..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">
                <CiSearch />
              </span>
            </div>

            <div className="user-cards-container">
              {productosPagina.length > 0 ? (
                productosPagina.map((p) => (
                  <div
                    key={p.id}
                    className="user-card"
                    onClick={() => handleViewProducto(p.id)}
                  >
                    <div className="user-card-info">
                      <div className="user-avatar"></div>
                      <div className="user-details">
                        <span className="user-name">Producto ID: {p.productoId}</span>
                        <p className="text-sm">Precio Compra: ${p.precioCompra}</p>
                        {p.catalogoUrl && (
                          <p className="text-sm">
                            <a href={p.catalogoUrl} target="_blank" rel="noopener noreferrer">
                              Ver Catálogo
                            </a>
                          </p>
                        )}
                        {p.fechaDesde && (
                          <p className="text-sm">Desde: {new Date(p.fechaDesde).toLocaleDateString()}</p>
                        )}
                        <p className="text-sm italic">
                          Estado: {p.activo ? "Activo" : "Inactivo"}
                        </p>
                      </div>
                    </div>
                    <button
                      className="edit-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditProducto(p.id);
                      }}
                    >
                      Editar
                    </button>
                  </div>
                ))
              ) : (
                <p>No hay productos registrados.</p>
              )}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
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

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  &raquo;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        inputs={ProductoFields}
        onSubmit={handleModalSubmit}
        isOpen={open}
        setIsOpen={setOpen}
        View={view}
        setView={setView}
        Title={view ? "Ver Producto" : edit ? "Editar Producto" : "Añadir Producto"}
        defaultValues={selectedProducto || {}}
        onEdit={edit}
      />
      <ToastContainer toasts={toasts} />
    </>
  );
}
