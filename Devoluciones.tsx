import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { IoAdd, IoTrash } from "react-icons/io5";
import "../styles/PersonaCrud.css";
import { devolucionesService } from "../services/devolucionesService";
import type { DevolucionVentaDTO, DevolucionVentaItemDTO } from "../types/devoluciones";
import axios from "axios";
import { Modal, type ModalField } from "../components/Modal";

// Helper for Clientes
interface ClienteSimple {
    id: number;
    personaId: number;
    codigo: string;
    limiteCredito: number;
    descuento: number;
    formasPago: string;
    observacion?: string;
    activo: boolean;
}

export default function Devoluciones() {
    // State for List View
    const [devoluciones, setDevoluciones] = useState<DevolucionVentaDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // State for Edit/Create View
    const [isEditing, setIsEditing] = useState(false);
    const [currentDevolucion, setCurrentDevolucion] = useState<DevolucionVentaDTO | null>(null);
    const [clientes, setClientes] = useState<ClienteSimple[]>([]);
    // Notas de Pedido (Sales Orders) - Placeholder as service is not yet identified
    const [notasPedido, setNotasPedido] = useState<{ id: number, fecha: string }[]>([]);

    // Items State
    const [items, setItems] = useState<Partial<DevolucionVentaItemDTO>[]>([]);
    const [deletedItems, setDeletedItems] = useState<Partial<DevolucionVentaItemDTO>[]>([]);

    // Products for Item selection
    const [productos, setProductos] = useState<{ id: number, nombre: string, precio: number }[]>([]);

    useEffect(() => {
        fetchDevoluciones();
        fetchClientes();
        fetchProductos();
    }, []);

    const fetchDevoluciones = async () => {
        setLoading(true);
        try {
            const data = await devolucionesService.getDevoluciones();
            setDevoluciones(data);
        } catch (error) {
            console.error("Error fetching devoluciones:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchClientes = async () => {
        try {
            const { data } = await axios.get("http://localhost:5300/api/clientes");
            // ClientesService returns array directly, not wrapped in .value
            const clients = Array.isArray(data) ? data : [];
            setClientes(clients);
        } catch (error) {
            console.error("Error fetching clientes:", error);
        }
    };

    const fetchProductos = async () => {
        try {
            const { data } = await axios.get("http://localhost:5080/api/productos");
            if (Array.isArray(data)) setProductos(data);
            else if (data && Array.isArray(data.value)) setProductos(data.value);
        } catch (error) {
            console.warn("Could not fetch products");
        }
    }

    const fetchNotasPedido = async (clienteId: number) => {
        // Placeholder: If we find the service, we would fetch orders here.
        // For now, we clear it or maybe fetch from a hypothetical endpoint.
        setNotasPedido([]);
    };

    const handleCreateNew = () => {
        setCurrentDevolucion(null);
        setItems([]);
        setDeletedItems([]);
        setNotasPedido([]);
        setIsEditing(true);
    };

    const handleEdit = async (devolucion: DevolucionVentaDTO) => {
        setCurrentDevolucion(devolucion);
        try {
            const itemsData = await devolucionesService.getDevolucionItems(devolucion.id);
            setItems(itemsData);
            if (devolucion.clienteId) {
                await fetchNotasPedido(devolucion.clienteId);
            }
        } catch (error) {
            console.error("Error fetching items:", error);
            setItems([]);
        }
        setDeletedItems([]);
        setIsEditing(true);
    };

    const handleFieldChange = (name: string, value: any) => {
        if (name === 'clienteId' && value) {
            // Use setTimeout to avoid setState during render
            setTimeout(() => {
                fetchNotasPedido(Number(value));
            }, 0);
        }
    };

    const handleSave = async (formData: Record<string, any>) => {
        const clienteId = Number(formData.clienteId);
        const fecha = formData.fecha;
        const motivo = formData.motivo || undefined;
        const notaPedidoVentaId = formData.notaPedidoVentaId ? Number(formData.notaPedidoVentaId) : undefined;

        if (!clienteId) {
            alert("Seleccione un cliente");
            return;
        }

        // Validar items
        if (items.length === 0) {
            alert("Debe agregar al menos un producto a la devolución");
            return;
        }

        for (const item of items) {
            if (!item.productoId || item.productoId <= 0) {
                alert("Todos los items deben tener un producto seleccionado");
                return;
            }
            if (!item.cantidad || item.cantidad <= 0) {
                alert("La cantidad de los productos debe ser mayor a 0");
                return;
            }
        }

        try {
            let devolucionId = currentDevolucion?.id;

            if (currentDevolucion) {
                // Update
                await devolucionesService.updateDevolucion(currentDevolucion.id, {
                    clienteId: clienteId,
                    fecha: new Date(fecha).toISOString(),
                    motivo: motivo,
                    notaPedidoVentaId: notaPedidoVentaId,
                    activo: true
                });
            } else {
                // Create
                const response = await devolucionesService.createDevolucion({
                    clienteId: clienteId,
                    fecha: new Date(fecha).toISOString(),
                    motivo: motivo,
                    notaPedidoVentaId: notaPedidoVentaId
                });
                // Handle response which might be an object { id: ... } or number
                devolucionId = (typeof response === 'object' && response !== null && 'id' in response) ? (response as any).id : response;
            }

            if (devolucionId) {
                // Handle Deleted Items (Soft Delete)
                for (const item of deletedItems) {
                    if (item.id && item.devolucionVentaId === devolucionId) {
                        await devolucionesService.updateDevolucionItem(item.id, {
                            devolucionVentaId: devolucionId,
                            productoId: item.productoId!,
                            cantidad: item.cantidad!,
                            activo: false
                        });
                    }
                }

                // Handle Active Items
                for (const item of items) {
                    if (item.id) {
                        // Update existing item
                        if (item.devolucionVentaId === devolucionId) {
                            await devolucionesService.updateDevolucionItem(item.id, {
                                devolucionVentaId: devolucionId,
                                productoId: item.productoId!,
                                cantidad: item.cantidad!,
                                activo: true
                            });
                        }
                    } else {
                        // Create new item
                        await devolucionesService.createDevolucionItem({
                            devolucionVentaId: devolucionId,
                            productoId: item.productoId!,
                            cantidad: item.cantidad!
                        });
                    }
                }
            }

            alert("Guardado correctamente");
            setIsEditing(false);
            fetchDevoluciones();
        } catch (error) {
            console.error("Error saving:", error);
            alert("Error al guardar");
        }
    };

    const addItem = () => {
        setItems([...items, { productoId: 0, cantidad: 1 }]);
    };

    const updateItem = (index: number, field: keyof DevolucionVentaItemDTO, value: any) => {
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

    // Filter logic
    const filteredDevoluciones = devoluciones.filter(d =>
        d.id.toString().includes(busqueda) ||
        d.motivo?.toLowerCase().includes(busqueda.toLowerCase()) ||
        clientes.find(c => c.id === d.clienteId)?.codigo.toLowerCase().includes(busqueda.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filteredDevoluciones.length / itemsPerPage);
    const paginatedDevoluciones = filteredDevoluciones.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Modal Configuration
    const modalInputs: ModalField[] = [
        {
            name: "clienteId",
            label: "Cliente",
            type: "select",
            required: true,
            options: clientes.map(c => ({ label: `${c.codigo} (ID: ${c.id})`, value: c.id }))
        },
        {
            name: "notaPedidoVentaId",
            label: "Nota de Pedido (Opcional)",
            type: "select",
            required: false,
            options: notasPedido.map(n => ({ label: `Pedido #${n.id} - ${new Date(n.fecha).toLocaleDateString()}`, value: n.id })),
            disabled: notasPedido.length === 0
        },
        {
            name: "fecha",
            label: "Fecha",
            type: "date",
            required: true
        },
        {
            name: "motivo",
            label: "Motivo",
            type: "text",
            required: false
        }
    ];

    const defaultValues = currentDevolucion ? {
        clienteId: currentDevolucion.clienteId,
        notaPedidoVentaId: currentDevolucion.notaPedidoVentaId,
        fecha: currentDevolucion.fecha.split('T')[0],
        motivo: currentDevolucion.motivo || ""
    } : {
        fecha: new Date().toISOString().split('T')[0]
    };

    return (
        <div className='Container'>
            <div className="Sub-Container">
                <div className="Title-Container">
                    <h1 className="Ttitle">Devoluciones de Venta</h1>
                </div>

                <div className="user-crud-container">
                    <div className="search-container">
                        <button className="add-button" onClick={handleCreateNew}>
                            Añadir
                        </button>
                        <input
                            type="text"
                            placeholder="Buscar por ID, Motivo o Cliente..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="search-input"
                        />
                        <span className="search-icon"><CiSearch /></span>
                    </div>

                    <div className="user-cards-container">
                        {loading ? <p>Cargando...</p> :
                            paginatedDevoluciones.length > 0 ? (
                                paginatedDevoluciones.map((devolucion) => (
                                    <div key={devolucion.id} className="user-card" onClick={() => handleEdit(devolucion)}>
                                        <div className="user-card-info">
                                            <div className="user-avatar" style={{}}></div>
                                            <div className="user-details">
                                                <span className="user-name">Devolución #{devolucion.id}</span>
                                                <p className="p-0">Cliente: {clientes.find(c => c.id === devolucion.clienteId)?.codigo || `ID: ${devolucion.clienteId}`}</p>
                                                <p className="p-0">Fecha: {new Date(devolucion.fecha).toLocaleDateString()}</p>
                                                {devolucion.notaPedidoVentaId && <p className="p-0">Nota Pedido: #{devolucion.notaPedidoVentaId}</p>}
                                                {devolucion.motivo && <p className="p-0">Motivo: {devolucion.motivo}</p>}
                                            </div>
                                        </div>
                                        <div className="flex flex-row justify-center gap-2 mt-3">
                                            <button
                                                className="edit-button"
                                                onClick={(e) => { e.stopPropagation(); handleEdit(devolucion); }}
                                            >
                                                Editar
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No hay devoluciones registradas.</p>
                            )}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>&lt;</button>
                            <span>{currentPage} de {totalPages}</span>
                            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>&gt;</button>
                        </div>
                    )}
                </div>
            </div>

            <Modal
                isOpen={isEditing}
                setIsOpen={setIsEditing}
                Title={currentDevolucion ? `Editar Devolución #${currentDevolucion.id}` : "Nueva Devolución"}
                inputs={modalInputs}
                onSubmit={handleSave}
                View={false}
                setView={() => { }}
                defaultValues={defaultValues}
                onEdit={!!currentDevolucion}
                onFieldChange={handleFieldChange}
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
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
                            <thead>
                                <tr style={{
                                    borderBottom: '1px solid var(--current-glass-border)',
                                    textAlign: 'left',
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    color: 'var(--current-accent-color)'
                                }}>
                                    <th style={{ padding: '12px', fontWeight: '600' }}>Producto</th>
                                    <th style={{ padding: '12px', width: '150px' }}>Cantidad</th>
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
                                        <td colSpan={3} style={{ padding: '20px', textAlign: 'center', color: 'var(--current-placeholder-color)' }}>
                                            No hay items agregados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
