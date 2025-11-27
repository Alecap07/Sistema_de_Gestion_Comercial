import { useEffect, useState, useCallback, useMemo } from 'react';
import { CiSearch } from "react-icons/ci";
import type { ClienteReadDTO } from '../types/cliente.types';
import type { PresupuestoDTO } from '../types/presupuesto.types';
import { Modal, type ModalField } from "../components/Modal";
import { fetchAll, create, update, handleApiError } from '../functions/api';
import { getPageNumbers, paginateArray, getTotalPages } from '../functions/pagination';
import { filterBySearch } from '../functions/filtering';
import { formatDateForInput } from '../functions/formatting';
import '../styles/PersonaCrud.css';
import '../styles/user.css';
import { useNavigate } from 'react-router-dom';



function createPresupuestoFields(clientes: ClienteReadDTO[]): ModalField[] {
  return [
    {
      name: 'clienteId',
      label: 'Cliente',
      type: 'select',
      required: true,
      options: clientes.map(cl => ({
        value: cl.id.toString(),
        label: `${cl.codigo} - ID:${cl.id}`
      }))
    },
    { name: 'fecha', label: 'Fecha', type: 'date', required: true },
    { name: 'estado', label: 'Estado', type: 'text', required: true },
    { name: 'observacion', label: 'Observación', type: 'textarea' },
    { name: 'activo', label: 'Activo', type: 'checkbox' }
  ];
}

const API_URL_CLIENTES = 'http://localhost:5300';
const API_URL = "http://localhost:5400";

