import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { IoAdd, IoTrash } from "react-icons/io5";
import "../styles/PersonaCrud.css";
import { facturasService } from "../services/facturasService";
import type { FacturaCompraDTO, FacturaCompraItemDTO } from "../types/facturas";
import axios from "axios";
import { Modal, type ModalField } from "../components/Modal";
import type { NotasPedidoDTO } from "../types/notasPedido.types";
import type { NotaPedidoVentaItemDTO } from "../types/notasPedidoItem.types";
import ToastContainer from "../components/ToastContainer";
import { useToast } from "../hooks/useToast";

// Helper for Proveedores
interface ProveedorSimple {
    id: number;
    razonSocial: string;
}

export default function Facturas() {
    const { toasts, addToast } = useToast();
    // State for List View
    const [facturas, setFacturas] = useState<FacturaCompraDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // State for Edit/Create View
    const [isEditing, setIsEditing] = useState(false);
    const [currentFactura, setCurrentFactura] = useState<FacturaCompraDTO | null>(null);
    const [proveedores, setProveedores] = useState<ProveedorSimple[]>([]);
    const [notasPedido, setNotasPedido] = useState<NotasPedidoDTO[]>([]);

    // Items State
    const [items, setItems] = useState<Partial<FacturaCompraItemDTO>[]>([]);
    const [deletedItems, setDeletedItems] = useState<Partial<FacturaCompraItemDTO>[]>([]);

    // Products for Item selection
    const [productos, setProductos] = useState<{ id: number, nombre: string, precio: number }[]>([]);

    useEffect(() => {
        fetchFacturas();
        fetchProveedores();
        fetchProductos();
        fetchNotasPedido();
    }, []);

    const fetchFacturas = async () => {
        setLoading(true);
        try {
            const data = await facturasService.getFacturasCompra();
            setFacturas(data);
        } catch (error) {
            addToast("⚠️ Error fetching facturas", "error");
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

    const fetchNotasPedido = async () => {
        try {
            const { data } = await axios.get("https://localhost:7230/api/notas-pedido");
            setNotasPedido(data);
        } catch (error) {
            addToast("⚠️ Error fetching notas pedido", "error");
        }
    };

    const handleCreateNew = () => {
        setCurrentFactura(null);
        setItems([]);
        setDeletedItems([]);
        setIsEditing(true);
    };

    const handleEdit = async (factura: FacturaCompraDTO) => {
        setCurrentFactura(factura);
        try {
            const itemsData = await facturasService.getFacturaCompraItems(factura.id);
            setItems(itemsData);
        } catch (error) {
            addToast("⚠️ Error fetching items", "error");
            setItems([]);
        }
        setDeletedItems([]);
        setIsEditing(true);
    };

    const handleFieldChange = async (name: string, value: any) => {
        if (name === 'notaPedidoVentaId' && value) {
            try {
                const { data } = await axios.get(`https://localhost:7230/api/notas-pedido/items/by-nota/${value}`);
                // Map NotaPedido items to Factura items
                const mappedItems: Partial<FacturaCompraItemDTO>[] = data.map((item: NotaPedidoVentaItemDTO) => ({
                    productoId: item.productoId,
                    cantidad: item.cantidad,
                    precioUnitario: item.precioUnitario,
                    activo: true
                }));
                setItems(mappedItems);
            } catch (error) {
                addToast("❌ Error al cargar los productos de la nota de pedido", "error");
            }
        }
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + ((item.cantidad || 0) * (item.precioUnitario || 0)), 0);
    };

    const handleSave = async (formData: Record<string, any>) => {
        const proveedorId = Number(formData.proveedorId);
        const fecha = formData.fecha;
        const numeroFactura = formData.numeroFactura;

        if (!proveedorId) {
            addToast("❌ Seleccione un proveedor", "error");
            return;
        }

        // Validar items
        if (items.length === 0) {
            addToast("❌ Debe agregar al menos un producto a la factura", "error");
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

        const total = calculateTotal();

        try {
            let facturaId = currentFactura?.id;

            if (currentFactura) {
                // Update
                await facturasService.updateFacturaCompra(currentFactura.id, {
                    proveedorId: proveedorId,
                    fecha: new Date(fecha).toISOString(),
                    numeroFactura: numeroFactura,
                    total: total,
                    activo: true
                });
            } else {
                // Create
                facturaId = await facturasService.createFacturaCompra({
                    proveedorId: proveedorId,
                    fecha: new Date(fecha).toISOString(),
                    numeroFactura: numeroFactura,
                    total: total
                });
            }

            if (facturaId) {
                // Handle Deleted Items (Soft Delete)
                for (const item of deletedItems) {
                    if (item.id && item.facturaId === facturaId) {
                        await facturasService.updateFacturaCompraItem(item.id, {
                            facturaId: facturaId,
                            productoId: item.productoId!,
                            cantidad: item.cantidad!,
                            precioUnitario: item.precioUnitario!,
                            activo: false
                        });
                    }
                }

                // Handle Active Items
                for (const item of items) {
                    if (item.id) {
                        // Update existing item
                        if (item.facturaId === facturaId) {
                            await facturasService.updateFacturaCompraItem(item.id, {
                                facturaId: facturaId,
                                productoId: item.productoId!,
                                cantidad: item.cantidad!,
                                precioUnitario: item.precioUnitario!,
                                activo: true
                            });
                        }
                    } else {
                        // Create new item
                        await facturasService.createFacturaCompraItem({
                            facturaId: facturaId,
                            productoId: item.productoId!,
                            cantidad: item.cantidad!,
                            precioUnitario: item.precioUnitario!
                        });
                    }
                }
            }

            addToast("✅ Guardado correctamente", "success");
            setIsEditing(false);
            fetchFacturas();
        } catch (error) {
            console.error("Error saving:", error);
            addToast("❌ Error al guardar", "error");
        }
    };

    const addItem = () => {
        setItems([...items, { productoId: 0, cantidad: 1, precioUnitario: 0 }]);
    };

    const updateItem = (index: number, field: keyof FacturaCompraItemDTO, value: any) => {
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
    const filteredFacturas = facturas.filter(f =>
        f.id.toString().includes(busqueda) ||
        f.numeroFactura?.toLowerCase().includes(busqueda.toLowerCase()) ||
        proveedores.find(p => p.id === f.proveedorId)?.razonSocial.toLowerCase().includes(busqueda.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filteredFacturas.length / itemsPerPage);
    const paginatedFacturas = filteredFacturas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
            name: "numeroFactura",
            label: "Número de Factura",
            type: "text",
            required: false
        },
        {
            name: "fecha",
            label: "Fecha",
            type: "date",
            required: true
        },
        {
            name: "notaPedidoVentaId",
            type: "select",
            label: "Nota Pedido (Cargar Productos)",
            required: false,
            options: notasPedido.map(np => ({ value: np.id, label: `ID: ${np.id} - ${new Date(np.fecha).toLocaleDateString()} - ${np.observacion}` }))
        }
    ];

    const defaultValues = currentFactura ? {
        proveedorId: currentFactura.proveedorId,
        numeroFactura: currentFactura.numeroFactura || "",
        fecha: currentFactura.fecha.split('T')[0]
    } : {
        fecha: new Date().toISOString().split('T')[0]
    };

    return (
        <div className='Container'>
            <div className="Sub-Container">
                <div className="Title-Container">
                    <h1 className="Ttitle">Facturas de Compra</h1>
                </div>

                <div className="user-crud-container">
                    <div className="search-container">
                        <button className="add-button" onClick={handleCreateNew}>
                            Añadir
                        </button>
                        <input
                            type="text"
                            placeholder="Buscar por ID, Número o Proveedor..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="search-input"
                        />
                        <span className="search-icon"><CiSearch /></span>
                    </div>

                    <div className="user-cards-container">
                        {loading ? <p>Cargando...</p> :
                            paginatedFacturas.length > 0 ? (
                                paginatedFacturas.map((factura) => (
                                    <div key={factura.id} className="user-card" onClick={() => handleEdit(factura)}>
                                        <div className="user-card-info">
                                            <div className="user-avatar" style={{}}></div>
                                            <div className="user-details">
                                                <span className="user-name">Factura #{factura.id}</span>
                                                <p className="p-0">Número: {factura.numeroFactura || "Sin número"}</p>
                                                <p className="p-0">Proveedor: {proveedores.find(p => p.id === factura.proveedorId)?.razonSocial || factura.proveedorId}</p>
                                                <p className="p-0">Fecha: {new Date(factura.fecha).toLocaleDateString()}</p>
                                                <p className="p-0">Total: ${factura.total.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-row justify-center gap-2 mt-3">
                                            <button
                                                className="edit-button"
                                                onClick={(e) => { e.stopPropagation(); handleEdit(factura); }}
                                            >
                                                Editar
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No hay facturas registradas.</p>
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
                Title={currentFactura ? `Editar Factura #${currentFactura.id}` : "Nueva Factura de Compra"}
                inputs={modalInputs}
                onSubmit={handleSave}
                View={false}
                setView={() => { }}
                defaultValues={defaultValues}
                onEdit={!!currentFactura}
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
                            <tfoot>
                                <tr style={{ borderTop: '2px solid var(--current-glass-border)', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                                    <td colSpan={3} style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: 'var(--current-accent-color)' }}>
                                        Total General:
                                    </td>
                                    <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--current-accent-color)', fontSize: '1.1rem' }}>
                                        ${calculateTotal().toFixed(2)}
                                    </td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </Modal>
            <ToastContainer toasts={toasts} />
        </div>
    );
}
