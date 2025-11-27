import { useState, useEffect } from "react";
import { Modal, type ModalField } from "../components/Modal";
import { CiSearch } from "react-icons/ci";
import axios from "axios";
import "../styles/PersonaCrud.css";
import { IoMdArrowRoundBack } from "react-icons/io";

const API_URL = "http://localhost:5090";

export interface ProveedorDireccionDTO {
  id?: number;
  proveedorId: number;
  calle: string;
  altura?: string;
  localidad?: string;
  observacion?: string;
  activo: boolean;
}

export default function ProveedorDirecciones({ proveedorId }: { proveedorId: number }) {
  const [direcciones, setDirecciones] = useState<ProveedorDireccionDTO[]>([]);
  const [selectedDireccion, setSelectedDireccion] = useState<ProveedorDireccionDTO | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(false);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState<number | null>(null);

  const itemsPerPage = 8;
  const visiblePages = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (proveedorId) fetchDirecciones();
  }, [proveedorId]);

  const fetchDirecciones = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/proveedores/${proveedorId}/direcciones`);
      if (Array.isArray(data)) {
        setDirecciones(data);
      } else if (data?.value && Array.isArray(data.value)) {
        setDirecciones(data.value);
      } else {
        setDirecciones([]);
      }
    } catch (error) {
      console.error("Error al obtener direcciones:", error);
    }
  };

  const DireccionesFields: ModalField[] = [
    { name: "calle", type: "text", label: "Calle", required: true },
    { name: "altura", type: "text", label: "Altura" },
    { name: "localidad", type: "text", label: "Localidad" },
    { name: "observacion", type: "text", label: "Observación" },
    { name: "activo", type: "checkbox", label: "Activo" },
  ];

  const direccionesFiltradas = direcciones.filter((d) =>
    [d.calle, d.altura ?? "", d.localidad ?? "", d.observacion ?? ""]
      .some((field) => field.toString()
      .toLowerCase()
      .replace(/\s/g, '')
      .includes(busqueda.toLowerCase().replace(/\s/g, '')) )
  );

  const handleModalSubmit = async (data: Record<string, any>) => {
    try {
      const payload: ProveedorDireccionDTO = {
        proveedorId,
        calle: data.calle,
        altura: data.altura,
        localidad: data.localidad,
        observacion: data.observacion,
        activo: data.activo === true || data.activo === "true",
      };

      if (edit && id) {
        await axios.put(`${API_URL}/api/proveedores/direcciones/${id}`, payload);
        alert("Dirección actualizada correctamente");
      } else {
        await axios.post(`${API_URL}/api/proveedores/${proveedorId}/direcciones`, payload);
        alert("Dirección creada correctamente");
      }

      fetchDirecciones();
      setOpen(false);
      setSelectedDireccion(null);
      setView(false);
      setEdit(false);
    } catch (error) {
      console.error("Error al guardar dirección:", error);
      alert("Error al guardar dirección. Revisa la consola.");
    }
  };

  const handleViewDireccion = async (id: number | undefined) => {
    setView(true);
    setEdit(false);
    if (id) {
      const { data } = await axios.get(`${API_URL}/api/proveedores/direcciones/${id}`);
      setSelectedDireccion({
        ...data,
        activo: Boolean(data.activo),
      });
      setId(id);
    }
    setOpen(true);
  };

  const handleAddDireccion = () => {
    setEdit(false);
    setSelectedDireccion({
      proveedorId,
      calle: "",
      altura: "",
      localidad: "",
      observacion: "",
      activo: true,
    });
    setView(false);
    setOpen(true);
  };

  const handleEditDireccion = async (id: number | undefined) => {
    setView(false);
    setEdit(true);
    if (id) {
      const { data } = await axios.get(`${API_URL}/api/proveedores/direcciones/${id}`);
      setSelectedDireccion({
        ...data,
        activo: Boolean(data.activo),
      });
      setId(id);
    }
    setOpen(true);
  };

  const totalPages = Math.ceil(direccionesFiltradas.length / itemsPerPage);
  const direccionesPagina = direccionesFiltradas.slice(
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
        <div className="Title-Container w-full">
          <h1 className="Ttitle w-full">Direcciones del Proveedor</h1>
          <a href="/" className="text-white text-2xl bold items-center justify-center"><IoMdArrowRoundBack/> {"Volver Proveedores"}</a>
        </div>

        <div className="user-crud-container">
          <div className="search-container">
            <button className="add-button" onClick={handleAddDireccion}>Añadir</button>
            <input
              type="text"
              placeholder="Buscar dirección..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="search-input"
            />
            <span className="search-icon"><CiSearch /></span>
          </div>

          <div className="user-cards-container">
            {direccionesPagina.length > 0 ? (
              direccionesPagina.map((dir) => (
                <div
                  key={dir.id}
                  className="user-card"
                  onClick={() => handleViewDireccion(dir.id)}
                >
                  <div className="user-card-info">
                    <div className="user-avatar"></div>
                    <div className="user-details">
                      <span className="user-name">{dir.calle} {dir.altura ?? ""}</span>
                      <span className="user-role">
                        <p>{dir.localidad ?? "Sin localidad"}</p>
                      </span>
                      {dir.observacion && <p className="text-sm italic">"{dir.observacion}"</p>}
                    </div>
                  </div>
                  <button
                    className="edit-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditDireccion(dir.id);
                    }}
                  >
                    Editar
                  </button>
                </div>
              ))
            ) : (
              <p>No hay direcciones registradas.</p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
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

              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                &raquo;
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal
        inputs={DireccionesFields}
        onSubmit={handleModalSubmit}
        isOpen={open}
        setIsOpen={setOpen}
        View={view}
        setView={setView}
        Title={view ? "Ver Dirección" : edit ? "Editar Dirección" : "Añadir Dirección"}
        defaultValues={selectedDireccion || {}}
      />
    </>
  );
}
