import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import ToastContainer from "../components/ToastContainer";
import { useToast } from "../hooks/useToast";
import "../styles/PersonaCrud.css";
import type { MovimientoStockDTO } from "../types/movimientos.types";

const API_URL = "http://localhost:5227/api/MovimientosStock";

export default function MovimientosHistorial() {
  const { toasts, addToast } = useToast();
  const [movimientos, setMovimientos] = useState<MovimientoStockDTO[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchMovimientos();
  }, []);

  const fetchMovimientos = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setMovimientos(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (error) {
      addToast("❌ Error al obtener movimientos", "error");
      setMovimientos([]);
    }
    setLoading(false);
  };

  const movimientosFiltrados = movimientos.filter((m) => {
    const busq = busqueda.toLowerCase();
    return (
      m.codigo.toString().includes(busq) ||
      m.tipoMovimiento.toLowerCase().includes(busq) ||
      m.cantidad.toString().includes(busq) ||
      (m.observaciones?.toLowerCase().includes(busq) ?? false) ||
      (m.fechaMovimiento?.split("T")[0].includes(busq) ?? false) // filtra solo por fecha YYYY-MM-DD
    );
  });


  const totalPages = Math.ceil(movimientosFiltrados.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMovimientos = movimientosFiltrados.slice(
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
          <h1 className="Ttitle">Historial de Movimientos</h1>
        </div>

        <div className="user-crud-container">
          {/* Buscador */}
          <div className="search-container">
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

          {/* Tabla */}
          {loading ? (
            <div className="empty-table">Cargando...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Tipo</th>
                  <th>Cantidad</th>
                  <th>Orden</th>
                  <th>Observaciones</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {currentMovimientos.length > 0 ? (
                  currentMovimientos.map((mov) => (
                    <tr key={mov.idMovimiento ?? mov.codigo}>
                      <td data-label="Código">{mov.codigo}</td>
                      <td data-label="Tipo">{mov.tipoMovimiento}</td>
                      <td data-label="Cantidad">{mov.cantidad}</td>
                      <td data-label="Orden">{mov.idOrden || "-"}</td>
                      <td data-label="Observaciones">{mov.observaciones || "-"}</td>
                      <td data-label="Fecha">{mov.fechaMovimiento?.split("T")[0] || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center" }}>
                      No hay movimientos registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* Paginación */}
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
        <ToastContainer toasts={toasts} />
      </div>
    </div>
  );
}
