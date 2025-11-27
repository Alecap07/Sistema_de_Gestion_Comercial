import { useEffect, useState, useCallback, useMemo } from 'react';
import { CiSearch } from "react-icons/ci";
import type { PresupuestoVentaItemDTO } from '../types/presupuesto.types';
import type { ProductoDTO } from '../types/producto.types';
import type { PresupuestoDTO } from '../types/presupuesto.types';
import { Modal, type ModalField } from "../components/Modal";
import { fetchAll, create, update, patch, handleApiError } from '../functions/api';
import { getPageNumbers, paginateArray, getTotalPages } from '../functions/pagination';
import { filterBySearch } from '../functions/filtering';
import '../styles/PersonaCrud.css';
import '../styles/user.css';
import { useSearchParams } from 'react-router-dom';



function createPresupuestoVentaItemFields(productos: ProductoDTO[], presupuestos: PresupuestoDTO[]): ModalField[] {
  return [
    {
      name: 'presupuestoVentaId',
      label: 'Presupuesto',
      type: 'select',
      required: true,
      options: presupuestos.map(pres => ({
        value: pres.id.toString(),
        label: `ID: ${pres.id} - Cliente: ${pres.clienteId} - ${pres.estado}`
      }))
    },
    {
      name: 'productoId',
      label: 'Producto',
      type: 'select',
      required: true,
      options: productos.map(prod => ({
        value: prod.id.toString(),
        label: `${prod.codigo} - ${prod.nombre}`
      }))
    },
    { name: 'cantidad', label: 'Cantidad', type: 'number', required: true, min: 1 },
    { name: 'precioUnitario', label: 'Precio Unitario', type: 'number', required: true, min: 0, step: 0.01 },
    { name: 'activo', label: 'Activo', type: 'checkbox' }
  ];
}

const API_URL = "http://localhost:5400";
const API_URL_PRODUCTOS = "http://localhost:5080";

const formatNumber = (n?: number) => {
  if (n === undefined || n === null) return '—';
  return n.toFixed(2);
};

