import { useState, useEffect, useCallback, useMemo } from "react";
import { CiSearch } from "react-icons/ci";
import { IoAdd, IoTrash } from "react-icons/io5";
import "../styles/PersonaCrud.css";
import type { OrdenCompraDTO, OrdenCompraItemDTO } from "../types/compras";
import { Modal, type ModalField } from "../components/Modal";
import { fetchAll, create, update, handleApiError } from '../functions/api';
import { getPageNumbers, paginateArray, getTotalPages } from '../functions/pagination';
import ToastContainer from "../components/ToastContainer";
import { useToast } from "../hooks/useToast";

// Helper for Proveedores
interface ProveedorSimple {
    id: number;
    razonSocial: string;
}

const API_URL = "http://localhost:5000";
const API_URL_PROVEEDORES = "http://localhost:5090";
const API_URL_PRODUCTOS = "http://localhost:5080";

export default function Compras() {
    const { toasts, addToast } = useToast();
    // State for List View
    const [ordenes, setOrdenes] = useState<OrdenCompraDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // State for Edit/Create View
    const [isEditing, setIsEditing] = useState(false);
    const [currentOrden, setCurrentOrden] = useState<OrdenCompraDTO | null>(null);
    const [proveedores, setProveedores] = useState<ProveedorSimple[]>([]);

    // Items State
    const [items, setItems] = useState<Partial<OrdenCompraItemDTO>[]>([]);
    const [deletedItems, setDeletedItems] = useState<Partial<OrdenCompraItemDTO>[]>([]);

    // Products for Item selection
    const [productos, setProductos] = useState<{ id: number, nombre: string, precio: number }[]>([]);

    const fetchOrdenes = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchAll<OrdenCompraDTO>(`${API_URL}/api/ordenes-compra`, addToast);
            setOrdenes(data);
        } catch (error) {
            handleApiError(error, "Error fetching ordenes", addToast);
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    const fetchProveedores = useCallback(async () => {
        try {
            const data = await fetchAll<ProveedorSimple>(`${API_URL_PROVEEDORES}/api/proveedores`, addToast);
            setProveedores(data);
        } catch (error) {
            addToast("⚠️ Error fetching proveedores", "error");
        }
    }, [addToast]);

    const fetchProductos = useCallback(async () => {
        try {
            const data = await fetchAll<{ id: number, nombre: string, precio: number }>(`${API_URL_PRODUCTOS}/api/productos`, addToast);
            setProductos(data);
        } catch (error) {
            addToast("⚠️ Could not fetch products", "error");
        }
    }, [addToast]);

    useEffect(() => {
        fetchOrdenes();
        fetchProveedores();
        fetchProductos();
    }, [fetchOrdenes, fetchProveedores, fetchProductos]);

    const handleCreateNew = () => {
        setCurrentOrden(null);
        setItems([]);
        setDeletedItems([]);
        setIsEditing(true);
    };

    const handleEdit = async (orden: OrdenCompraDTO) => {
        setCurrentOrden(orden);
        try {
            const itemsData = await fetchAll<OrdenCompraItemDTO>(`${API_URL}/api/orden-compra-items?ordenCompraId=${orden.id}`, addToast);
            setItems(itemsData);
        } catch (error) {
            addToast("⚠️ Error fetching items", "error");
            setItems([]);
        }
        setDeletedItems([]);
        setIsEditing(true);
    };

    const handleSave = async (formData: Record<string, any>) => {
        const proveedorId = Number(formData.proveedorId);
        const fecha = formData.fecha;
        const estado = formData.estado;
        const observacion = formData.observacion;

        if (!proveedorId) {
            addToast("❌ Seleccione un proveedor", "error");
            return;
        }

        if (items.length === 0) {
            addToast("❌ Debe agregar al menos un producto a la orden", "error");
            return;
        }

        for (const item of items) {
            if (!item.productoId || item.productoId <= 0) {
                addToast("❌ Todos los items deben tener un producto seleccionado", "error");
                return;
            }
            if (!item.cantidad || item.cantidad <= 0) {
                addToast("❌ La cantidad de los productos debe ser mayor a 0", "error");
                return;
            }
        }

        try {
            let ordenId = currentOrden?.id;

            if (currentOrden) {
                // Update
                await update(
                    `${API_URL}/api/ordenes-compra`,
                    currentOrden.id,
                    {
                        proveedorId: proveedorId,
                        fecha: new Date(fecha).toISOString(),
                        estado: estado,
                        observacion: observacion,
                        activo: true
                    },
                    addToast
                );
            } else {
                // Create
                const response = await create<number>(`${API_URL}/api/ordenes-compra`, {
                    proveedorId: proveedorId,
                    fecha: new Date(fecha).toISOString(),
                    estado: estado,
                    observacion: observacion
                } as any, addToast);
                ordenId = response;
            }

            if (ordenId) {
                // Handle Deleted Items (Soft Delete)
                for (const item of deletedItems) {
                    if (item.id && item.ordenCompraId === ordenId) {
                        await update(`${API_URL}/api/orden-compra-items`, item.id, {
                            ordenCompraId: ordenId,
                            productoId: item.productoId!,
                            cantidad: item.cantidad!,
                            precioUnitario: item.precioUnitario!,
                            activo: false
                        }, addToast);
                    }
                }

                // Handle Active Items
                for (const item of items) {
                    if (item.id) {
                        // Update existing item
                        if (item.ordenCompraId === ordenId) {
                            await update(`${API_URL}/api/orden-compra-items`, item.id, {
                                ordenCompraId: ordenId,
                                productoId: item.productoId!,
                                cantidad: item.cantidad!,
                                precioUnitario: item.precioUnitario!,
                                activo: true
                            }, addToast);
                        }
                    } else {
                        // Create new item
                        await create(`${API_URL}/api/orden-compra-items`, {
                            ordenCompraId: ordenId,
                            productoId: item.productoId!,
                            cantidad: item.cantidad!,
                            precioUnitario: item.precioUnitario!
                        } as any, addToast);
                    }
                }
            }

            addToast("✅ Guardado correctamente", "success");
            setIsEditing(false);
            fetchOrdenes();
        } catch (error) {
            handleApiError(error, "Error al guardar", addToast);
        }
    };

    const addItem = () => {
        setItems([...items, { productoId: 0, cantidad: 1, precioUnitario: 0 }]);
    };

    const updateItem = (index: number, field: keyof OrdenCompraItemDTO, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
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

    const filteredOrdenes = useMemo(() => {
        return ordenes.filter(o =>
            o.id.toString().includes(busqueda) ||
            proveedores.find(p => p.id === o.proveedorId)?.razonSocial.toLowerCase().includes(busqueda.toLowerCase())
        );
    }, [ordenes, busqueda, proveedores]);

    const totalPages = getTotalPages(filteredOrdenes.length, itemsPerPage);
    const paginatedOrdenes = useMemo(() => paginateArray(filteredOrdenes, currentPage, itemsPerPage), [filteredOrdenes, currentPage, itemsPerPage]);
    const pageNumbers = getPageNumbers(currentPage, totalPages, 5);

    const modalInputs: ModalField[] = [
        {
            name: "proveedorId",
            label: "Proveedor",
            type: "select",
            required: true,
            options: proveedores.map(p => ({ label: p.razonSocial, value: p.id.toString() }))
        },
        {
            name: "fecha",
            label: "Fecha",
            type: "date",
            required: true
        },
        {
            name: "estado",
            label: "Estado",
            type: "select",
            required: true,
            options: [
                { label: "Pendiente", value: "Pendiente" },
                { label: "Aprobada", value: "Aprobada" },
                { label: "Rechazada", value: "Rechazada" },
                { label: "Finalizada", value: "Finalizada" }
            ]
        },
        {
            name: "observacion",
            label: "Observación",
            type: "text",
            required: false
        }
    ];

    const defaultValues = currentOrden ? {
        proveedorId: currentOrden.proveedorId.toString(),
        fecha: currentOrden.fecha.split('T')[0],
        estado: currentOrden.estado,
        observacion: currentOrden.observacion
    } : {
        fecha: new Date().toISOString().split('T')[0],
        estado: "Pendiente"
    };

    return (
        <div className='Container'>
            <div className="Sub-Container">
                <div className="Title-Container">
                    <h1 className="Ttitle">Compras</h1>
                </div>

                <div className="user-crud-container">
                    <div className="search-container">
                        <button className="add-button" onClick={handleCreateNew}>
                            Añadir
                        </button>
                        <input
                            type="text"
                            placeholder="Buscar por ID o Proveedor..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="search-input"
                        />
                        <span className="search-icon"><CiSearch /></span>
                    </div>

                    <div className="user-cards-container">
                        {loading ? <p>Cargando...</p> :
                            paginatedOrdenes.length > 0 ? (
                                paginatedOrdenes.map((orden) => (
                                    <div key={orden.id} className="user-card" onClick={() => handleEdit(orden)}>
                                        <div className="user-card-info">
                                            <div className="user-avatar"></div>
                                            <div className="user-details">
                                                <span className="user-name">Orden #{orden.id}</span>
                                                <p className="p-0">Proveedor: {proveedores.find(p => p.id === orden.proveedorId)?.razonSocial || orden.proveedorId}</p>
                                                <p className="p-0">Fecha: {new Date(orden.fecha).toLocaleDateString()}</p>
                                                <p className="p-0">Estado: {orden.estado}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-row justify-center gap-2 mt-3">
                                            <button
                                                className="edit-button"
                                                onClick={(e) => { e.stopPropagation(); handleEdit(orden); }}
                                            >
                                                Editar
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No hay ordenes registradas.</p>
                            )}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>&lt;</button>
                            {pageNumbers.map(page => (
                                <button key={page} className={currentPage === page ? 'active' : ''} onClick={() => setCurrentPage(page)}>{page}</button>
                            ))}
                            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>&gt;</button>
                        </div>
                    )}
                </div>
            </div>

            <Modal
                isOpen={isEditing}
                setIsOpen={setIsEditing}
                Title={currentOrden ? `Editar Orden #${currentOrden.id}` : "Nueva Orden de Compra"}
                inputs={modalInputs}
                onSubmit={handleSave}
                View={false}
                setView={() => { }}
                defaultValues={defaultValues}
                onEdit={!!currentOrden}
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
                        <button type="button" className="add-button" onClick={addItem} style={{ padding: '8px 15px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <IoAdd /> Agregar Item
                        </button>
                    </div>

                    <div style={{
                        overflowX: 'auto',
                        border: '1px solid var(--current-glass-border)',
                        borderRadius: 'var(--radius)',
                        background: 'rgba(0,0,0,0.05)'
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
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
                                    <th style={{ padding: '12px', width: '50px' }}></th>
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
                                            />
                                        </td>
                                        <td style={{ padding: '10px' }}>
                                            <input
                                                type="number"
                                                className="form-input"
                                                value={item.precioUnitario}
                                                onChange={e => updateItem(index, 'precioUnitario', Number(e.target.value))}
                                                style={{ width: '100%' }}
                                            />
                                        </td>
                                        <td style={{ padding: '10px', color: 'var(--current-accent-color)', fontWeight: 'bold' }}>
                                            ${((item.cantidad || 0) * (item.precioUnitario || 0)).toFixed(2)}
                                        </td>
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
                                    </tr>
                                ))}
                                {items.length === 0 && (
                                    <tr>
                                        <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: 'var(--current-placeholder-color)' }}>
                                            No hay items agregados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Modal>
            <ToastContainer toasts={toasts} />
        </div>
    );
}
