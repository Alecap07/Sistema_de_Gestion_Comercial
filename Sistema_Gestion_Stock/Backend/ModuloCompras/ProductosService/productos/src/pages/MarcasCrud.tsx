import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, type ModalField } from "../components/Modal";

const API_URL = "http://localhost:5080";

export interface MarcaDTO {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface MarcaCreateDTO {
  nombre: string;
}

export interface MarcaEditDTO {
  nombre: string;
  activo: boolean;
}

export default function MarcasCrud() {
  const [marcas, setMarcas] = useState<MarcaDTO[]>([]);
  const [marcaActual, setMarcaActual] = useState<MarcaDTO | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<boolean>(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Cargar todas las marcas al iniciar
  useEffect(() => {
    fetchMarcas();
  }, []);

  const fetchMarcas = async (id?: number) => {
    try {
      if (id) {
        const { data } = await axios.get<MarcaDTO>(`${API_URL}/api/marcas/${id}`);
        setMarcaActual(data);
      } else {
        const { data } = await axios.get<MarcaDTO[]>(`${API_URL}/api/marcas`);
        setMarcas(data);
      }
    } catch (error) {
      console.error("Error al obtener marcas:", error);
    }
  };

  // Crear
  const handleCreate = async (data: Record<string, any>) => {
    try {
      const dto: MarcaCreateDTO = { nombre: data.nombre };
      await axios.post(`${API_URL}/api/marcas`, dto);
      setIsOpen(false);
      fetchMarcas();
    } catch (error) {
      console.error("Error al crear marca:", error);
    }
  };

  // Editar
  const handleUpdate = async (data: Record<string, any>) => {
    if (!editId) return;
    try {
      const dto: MarcaEditDTO = {
        nombre: data.nombre,
        activo: !!data.activo,
      };
      await axios.put(`${API_URL}/api/marcas/${editId}`, dto);
      setIsOpen(false);
      setEditId(null);
      setMarcaActual(null);
      fetchMarcas();
    } catch (error) {
      console.error("Error al actualizar marca:", error);
    }
  };

  // Abrir modal para Editar
  const handleOpenModal = async (id: number) => {
    setEditId(id);
    await fetchMarcas(id);
    setIsOpen(true);
  };

  // Abrir modal para Crear
  const handleOpenCreateModal = () => {
    setEditId(null);
    setMarcaActual(null);
    setIsOpen(true);
  };

  // Campos dinámicos del modal
  const marcaInputs: ModalField[] = [
    {
      name: "nombre",
      label: "Nombre de la Marca",
      type: "text",
      required: true,
      placeholder: "Ejemplo: Samsung",
    },
  ];

  const marcaInputsE: ModalField[] = [
    {
      name: "nombre",
      label: "Nombre de la Marca",
      type: "text",
      required: true,
      placeholder: "Ejemplo: Samsung",
    },
    {
      name: "activo",
      label: "Activo",
      type: "checkbox",
    },
  ];

  return (
    <>
      <div className="bg-gray-50 min-h-screen flex flex-col items-center py-10 px-6">
        <h1 className="text-3xl font-bold text-violet-700 mb-8">
          Gestión de Marcas
        </h1>

        <button
          className="mb-6 bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-800 transition"
          onClick={handleOpenCreateModal}
        >
          + Nueva Marca
        </button>

        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-violet-100 text-violet-700">
              <tr>
                <th className="py-3 px-4 border-b">ID</th>
                <th className="py-3 px-4 border-b">Nombre</th>
                <th className="py-3 px-4 border-b">Activo</th>
                <th className="py-3 px-4 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {marcas.length > 0 ? (
                marcas.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{m.id}</td>
                    <td className="py-2 px-4 border-b">{m.nombre}</td>
                    <td className="py-2 px-4 border-b">
                      {m.activo ? "Sí" : "No"}
                    </td>
                    <td className="py-2 px-4 border-b space-x-2">
                      <button
                        onClick={() => handleOpenModal(m.id)}
                        className="text-green-600 hover:underline"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    No hay marcas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        inputs={editId ? marcaInputsE : marcaInputs}
        onSubmit={editId ? handleUpdate : handleCreate}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        Title={editId ? "Editar Marca" : "Registrar nueva marca"}
        View={view}
        setView={setView}
        defaultValues={marcaActual || {}} 
      />
    </>
  );
}
