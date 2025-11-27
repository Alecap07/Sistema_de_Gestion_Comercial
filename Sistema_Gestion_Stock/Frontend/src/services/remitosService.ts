import axios from 'axios';
import type {
    RemitoDTO,
    RemitoCreateDTO,
    RemitoUpdateDTO,
    RemitoItemDTO,
    RemitoItemCreateDTO,
    RemitoItemUpdateDTO
} from '../types/remitos';

const API_BASE_URL = 'http://localhost:5110';

// Remitos (Header) API calls
export const remitosService = {
    // Get all remitos
    getRemitos: async (): Promise<RemitoDTO[]> => {
        const response = await axios.get(`${API_BASE_URL}/api/remitos`);
        return response.data;
    },

    // Get remito by ID
    getRemitoById: async (id: number): Promise<RemitoDTO> => {
        const response = await axios.get(`${API_BASE_URL}/api/remitos/${id}`);
        return response.data;
    },

    // Create new remito
    createRemito: async (data: RemitoCreateDTO): Promise<number> => {
        const response = await axios.post(`${API_BASE_URL}/api/remitos`, data);
        return response.data;
    },

    // Update remito
    updateRemito: async (id: number, data: RemitoUpdateDTO): Promise<void> => {
        await axios.put(`${API_BASE_URL}/api/remitos/${id}`, data);
    },

    // Get remito items by remito ID
    getRemitoItems: async (remitoId: number): Promise<RemitoItemDTO[]> => {
        const response = await axios.get(`${API_BASE_URL}/api/remito-items`, {
            params: { remitoId }
        });
        return response.data;
    },

    // Create remito item
    createRemitoItem: async (data: RemitoItemCreateDTO): Promise<number> => {
        const response = await axios.post(`${API_BASE_URL}/api/remito-items`, data);
        return response.data;
    },

    // Update remito item
    updateRemitoItem: async (id: number, data: RemitoItemUpdateDTO): Promise<void> => {
        await axios.put(`${API_BASE_URL}/api/remito-items/${id}`, data);
    }
};
