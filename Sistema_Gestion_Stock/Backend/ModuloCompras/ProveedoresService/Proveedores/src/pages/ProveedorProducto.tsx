import { useState, useEffect } from "react";
import { Modal, type ModalField } from "../components/Modal";
import { CiSearch } from "react-icons/ci";
import axios from "axios";
import "../styles/PersonaCrud.css";
import { IoMdArrowRoundBack } from "react-icons/io";

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

  useEffect(() => {
    if (proveedorId) fetchProductos();
    fetchHubProductos();
  }, [proveedorId]);

  const fetchHubProductos = async () => {
    try {
      const { data } = await axios.get(`${API_PRODUCTOS_URL}/api/productos`);
      setHubProductos(data);
    } catch (error) {
      console.error("Error al obtener productos del hub:", error);
    } 
  };
  const fetchProductos = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/proveedores/${proveedorId}/productos`);
      if (Array.isArray(data)) {
        setProductos(data);
      } else if (data?.value && Array.isArray(data.value)) {
        setProductos(data.value);
      } else {
        setProductos([]);
      }
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const ProductoFields: ModalField[] = [
    {
    name: "productoId",
    type: "select",
    label: "ID del Producto",
    required: true,
    options: hubproductos.map((p) => ({
      value: p.id,
      label: `${p.id} - ${p.nombre} ${p.codigo}`,
    })),
    },
    { name: "precioCompra", type: "number", label: "Precio de Compra", required: true },
    { name: "catalogoUrl", type: "text", label: "Catálogo (URL)", required: false },
    { name: "fechaDesde", type: "date", label: "Fecha Desde", required: false },
    { name: "activo", type: "checkbox", label: "Activo" },
  ];

  const productosFiltrados = productos.filter((p) =>
    p.toString()
      .toLowerCase()
      .replace(/\s/g, '')
      .includes(busqueda.toLowerCase().replace(/\s/g, '')) 
  );

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
        await axios.put(`${API_URL}/api/proveedores/productos/${id}`, payload);
        alert("Producto actualizado correctamente");
      } else {
        await axios.post(`${API_URL}/api/proveedores/${proveedorId}/productos`, payload);
        alert("Producto agregado correctamente");
      }

      fetchProductos();
      setOpen(false);
      setSelectedProducto(null);
      setView(false);
      setEdit(false);
      setId(null);
    } catch (error) {
      console.error("Error al guardar producto:", error);
      alert("Error al guardar producto. Revisá la consola.");
    }
  };

  const handleViewProducto = async (id: number | undefined) => {
    setView(true);
    setEdit(false);
    if (id) {
      const { data } = await axios.get(`${API_URL}/api/proveedores/productos/${id}`);
      setSelectedProducto(data);
      setId(id);
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
      const { data } = await axios.get(`${API_URL}/api/proveedores/productos/${id}`);
      setSelectedProducto(data);
      setId(id);
    }
    setOpen(true);
  };

  const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);
  const productosPagina = productosFiltrados.slice(
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
          <h1 className="Ttitle w-full">Productos del Proveedor</h1>
          <a href="/" className="text-white text-2xl bold"><IoMdArrowRoundBack/> {"Volver Proveedores"}</a>
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

              {getPageNumbers().map((page) => (
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

      <Modal
        inputs={ProductoFields}
        onSubmit={handleModalSubmit}
        isOpen={open}
        setIsOpen={setOpen}
        View={view}
        setView={setView}
        Title={view ? "Ver Producto" : edit ? "Editar Producto" : "Añadir Producto"}
        defaultValues={selectedProducto || {}}
      />
    </>
  );
}
