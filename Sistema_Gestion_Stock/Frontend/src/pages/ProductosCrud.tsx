import { useEffect, useState } from "react";
import { Modal, type ModalField } from "../components/Modal";
import { CiSearch } from "react-icons/ci";
import ToastContainer from "../components/ToastContainer";
import { useToast } from "../hooks/useToast";
import type { ProductoDTO } from '../types/producto.types';
import type { MarcaDTO } from '../types/marca.types';
import type { CategoriaDTO } from '../types/categoria.types';
import { fetchAll, fetchById, create, update, handleApiError } from '../functions/api';
import { getPageNumbers, paginateArray, getTotalPages } from '../functions/pagination';
import { formatValueForInput } from '../functions/formatting';
import { filterByField } from '../functions/filtering';
import '../styles/PersonaCrud.css';

const API_URL = "http://localhost:5080";
const API_URL_ALMACEN = "http://localhost:5227";

interface ProductoAlmacenDTO {
  idProducto?: number;
  codigo: number;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  stock: number;
  lote?: string | null;
  fechaVencimiento?: string | null;
  activo?: boolean;
}

export default function ProductosCrud() {
  const { toasts, addToast } = useToast();
  const [productos, setProductos] = useState<ProductoDTO[]>([]);
  const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);
  const [marcas, setMarcas] = useState<MarcaDTO[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState(false);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState(0);
  const [selectedProducto, setSelectedProducto] = useState<ProductoDTO | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const itemsPerPage = 8;
  const visiblePages = 5;

  // ===== Obtener productos =====
  const fetchProductos = async () => {
    try {
      const data = await fetchAll<ProductoDTO>(`${API_URL}/api/productos`, addToast);
      setProductos(data);
    } catch (error) {
      handleApiError(error, 'Error al obtener productos', addToast);
    }
  };
  const fetchMarcas = async () => {
    try {
      const data = await fetchAll<MarcaDTO>(`${API_URL}/api/marcas`, addToast);
      setMarcas(data);
    } catch (error) {
      handleApiError(error, 'Error al obtener marcas', addToast);
    }
  };
  const fetchCategorias = async () => {
    try {
      const data = await fetchAll<CategoriaDTO>(`${API_URL}/api/categorias`, addToast);
      setCategorias(data);
    } catch (error) {
      handleApiError(error, 'Error al obtener categorías', addToast);
    }
  };
  useEffect(() => {
    fetchProductos();
    fetchMarcas();
    fetchCategorias();
  }, []);

  // ===== Obtener producto por ID (y abrir modal en view o edit) =====
  const fetchProductoById = async (id: number, edit: boolean) => {
    try {
      const data = await fetchById<ProductoDTO>(`${API_URL}/api/productos`, id, addToast);
      setSelectedProducto(data);
      setView(await edit);
      setIsOpen(true);
    } catch (error) {
      handleApiError(error, 'No se pudo obtener el producto', addToast);
    }
  };

  // ===== Crear nuevo (abrir modal vacío) =====
  const openCreateModal = () => {
    setSelectedProducto(null);
    setView(false);
    setIsOpen(true);
  };

  // ===== Base de campos (sin valores) =====
  const productoFieldBase: ModalField[] = [
    { name: "codigo", type: "text", label: "Código", minLength: 1, maxLength: 50, required: true },
    { name: "nombre", type: "text", label: "Nombre", minLength: 1, maxLength: 200, required: true },
    {
      name: "categoriaId",
      type: "select",
      label: "ID Categoría",
      required: true,
      options: categorias.filter(p => p.id !== undefined).map((p) => ({
        value: p.id!,
        label: `${p.id} - ${p.nombre}`,
      })),
    },
    {
      name: "marcaId",
      type: "select",
      label: "ID Marca",
      required: true,
      options: marcas.filter(p => p.id !== undefined).map((p) => ({
        value: p.id!,
        label: `${p.id} - ${p.nombre}`,
      })),
    },
    { name: "descripcion", type: "textarea", label: "Descripción", minLength: 1, maxLength: 300 },
    { name: "lote", type: "text", label: "Lote", minLength: 1, maxLength: 100 },
    { name: "fechaVencimiento", type: "date", label: "Fecha de Vencimiento" },
    { name: "unidadesAviso", type: "number", label: "Unidades de Aviso" },
    { name: "precioCompra", type: "number", label: "Precio Compra", required: true },
    { name: "precioVenta", type: "number", label: "Precio Venta" },
    { name: "stockActual", type: "number", label: "Stock Actual", required: true },
    { name: "stockMinimo", type: "number", label: "Stock Mínimo" },
    { name: "stockIdeal", type: "number", label: "Stock Ideal" },
    { name: "stockMaximo", type: "number", label: "Stock Máximo" },
    {
      name: "tipoStock",
      type: "select",
      label: "Tipo de Stock",
      options: [
        { label: "JIT", value: "JIT" },
        { label: "Existencia", value: "Existencia" }
      ]
    },
    { name: "activo", type: "checkbox", label: "Activo", defaultValue: true }
  ];

  // ==== Cargar valor del producto en los inputs del modal ====

  const modalInputs: ModalField[] = productoFieldBase.map((f) => {
    const base = { ...f } as ModalField;
    if (!selectedProducto) {
      base.defaultValue = base.defaultValue ?? (base.type === "checkbox" ? false : "");
      return base;
    }
    const raw = (selectedProducto as any)[f.name];
    const formatted = formatValueForInput(raw, f.type as string);

    base.defaultValue = formatted;
    (base as any).value = formatted;

    return base;
  });

  // ==== Mandar datos del modal al back

  const handleModalSubmit = async (data: Record<string, any>) => {
    try {
      const payload = {
        codigo: data.codigo,
        nombre: data.nombre,
        categoriaId: Number(data.categoriaId),
        marcaId: Number(data.marcaId),
        descripcion: data.descripcion || null,
        lote: data.lote || null,
        fechaVencimiento: data.fechaVencimiento
          ? new Date(data.fechaVencimiento).toISOString()
          : null,
        unidadesAviso: data.unidadesAviso ? Number(data.unidadesAviso) : null,
        precioCompra: Number(data.precioCompra),
        precioVenta: data.precioVenta ? Number(data.precioVenta) : null,
        stockActual: Number(data.stockActual),
        stockMinimo: data.stockMinimo ? Number(data.stockMinimo) : null,
        stockIdeal: data.stockIdeal ? Number(data.stockIdeal) : null,
        stockMaximo: data.stockMaximo ? Number(data.stockMaximo) : null,
        tipoStock: data.tipoStock || null,
        activo: !!data.activo
      };
      const payload_almacen: ProductoAlmacenDTO = {
        codigo: Number(data.codigo),
        nombre: data.nombre,
        descripcion: data.descripcion || null,
        precio: data.precioVenta ? Number(data.precioVenta) : Number(data.precioCompra),
        stock: Number(data.stockActual),
        lote: data.lote || null,
        fechaVencimiento: data.fechaVencimiento
          ? new Date(data.fechaVencimiento).toISOString()
          : null,
        activo: !!data.activo
      };
      if (edit) {
        await update<ProductoDTO>(`${API_URL}/api/productos`, id, payload, addToast);
        await update<ProductoAlmacenDTO>(`${API_URL_ALMACEN}/api/productos`, id, payload_almacen, addToast);
      } else {
        await create<ProductoDTO>(`${API_URL}/api/productos`, payload, addToast);
        await create<ProductoAlmacenDTO>(`${API_URL_ALMACEN}/api/productos`, payload_almacen, addToast);
      }
      fetchProductos();
      setIsOpen(false);
      setSelectedProducto(null);
      setView(false);
    } catch (error) {
      addToast(`❌ Error al ${edit ? 'editar' : 'crear'} producto`, "error");
    }
  };
  const productosFiltrados = filterByField(productos, busqueda, 'nombre');
  const totalPages = getTotalPages(productosFiltrados.length, itemsPerPage);
  const productosPagina = paginateArray(productosFiltrados, currentPage, itemsPerPage);
  const pageNumbers = getPageNumbers(currentPage, totalPages, visiblePages);
  return (
    <>
      <div className='Container'>
        <div className="Sub-Container">
          <div className="Title-Container">
            <h1 className="Ttitle">Productos</h1>
          </div>
          <div className="user-crud-container">
            <div className="search-container">
              <button className="add-button" onClick={() => openCreateModal()}>
                Añadir
              </button>
              <input
                type="text"
                placeholder="Buscar proveedor por codigo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="search-input"
              />
              <span className="search-icon"><CiSearch /></span>
            </div>
            <div className="user-cards-container">
              {productosPagina.length > 0 ? (
                productosPagina.map((prov) => (
                  <div key={prov.id} className="user-card" onClick={() => { setId(prov.id); fetchProductoById(prov.id, true); setView(false); setEdit(true); }}>
                    <div className="user-card-info">
                      <div className="user-avatar"></div>
                      <div className="user-details">
                        <span className="user-name">{prov.nombre}</span>
                        <p className="p-0">Código: {prov.codigo}</p>
                        <p className="p-0">Descripcion: {prov.descripcion}</p>
                      </div>
                    </div>
                    <div className="flex flex-row justify-center gap-2 mt-3">
                      <button
                        className="edit-button"
                        onClick={(e) => { e.stopPropagation(); setId(prov.id); fetchProductoById(prov.id, false); setView(false); setEdit(true); }}
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No hay proveedores registrados.</p>
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
        setIsOpen={(v) => { setIsOpen(v); if (!v) { setSelectedProducto(null); setView(false); setEdit(false); } }}
        Title={view ? "Ver Producto" : edit ? "Editar Producto" : "Crear Producto"}
        View={view}
        setView={setView}
        defaultValues={{}}
        onEdit={edit}
      />
      <ToastContainer toasts={toasts} />
    </>
  );
}
