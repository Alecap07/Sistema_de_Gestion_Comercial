import { useEffect, useState } from "react";
import { Modal, type ModalField } from "../components/Modal";
import { CiSearch } from "react-icons/ci";
import ToastContainer from "../components/ToastContainer";
import { useToast } from "../hooks/useToast";
import type { NotaDebitoVentaReadDTO } from '../types/notaDebito.types';
import type { ClienteReadDTO } from '../types/cliente.types';
import type { NotasPedidoDTO } from '../types/notasPedido.types';
import { fetchAll, fetchById, create, update, handleApiError } from '../functions/api';
import { getPageNumbers, paginateArray, getTotalPages } from '../functions/pagination';
import { formatValueForInput } from '../functions/formatting';
import { filterByField } from '../functions/filtering';
import "../styles/PersonaCrud.css"; // Reusing existing styles

const API_URL = "https://localhost:7230";
const API_URL_DEBITO = "https://localhost:7100";
const API_URL_CLIENTES = "http://localhost:5300";

export default function NotasDebitoCrud() {
    const { toasts, addToast } = useToast();
    const [notas, setNotas] = useState<NotaDebitoVentaReadDTO[]>([]);
    const [clientes, setClientes] = useState<ClienteReadDTO[]>([]);
    const [notasPedido, setNotasPedido] = useState<NotasPedidoDTO[]>([]);
    const [selectedNota, setSelectedNota] = useState<NotaDebitoVentaReadDTO | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState(false);
    const [edit, setEdit] = useState(false);
    const [id, setId] = useState(0);
    const [busqueda, setBusqueda] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const visiblePages = 5;

    // ===== Obtener notas =====
    const fetchNotas = async () => {
        try {
            const data = await fetchAll<NotaDebitoVentaReadDTO>(`${API_URL_DEBITO}/api/notas-debito`, addToast);
            setNotas(data);
        } catch (error) {
            handleApiError(error, 'Error al obtener notas de débito', addToast);
        }
    };

    const fetchClientes = async () => {
        try {
            const data = await fetchAll<ClienteReadDTO>(`${API_URL_CLIENTES}/api/clientes`, addToast);
            setClientes(data);
        } catch (error) {
            handleApiError(error, 'Error al obtener clientes', addToast);
        }
    };

    const fetchNotasPedido = async () => {
        try {
            const data = await fetchAll<NotasPedidoDTO>(`${API_URL}/api/notas-pedido`, addToast);
            setNotasPedido(data);
        } catch (error) {
            handleApiError(error, 'Error al obtener notas de pedido', addToast);
        }
    };

    useEffect(() => {
        fetchNotas();
        fetchClientes();
        fetchNotasPedido();
    }, []);

    // ===== Obtener nota por ID =====
    const fetchNotaById = async (id: number, edit: boolean) => {
        try {
            const data = await fetchById<NotaDebitoVentaReadDTO>(`${API_URL_DEBITO}/api/notas-debito`, id, addToast);
            setSelectedNota(data);
            setView(await edit);
            setIsOpen(true);
        } catch (error) {
            handleApiError(error, 'No se pudo obtener la nota de débito', addToast);
        }
    };

    // ===== Crear nueva =====
    const openCreateModal = () => {
        setSelectedNota(null);
        setView(false);
        setEdit(false);
        setIsOpen(true);
    };

    // ===== Campos base =====
    const notaFieldBase: ModalField[] = [
        {
            name: "clienteId",
            type: "select",
            label: "Cliente",
            required: true,
            options: clientes.map(c => ({ value: c.id, label: `${c.codigo} - ID: ${c.id}` }))
        },
        { name: "fecha", type: "date", label: "Fecha", required: true },
        { name: "motivo", type: "text", label: "Motivo", required: false },
        { name: "monto", type: "number", label: "Monto", required: true },
        {
            name: "notaPedidoVentaId",
            type: "select",
            label: "Nota Pedido Venta",
            required: true,
            options: notasPedido.map(np => ({ value: np.id, label: `ID: ${np.id} - ${np.fecha.split('T')[0]} - ${np.observacion}` }))
        },
        { name: "activo", type: "checkbox", label: "Activo", defaultValue: true }
    ];

    // ===== Inputs del modal =====
    const modalInputs: ModalField[] = notaFieldBase.map((f) => {
        const base = { ...f } as ModalField;
        if (!selectedNota) {
            base.defaultValue = base.defaultValue ?? (base.type === "checkbox" ? false : "");
            return base;
        }
        const raw = (selectedNota as any)[f.name];
        const formatted = formatValueForInput(raw, f.type as string);

        base.defaultValue = formatted;
        (base as any).value = formatted;

        return base;
    });

    // ===== Crear / Editar =====
    const handleModalSubmit = async (data: Record<string, any>) => {
        try {
            const payload = {
                clienteId: Number(data.clienteId),
                fecha: data.fecha,
                motivo: data.motivo,
                monto: Number(data.monto),
                notaPedidoVentaId: data.notaPedidoVentaId ? Number(data.notaPedidoVentaId) : undefined,
                activo: !!data.activo,
            };

            if (edit) {
                await update<NotaDebitoVentaReadDTO>(`${API_URL_DEBITO}/api/notas-debito`, id, payload, addToast);
            } else {
                await create<NotaDebitoVentaReadDTO>(`${API_URL_DEBITO}/api/notas-debito`, payload, addToast);
            }

            fetchNotas();
            setIsOpen(false);
            setSelectedNota(null);
            setView(false);
        } catch (error) {
            handleApiError(error, edit ? 'Error al editar nota de débito' : 'Error al crear nota de débito', addToast);
        }
    };

    // ===== Filtrar notas =====
    const notasFiltradas = filterByField(notas, busqueda, 'motivo');

    const totalPages = getTotalPages(notasFiltradas.length, itemsPerPage);
    const notasPagina = paginateArray(notasFiltradas, currentPage, itemsPerPage);
    const pageNumbers = getPageNumbers(currentPage, totalPages, visiblePages);

    return (
        <>
            <div className='Container'>
                <div className="Sub-Container">
                    <div className="Title-Container">
                        <h1 className="Ttitle">Notas de Débito</h1>
                    </div>

                    <div className="user-crud-container">
                        <div className="search-container">
                            <button className="add-button" onClick={openCreateModal}>
                                Añadir
                            </button>
                            <input
                                type="text"
                                placeholder="Buscar por motivo..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="search-input"
                            />
                            <span className="search-icon">
                                <CiSearch />
                            </span>
                        </div>

                        <div className="user-cards-container">
                            {notasPagina.length > 0 ? (
                                notasPagina.map((n) => (
                                    <div
                                        key={n.id}
                                        className="user-card"
                                        onClick={() => {
                                            setId(n.id);
                                            fetchNotaById(n.id, true);
                                            setView(false);
                                            setEdit(true);
                                        }}
                                    >
                                        <div className="user-card-info">
                                            <div className="user-avatar"></div>
                                            <div className="user-details">
                                                <span className="user-name">ID: {n.id} - ${n.monto}</span>
                                                <p className="p-0">Cliente: {n.clienteId}</p>
                                                <p className="p-0">Fecha: {new Date(n.fecha).toLocaleDateString()}</p>
                                                <p className="p-0">Estado: {n.activo ? "Activo" : "Inactivo"}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-row justify-center gap-2 mt-3">
                                            <button
                                                className="edit-button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setId(n.id);
                                                    fetchNotaById(n.id, false);
                                                    setView(false);
                                                    setEdit(true);
                                                }}
                                            >
                                                Editar
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No hay notas de débito registradas.</p>
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
                        setSelectedNota(null);
                        setView(false);
                        setEdit(false);
                    }
                }}
                Title={view ? "Ver Nota de Débito" : edit ? "Editar Nota de Débito" : "Crear Nota de Débito"}
                View={view}
                setView={setView}
                defaultValues={{}}
                onEdit={edit}
            />
            <ToastContainer toasts={toasts} />
        </>
    );
}
