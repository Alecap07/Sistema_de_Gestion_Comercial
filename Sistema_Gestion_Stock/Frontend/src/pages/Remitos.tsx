import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { IoAdd, IoTrash } from "react-icons/io5";
import "../styles/PersonaCrud.css";
import { remitosService } from "../services/remitosService";
import type { RemitoDTO, RemitoItemDTO } from "../types/remitos";
import type { OrdenCompraDTO } from "../types/compras";
import axios from "axios";
import { Modal, type ModalField } from "../components/Modal";
import ToastContainer from "../components/ToastContainer";
import { useToast } from "../hooks/useToast";

// Helper for Proveedores
interface ProveedorSimple {
    id: number;
    razonSocial: string;
}

export default function Remitos() {
    const { toasts, addToast } = useToast();
    // State for List View
    const [remitos, setRemitos] = useState<RemitoDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // State for Edit/Create View
    const [isEditing, setIsEditing] = useState(false);
    const [currentRemito, setCurrentRemito] = useState<RemitoDTO | null>(null);
    const [proveedores, setProveedores] = useState<ProveedorSimple[]>([]);
    const [ordenesCompra, setOrdenesCompra] = useState<OrdenCompraDTO[]>([]);

    // Items State
    const [items, setItems] = useState<Partial<RemitoItemDTO>[]>([]);
    const [deletedItems, setDeletedItems] = useState<Partial<RemitoItemDTO>[]>([]);

    // Products for Item selection
    const [productos, setProductos] = useState<{ id: number, nombre: string, precio: number }[]>([]);

    useEffect(() => {
        fetchRemitos();
        fetchProveedores();
        fetchProductos();
    }, []);

    const fetchRemitos = async () => {
        setLoading(true);
        try {
            const data = await remitosService.getRemitos();
            setRemitos(data);
        } catch (error) {
            addToast("⚠️ Error fetching remitos", "error");
        } finally {
            setLoading(false);
        }
    };

    const fetchProveedores = async () => {
        try {
            const { data } = await axios.get("http://localhost:5090/api/proveedores");
            const provs = Array.isArray(data.value) ? data.value : (Array.isArray(data) ? data : []);
            setProveedores(provs);
        } catch (error) {
            addToast("⚠️ Error fetching proveedores", "error");
        }
    };

    const fetchProductos = async () => {
        try {
            const { data } = await axios.get("http://localhost:5080/api/productos");
            const rawProducts = Array.isArray(data) ? data : (data && Array.isArray(data.value) ? data.value : []);

            const mappedProducts = rawProducts.map((p: any) => ({
                id: p.id,
                nombre: p.nombre,
                precio: p.precioVenta || 0
            }));
            setProductos(mappedProducts);
        } catch (error) {
            addToast("⚠️ Could not fetch products", "error");
        }
    }

    const fetchOrdenesCompra = async (proveedorId: number) => {
        try {
            // Fetch Approved orders for the selected provider
            const { data } = await axios.get(`http://localhost:5000/api/ordenes-compra`, {
                params: { proveedorId, estado: 'Aprobada' }
            });
            setOrdenesCompra(data);
        } catch (error) {
            addToast("⚠️ Error fetching ordenes compra", "error");
            setOrdenesCompra([]);
        }
    };

    const handleCreateNew = () => {
        setCurrentRemito(null);
        setItems([]);
        setDeletedItems([]);
        setOrdenesCompra([]); // Reset orders
        setIsEditing(true);
    };

    const handleEdit = async (remito: RemitoDTO) => {
        setCurrentRemito(remito);
        try {
            const itemsData = await remitosService.getRemitoItems(remito.id);
            setItems(itemsData);
            // Fetch orders for the provider of this remito
            if (remito.proveedorId) {
                await fetchOrdenesCompra(remito.proveedorId);
            }
        } catch (error) {
            addToast("⚠️ Error fetching items", "error");
            setItems([]);
        }
        setDeletedItems([]);
        setIsEditing(true);
    };

    const handleFieldChange = (name: string, value: any) => {
        if (name === 'proveedorId' && value) {
            fetchOrdenesCompra(Number(value));
        }
    };

    const handleSave = async (formData: Record<string, any>) => {
        const proveedorId = Number(formData.proveedorId);
        const fecha = formData.fecha;
        const observacion = formData.observacion || null;
        const ordenCompraId = formData.ordenCompraId ? Number(formData.ordenCompraId) : null;

        if (!proveedorId) {
            addToast("❌ Seleccione un proveedor", "error");
            return;
        }

        // Validar items
        if (items.length === 0) {
            addToast("❌ Debe agregar al menos un producto al remito", "error");
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
            let remitoId = currentRemito?.id;

            if (currentRemito) {
                // Update
                await remitosService.updateRemito(currentRemito.id, {
                    proveedorId: proveedorId,
                    fecha: new Date(fecha).toISOString(),
                    observacion: observacion,
                    ordenCompraId: ordenCompraId,
                    activo: true
                });
            } else {
                // Create
                remitoId = await remitosService.createRemito({
                    proveedorId: proveedorId,
                    fecha: new Date(fecha).toISOString(),
                    observacion: observacion,
                    ordenCompraId: ordenCompraId
                });
            }

            if (remitoId) {
                // Handle Deleted Items (Soft Delete)
                for (const item of deletedItems) {
                    if (item.id && item.remitoId === remitoId) {
                        await remitosService.updateRemitoItem(item.id, {
                            remitoId: remitoId,
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
                        if (item.remitoId === remitoId) {
                            await remitosService.updateRemitoItem(item.id, {
                                remitoId: remitoId,
                                productoId: item.productoId!,
                                cantidad: item.cantidad!,
                                activo: true
                            });
                        }
                    } else {
                        // Create new item
                        await remitosService.createRemitoItem({
                            remitoId: remitoId,
                            productoId: item.productoId!,
                            cantidad: item.cantidad!
                        });
                    }
                }
            }

            addToast("✅ Guardado correctamente", "success");
            setIsEditing(false);
            fetchRemitos();
        } catch (error) {
            console.error("Error saving:", error);
            addToast("❌ Error al guardar", "error");
        }
    };

    const addItem = () => {
        setItems([...items, { productoId: 0, cantidad: 1 }]);
    };

    const updateItem = (index: number, field: keyof RemitoItemDTO, value: any) => {
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
    const filteredRemitos = remitos.filter(r =>
        r.id.toString().includes(busqueda) ||
        r.observacion?.toLowerCase().includes(busqueda.toLowerCase()) ||
        proveedores.find(p => p.id === r.proveedorId)?.razonSocial.toLowerCase().includes(busqueda.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filteredRemitos.length / itemsPerPage);
    const paginatedRemitos = filteredRemitos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Modal Configuration
    const modalInputs: ModalField[] = [
        {
            name: "proveedorId",
            label: "Proveedor",
            type: "select",
            required: true,
            options: proveedores.map(p => ({ label: p.razonSocial, value: p.id }))
        },
        {
            name: "ordenCompraId",
            label: "Orden de Compra (Opcional)",
            type: "select",
            required: false,
            options: ordenesCompra.map(o => ({ label: `Orden #${o.id} - ${new Date(o.fecha).toLocaleDateString()}`, value: o.id })),
            disabled: ordenesCompra.length === 0
        },
        {
            name: "fecha",
            label: "Fecha",
            type: "date",
            required: true
        },
        {
            name: "observacion",
            label: "Observación",
            type: "text",
            required: false
        }
    ];

    const defaultValues = currentRemito ? {
        proveedorId: currentRemito.proveedorId,
        ordenCompraId: currentRemito.ordenCompraId,
        fecha: currentRemito.fecha.split('T')[0],
        observacion: currentRemito.observacion || ""
    } : {
        fecha: new Date().toISOString().split('T')[0]
    };

    return (
        <div className='Container'>
            <div className="Sub-Container">
                <div className="Title-Container">
                    <h1 className="Ttitle">Remitos de Compra</h1>
                </div>

                <div className="user-crud-container">
                    <div className="search-container">
                        <button className="add-button" onClick={handleCreateNew}>
                            Añadir
                        </button>
                        <input
                            type="text"
                            placeholder="Buscar por ID, Observación o Proveedor..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="search-input"
                        />
                        <span className="search-icon"><CiSearch /></span>
                    </div>

                    <div className="user-cards-container">
                        {loading ? <p>Cargando...</p> :
                            paginatedRemitos.length > 0 ? (
                                paginatedRemitos.map((remito) => (
                                    <div key={remito.id} className="user-card" onClick={() => handleEdit(remito)}>
                                        <div className="user-card-info">
                                            <div className="user-avatar" style={{}}></div>
                                            <div className="user-details">
                                                <span className="user-name">Remito #{remito.id}</span>
                                                <p className="p-0">Proveedor: {proveedores.find(p => p.id === remito.proveedorId)?.razonSocial || remito.proveedorId}</p>
                                                <p className="p-0">Fecha: {new Date(remito.fecha).toLocaleDateString()}</p>
                                                {remito.ordenCompraId && <p className="p-0">Orden Compra: #{remito.ordenCompraId}</p>}
                                                {remito.observacion && <p className="p-0">Obs: {remito.observacion}</p>}
                                            </div>
                                        </div>
                                        <div className="flex flex-row justify-center gap-2 mt-3">
                                            <button
                                                className="edit-button"
                                                onClick={(e) => { e.stopPropagation(); handleEdit(remito); }}
                                            >
                                                Editar
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No hay remitos registrados.</p>
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
                Title={currentRemito ? `Editar Remito #${currentRemito.id}` : "Nuevo Remito de Compra"}
                inputs={modalInputs}
                onSubmit={handleSave}
                View={false}
                setView={() => { }}
                defaultValues={defaultValues}
                onEdit={!!currentRemito}
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
            <ToastContainer toasts={toasts} />
        </div>
    );
}
