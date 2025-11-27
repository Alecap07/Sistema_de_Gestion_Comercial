import { useEffect, useState } from "react";
import { Modal, type ModalField } from "../components/Modal";
import { CiSearch } from "react-icons/ci";
import { IoAdd, IoTrash } from "react-icons/io5";
import ToastContainer from "../components/ToastContainer";
import { useToast } from "../hooks/useToast";
import { type ClienteReadDTO } from "../types/cliente.types";
import type { NotasPedidoDTO } from "../types/notasPedido.types";
import type { NotaPedidoVentaItemDTO } from '../types/notasPedidoItem.types';
import { fetchAll, fetchById, create, update, handleApiError } from '../functions/api';
import { getPageNumbers, paginateArray, getTotalPages } from '../functions/pagination';
import { filterBySearch } from '../functions/filtering';
import "../styles/PersonaCrud.css";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const API_URL = "https://localhost:7230";
const API_URL_CLIENTES = "http://localhost:5300";
const API_URL_PRODUCTOS = "http://localhost:5080";

export default function NotasPedidoCrud() {
    const { toasts, addToast } = useToast();
    const navigate = useNavigate();
    const [notasPedido, setNotasPedido] = useState<NotasPedidoDTO[]>([]);
    const [selectedNotasPedido, setSelectedNotasPedido] = useState<NotasPedidoDTO | null>(null);
    const [clientes, setClientes] = useState<ClienteReadDTO[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState(false);
    const [edit, setEdit] = useState(false);
    const [id, setId] = useState(0);
    const [busqueda, setBusqueda] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const itemsPerPage = 8;
    const visiblePages = 5;

    // Items State
    const [items, setItems] = useState<Partial<NotaPedidoVentaItemDTO>[]>([]);
    const [deletedItems, setDeletedItems] = useState<Partial<NotaPedidoVentaItemDTO>[]>([]);
    const [productos, setProductos] = useState<{ id: number, nombre: string, precio: number }[]>([]);

    // ===== Obtener datos =====
    const fetchNotasPedido = async () => {
        try {
            const data = await fetchAll<NotasPedidoDTO>(`${API_URL}/api/notas-pedido`, addToast);
            setNotasPedido(data);
        } catch (error) {
            handleApiError(error, 'Error al obtener notas pedido', addToast);
        }
    };
    const fetchClientes = async () => {
        try {
            const data = await fetchAll<ClienteReadDTO>(`${API_URL_CLIENTES}/api/clientes`, addToast);
            setClientes(data);
        } catch (error) {
            handleApiError(error, 'Error al obtener clientes', addToast);
        }
    }

    const fetchProductos = async () => {
        try {
            const { data } = await axios.get(`${API_URL_PRODUCTOS}/api/productos`);
            const rawProducts = Array.isArray(data) ? data : (data && Array.isArray(data.value) ? data.value : []);

            const mappedProducts = rawProducts.map((p: any) => ({
                id: p.id,
                nombre: p.nombre,
                precio: p.precioVenta || 0
            }));
            setProductos(mappedProducts);
        } catch (error) {
            addToast("⚠️ No se pudieron cargar productos", "error");
        }
    }

    useEffect(() => {
        fetchNotasPedido();
        fetchClientes();
        fetchProductos();
    }, []);

    // ===== Obtener nota por ID y sus items =====
    const fetchNotasPedidoById = async (id: number, edit: boolean) => {
        try {
            const data = await fetchById<NotasPedidoDTO>(`${API_URL}/api/notas-pedido`, id, addToast);
            setSelectedNotasPedido(data);

            // Fetch items for this order
            try {
                const itemsData = await fetchAll<NotaPedidoVentaItemDTO>(`${API_URL}/api/notas-pedido/items/by-nota/${id}`, addToast);
                setItems(itemsData);
            } catch (err) {
                addToast("⚠️ No se encontraron items", "error");
                setItems([]);
            }
            setDeletedItems([]);

            setView(await edit);
            setIsOpen(true);
        } catch (error) {
            handleApiError(error, 'No se pudo obtener la notas pedido', addToast);
        }
    };

    const handleEditNotaPedido = () => {
        if (selectedNotasPedido) {
            setId(selectedNotasPedido.id);
            fetchNotasPedidoById(selectedNotasPedido.id, false);
            setView(false);
            setEdit(true);
            setShowOptionsModal(false);
        }
    };

    const openViewModal = (n: NotasPedidoDTO) => {
        setSelectedNotasPedido(n);
        // Also fetch items for view? Maybe not strictly necessary for just viewing the card, 
        // but if we want to show details we should. For now, just setting selected.
        // If we want to view details in modal, we should call fetchNotasPedidoById(n.id, true) but view=true
        // The original code just set selected and opened modal.
        // Let's fetch full details including items for view mode too if needed, 
        // but the current View implementation in Modal might not show custom children.
        // Let's stick to original behavior but populate items just in case.
        setId(n.id);
        fetchNotasPedidoById(n.id, true);
        setEdit(false);
        // setIsOpen(true) is called in fetchNotasPedidoById
    };

    // ===== Crear nueva =====
    const openCreateModal = () => {
        setSelectedNotasPedido(null);
        setItems([]);
        setDeletedItems([]);
        setView(false);
        setEdit(false);
        setIsOpen(true);
    };

    // ===== Campos base =====
    const notasPedidoFieldBase: ModalField[] = [
        {
            name: "clienteId", type: "select", label: "Cliente", required: true,
            options: clientes.map((n) => ({ value: n.id, label: n.codigo + " - " + n.personaId }))
        },
        { name: "observacion", type: "text", label: "Observacion", required: true, minLength: 1, maxLength: 100 },
        { name: "fecha", type: "date", label: "Fecha", required: true },
    ];

    // ===== Inputs del modal =====
    const modalInputs: ModalField[] = [
        ...notasPedidoFieldBase,
        ...(edit
            ? [
                {
                    name: 'activo', label: 'Activo', type: 'checkbox',
                } satisfies ModalField,
            ]
            : []),
    ];

    // ===== Valores por defecto =====
    const defaultValues = selectedNotasPedido ? {
        ...selectedNotasPedido,
        fecha: selectedNotasPedido.fecha ? selectedNotasPedido.fecha.split('T')[0] : '',
    } : {
        fecha: new Date().toISOString().split('T')[0]
    };

    // ===== Items Logic =====
    const addItem = () => {
        setItems([...items, { productoId: 0, cantidad: 1, precioUnitario: 0 }]);
    };

    const updateItem = (index: number, field: keyof NotaPedidoVentaItemDTO, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };

        // Auto-update price if product changes
        if (field === 'productoId') {
            const prod = productos.find(p => p.id === Number(value));
            if (prod) {
                newItems[index].precioUnitario = prod.precio;
            }
        }

        setItems(newItems);
    };

    const removeItem = (index: number) => {
        const itemToRemove = items[index];
        if (itemToRemove.id) {
            setDeletedItems([...deletedItems, itemToRemove]);
        }
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    // ===== Crear / Editar =====
    const handleModalSubmit = async (data: Record<string, any>) => {
        try {
            // Validate items
            if (items.length === 0) {
                addToast("❌ Debe agregar al menos un producto", "error");
                return;
            }
            for (const item of items) {
                if (!item.productoId || item.productoId <= 0) {
                    addToast("❌ Todos los items deben tener un producto seleccionado", "error");
                    return;
                }
                if (!item.cantidad || item.cantidad <= 0) {
                    addToast("❌ La cantidad debe ser mayor a 0", "error");
                    return;
                }
            }

            const payload = {
                clienteId: data.clienteId,
                observacion: data.observacion,
                fecha: data.fecha,
                activo: edit ? (data.activo === true || data.activo === 'true') : true,
            };

            let notaId = id;

            if (edit) {
                await update<NotasPedidoDTO>(`${API_URL}/api/notas-pedido`, id, payload, addToast);
            } else {
                const response = await axios.post(`${API_URL}/api/notas-pedido`, payload);
                // Assuming response.data is the ID or object with ID
                notaId = (typeof response.data === 'object' && response.data.id) ? response.data.id : response.data;
            }

            if (notaId) {
                // Handle Deleted Items
                for (const item of deletedItems) {
                    if (item.id) {
                        await update(`${API_URL}/api/notas-pedido/items`, item.id, { ...item, activo: false }, addToast);
                    }
                }

                // Handle Active Items
                for (const item of items) {
                    const itemPayload = {
                        notaPedidoVentaId: notaId,
                        productoId: item.productoId,
                        cantidad: item.cantidad,
                        precioUnitario: item.precioUnitario || 0, // Ensure price is sent
                        activo: true
                    };

                    if (item.id) {
                        await update(`${API_URL}/api/notas-pedido/items`, item.id, itemPayload, addToast);
                    } else {
                        await create(`${API_URL}/api/notas-pedido/items`, itemPayload, addToast);
                    }
                }
            }

            fetchNotasPedido();
            setIsOpen(false);
            setSelectedNotasPedido(null);
            setView(false);
        } catch (error) {
            handleApiError(error, edit ? 'Error al editar nota de pedido' : 'Error al crear nota de pedido', addToast);
        }
    };

    // ===== Filtrar marcas =====
    const notasPedidoFiltradas = filterBySearch(notasPedido, busqueda, ['clienteId', 'observacion']);

    const totalPages = getTotalPages(notasPedidoFiltradas.length, itemsPerPage);
    const notasPedidoPagina = paginateArray(notasPedidoFiltradas, currentPage, itemsPerPage);
    const pageNumbers = getPageNumbers(currentPage, totalPages, visiblePages);

    return (
        <>
            <div className='Container'>
                <div className="Sub-Container">
                    <div className="Title-Container">
                        <h1 className="Ttitle">Notas de Pedido</h1>
                    </div>

                    <div className="user-crud-container">
                        <div className="search-container">
                            <button className="add-button" onClick={openCreateModal}>
                                Añadir
                            </button>
                            <input
                                type="text"
                                placeholder="Buscar nota de pedido por nombre..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="search-input"
                            />
                            <span className="search-icon">
                                <CiSearch />
                            </span>
                        </div>

                        <div className="user-cards-container">
                            {notasPedidoPagina.length > 0 ? (
                                notasPedidoPagina.map((n) => (
                                    <div
                                        key={n.id}
                                        className="user-card"
                                        onClick={() => openViewModal(n)}
                                    >
                                        <div className="user-card-info">
                                            <div className="user-avatar"></div>
                                            <div className="user-details">
                                                <span className="user-name">{"Obs: " + n.observacion}</span>
                                                <p className="p-0">Estado: {n.activo ? "Activo" : "Inactivo"}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-row justify-center gap-2 mt-3">
                                            <button
                                                className="edit-button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedNotasPedido(n);
                                                    setShowOptionsModal(true);
                                                }}
                                            >
                                                Editar
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No hay notas de pedido registradas.</p>
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

            {/* Modal dinámico */}
            <Modal
                inputs={modalInputs}
                onSubmit={handleModalSubmit}
                isOpen={isOpen}
                setIsOpen={(v) => {
                    setIsOpen(v);
                    if (!v) {
                        setSelectedNotasPedido(null);
                        setView(false);
                        setEdit(false);
                    }
                }}
                Title={view ? "Ver Nota de Pedido" : edit ? "Editar Nota de Pedido" : "Crear Nota de Pedido"}
                View={view}
                setView={setView}
                defaultValues={defaultValues}
                onEdit={edit}
            >
                {/* Custom Items Section inside Modal */}
                <div className="items-section" style={{
                    marginTop: '20px',
                    borderTop: '1px solid var(--current-glass-border)',
                    paddingTop: '15px',
                    width: '100%',
                    gridColumn: '1 / -1'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3 className="PTitle" style={{ fontSize: '1.2rem', margin: 0, color: 'var(--current-accent-color)' }}>Items</h3>
                        {!view && (
                            <button type="button" className="add-button" onClick={addItem} style={{ padding: '8px 15px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <IoAdd /> Agregar Item
                            </button>
                        )}
                    </div>

                    <div style={{
                        overflowX: 'auto',
                        border: '1px solid var(--current-glass-border)',
                        borderRadius: 'var(--radius)',
                        background: 'rgba(0,0,0,0.05)'
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
                            <thead>
                                <tr style={{
                                    borderBottom: '1px solid var(--current-glass-border)',
                                    textAlign: 'left',
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    color: 'var(--current-accent-color)'
                                }}>
                                    <th style={{ padding: '12px', fontWeight: '600' }}>Producto</th>
                                    <th style={{ padding: '12px', width: '100px' }}>Cant.</th>
                                    <th style={{ padding: '12px', width: '120px' }}>Precio</th>
                                    <th style={{ padding: '12px', width: '120px' }}>Total</th>
                                    {!view && <th style={{ padding: '12px', width: '50px' }}></th>}
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid var(--current-glass-border)' }}>
                                        <td style={{ padding: '10px' }}>
                                            {productos.length > 0 ? (
                                                <select
                                                    className="form-input"
                                                    value={item.productoId}
                                                    onChange={e => updateItem(index, 'productoId', Number(e.target.value))}
                                                    style={{ width: '100%' }}
                                                    disabled={view}
                                                >
                                                    <option value={0}>Seleccionar...</option>
                                                    {productos.map(prod => (
                                                        <option key={prod.id} value={prod.id}>{prod.nombre}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type="number"
                                                    placeholder="ID"
                                                    className="form-input"
                                                    value={item.productoId}
                                                    onChange={e => updateItem(index, 'productoId', Number(e.target.value))}
                                                    style={{ width: '100%' }}
                                                    disabled={view}
                                                />
                                            )}
                                        </td>
                                        <td style={{ padding: '10px' }}>
                                            <input
                                                type="number"
                                                className="form-input"
                                                value={item.cantidad}
                                                onChange={e => updateItem(index, 'cantidad', Number(e.target.value))}
                                                style={{ width: '100%' }}
                                                disabled={view}
                                            />
                                        </td>
                                        <td style={{ padding: '10px' }}>
                                            <input
                                                type="number"
                                                className="form-input"
                                                value={item.precioUnitario}
                                                onChange={e => updateItem(index, 'precioUnitario', Number(e.target.value))}
                                                style={{ width: '100%' }}
                                                disabled={view}
                                            />
                                        </td>
                                        <td style={{ padding: '10px', color: 'var(--current-accent-color)', fontWeight: 'bold' }}>
                                            ${((item.cantidad || 0) * (item.precioUnitario || 0)).toFixed(2)}
                                        </td>
                                        {!view && (
                                            <td style={{ padding: '10px', textAlign: 'center' }}>
                                                <button type="button" onClick={() => removeItem(index)} style={{
                                                    color: '#ff4d4d',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    fontSize: '1.2rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <IoTrash />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                {items.length === 0 && (
                                    <tr>
                                        <td colSpan={view ? 4 : 5} style={{ padding: '20px', textAlign: 'center', color: 'var(--current-placeholder-color)' }}>
                                            No hay items agregados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Modal>

            {showOptionsModal && selectedNotasPedido && (
                <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }} onClick={() => setShowOptionsModal(false)}>
                    <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'absolute', inset: 0 }} />
                    <div className="user-crud-form" onClick={(e) => e.stopPropagation()} style={{ position: 'relative', zIndex: 10001, width: '90%', maxWidth: '400px', padding: '20px' }}>
                        <h3 className="PTitle" style={{ fontSize: '18px', marginBottom: '16px', textAlign: 'center' }}>¿Qué deseas hacer?</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button
                                className="submit-button"
                                onClick={handleEditNotaPedido}
                                style={{ width: '100%' }}
                            >
                                Editar Nota de Pedido
                            </button>
                            <button
                                className="submit-button"
                                onClick={() => navigate('/notas-credito')}
                                style={{ width: '100%' }}
                            >
                                Notas Pedido Credito
                            </button>
                            <button
                                className="submit-button"
                                onClick={() => navigate('/notas-debito')}
                                style={{ width: '100%' }}
                            >
                                Notas Pedido Debito
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer toasts={toasts} />
        </>
    );
}