function PresupuestoVentaItemCrud() {
  const [searchParams] = useSearchParams();
  const presupuestoIdFromParams = searchParams.get('presupuestoId');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productos, setProductos] = useState<ProductoDTO[]>([]);
  const [presupuestos, setPresupuestos] = useState<PresupuestoDTO[]>([]);
  const [items, setItems] = useState<PresupuestoVentaItemDTO[]>([]);
  const [busqueda, setBusqueda] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [view, setView] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<PresupuestoVentaItemDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProductos = useCallback(async () => {
    setError(null);
    try {
      const data = await fetchAll<ProductoDTO>(`${API_URL_PRODUCTOS}/api/productos`);
      setProductos(data);
    } catch (err) {
      handleApiError(err, "Error al obtener productos");
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

  const fetchItems = useCallback(async () => {
    setError(null);
    try {
      let url = `${API_URL}/api/presupuestos/items`;

      // Si viene presupuestoId en params, usar el endpoint específico
      if (presupuestoIdFromParams) {
        url = `${API_URL}/api/presupuestos/${presupuestoIdFromParams}/items`;
      }

      const data = await fetchAll<PresupuestoVentaItemDTO>(url);
      setItems(data);
    } catch (err) {
      handleApiError(err, "Error al obtener items");
    }
  }, [presupuestoIdFromParams]);

  useEffect(() => {
    document.body.classList.add('user-crud-page');
    fetchProductos();
    fetchPresupuestos();
    fetchItems();
    return () => document.body.classList.remove('user-crud-page');
  }, [fetchProductos, fetchPresupuestos, fetchItems]);

  const handleModalSubmit = async (formData: Record<string, any>) => {
    setError(null);
    const isEditing = edit && selectedItem?.id;
    const url = `${API_URL}/api/presupuestos/items`;

    const payload = {
      id: selectedItem?.id || 0,
      presupuestoVentaId: parseInt(formData.presupuestoVentaId),
      productoId: parseInt(formData.productoId),
      cantidad: parseInt(formData.cantidad),
      precioUnitario: parseFloat(formData.precioUnitario),
      activo: formData.activo === true || formData.activo === 'true'
    };

    try {
      if (isEditing) {
        await update<PresupuestoVentaItemDTO>(url, selectedItem!.id, payload);
      } else {
        await create<PresupuestoVentaItemDTO>(url, payload);
      }
      setIsOpen(false);
      setView(false);
      setEdit(false);
      setSelectedItem(null);
      fetchItems();
    } catch (err) {
      handleApiError(err, isEditing ? 'Error al actualizar item' : 'Error al guardar item');
    }
  };

  const openModal = () => {
    setSelectedItem(null);
    setEdit(false);
    setView(false);
    setIsOpen(true);
  };

  const openViewModal = (item: PresupuestoVentaItemDTO) => {
    setSelectedItem(item);
    setView(true);
    setEdit(false);
    setIsOpen(false);
  };

  const openEditModal = (item: PresupuestoVentaItemDTO) => {
    setSelectedItem(item);
    setEdit(true);
    setView(false);
    setIsOpen(true);
  };

  const handleCancel = async (itemId: number) => {
    if (!confirm('¿Deseas cancelar este item?')) return;
    try {
      await patch(`${API_URL}/api/presupuestos/items/${itemId}/cancelar`);
      fetchItems();
    } catch (err) {
      handleApiError(err, "Error al cancelar item");
    }
  };

  const itemsFiltrados = useMemo(() => {
    let filtrados = filterBySearch(items, busqueda, ['id', 'presupuestoVentaId']);

    // Si viene presupuestoId en params, filtrar solo por ese presupuesto
    if (presupuestoIdFromParams) {
      const presupuestoId = parseInt(presupuestoIdFromParams);
      filtrados = filtrados.filter(item => item.presupuestoVentaId === presupuestoId);
    }

    return filtrados;
  }, [items, busqueda, presupuestoIdFromParams]);

  const itemsPerPage = 9;
  const totalPages = getTotalPages(itemsFiltrados.length, itemsPerPage);
  const visiblePages = 5;

  const itemsEnPagina = useMemo(() => paginateArray(itemsFiltrados, currentPage, itemsPerPage), [itemsFiltrados, currentPage, itemsPerPage]);

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);
  const pageNumbers = getPageNumbers(currentPage, totalPages, visiblePages);

  return (
    <>
      <div className='Container'>
        <div className="Sub-Container">
          <div className='Title-Container'>
            <h1 className="Ttitle">Items de Presupuesto</h1>
          </div>
          <div className="user-crud-container">
            {error && <p className="error-message">{error}</p>}

            <div className="search-container">
              <button className='add-button' onClick={openModal}>Añadir</button>
              <input
                type="text"
                placeholder="Buscar por ID presupuesto o ID item..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="search-input"
              />
              <span className='search-icon'><CiSearch /></span>
            </div>

            <div className="user-cards-container">
              {itemsEnPagina.length === 0 ? (
                <p className="no-data-message">No hay items de presupuesto.</p>
              ) : (
                itemsEnPagina.map(item => (
                  <div key={item.id} className="user-card" onClick={() => openViewModal(item)}>
                    <div className="user-card-info">
                      <div className="user-avatar"></div>
                      <div className="user-details">
                        <span className="user-name">Item #{item.id} - Presupuesto: {item.presupuestoVentaId}</span>
                        <span className="user-role">Qty: {item.cantidad} | Precio: ${formatNumber(item.precioUnitario)}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="edit-button" onClick={(e) => { e.stopPropagation(); openEditModal(item); }}>Editar</button>
                      <button className="cancel-button" onClick={(e) => { e.stopPropagation(); handleCancel(item.id); }}>Cancelar</button>
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
          inputs={createPresupuestoVentaItemFields(productos, presupuestos)}
          onSubmit={handleModalSubmit}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          Title={edit ? 'Editar Item' : 'Añadir Item'}
          View={view}
          setView={setView}
          defaultValues={selectedItem ? {
            presupuestoVentaId: selectedItem.presupuestoVentaId.toString(),
            productoId: selectedItem.productoId.toString(),
            cantidad: selectedItem.cantidad.toString(),
            precioUnitario: selectedItem.precioUnitario.toString(),
            activo: selectedItem.activo
          } : {}}
          onEdit={edit}
        />
      )}

      {view && selectedItem && (
        <div className="modal-overlay" onClick={() => setView(false)}>
          <div className="user-crud-form" onClick={e => e.stopPropagation()}>
            <button className="pregunta-close-button" onClick={() => setView(false)}>×</button>
            <h2 className="PTitle">Detalles del Item</h2>
            <div className='inputs-container'>
              {[
                { label: 'ID Item', value: selectedItem.id },
                { label: 'ID Presupuesto', value: selectedItem.presupuestoVentaId },
                { label: 'ID Producto', value: selectedItem.productoId },
                { label: 'Nombre Producto', value: productos.find(p => p.id === selectedItem.productoId)?.nombre ?? '—' },
                { label: 'Cantidad', value: selectedItem.cantidad },
                { label: 'Precio Unitario', value: `$${formatNumber(selectedItem.precioUnitario)}` },
                { label: 'Total', value: `$${formatNumber((selectedItem.cantidad * selectedItem.precioUnitario))}` },
                { label: 'Activo', value: selectedItem.activo ? 'Sí' : 'No' }
              ].map(item => (
                <div className="input-container" key={item.label}>
                  <label className="Plabel">{item.label}</label>
                  <p className="form-input input-full">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="form-buttons-container">
              <button className="submit-button" onClick={() => openEditModal(selectedItem)}>Editar</button>
              <button className="cancel-button" onClick={() => setView(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PresupuestoVentaItemCrud;
