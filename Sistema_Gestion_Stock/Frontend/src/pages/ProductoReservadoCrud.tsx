import { useEffect, useState, useCallback, useMemo } from 'react';
import { CiSearch } from "react-icons/ci";
import { Modal, type ModalField } from "../components/Modal";
import ToastContainer from "../components/ToastContainer";
import { useToast } from "../hooks/useToast";
import type { ProductoReservadoReadDTO, NotaPedidoDTO, ProductoDTO } from '../types/productoReservado.types';
import { fetchAll, create, update, patch, handleApiError } from '../functions/api';
import { getPageNumbers, paginateArray, getTotalPages } from '../functions/pagination';
import { filterBySearch } from '../functions/filtering';
import '../styles/PersonaCrud.css';
import '../styles/user.css';

const API_URL = 'http://localhost:5500';
const API_URL_NOTAS_PEDIDO = 'https://localhost:7230';
const API_URL_PRODUCTOS = 'http://localhost:5080';

function createProductoReservadoFields(notasPedido: NotaPedidoDTO[], productos: ProductoDTO[], isEdit: boolean): ModalField[] {
    return [
        {
            name: 'notaPedidoVentaId',
            label: 'Nota de Pedido',
            type: 'select',
            required: true,
            options: notasPedido.map(n => ({
                value: n.id.toString(),
                label: `ID: ${n.id} - ${n.observacion}`
            }))
        },
        {
            name: 'productoId',
            label: 'Producto',
            type: 'select',
            required: true,
            options: productos.map(p => ({
                value: p.id.toString(),
                label: `${p.codigo} - ${p.nombre}`
            }))
        },
        { name: 'cantidad', label: 'Cantidad', type: 'number', required: true, min: 1 },
        { name: 'fechaReserva', label: 'Fecha Reserva', type: 'date', required: true },
        ...(isEdit ? [{ name: 'activo', label: 'Activo', type: 'checkbox' } as ModalField] : [])
    ];
}

