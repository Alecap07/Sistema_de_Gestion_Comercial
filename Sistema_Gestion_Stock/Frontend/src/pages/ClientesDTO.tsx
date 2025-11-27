import { useCallback, useEffect, useState } from "react";
import { Modal, type ModalField } from "../components/Modal";
import { CiSearch } from "react-icons/ci";
import ToastContainer from "../components/ToastContainer";
import { useToast } from "../hooks/useToast";
import type { ClienteReadDTO, PersonaDTO } from '../types/cliente.types';
import { fetchAll, fetchById, create, update, handleApiError } from '../functions/api';
import { getPageNumbers, paginateArray, getTotalPages } from '../functions/pagination';
import { filterBySearch } from '../functions/filtering';
import "../styles/PersonaCrud.css";

const API_URL = 'http://localhost:5300';
const API_URL_PERSONA = 'http://localhost:5160';

function createClienteFields(personas: PersonaDTO[]): ModalField[] {
  return [
    {
      name: 'personaId',
      label: 'ID Persona',
      type: 'select',
      required: true,
      options: personas.map(p => ({
        value: p.Id.toString(),
        label: `${p.Nombre} - ${p.Apellido} (ID: ${p.Id})`
      }))
    },
    { name: 'codigo', label: 'Código', type: 'text', required: true },
    { name: 'limiteCredito', label: 'Límite de Crédito', type: 'number', required: true },
    { name: 'descuento', label: 'Descuento (%)', type: 'number', required: true },
    { name: 'formasPago', label: 'Formas de Pago', type: 'text', required: true },
    { name: 'observacion', label: 'Observación', type: 'textarea' },
    { name: 'activo', label: 'Activo', type: 'checkbox' }
  ];
}

