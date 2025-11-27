import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Modal, type ModalField } from "../components/Modal";

const API_URL = "http://localhost:5080";

export interface CategoriaDTO {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface CategoriaCreateDTO {
  nombre: string;
}

export interface CategoriaUpdateDTO {
  nombre: string;
  activo: boolean;
}

export default function CategoriasCrud() {
  const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<CategoriaDTO | null>(null);

  // ======== CARGAR CATEGORÍAS AL MONTAR ========
  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const { data } = await axios.get<CategoriaDTO[]>(`${API_URL}/api/categorias`);
      setCategorias(data);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  // ======== CREAR CATEGORÍA ========
  const handleCreate = async (data: Record<string, any>) => {
    try {
      const dto: CategoriaCreateDTO = { nombre: data.nombre };
      await axios.post(`${API_URL}/api/categorias`, dto);
      setIsOpen(false);
      fetchCategorias();
    } catch (error) {
      console.error("Error al crear categoría:", error);
    }
  };

  // ======== ACTUALIZAR CATEGORÍA ========
  const handleUpdate = async (data: Record<string, any>) => {
    if (!selectedCategoria) return;
    try {
      const dto: CategoriaUpdateDTO = {
        nombre: data.nombre,
        activo: !!data.activo,
      };
      await axios.put(`${API_URL}/api/categorias/${selectedCategoria.id}`, dto);
      setIsOpen(false);
      setEditMode(false);
      setSelectedCategoria(null);
      fetchCategorias();
    } catch (error) {
      console.error("Error al actualizar categoría:", error);
    }
  };

  // ======== OBTENER UNA CATEGORÍA POR ID ========
  const fetchCategoriaById = async (id: number) => {
    try {
      const { data } = await axios.get<CategoriaDTO>(`${API_URL}/api/categorias/${id}`);
      setSelectedCategoria(data);
      setIsOpen(true);
    } catch (error) {
      console.error("Error al obtener la categoría:", error);
    }
  };

  // ======== CAMPOS PARA EL MODAL ========
  const categoriaInputs: ModalField[] = [
    {
      name: "nombre",
      label: "Nombre de la Categoría",
      type: "text",
      required: true,
      placeholder: "Ejemplo: Bebidas",
    },
  ];

  const categoriaInputsEdit: ModalField[] = [
    ...categoriaInputs,
    {
      name: "activo",
      label: "Activo",
      type: "checkbox",
    },
  ];

  // ======== DEFAULT VALUES SEGÚN SELECCIÓN ========
  const defaultValues = useMemo(() => {
    return selectedCategoria
      ? { nombre: selectedCategoria.nombre, activo: selectedCategoria.activo }
      : {};
  }, [selectedCategoria]);

  // ======== HANDLER DE SUBMIT SEGÚN MODO ========
  const handleSubmit = editMode ? handleUpdate : handleCreate;

  // ======== RENDER ========
  return (
    <>
      <div className="bg-gray-50 min-h-screen flex flex-col items-center py-10 px-6">
        <h1 className="text-3xl font-bold text-violet-700 mb-8">Gestión de Categorías</h1>

        <button
          className="mb-6 bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-800 transition"
          onClick={() => {
            setSelectedCategoria(null);
            setEditMode(false);
            setIsOpen(true);
          }}
        >
          + Nueva Categoría
        </button>

        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
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
              {categorias.length > 0 ? (
                categorias.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{c.id}</td>
                    <td className="py-2 px-4 border-b">{c.nombre}</td>
                    <td className="py-2 px-4 border-b">{c.activo ? "Sí" : "No"}</td>
                    <td className="py-2 px-4 border-b flex gap-2">
                      <button
                        onClick={() => {
                          setEditMode(true);
                          fetchCategoriaById(c.id);
                        }}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    No hay categorías registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        inputs={editMode ? categoriaInputsEdit : categoriaInputs}
        onSubmit={handleSubmit}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        Title={editMode ? "Editar categoría" : "Registrar nueva categoría"}
        View={false}
        setView={() => {}}
        defaultValues={defaultValues || {}}
      />
    </>
  );
}
