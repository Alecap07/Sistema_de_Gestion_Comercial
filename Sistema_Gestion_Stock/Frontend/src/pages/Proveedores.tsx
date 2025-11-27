import { useState, useEffect, useMemo, useCallback } from "react";
import { Modal, type ModalField } from "../components/Modal";
import { CiSearch } from "react-icons/ci";
import ToastContainer from "../components/ToastContainer";
import { useToast } from "../hooks/useToast";
import type { ProveedorDTO } from '../types/proveedor.types';
import { fetchAll, fetchById, create, update, handleApiError } from '../functions/api';
import { getPageNumbers, paginateArray, getTotalPages } from '../functions/pagination';
import { filterBySearch } from '../functions/filtering';
import "../styles/PersonaCrud.css";
import ProveedorCategorias from "./ProveedoresCategoria";
import ProveedorDirecciones from "./ProveedorDirecciones";
import ProveedorTelefonos from "./ProveedorTelefonos";
import ProveedorProductos from "./ProveedorProducto";

const API_URL = "http://localhost:5090";
const API_URL_Personas = "http://localhost:5160";

export default function Proveedores() {
  const { toasts, addToast } = useToast();
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

  const fetchProveedores = useCallback(async (Id?: number) => {
    try {
      if (Id) {
        const data = await fetchById<ProveedorDTO>(`${API_URL}/api/proveedores`, Id, addToast);
        setSelectedProveedor(data);
      } else {
        const data = await fetchAll<ProveedorDTO>(`${API_URL}/api/proveedores`, addToast);
        setProveedores(data);
      }
    } catch (error) {
      handleApiError(error, 'Error al obtener proveedores', addToast);
    }
  }, [addToast]);

  const fetchPersonas = useCallback(async () => {
    try {
      const data = await fetchAll<{ Id: number; Nombre: string; Apellido: string }>(`${API_URL_Personas}/api/persona`, addToast);
      if (Array.isArray(data)) {
        setPersonas(
          data.map((p) => ({
            id: p.Id,
            nombre: p.Nombre || "",
            apellido: p.Apellido || "",
          }))
        );
      }
    } catch (error) {
      handleApiError(error, 'Error al obtener personas', addToast);
    }
  }, [addToast]);

  useEffect(() => {
    fetchProveedores();
    fetchPersonas();
  }, [fetchProveedores, fetchPersonas]);

  const ProveedoresFieldBase: ModalField[] = [
    {
      name: "personaId",
      type: "select",
      label: "Persona",
      required: true,
      options: personas.map((p) => ({
        value: p.id.toString(),
        label: `${p.id} - ${p.nombre} ${p.apellido}`,
      })),
    },
    { name: "codigo", type: "text", label: "Código", required: true },
    { name: "razonSocial", type: "text", label: "Razón Social", required: true },
    { name: "tiempoEntregaDias", type: "number", label: "Tiempo entrega (días)" },
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

      if (edit && id !== null) {
        await update<ProveedorDTO>(`${API_URL}/api/proveedores`, id, payload, addToast);
      } else {
        await create<ProveedorDTO>(`${API_URL}/api/proveedores`, payload, addToast);
      }

      fetchProveedores();
      setOpen(false);
      setSelectedProveedor(null);
      setModalOpciones(false);
    } catch (error) {
      handleApiError(error, edit ? 'Error al editar proveedor' : 'Error al crear proveedor', addToast);
    }
  };

  const handleViewProveedor = async (id: number | undefined) => {
    setView(true);
    setEdit(false);
    if (id != null) {
      setId(id);
      await fetchProveedores(id);
    }
    setOpen(true);
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

  const handleViewTelefono = (proveedorId: number | undefined) => {
    if (!proveedorId) return;
    setSelectedProveedorTelefono(proveedorId);
  };

  const handleViewProducto = (proveedorId: number | undefined) => {
    if (!proveedorId) return;
    setSelectedProveedorProducto(proveedorId);
  };

  const proveedoresFiltrados = useMemo(() => {
    return filterBySearch(proveedores, busqueda, ['razonSocial', 'codigo', 'personaId']);
  }, [proveedores, busqueda]);

  const totalPages = getTotalPages(proveedoresFiltrados.length, itemsPerPage);
  const proveedoresPagina = useMemo(() => paginateArray(proveedoresFiltrados, currentPage, itemsPerPage), [proveedoresFiltrados, currentPage, itemsPerPage]);
  const pageNumbers = getPageNumbers(currentPage, totalPages, visiblePages);

  if (selectedProveedorDirecciones !== null) {
    return (
      <div className='Container'>
        <div className="Sub-Container">
          <ProveedorDirecciones proveedorId={selectedProveedorDirecciones} />
          <button className="cancel-button" onClick={() => setSelectedProveedorDirecciones(null)}>Volver</button>
        </div>
      </div>
    );
  }

  if (selectedProveedorTelefono !== null) {
    return (
      <div className='Container'>
        <div className="Sub-Container">
          <ProveedorTelefonos proveedorId={selectedProveedorTelefono} />
          <button className="cancel-button" onClick={() => setSelectedProveedorTelefono(null)}>Volver</button>
        </div>
      </div>
    );
  }

  if (selectedProveedorProducto !== null) {
    return (
      <div className='Container'>
        <div className="Sub-Container">
          <ProveedorProductos proveedorId={selectedProveedorProducto} />
          <button className="cancel-button" onClick={() => setSelectedProveedorProducto(null)}>Volver</button>
        </div>
      </div>
    );
  }

  if (selectedProveedorCategorias !== null) {
    return (
      <div className='Container'>
        <div className="Sub-Container">
          <ProveedorCategorias proveedorId={selectedProveedorCategorias} />
          <button className="cancel-button" onClick={() => setSelectedProveedorCategorias(null)}>Volver</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='Container'>
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
                  <div key={prov.id} className="user-card" onClick={() => { handleViewProveedor(prov.id); }}>
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
                        onClick={(e) => { e.stopPropagation(); handleEditProveedor(prov.id); }}
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
        onEdit={edit}
      />
      <ToastContainer toasts={toasts} />
    </>
  );
}
