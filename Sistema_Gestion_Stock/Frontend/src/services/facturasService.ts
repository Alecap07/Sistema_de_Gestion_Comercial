import axios from "axios";
import type {
    FacturaCompraDTO,
    FacturaCompraCreateDTO,
    FacturaCompraUpdateDTO,
    FacturaCompraItemDTO,
    FacturaCompraItemCreateDTO,
    FacturaCompraItemUpdateDTO
} from "../types/facturas";

const API_URL = "http://localhost:5100"; // FacturasService Port - ajustar según configuración

// ===== Facturas de Compra =====
const getFacturasCompra = async (): Promise<FacturaCompraDTO[]> => {
    const { data } = await axios.get(`${API_URL}/api/facturas-compra`);
    return Array.isArray(data) ? data : [];
};

const getFacturaCompraById = async (id: number): Promise<FacturaCompraDTO | null> => {
    try {
        const { data } = await axios.get(`${API_URL}/api/facturas-compra/${id}`);
        return data;
    } catch (error) {
        console.error(`Error fetching factura ${id}:`, error);
        return null;
    }
};

const createFacturaCompra = async (factura: FacturaCompraCreateDTO): Promise<number> => {
    const { data } = await axios.post(`${API_URL}/api/facturas-compra`, factura);
    return data;
};

const updateFacturaCompra = async (id: number, factura: FacturaCompraUpdateDTO): Promise<void> => {
    await axios.put(`${API_URL}/api/facturas-compra/${id}`, factura);
};

// ===== Items de Factura =====
const getFacturaCompraItems = async (facturaId: number): Promise<FacturaCompraItemDTO[]> => {
    const { data } = await axios.get(`${API_URL}/api/factura-compra-items`, {
        params: { facturaId }
    });
    return Array.isArray(data) ? data : [];
};

const createFacturaCompraItem = async (item: FacturaCompraItemCreateDTO): Promise<number> => {
    const { data } = await axios.post(`${API_URL}/api/factura-compra-items`, item);
    return data;
};

const updateFacturaCompraItem = async (id: number, item: FacturaCompraItemUpdateDTO): Promise<void> => {
    await axios.put(`${API_URL}/api/factura-compra-items/${id}`, item);
};

export const facturasService = {
    getFacturasCompra,
    getFacturaCompraById,
    createFacturaCompra,
    updateFacturaCompra,
    getFacturaCompraItems,
    createFacturaCompraItem,
    updateFacturaCompraItem
};