function ClienteCrud() {
  const { toasts, addToast } = useToast();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [clientes, setClientes] = useState<ClienteReadDTO[]>([]);
  const [persona, setPersona] = useState<PersonaDTO[]>([]);
  const [busqueda, setBusqueda] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [view, setView] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [selectedCliente, setSelectedCliente] = useState<ClienteReadDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 8;
  const visiblePages = 5;

  const fetchClientes = useCallback(async () => {
    try {
      const data = await fetchAll<ClienteReadDTO>(`${API_URL}/api/clientes`, addToast);
      setClientes(data);
    } catch (error) {
      handleApiError(error, 'Error al obtener clientes', addToast);
    }
  }, [addToast]);
  const fetchPersona = useCallback(async () => {
    try {
      const data = await fetchAll<PersonaDTO>(`${API_URL_PERSONA}/api/persona`, addToast);
      const mapped = data.map((p: any) => ({
        Id: p.Id,
        Nombre: p.Nombre || "",
        Apellido: p.Apellido || "",
      }));
      setPersona(mapped);
    } catch (error) {
      handleApiError(error, 'Error al obtener personas', addToast);
    }
  }, [addToast]);
  useEffect(() => {
    document.body.classList.add('user-crud-page');
    fetchClientes();
    fetchPersona();
    return () => document.body.classList.remove('user-crud-page');
  }, [fetchClientes, fetchPersona]);

  const handleModalSubmit = async (formData: Record<string, any>) => {
    setError(null);
    const isEditing = edit && selectedCliente?.id;
    const url = `${API_URL}/api/clientes`;

    const dataToSend = {
      personaId: parseInt(formData.personaId),
      codigo: formData.codigo,
      limiteCredito: parseFloat(formData.limiteCredito) || 0,
      descuento: parseFloat(formData.descuento) || 0,
      formasPago: formData.formasPago,
      observacion: formData.observacion,
      activo: formData.activo === true || formData.activo === 'true',
    };

    const requestData = isEditing ? { id: selectedCliente!.id, ...dataToSend } : dataToSend;

    try {
      if (isEditing) await update(url, selectedCliente!.id, requestData, addToast);
      else await create(url, requestData, addToast);
      setIsOpen(false);
      setView(false);
      setEdit(false);
      setSelectedCliente(null);
      fetchClientes();
    } catch (err) {
      const axiosError = err as { response?: { data?: string } };
      let msg = isEditing ? 'Error al actualizar cliente' : 'Error al guardar cliente';
      if (axiosError.response && axiosError.response.data) msg = axiosError.response.data as string;
      else if (err instanceof Error) msg = err.message;
      setError(msg);
      addToast(`❌ ${msg}`, "error");
    };
  };

  const openModal = () => {
    setSelectedCliente(null);
    setEdit(false);
    setView(false);
    setIsOpen(true);
  };

  const openViewModal = (cliente: ClienteReadDTO) => {
    setSelectedCliente(cliente);
    setView(true);
    setEdit(false);
    setIsOpen(false);
  };

  const openEditModal = (cliente: ClienteReadDTO) => {
    setSelectedCliente(cliente);
    setEdit(true);
    setView(false);
    setIsOpen(true);
  };

  const clientesFiltrados = filterBySearch(clientes, busqueda, ['codigo']);
  const totalPages = getTotalPages(clientesFiltrados.length, itemsPerPage);
  const clientesPagina = paginateArray(clientesFiltrados, currentPage, itemsPerPage);
  const pageNumbers = getPageNumbers(currentPage, totalPages, visiblePages);

  return (
    <>
      <div className='Container'>
        <div className="Sub-Container">
          <div className='Title-Container'>
            <h1 className="Ttitle">Clientes</h1>
          </div>
          <div className="user-crud-container">
            {error && <p className="error-message">{error}</p>}

            <div className="search-container">
              <button className='add-button' onClick={openModal}>Añadir</button>
              <input
                type="text"
                placeholder="Buscar por código o ID Persona..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="search-input"
              />
              <span className='search-icon'><CiSearch /></span>
            </div>

            <div className="user-cards-container">
              {clientesFiltrados.length === 0 ? (
                <p className="no-data-message">No hay clientes encontrados.</p>
              ) : (
                clientesPagina.map(c => (
                  <div key={c.id} className="user-card" onClick={() => openViewModal(c)}>
                    <div className="user-card-info">
                      <div className="user-avatar"></div>
                      <div className="user-details">
                        <span className="user-name">Cód: {c.codigo} (ID P.: {c.personaId})</span>
                        <span className="user-role">Límite: ${c.limiteCredito.toFixed(2)} | Desc.: {c.descuento}%</span>
                      </div>
                    </div>
                    <button className="edit-button" onClick={(e) => { e.stopPropagation(); openEditModal(c); }}>Editar</button>
                  </div>
                ))
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

      {!view && (
        <Modal
          inputs={createClienteFields(persona)}
          onSubmit={handleModalSubmit}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          Title={edit ? 'Editar Cliente' : 'Añadir Cliente'}
          View={view}
          setView={setView}
          defaultValues={selectedCliente ? {
            personaId: selectedCliente.personaId.toString(),
            codigo: selectedCliente.codigo,
            limiteCredito: selectedCliente.limiteCredito,
            descuento: selectedCliente.descuento,
            formasPago: selectedCliente.formasPago,
            observacion: selectedCliente.observacion,
            activo: selectedCliente.activo
          } : {}}
          onEdit={edit}
        />
      )}

      {view && selectedCliente && (
        <div className="modal-overlay" onClick={() => setView(false)}>
          <div className="user-crud-form" onClick={e => e.stopPropagation()}>
            <button className="pregunta-close-button" onClick={() => setView(false)}>×</button>
            <h2 className="PTitle">Detalles del Cliente</h2>
            <div className='inputs-container'>
              {[
                { label: 'ID Cliente', value: selectedCliente.id },
                { label: 'ID Persona (FK)', value: selectedCliente.personaId },
                { label: 'Código', value: selectedCliente.codigo },
                { label: 'Límite Crédito', value: `$${selectedCliente.limiteCredito.toFixed(2)}` },
                { label: 'Descuento', value: `${selectedCliente.descuento}%` },
                { label: 'Formas de Pago', value: selectedCliente.formasPago },
                { label: 'Estado', value: selectedCliente.activo ? 'Activo' : 'Inactivo' },
              ].map(item => (
                <div className="input-container" key={item.label}>
                  <label className="Plabel">{item.label}</label>
                  <p className="form-input input-full">{item.value}</p>
                </div>
              ))}
              <div className="input-container" style={{ gridColumn: '1 / -1' }}>
                <label className="Plabel">Observación</label>
                <p className="form-input input-full" style={{ minHeight: '80px' }}>{selectedCliente.observacion || 'Sin observaciones'}</p>
              </div>
            </div>

            <div className="form-buttons-container">
              <button className="submit-button" onClick={() => openEditModal(selectedCliente)}>Editar</button>
              <button className="cancel-button" onClick={() => setView(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer toasts={toasts} />
    </>
  );
}

export default ClienteCrud;
