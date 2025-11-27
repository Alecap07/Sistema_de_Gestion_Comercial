import { useEffect, useState } from "react";
import axios from "axios";
import ModalBase from "../components/ModalBase";
import ToastContainer from "../components/ToastContainer";
import { useToast } from "../hooks/useToast";
import { CiSearch } from "react-icons/ci";
import "../styles/PersonaCrud.css";
import type { ProductoAlmacenDTO } from "../types/productosPage.types";

const API_URL = "http://localhost:5227";

export default function ProductosPage() {
  const { toasts, addToast } = useToast();
  const [productos, setProductos] = useState<ProductoAlmacenDTO[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(false);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"editar" | "eliminar" | null>(null);
  const [mostrarInactivos, setMostrarInactivos] = useState(false);

  // PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [formData, setFormData] = useState<ProductoAlmacenDTO>({
    codigo: "",
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    lote: "",
    fechaVencimiento: "",
    activo: true,
  });

  useEffect(() => {
    fetchProductos();
  }, [mostrarInactivos]);

  const fetchProductos = async (Id?: number) => {
    try {
      if (Id) {
        const { data } = await axios.get(`${API_URL}/api/Productos/${Id}`);
        setFormData({
          ...data,
          activo: data.activo === 1 || data.activo === true,
        });
      } else {
        const url = mostrarInactivos
          ? `${API_URL}/api/Productos/inactivos`
          : `${API_URL}/api/Productos`;
        const { data } = await axios.get(url);
        const productosConBoolean = (Array.isArray(data) ? data : data.value || []).map(
          (p: any) => ({ ...p, activo: p.activo === 1 || p.activo === true })
        );
        setProductos(productosConBoolean);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error al obtener productos:", error);
      addToast("❌ Error al obtener productos", "error");
    }
  };

  const handleViewProducto = async (idParam: number | undefined) => {
    if (!idParam) return;
    await fetchProductos(idParam);
    setView(true);
    setEdit(false);
    setId(idParam);
    setOpen(true);
  };

  const handleEditProducto = async (idParam: number | undefined) => {
    if (!idParam) return;
    await fetchProductos(idParam);
    setEdit(true);
    setView(false);
    setId(idParam);
    setOpen(true);
  };

  const handleDeleteProducto = async (idParam: number | undefined) => {
    if (!idParam) return;
    setId(idParam);
    setConfirmAction("eliminar");
    setShowConfirmModal(true);
  };

  const eliminarProductoConfirmado = async (idParam: number) => {
    try {
      await axios.delete(`${API_URL}/api/Productos/${idParam}`);
      addToast("✅ Producto desactivado correctamente", "success");
      setShowConfirmModal(false);
      setConfirmAction(null);
      fetchProductos();
    } catch (error: any) {
      console.error("Error al eliminar producto:", error);
      addToast("❌ Error al eliminar producto", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (edit) {
      setConfirmAction("editar");
      setShowConfirmModal(true);
    }
  };

  const guardarProducto = async () => {
    try {
      const payload = { ...formData, activo: !!formData.activo };

      if (edit && id != null) {
        await axios.put(`${API_URL}/api/Productos/${id}`, {
          idProducto: id,
          ...payload,
        });
        addToast("✅ Producto actualizado correctamente", "success");
      }

      setShowConfirmModal(false);
      setConfirmAction(null);
      setOpen(false);
      fetchProductos();
    } catch (error) {
      console.error("Error al guardar producto:", error);
      addToast("❌ Error al guardar producto", "error");
    }
  };

  // 🔹 FILTRADO POR VARIOS CAMPOS
  const productosFiltrados = productos.filter((p) => {
    const busq = busqueda.toLowerCase();
    return (
      p.nombre.toLowerCase().includes(busq) ||
      p.codigo.toString().includes(busq) ||
      p.descripcion.toLowerCase().includes(busq) ||
      p.stock.toString().includes(busq) ||
      p.precio.toString().includes(busq) ||
      p.lote.toLowerCase().includes(busq) ||
      p.fechaVencimiento.includes(busq)
    );
  });

  const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProductos = productosFiltrados.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    let start = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 1);
    let end = Math.min(start + maxPagesToShow - 1, totalPages);
    start = Math.max(end - maxPagesToShow + 1, 1);
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="Container">
      <div className="Sub-Container">
        <div className="Title-Container">
          <h1 className="Ttitle">Productos</h1>
        </div>

        <div className="user-crud-container">
          {/* BUSCADOR */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">
              <CiSearch />
            </span>
          </div>

          {/* TABS */}
          <div className="tabs-container">
            <button
              onClick={() => setMostrarInactivos(false)}
              className={!mostrarInactivos ? "active-tab" : ""}
            >
              Activos
            </button>
            <button
              onClick={() => setMostrarInactivos(true)}
              className={mostrarInactivos ? "active-tab" : ""}
            >
              Inactivos
            </button>
          </div>

          {/* CARDS */}
          <div className="user-cards-container">
            {currentProductos.length > 0 ? (
              currentProductos.map((prod) => (
                <div
                  key={prod.idProducto}
                  className="user-card"
                  onClick={() => handleViewProducto(prod.idProducto)}
                >
                  <div className="user-card-info">
                    <div className="user-avatar"></div>
                    <div className="user-details">
                      <span className="user-name">{prod.nombre}</span>
                      <span className="user-role">Código: {prod.codigo}</span>
                      <span className="user-role">Precio: ${prod.precio}</span>
                      <span className="user-role">Stock: {prod.stock}</span>
                      <span
                        className={`user-role ${!prod.activo ? "inactive" : ""}`}
                      >
                        {prod.activo ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>

                  <div className="user-actions">
                    <button
                      className="edit-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditProducto(prod.idProducto);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="delete-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProducto(prod.idProducto);
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No hay productos {mostrarInactivos ? "inactivos" : "registrados"}.</p>
            )}
          </div>

          {/* PAGINACIÓN */}
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

        {/* MODAL PRINCIPAL */}
        {open && (
          <ModalBase
            title={view ? "Ver Producto" : edit ? "Editar Producto" : ""}
            onClose={() => setOpen(false)}
          >
            <form onSubmit={handleSubmit}>
              <div className="inputs-container">
                {Object.keys(formData).map(
                  (key) =>
                    key !== "idProducto" &&
                    key !== "activo" && (
                      <div key={key} className="user-input-container">
                        <label className="user-label">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                        <input
                          className="form-input"
                          type={
                            key === "precio" || key === "stock"
                              ? "number"
                              : key === "fechaVencimiento"
                                ? "date"
                                : "text"
                          }
                          value={(formData as any)[key] || ""}
                          disabled={view}
                          onChange={(e) =>
                            setFormData({ ...formData, [key]: e.target.value })
                          }
                        />
                      </div>
                    )
                )}

                {edit && (
                  <div className="form-input-wrapper">
                    <label className="checkbox-wrapper-12">
                      <div className="cbx">
                        <input
                          type="checkbox"
                          id="cbx-activo"
                          checked={formData.activo ?? false}
                          onChange={(e) =>
                            setFormData({ ...formData, activo: e.target.checked })
                          }
                        />
                        <label htmlFor="cbx-activo"></label>
                        <svg fill="none" viewBox="0 0 15 14" height="14" width="15">
                          <path d="M2 8.36364L6.23077 12L13 2"></path>
                        </svg>
                      </div>
                      <p className="PCheckInfo">
                        {formData.activo ? "Activo" : "Inactivo"}
                      </p>
                    </label>
                  </div>
                )}
              </div>

              <div className="form-buttons-container">
                {view ? (
                  <>
                    <button
                      type="button"
                      className="submit-button"
                      onClick={() => handleEditProducto(formData.idProducto)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => setOpen(false)}
                    >
                      Cerrar
                    </button>
                  </>
                ) : (
                  <>
                    <button type="submit" className="submit-button">
                      {edit ? "Actualizar" : ""}
                    </button>
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => setOpen(false)}
                    >
                      Cancelar
                    </button>
                  </>
                )}
              </div>
            </form>
          </ModalBase>
        )}

        {/* MODAL CONFIRMACIÓN */}
        {showConfirmModal && (
          <div
            className="pregunta-modal-overlay"
            onClick={() => setShowConfirmModal(false)}
          >
            <div
              className="pregunta-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="PTitle">
                {confirmAction === "eliminar"
                  ? "¿Eliminar producto?"
                  : "¿Confirmar actualización?"}
              </h3>
              <p>
                {confirmAction === "eliminar"
                  ? "¿Seguro que deseas eliminar este producto? Esta acción no se puede deshacer."
                  : "¿Seguro que deseas actualizar este producto?"}
              </p>
              <div className="pregunta-form-buttons">
                <button
                  type="button"
                  className="submit-button"
                  onClick={() => {
                    if (confirmAction === "eliminar" && id != null) {
                      eliminarProductoConfirmado(id);
                    } else {
                      guardarProducto();
                    }
                  }}
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        <ToastContainer toasts={toasts} />
      </div>
    </div>
  );
}
