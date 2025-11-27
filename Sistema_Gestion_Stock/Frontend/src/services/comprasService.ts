import axios from "axios";
import type {
    OrdenCompraDTO,
    OrdenCompraCreateDTO,
    OrdenCompraUpdateDTO,
    OrdenCompraItemDTO,
    OrdenCompraItemCreateDTO,
    OrdenCompraItemUpdateDTO,
} from "../types/compras";

const API_URL = "http://localhost:5000"; // ComprasService Port

export const comprasService = {
    // Ordenes de Compra
    getOrdenesCompra: async (
        proveedorId?: number,
        estado?: string,
        fechaDesde?: string,
        fechaHasta?: string,
        estadoFiltro: number = 1 // 1 = Activos
    ) => {
        const params = new URLSearchParams();
        if (proveedorId) params.append("proveedorId", proveedorId.toString());
        if (estado) params.append("estado", estado);
        if (fechaDesde) params.append("fechaDesde", fechaDesde);
        if (fechaHasta) params.append("fechaHasta", fechaHasta);
        params.append("estadoFiltro", estadoFiltro.toString());

        const response = await axios.get<OrdenCompraDTO[]>(
            `${API_URL}/api/ordenes-compra`,
            { params }
        );
        return response.data;
    },

    getOrdenCompraById: async (id: number) => {
        const response = await axios.get<OrdenCompraDTO>(
            `${API_URL}/api/ordenes-compra/${id}`
        );
        return response.data;
    },

    createOrdenCompra: async (orden: OrdenCompraCreateDTO) => {
        const response = await axios.post<number>(
            `${API_URL}/api/ordenes-compra`,
            orden
        );
        return response.data;
    },

    updateOrdenCompra: async (id: number, orden: OrdenCompraUpdateDTO) => {
        await axios.put(`${API_URL}/api/ordenes-compra/${id}`, orden);
    },

    // Items de Orden de Compra
    getOrdenCompraItems: async (ordenCompraId: number) => {
        const response = await axios.get<OrdenCompraItemDTO[]>(
            `${API_URL}/api/orden-compra-items`,
            { params: { ordenCompraId } }
        );
        return response.data;
    },

    getOrdenCompraItemById: async (id: number) => {
        const response = await axios.get<OrdenCompraItemDTO>(
            `${API_URL}/api/orden-compra-items/${id}`
        );
        return response.data;
    },

    createOrdenCompraItem: async (item: OrdenCompraItemCreateDTO) => {
        const response = await axios.post<number>(
            `${API_URL}/api/orden-compra-items`,
            item
        );
        return response.data;
    },

    updateOrdenCompraItem: async (id: number, item: OrdenCompraItemUpdateDTO) => {
        await axios.put(`${API_URL}/api/orden-compra-items/${id}`, item);
    },
};
