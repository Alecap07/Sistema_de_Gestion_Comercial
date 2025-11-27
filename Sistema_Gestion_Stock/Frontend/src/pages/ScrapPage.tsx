import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import ModalBase from "../components/ModalBase";
import ToastContainer from "../components/ToastContainer";
import { useToast } from "../hooks/useToast";
import "../styles/PersonaCrud.css";
import type { ScrapDTO, ProductoScrapDTO } from "../types/scrap.types";

const API_URL = "http://localhost:5227/api/Scrap";
const API_PRODUCTOS = "http://localhost:5227/api/Productos";

export default function ScrapPage() {
  const { toasts, addToast } = useToast();
  const [scraps, setScraps] = useState<ScrapDTO[]>([]);
  const [productos, setProductos] = useState<ProductoScrapDTO[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ScrapDTO>({
    codigo: 0,
    idUsuario: 1,
    cantidad: 0,
    motivo: "",
    observaciones: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchScraps();
    fetchProductos();
  }, []);

  const fetchScraps = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setScraps(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error al obtener scraps:", error);
      setScraps([]);
    }
    setLoading(false);
  };

  const fetchProductos = async () => {
    try {
      const res = await fetch(API_PRODUCTOS);
      const data = await res.json();
      setProductos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      setProductos([]);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      codigo: 0,
      idUsuario: 1,
      cantidad: 0,
      motivo: "",
      observaciones: "",
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.codigo === 0) {
      addToast("❌ Debe seleccionar un producto válido.", "error");
      return;
    }
    if (formData.cantidad <= 0) {
      addToast("❌ La cantidad debe ser mayor a cero.", "error");
      return;
    }

    const dataToSend = {
      codigo: formData.codigo,
      idUsuario: formData.idUsuario,
      cantidad: formData.cantidad,
      motivo: formData.motivo,
      observaciones: formData.observaciones || null,
      fechaScrap: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${API_URL}/registrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMessage = data.error || data.title || "Error desconocido al registrar scrap";
        throw new Error(errorMessage);
      }

      addToast("✅ Producto enviado a scrap correctamente", "success");
      setOpen(false);
      fetchScraps();
      fetchProductos();
    } catch (error: any) {
      console.error(error);
      addToast(`❌ ${error.message}`, "error");
    }
  };

  const scrapsFiltrados = scraps.filter((s) => {
    const busq = busqueda.toLowerCase();
    return (
      s.codigo.toString().includes(busq) ||
      s.motivo.toLowerCase().includes(busq) ||
      s.cantidad.toString().includes(busq) ||
      (s.observaciones?.toLowerCase().includes(busq) ?? false) ||
      (s.fechaScrap?.split("T")[0].includes(busq) ?? false)
    );
  });

  const totalPages = Math.ceil(scrapsFiltrados.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentScraps = scrapsFiltrados.slice(indexOfFirstItem, indexOfLastItem);

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
          <h1 className="Ttitle">Historial de Scrap</h1>
        </div>

        <div className="user-crud-container">
          <div className="search-container">
            <button className="add-button" onClick={handleOpenModal}>
              Añadir
            </button>
            <input
              type="text"
              placeholder="Buscar por código..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">
              <CiSearch />
            </span>
          </div>

          {loading ? (
            <div className="empty-table">Cargando...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Motivo</th>
                  <th>Observaciones</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {currentScraps.length > 0 ? (
                  currentScraps.map((s) => (
                    <tr key={s.idScrap ?? s.codigo}>
                      <td data-label="Código">{s.codigo}</td>
                      <td data-label="Producto">{productos.find((p) => p.codigo === s.codigo)?.nombre}</td>
                      <td data-label="Cantidad">{s.cantidad}</td>
                      <td data-label="Motivo">{s.motivo}</td>
                      <td data-label="Observaciones">{s.observaciones || "-"}</td>
                      <td data-label="Fecha">{s.fechaScrap?.split("T")[0] || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center" }}>
                      No hay productos en scrap.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                &laquo;
              </button>
              {getPageNumbers().map((page) => (
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

        {/* MODAL */}
        {open && (
          <ModalBase title="Añadir a Scrap" onClose={() => setOpen(false)}>
            <form onSubmit={handleSubmit}>
              <div className="inputs-container">
                <label>Producto:</label>
                <select
                  className="form-select"
                  value={formData.codigo}
                  onChange={(e) =>
                    setFormData({ ...formData, codigo: parseInt(e.target.value) })
                  }
                  required
                >
                  <option value={0}>Seleccione un producto</option>
                  {productos
                    .filter((p) => p.stock > 0)
                    .map((p) => (
                      <option key={p.codigo} value={p.codigo}>
                        {p.nombre} (Stock: {p.stock})
                      </option>
                    ))}
                </select>

                <label>Cantidad:</label>
                <input
                  className="form-input"
                  type="number"
                  min={1}
                  max={productos.find((p) => p.codigo === formData.codigo)?.stock || 1}
                  value={formData.cantidad === 0 ? "" : formData.cantidad || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, cantidad: parseInt(e.target.value) })
                  }
                  required
                />

                <label>Motivo:</label>
                <input
                  className="form-input"
                  type="text"
                  value={formData.motivo || ""}
                  onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                  required
                />

                <label>Observaciones:</label>
                <input
                  className="form-input"
                  type="text"
                  value={formData.observaciones || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, observaciones: e.target.value })
                  }
                />
              </div>

              <div className="form-buttons-container">
                <button type="submit" className="submit-button">
                  Añadir
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </ModalBase>
        )}

        <ToastContainer toasts={toasts} />
      </div>
    </div>
  );
}
