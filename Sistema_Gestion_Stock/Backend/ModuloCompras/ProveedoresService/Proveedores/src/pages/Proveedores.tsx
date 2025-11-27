import { useState, useEffect } from "react";
import { Modal, type ModalField } from "../components/Modal";
import { CiSearch } from "react-icons/ci";
import axios from "axios";
import "../styles/PersonaCrud.css";
import ProveedorCategorias from "./ProveedoresCategoria";
import ProveedorDirecciones from "./ProveedorDirecciones";
import ProveedorTelefonos from "./ProveedorTelefonos";
import ProveedorProductos from "./ProveedorProducto";

const API_URL = "http://localhost:5090";
const API_URL_Personas = "http://localhost:5160";

export interface ProveedorDTO {
  id?: number;
  personaId: number;
  codigo: string;
  razonSocial: string;
  formaPago?: string;
  tiempoEntregaDias?: number;
  descuentosOtorgados?: string;
  activo: boolean;
}

export default function Proveedores() {
  const [currentPage, setCurrentPage] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [id, setId] = useState<number | null>(null);
  const [proveedores, setProveedores] = useState<ProveedorDTO[]>([]);
  const [selectedProveedor, setSelectedProveedor] = useState<ProveedorDTO | null>(null);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(false);
  const [edit, setEdit] = useState(false);
  const [modalOpciones, setModalOpciones] = useState(false);
  const [selectedProveedorCategorias, setSelectedProveedorCategorias] = useState<number | null>(null);
  const [personas, setPersonas] = useState<{ id: number; nombre: string; apellido: string }[]>([]);
  const [selectedProveedorDirecciones, setSelectedProveedorDirecciones] = useState<number | null>(null);
  const [selectedProveedorTelefono, setSelectedProveedorTelefono] = useState<number | null>(null);
  const [selectedProveedorProducto, setSelectedProveedorProducto] = useState<number | null>(null);

  const itemsPerPage = 8;
  const visiblePages = 5;

  useEffect(() => {
    fetchProveedores();
    fetchPersonas();
  }, []);

  const fetchProveedores = async (Id?: number) => {
    try {
      if (Id) {
        const { data } = await axios.get(`${API_URL}/api/proveedores/${Id}`);
        setSelectedProveedor(data);
      } else {
        const { data } = await axios.get(`${API_URL}/api/proveedores`);
        if (data && Array.isArray(data.value)) {
          setProveedores(data.value);
        } else if (Array.isArray(data)) {
          setProveedores(data);
        } else {
          setProveedores([]);
        }
      }
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
    }
  };
  const fetchPersonas = async () => {
    try {
      const { data } = await axios.get(`${API_URL_Personas}/api/persona`);
      if (Array.isArray(data)) {
        setPersonas(
          data.map((p: any) => ({
            id: p.Id,
            nombre: p.Nombre || "",
            apellido: p.Apellido || "",
          }))
        );
        console.log(data);
      }
    } catch (error) {
      console.error("Error al obtener personas:", error);
    }
  };
const ProveedoresFieldBase: ModalField[] = [
  {
    name: "personaId",
    type: "select",
    label: "Persona",
    required: true,
    options: personas.map((p) => ({
      value: p.id,
      label: `${p.id} - ${p.nombre} ${p.apellido}`,
    })),
  },
  { name: "codigo", type: "text", label: "Código", required: true },
  { name: "razonSocial", type: "text", label: "Razón Social", required: true },
  { name: "tiempoEntregaDias", type: "text", label: "Tiempo entrega (días)" },
  { name: "formaPago", type: "text", label: "Forma de pago" },
  { name: "descuentosOtorgados", type: "text", label: "Descuentos otorgados" },
  { name: "activo", type: "checkbox", label: "Activo" },
];

  const handleModalSubmit = async (data: Record<string, any>) => {
    try {
      const payload: ProveedorDTO = {
        personaId: Number(data.personaId),
        codigo: data.codigo,
        razonSocial: data.razonSocial,
        formaPago: data.formaPago || null,
        tiempoEntregaDias: data.tiempoEntregaDias ? Number(data.tiempoEntregaDias) : 0,
        descuentosOtorgados: data.descuentosOtorgados || null,
        activo: !!data.activo,
      };

      if (edit) {
        await axios.put(`${API_URL}/api/proveedores/${id}`, payload);
      } else {
        await axios.post(`${API_URL}/api/proveedores`, payload);
      }

      alert(edit ? "Proveedor editado correctamente" : "Proveedor creado correctamente");
      fetchProveedores();
      setOpen(false);
      setSelectedProveedor(null);
      setModalOpciones(false);
    } catch (error) {
      console.error(edit ? "Error al editar proveedor:" : "Error al crear proveedor:", error);
      alert("Error al guardar el proveedor. Revisá la consola.");
    }
  };
  const handleViewProveedor = async (id: number | undefined) => { 
    setView(true); 
    setEdit(false); if (id != null) 
    { 
      setId(id); await fetchProveedores(id); 
    } setOpen(true); 
  };
  
  const handleAddProveedor = () => {
    setEdit(false);
    setSelectedProveedor(null);
    setView(false);
    setModalOpciones(false);
    setOpen(true);
  };

  const handleEditProveedor = async (id: number | undefined) => {
    setView(false);
    if (id != null) {
      setEdit(true);
      setId(id);
      await fetchProveedores(id);
      setModalOpciones(true);
    }
  };

  const handleViewDireccion = (proveedorId: number | undefined) => {
    if (!proveedorId) return;
    setSelectedProveedorDirecciones(proveedorId);
  };

  const handleViewCategorias = (proveedorId: number | undefined) => {
    if (!proveedorId) return;
    setSelectedProveedorCategorias(proveedorId);
  };

  const handleViewProducto = (proveedorId: number | undefined) => {
    if (!proveedorId) return;
    setSelectedProveedorProducto(proveedorId);
  };

  const handleViewTelefono = (proveedorId: number | undefined) => {
    if (!proveedorId) return;
    setSelectedProveedorTelefono(proveedorId);
  };
  const proveedoresFiltrados = proveedores.filter((c) =>
    c.codigo
      .toString()
      .toLowerCase()
      .replace(/\s/g, '')
      .includes(busqueda.toLowerCase().replace(/\s/g, '')) 
  );
  const totalPages = Math.ceil(proveedoresFiltrados.length / itemsPerPage);
  const proveedoresPagina = proveedoresFiltrados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPageNumbers = () => {
    const startPage = Math.max(currentPage - Math.floor(visiblePages / 2), 1);
    const endPage = Math.min(startPage + visiblePages - 1, totalPages);
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  if (selectedProveedorCategorias !== null) {
    return (
      <div className="Sub-Container">
        <ProveedorCategorias proveedorId={selectedProveedorCategorias} />
      </div>
    );
  }

  if (selectedProveedorDirecciones !== null) {
    return (
      <div className="Sub-Container">
        <ProveedorDirecciones proveedorId={selectedProveedorDirecciones} />
      </div>
    );
  }
  
  if (selectedProveedorTelefono !== null) {
    return (
      <div className="Sub-Container">
        <ProveedorTelefonos proveedorId={selectedProveedorTelefono} />
      </div>
    );
  }
  
  if (selectedProveedorProducto !== null) {
    return (
      <div className="Sub-Container">
        <ProveedorProductos proveedorId={selectedProveedorProducto} />
      </div>
    );
  }

  return (
    <>
      <div className="Sub-Container">
        <div className="Title-Container">
          <h1 className="Ttitle">Proveedores</h1>
        </div>

        <div className="user-crud-container">
          <div className="search-container">
            <button className="add-button" onClick={() => handleAddProveedor()}>
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
            {proveedoresPagina.length > 0 ? (
              proveedoresPagina.map((prov) => (
                <div key={prov.id} className="user-card" onClick={() => {handleViewProveedor(prov.id);}}>
                  <div className="user-card-info">
                    <div className="user-avatar"></div>
                    <div className="user-details">
                      <span className="user-name">{prov.razonSocial}</span>
                      <p className="p-0">Código: {prov.codigo}</p>
                      <p className="p-0">ID Persona: {prov.personaId}</p>
                    </div>
                  </div>
                  <div className="flex flex-row justify-center gap-2 mt-3">
                    <button
                      className="edit-button"
                      onClick={(e) =>  {e.stopPropagation(); handleEditProveedor(prov.id);}}
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
              {getPageNumbers().map((page) => (
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

      {modalOpciones && (
        <div className="modal-overlay" onClick={() => { setModalOpciones(false); }}>
          <div className="user-crud-form" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Editar proveedor</h2>

            <div className="flex flex-col gap-3 mt-3">
              <button className="edit-button" onClick={() => setOpen(true)}>
                Editar datos del proveedor
              </button>

              <button
                className="edit-button"
                onClick={() => handleViewDireccion(selectedProveedor?.id)}
              >
                Editar direcciones
              </button>

              <button
                className="edit-button"
                onClick={() => handleViewCategorias(selectedProveedor?.id ?? 0)}
              >
                Editar categorías
              </button>
              <button
                className="edit-button"
                onClick={() => handleViewTelefono(selectedProveedor?.id ?? 0)}
              >
                Editar telefono
              </button>
              <button
                className="edit-button"
                onClick={() => handleViewProducto(selectedProveedor?.id ?? 0)}
              >
                Editar producto
              </button>
            </div>

            <button className="cancel-button" onClick={() => setModalOpciones(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      <Modal
        inputs={ProveedoresFieldBase}
        onSubmit={handleModalSubmit}
        isOpen={open}
        setIsOpen={setOpen}
        View={view}
        setView={setView}
        Title={edit ? "Editar proveedor" : view ? "Ver Proveedor" : "Añadir Proveedor"}
        defaultValues={selectedProveedor || {}}
      />
    </>
  );
}