function ProductoReservadoCrud() {
    const { toasts, addToast } = useToast();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [reservas, setReservas] = useState<ProductoReservadoReadDTO[]>([]);
    const [notasPedido, setNotasPedido] = useState<NotaPedidoDTO[]>([]);
    const [productos, setProductos] = useState<ProductoDTO[]>([]);
    const [busqueda, setBusqueda] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [view, setView] = useState<boolean>(false);
    const [edit, setEdit] = useState<boolean>(false);
    const [selectedReserva, setSelectedReserva] = useState<ProductoReservadoReadDTO | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchReservas = useCallback(async () => {
        setError(null);
        try {
            const data = await fetchAll<ProductoReservadoReadDTO>(`${API_URL}/api/productos-reservados`, addToast);
            setReservas(data);
        } catch (error) {
            handleApiError(error, "Error al obtener reservas de productos", addToast);
        }
    }, [addToast]);

    const fetchNotasPedido = useCallback(async () => {
        try {
            const data = await fetchAll<NotaPedidoDTO>(`${API_URL_NOTAS_PEDIDO}/api/notas-pedido`, addToast);
            setNotasPedido(data);
        } catch (error) {
            addToast("❌ Error al obtener notas de pedido", "error");
        }
    }, [addToast]);

    const fetchProductos = useCallback(async () => {
        try {
            const data = await fetchAll<ProductoDTO>(`${API_URL_PRODUCTOS}/api/productos`, addToast);
            setProductos(data);
        } catch (error) {
            addToast("❌ Error al obtener productos", "error");
        }
    }, [addToast]);

    useEffect(() => {
        document.body.classList.add('user-crud-page');
        fetchReservas();
        fetchNotasPedido();
        fetchProductos();
        return () => document.body.classList.remove('user-crud-page');
    }, [fetchReservas, fetchNotasPedido, fetchProductos]);

    const handleModalSubmit = async (formData: Record<string, any>) => {
        setError(null);
        const isEditing = edit && selectedReserva?.id;

        const dataToSend = {
            notaPedidoVentaId: parseInt(formData.notaPedidoVentaId),
            productoId: parseInt(formData.productoId),
            cantidad: parseInt(formData.cantidad),
            fechaReserva: formData.fechaReserva,
            activo: isEditing ? (formData.activo === true || formData.activo === 'true') : true,
        };

        try {
            if (isEditing) {
                await update<ProductoReservadoReadDTO>(`${API_URL}/api/productos-reservados`, selectedReserva!.id, dataToSend, addToast);
            } else {
                await create<ProductoReservadoReadDTO>(`${API_URL}/api/productos-reservados`, dataToSend, addToast);
            }
            setIsOpen(false);
            setView(false);
            setEdit(false);
            setSelectedReserva(null);
            fetchReservas();
        } catch (err) {
            handleApiError(err, isEditing ? 'Error al actualizar reserva' : 'Error al crear reserva', addToast);
        }
    };

    const handleCancel = async (id: number) => {
        if (!confirm('¿Desea cancelar esta reserva?')) return;
        setError(null);
        try {
            await patch(`${API_URL}/api/productos-reservados/${id}/cancelar`, undefined, undefined, addToast);
            fetchReservas();
        } catch (err) {
            handleApiError(err, 'Error al cancelar reserva', addToast);
        }
    };

    const openModal = () => {
        setSelectedReserva(null);
        setEdit(false);
        setView(false);
        setIsOpen(true);
    };

    const openViewModal = (reserva: ProductoReservadoReadDTO) => {
        setSelectedReserva(reserva);
        setView(true);
        setEdit(false);
        setIsOpen(false);
    };

    const openEditModal = (reserva: ProductoReservadoReadDTO) => {
        setSelectedReserva(reserva);
        setEdit(true);
        setView(false);
        setIsOpen(true);
    };

    const reservasFiltradas = useMemo(() => {
        return filterBySearch(reservas, busqueda, ['id', 'notaPedidoVentaId', 'productoId']);
    }, [reservas, busqueda]);

    const itemsPerPage = 9;
    const totalPages = getTotalPages(reservasFiltradas.length, itemsPerPage);
    const visiblePages = 5;

    const reservasPagina = useMemo(() => paginateArray(reservasFiltradas, currentPage, itemsPerPage), [reservasFiltradas, currentPage, itemsPerPage]);

    const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);
    const pageNumbers = getPageNumbers(currentPage, totalPages, visiblePages);

    const getProductoNombre = (productoId: number) => {
        const producto = productos.find(p => p.id === productoId);
        return producto ? `${producto.codigo} - ${producto.nombre}` : `ID: ${productoId}`;
    };

    const getNotaPedidoInfo = (notaId: number) => {
        const nota = notasPedido.find(n => n.id === notaId);
        return nota ? `ID: ${nota.id} - ${nota.observacion}` : `ID: ${notaId}`;
    };

    return (
        <>
            <div className='Container'>
                <div className="Sub-Container">
                    <div className='Title-Container'>
                        <h1 className="Ttitle">Productos Reservados</h1>
                    </div>
                    <div className="user-crud-container">
                        {error && <p className="error-message">{error}</p>}

                        <div className="search-container">
                            <button className='add-button' onClick={openModal}>Añadir</button>
                            <input
                                type="text"
                                placeholder="Buscar por ID..."
                                value={busqueda}
                                onChange={e => setBusqueda(e.target.value)}
                                className="search-input"
                            />
                            <span className='search-icon'><CiSearch /></span>
                        </div>

                        <div className="user-cards-container">
                            {reservasPagina.length === 0 ? (
                                <p className="no-data-message">No hay reservas encontradas.</p>
                            ) : (
                                reservasPagina.map(r => (
                                    <div key={r.id} className="user-card" onClick={() => openViewModal(r)}>
                                        <div className="user-card-info">
                                            <div className="user-avatar"></div>
                                            <div className="user-details">
                                                <span className="user-name">Reserva #{r.id} - Cant: {r.cantidad}</span>
                                                <span className="user-role">{getProductoNombre(r.productoId)}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="edit-button" onClick={(e) => { e.stopPropagation(); openEditModal(r); }}>Editar</button>
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
                    inputs={createProductoReservadoFields(notasPedido, productos, edit)}
                    onSubmit={handleModalSubmit}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    Title={edit ? 'Editar Reserva' : 'Crear Reserva'}
                    View={view}
                    setView={setView}
                    defaultValues={selectedReserva ? {
                        notaPedidoVentaId: selectedReserva.notaPedidoVentaId.toString(),
                        productoId: selectedReserva.productoId.toString(),
                        cantidad: selectedReserva.cantidad,
                        fechaReserva: selectedReserva.fechaReserva.split('T')[0],
                        activo: selectedReserva.activo
                    } : {}}
                    onEdit={edit}
                />
            )}

            {view && selectedReserva && (
                <div className="modal-overlay" onClick={() => setView(false)}>
                    <div className="user-crud-form" onClick={e => e.stopPropagation()}>
                        <button className="pregunta-close-button" onClick={() => setView(false)}>×</button>
                        <h2 className="PTitle">Detalles de la Reserva</h2>
                        <div className='inputs-container'>
                            {[
                                { label: 'ID Reserva', value: selectedReserva.id },
                                { label: 'Nota de Pedido', value: getNotaPedidoInfo(selectedReserva.notaPedidoVentaId) },
                                { label: 'Producto', value: getProductoNombre(selectedReserva.productoId) },
                                { label: 'Cantidad', value: selectedReserva.cantidad },
                                { label: 'Fecha Reserva', value: new Date(selectedReserva.fechaReserva).toLocaleDateString() },
                                { label: 'Estado', value: selectedReserva.activo ? 'Activo' : 'Cancelado' },
                            ].map(item => (
                                <div className="input-container" key={item.label}>
                                    <label className="Plabel">{item.label}</label>
                                    <p className="form-input input-full">{item.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="form-buttons-container">
                            {selectedReserva.activo && (
                                <button className="submit-button" onClick={() => openEditModal(selectedReserva)}>Editar</button>
                            )}
                            <button className="cancel-button" onClick={() => setView(false)}>Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer toasts={toasts} />
        </>
    );
}

export default ProductoReservadoCrud;
