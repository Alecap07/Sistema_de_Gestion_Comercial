import axios from "axios";
import type {
    DevolucionVentaDTO,
    DevolucionVentaCreateDTO,
    DevolucionVentaUpdateDTO,
    DevolucionVentaItemDTO,
    DevolucionVentaItemCreateDTO,
    DevolucionVentaItemUpdateDTO,
} from "../types/devoluciones";

const API_URL = "http://localhost:5120"; // DevolucionesService Port

export const devolucionesService = {
    // Devoluciones
    getDevoluciones: async (includeInactive: boolean = false) => {
        const response = await axios.get<DevolucionVentaDTO[]>(
            `${API_URL}/api/devoluciones`,
            { params: { includeInactive } }
        );
        return response.data;
    },

    getDevolucionById: async (id: number) => {
        const response = await axios.get<DevolucionVentaDTO>(
            `${API_URL}/api/devoluciones/${id}`
        );
        return response.data;
    },

    createDevolucion: async (devolucion: DevolucionVentaCreateDTO) => {
        const response = await axios.post<number>(
            `${API_URL}/api/devoluciones`,
            devolucion
        );
        // The backend returns { id: number } or just the number depending on implementation. 
        // Based on controller: CreatedAtAction(nameof(GetById), new { id }, new { id }); -> returns { id: ... }
        // But let's handle both just in case or adjust if needed.
        // Actually the controller returns `new { id }` which is an object.
        // But axios.post<number> implies we expect a number. 
        // Let's check the controller again. It returns `new { id }`. 
        // So response.data will be { id: 1 }.
        return response.data;
    },

    updateDevolucion: async (id: number, devolucion: DevolucionVentaUpdateDTO) => {
        await axios.put(`${API_URL}/api/devoluciones/${id}`, devolucion);
    },

    cancelDevolucion: async (id: number) => {
        await axios.patch(`${API_URL}/api/devoluciones/${id}/cancelar`);
    },

    // Items
    getDevolucionItems: async (devolucionId: number) => {
        const response = await axios.get<DevolucionVentaItemDTO[]>(
            `${API_URL}/api/devoluciones/items/by-devolucion/${devolucionId}`
        );
        return response.data;
    },

    createDevolucionItem: async (item: DevolucionVentaItemCreateDTO) => {
        const response = await axios.post<number>(
            `${API_URL}/api/devoluciones/items`,
            item
        );
        return response.data;
    },

    updateDevolucionItem: async (id: number, item: DevolucionVentaItemUpdateDTO) => {
        await axios.put(`${API_URL}/api/devoluciones/items/${id}`, item);
    },

    cancelDevolucionItem: async (id: number) => {
        await axios.patch(`${API_URL}/api/devoluciones/items/${id}/cancelar`);
    }
};