function PresupuestoCrud() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [clientes, setClientes] = useState<ClienteReadDTO[]>([]);
  const [presupuestos, setPresupuestos] = useState<PresupuestoDTO[]>([]);
  const [busqueda, setBusqueda] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [view, setView] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [selectedPresupuesto, setSelectedPresupuesto] = useState<PresupuestoDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showOptionsModal, setShowOptionsModal] = useState<boolean>(false);

  const fetchClientes = useCallback(async () => {
    setError(null);
    try {
      const data = await fetchAll<ClienteReadDTO>(`${API_URL_CLIENTES}/api/clientes`);
      setClientes(data);
    } catch (err) {
      handleApiError(err, "Error al obtener clientes");
    }
  }, []);

  const fetchPresupuestos = useCallback(async () => {
    setError(null);
    try {
      const data = await fetchAll<PresupuestoDTO>(`${API_URL}/api/presupuestos`);
      setPresupuestos(data);
    } catch (err) {
      handleApiError(err, "Error al obtener presupuestos");
    }
  }, []);

  useEffect(() => {
    document.body.classList.add('user-crud-page');
    fetchClientes();
    fetchPresupuestos();
    return () => document.body.classList.remove('user-crud-page');
  }, [fetchClientes, fetchPresupuestos]);

  const handleModalSubmit = async (formData: Record<string, any>) => {
    setError(null);
    const isEditing = edit && selectedPresupuesto?.id;
    const url = `${API_URL}/api/presupuestos`;

    const payload = {
      id: selectedPresupuesto?.id || 0,
      clienteId: parseInt(formData.clienteId),
      fecha: formData.fecha,
      estado: formData.estado,
      observacion: formData.observacion ?? '',
      activo: formData.activo === true || formData.activo === 'true'
    };

    try {
      if (isEditing) {
        await update<PresupuestoDTO>(url, selectedPresupuesto!.id, payload);
      } else {
        await create<PresupuestoDTO>(url, payload);
      }
      setIsOpen(false);
      setView(false);
      setEdit(false);
      setSelectedPresupuesto(null);
      fetchPresupuestos();
    } catch (err) {
      handleApiError(err, isEditing ? 'Error al actualizar presupuesto' : 'Error al guardar presupuesto');
    };
  };

  const openModal = () => {
    setSelectedPresupuesto(null);
    setEdit(false);
    setView(false);
    setIsOpen(true);
  };

  const openViewModal = (p: PresupuestoDTO) => {
    setSelectedPresupuesto(p);
    setShowOptionsModal(true);
  };

  const openEditModal = (p: PresupuestoDTO) => {
    setSelectedPresupuesto(p);
    setEdit(true);
    setView(false);
    setIsOpen(true);
  };

  const handleEditPresupuesto = () => {
    if (selectedPresupuesto) {
      openEditModal(selectedPresupuesto);
      setShowOptionsModal(false);
    }
  };

  const handleEditItems = () => {
    if (selectedPresupuesto) {
      navigate(`/presupuesto-items?presupuestoId=${selectedPresupuesto.id}`);
    }
  };

  const presupuestoFiltrado = useMemo(() => {
    return filterBySearch(presupuestos, busqueda, ['estado']);
  }, [presupuestos, busqueda]);

  const itemsPerPage = 9;
  const totalPages = getTotalPages(presupuestoFiltrado.length, itemsPerPage);
  const visiblePages = 5;

  const presupuestopagina = useMemo(() => paginateArray(presupuestoFiltrado, currentPage, itemsPerPage), [presupuestoFiltrado, currentPage, itemsPerPage]);

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);
  const pageNumbers = getPageNumbers(currentPage, totalPages, visiblePages);

  return (
    <>
      <div className='Container'>
        <div className="Sub-Container">
          <div className='Title-Container'>
            <h1 className="Ttitle">Presupuestos</h1>
          </div>
          <div className="user-crud-container">
            {error && <p className="error-message">{error}</p>}

            <div className="search-container">
              <button className='add-button' onClick={openModal}>Añadir</button>
              <input
                type="text"
                placeholder="Buscar por ID Cliente o estado..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="search-input"
              />
              <span className='search-icon'><CiSearch /></span>
            </div>

            <div className="user-cards-container">
              {presupuestopagina.length === 0 ? (
                <p className="no-data-message">No hay presupuestos.</p>
              ) : (
                presupuestopagina.map(p => (
                  <div key={p.id} className="user-card" onClick={() => openViewModal(p)}>
                    <div className="user-card-info">
                      <div className="user-avatar"></div>
                      <div className="user-details">
                        <span className="user-name">Est: {p.estado} (ID C.: {p.clienteId})</span>
                        <span className="user-role">Fecha: {formatDateForInput(p.fecha)} | Obs: {p.observacion || '—'}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>&laquo;</button>

                {pageNumbers[0] > 1 && (
                  <>
                    <button onClick={() => handlePageChange(1)}>1</button>
                    {pageNumbers[0] > 2 && <span className="dots">...</span>}
                  </>
                )}

                {pageNumbers.map(page => (
                  <button key={page} className={currentPage === page ? 'active' : ''} onClick={() => handlePageChange(page)}>{page}</button>
                ))}

                {pageNumbers[pageNumbers.length - 1] < totalPages && (
                  <>
                    {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className="dots">...</span>}
                    <button onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
                  </>
                )}

                <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>&raquo;</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {!view && (
        <Modal
          inputs={createPresupuestoFields(clientes)}
          onSubmit={handleModalSubmit}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          Title={edit ? 'Editar Presupuesto' : 'Añadir Presupuesto'}
          View={view}
          setView={setView}
          defaultValues={selectedPresupuesto ? {
            clienteId: selectedPresupuesto.clienteId.toString(),
            fecha: formatDateForInput(selectedPresupuesto.fecha),
            estado: selectedPresupuesto.estado,
            observacion: selectedPresupuesto.observacion,
            activo: selectedPresupuesto.activo
          } : {}}
          onEdit={edit}
        />
      )}

      {view && selectedPresupuesto && (
        <div className="modal-overlay" onClick={() => setView(false)}>
          <div className="user-crud-form" onClick={e => e.stopPropagation()}>
            <button className="pregunta-close-button" onClick={() => setView(false)}>×</button>
            <h2 className="PTitle">Detalles del Presupuesto</h2>
            <div className='inputs-container'>
              {[
                { label: 'ID Presupuesto', value: selectedPresupuesto.id },
                { label: 'ID Cliente', value: selectedPresupuesto.clienteId },
                { label: 'Cliente (código)', value: clientes.find(c => c.id === selectedPresupuesto.clienteId)?.codigo ?? '—' },
                { label: 'Fecha', value: formatDateForInput(selectedPresupuesto.fecha) },
                { label: 'Estado', value: selectedPresupuesto.estado },
                { label: 'Activo', value: selectedPresupuesto.activo ? 'Sí' : 'No' }
              ].map(item => (
                <div className="input-container" key={item.label}>
                  <label className="Plabel">{item.label}</label>
                  <p className="form-input input-full">{item.value}</p>
                </div>
              ))}
              <div className="input-container" style={{ gridColumn: '1 / -1' }}>
                <label className="Plabel">Observación</label>
                <p className="form-input input-full" style={{ minHeight: '80px' }}>{selectedPresupuesto.observacion || 'Sin observaciones'}</p>
              </div>
            </div>

            <div className="form-buttons-container">
              <button className="submit-button" onClick={() => openEditModal(selectedPresupuesto)}>Editar</button>
              <button className="cancel-button" onClick={() => setView(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {showOptionsModal && selectedPresupuesto && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }} onClick={() => setShowOptionsModal(false)}>
          <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'absolute', inset: 0 }} />
          <div className="user-crud-form" onClick={(e) => e.stopPropagation()} style={{ position: 'relative', zIndex: 10001, width: '90%', maxWidth: '400px', padding: '20px' }}>
            <h3 className="PTitle" style={{ fontSize: '18px', marginBottom: '16px', textAlign: 'center' }}>¿Qué deseas hacer?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                className="submit-button"
                onClick={handleEditPresupuesto}
                style={{ width: '100%' }}
              >
                Editar Presupuesto
              </button>
              <button
                className="submit-button"
                onClick={handleEditItems}
                style={{ width: '100%' }}
              >
                Editar Items
              </button>
              <button
                className="cancel-button"
                onClick={() => setShowOptionsModal(false)}
                style={{ width: '100%' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PresupuestoCrud;
