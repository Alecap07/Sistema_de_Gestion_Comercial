import axios, { AxiosError } from 'axios';

export type ToastFunction = (message: string, type: "success" | "error") => void;

/**
 * Generic function to fetch all items from an API endpoint
 * @param url - The API endpoint URL
 * @param addToast - Optional toast notification function
 * @returns Promise with array of items
 */
export async function fetchAll<T>(url: string, addToast?: ToastFunction): Promise<T[]> {
    try {
        const { data } = await axios.get(url);

        // Handle different response formats
        if (data && Array.isArray(data.value)) {
            return data.value;
        }
        if (Array.isArray(data)) {
            return data;
        }

        const warningMsg = `Formato de datos inesperado desde ${url}`;
        if (addToast) {
            addToast(`⚠️ ${warningMsg}`, "error");
        } else {
            console.warn(warningMsg, data);
        }
        return [];
    } catch (error) {
        const errorMsg = `Error al obtener datos desde ${url}`;
        if (addToast) {
            addToast(`❌ ${errorMsg}`, "error");
        } else {
            console.error(errorMsg, error);
        }
        throw error;
    }
}

/**
 * Generic function to fetch a single item by ID
 * @param url - The base API endpoint URL
 * @param id - The item ID
 * @param addToast - Optional toast notification function
 * @returns Promise with the item
 */
export async function fetchById<T>(url: string, id: number, addToast?: ToastFunction): Promise<T> {
    try {
        const { data } = await axios.get<T>(`${url}/${id}`);
        return data;
    } catch (error) {
        const errorMsg = `Error al obtener el elemento ${id}`;
        if (addToast) {
            addToast(`❌ ${errorMsg}`, "error");
        } else {
            console.error(`${errorMsg} from ${url}:`, error);
        }
        throw error;
    }
}

/**
 * Generic function to create a new item
 * @param url - The API endpoint URL
 * @param payload - The data to create
 * @param addToast - Optional toast notification function
 * @returns Promise with the created item
 */
export async function create<T>(url: string, payload: Partial<T>, addToast?: ToastFunction): Promise<T> {
    try {
        const { data } = await axios.post<T>(url, payload);
        if (addToast) {
            addToast("✅ Elemento creado exitosamente", "success");
        }
        return data;
    } catch (error) {
        const errorMsg = "Error al crear el elemento";
        if (addToast) {
            addToast(`❌ ${errorMsg}`, "error");
        } else {
            console.error(`${errorMsg} at ${url}:`, error);
        }
        throw error;
    }
}

/**
 * Generic function to update an existing item
 * @param url - The base API endpoint URL
 * @param id - The item ID
 * @param payload - The data to update
 * @param addToast - Optional toast notification function
 * @returns Promise with the updated item
 */
export async function update<T>(url: string, id: number, payload: Partial<T>, addToast?: ToastFunction): Promise<T> {
    try {
        const { data } = await axios.put<T>(`${url}/${id}`, payload);
        if (addToast) {
            addToast("✅ Elemento actualizado exitosamente", "success");
        }
        return data;
    } catch (error) {
        const errorMsg = `Error al actualizar el elemento ${id}`;
        if (addToast) {
            addToast(`❌ ${errorMsg}`, "error");
        } else {
            console.error(`${errorMsg} at ${url}:`, error);
        }
        throw error;
    }
}

/**
 * Generic function to delete an item
 * @param url - The base API endpoint URL
 * @param id - The item ID
 * @param addToast - Optional toast notification function
 */
export async function remove(url: string, id: number, addToast?: ToastFunction): Promise<void> {
    try {
        await axios.delete(`${url}/${id}`);
        if (addToast) {
            addToast("✅ Elemento eliminado exitosamente", "success");
        }
    } catch (error) {
        const errorMsg = `Error al eliminar el elemento ${id}`;
        if (addToast) {
            addToast(`❌ ${errorMsg}`, "error");
        } else {
            console.error(`${errorMsg} from ${url}:`, error);
        }
        throw error;
    }
}

/**
 * Generic function to partially update an existing item (PATCH)
 * @param url - The API endpoint URL (can include ID)
 * @param id - Optional item ID to append to URL
 * @param payload - Optional data to update
 * @param addToast - Optional toast notification function
 * @returns Promise with the updated item
 */
export async function patch<T>(url: string, id?: number, payload?: Partial<T>, addToast?: ToastFunction): Promise<T> {
    try {
        const requestUrl = id ? `${url}/${id}` : url;
        const { data } = await axios.patch<T>(requestUrl, payload);
        if (addToast) {
            addToast("✅ Elemento actualizado exitosamente", "success");
        }
        return data;
    } catch (error) {
        const errorMsg = "Error al actualizar el elemento";
        if (addToast) {
            addToast(`❌ ${errorMsg}`, "error");
        } else {
            console.error(`${errorMsg} at ${url}:`, error);
        }
        throw error;
    }
}

/**
 * Handle API errors with user-friendly messages
 * @param error - The error object
 * @param customMessage - Optional custom error message
 * @param addToast - Optional toast notification function
 */
export function handleApiError(error: unknown, customMessage?: string, addToast?: ToastFunction): void {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const message = customMessage || 'Ocurrió un error en la operación';

        if (axiosError.response) {
            // Server responded with error
            if (addToast) {
                addToast(`❌ ${message}`, "error");
            } else {
                console.error(`${message}:`, axiosError.response.data);
            }
        } else if (axiosError.request) {
            // Request made but no response
            const noResponseMsg = `${message}: Sin respuesta del servidor`;
            if (addToast) {
                addToast(`❌ ${noResponseMsg}`, "error");
            } else {
                console.error(noResponseMsg);
            }
        } else {
            // Error setting up request
            if (addToast) {
                addToast(`❌ ${message}`, "error");
            } else {
                console.error(`${message}:`, axiosError.message);
            }
        }
    } else {
        const errorMsg = customMessage || 'Error desconocido';
        if (addToast) {
            addToast(`❌ ${errorMsg}`, "error");
        } else {
            console.error(errorMsg, error);
        }
    }
}
