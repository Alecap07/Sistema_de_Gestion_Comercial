import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, type ModalField } from "../components/Modal";
import { Plus } from "lucide-react";

const API_URL = "http://localhost:5080";

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

export default function ProductosCrud() {
  const [productos, setProductos] = useState<ProductoDTO[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState(false);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState(0);
  const [selectedProducto, setSelectedProducto] = useState<ProductoDTO | null>(null);

  // ===== Obtener productos =====
  const fetchProductos = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/productos`);
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // ===== Obtener producto por ID (y abrir modal en view o edit) =====
  const fetchProductoById = async (id: number, edit : boolean) => {
    try {
      const { data } = await axios.get<ProductoDTO>(`${API_URL}/api/productos/${id}`);
      setSelectedProducto(data);
      setView(await edit);
      setIsOpen(true);
    } catch (error) {
      console.error("Error al obtener producto:", error);
      alert("No se pudo obtener el producto");
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
    { name: "categoriaId", type: "number", label: "ID Categoría", required: true },
    { name: "marcaId", type: "number", label: "ID Marca", required: true },
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

  // ==== Preparar el valor para el input

  const formatValueForInput = (fieldName: string, value: any, fieldType?: string) => {
    if (value === null || value === undefined) {
      if (fieldType === "checkbox") return false;
      return "";
    }
    if (fieldType === "date") {
      try {
        const d = new Date(value);
        if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
      } catch {  }
      return "";
    }
    if (fieldType === "checkbox") return !!value;
    return String(value);
  };

  // ==== Cargar valor del producto en los inputs del modal ====

  const modalInputs: ModalField[] = productoFieldBase.map((f) => {
    const base = { ...f } as ModalField;
    if (!selectedProducto) {
      base.defaultValue = base.defaultValue ?? (base.type === "checkbox" ? false : "");
      return base;
    }
    const raw = (selectedProducto as any)[f.name];
    const formatted = formatValueForInput(f.name, raw, f.type as string);

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
      if (edit) {
        await axios.put(`${API_URL}/api/productos/${await id}`, payload);
        } else {
        await axios.post(`${API_URL}/api/productos`, payload);
      }
      alert(edit ? "Producto editado correctamente" : "Producto creado correctamente");
      fetchProductos();
      setIsOpen(false);
      setSelectedProducto(null);
      setView(false);
    } catch (error) {
      console.error(edit ? "Error al editar el producto:" : "Error al crear producto:", error);
      alert("Error al crear producto. Revisa la consola.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6 flex flex-col items-center">
      <div className="flex w-full justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-violet-700">Gestión de Productos</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition"
        >
          <Plus size={18} /> Nuevo Producto
        </button>
      </div>

      {/* Tabla */}
      <div className="w-full bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border">Código</th>
              <th className="p-3 border">Nombre</th>
              <th className="p-3 border">Precio</th>
              <th className="p-3 border">Stock</th>
              <th className="p-3 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  No hay productos registrados
                </td>
              </tr>
            ) : (
              productos.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-3 border">{p.codigo}</td>
                  <td className="p-3 border">{p.nombre}</td>
                  <td className="p-3 border">${p.precioVenta ?? p.precioCompra}</td>
                  <td className="p-3 border">{p.stockActual}</td>
                  <td className="p-3 border text-center flex gap-5">
                    <button
                      onClick={async () => {setEdit(false); fetchProductoById(p.id, true);}}
                      className="text-violet-600 hover:underline"
                    >
                      Ver
                    </button>
                    <button
                      onClick={async () => {setEdit(true); setId(p.id); fetchProductoById(p.id, false);}}
                      className="text-violet-600 hover:underline"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal dinámico */}
      <Modal
        inputs={modalInputs}
        onSubmit={handleModalSubmit}
        isOpen={isOpen}
        setIsOpen={(v) => { setIsOpen(v); if (!v) { setSelectedProducto(null); setView(false); setEdit(false); } }}
        Title={view ? "Ver Producto" : "Nuevo Producto"}
        View={view}
        setView={setView}
        defaultValues={{}}
      />
    </div>
  );
}
