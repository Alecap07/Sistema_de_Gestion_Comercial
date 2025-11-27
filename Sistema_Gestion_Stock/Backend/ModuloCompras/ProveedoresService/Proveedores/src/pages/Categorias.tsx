import { useState, useEffect } from "react";
import { Modal, type ModalField } from "../components/Modal";
import { CiSearch } from "react-icons/ci";
import axios from "axios";
import "../styles/PersonaCrud.css";

const API_URL = "http://localhost:5090";

export interface CategoriaDTO {
  id?: number;
  nombre: string;
  descripcion?: string;
  activo : boolean;
}

export default function Categoria() {
  const [currentPage, setCurrentPage] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [id, setId] = useState<number | null>(null);
  const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<CategoriaDTO | null>(null);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(false);
  const [edit, setEdit] = useState(false);
  const itemsPerPage = 8;
  const visiblePages = 5;

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async (Id? : number) => {
    try {
      if(Id){
      const { data } = await axios.get(`${API_URL}/api/categorias/${Id}`);
      setSelectedCategoria(data);
      } else{
      const { data } = await axios.get(`${API_URL}/api/categorias`);
      if (data && Array.isArray(data.value)) {
        setCategorias(data.value);
      } else if (Array.isArray(data)) {
        setCategorias(data);
      } else {
        setCategorias([]);
      }
      }
    } catch (error) {
      console.error("Error al obtener categorias:", error);
    }
  };
  const CategoriasFieldBase: ModalField[] = [
    { name: "nombre", type: "text", label: "Nombre", minLength: 1, maxLength: 50, required: true },
    { name: "descripcion", type: "text", label: "Descripcion", minLength: 1, maxLength: 50, required: true },
    { name: "activo", type: "checkbox", label: "Activo" },
  ];
  const categoriasFiltrados = categorias.filter((prov) =>
    [prov.nombre, prov.descripcion]
      .some((field) =>
        field?.toString()
      .toLowerCase()
      .replace(/\s/g, '')
      .includes(busqueda.toLowerCase().replace(/\s/g, '')) 
      )
  );
  const handleModalSubmit = async (data: Record<string, any>) => {
    try {
      const payload : CategoriaDTO = {
        id: Number(data.personaId),
        nombre: data.nombre,
        descripcion: data.descripcion,
        activo: !!data.activo
      };
      if (edit) {
        await axios.put(`${API_URL}/api/categorias/${id}`, payload);
        } else {
        await axios.post(`${API_URL}/api/categorias`, payload);
      }
      alert(edit ? "Categoria editada correctamente" : "Categoria creada correctamente");
      fetchCategorias();
      setOpen(false);
      setSelectedCategoria(null);
      setView(false);
    } catch (error) {
      console.error(edit ? "Error al editar la categoria:" : "Error al crear categoria:", error);
      alert("Error al crear categoria. Revisa la consola.");
    }
  };

  const handleViewCategoria = async (id : number | undefined) =>{
    setView(true);
    setEdit(false);
    if(id != null){
      setId(id);
      await fetchCategorias(id);
    }
    setOpen(true);
  }

  const handleAddCategoria = () =>{
    setEdit(false); 
    setSelectedCategoria(null); 
    setView(false); 
    setOpen(true);
  }
  const handleEditCategoria = async (id : number | undefined) =>{
    setView(false); 
    setEdit(true);
    fetchCategorias(id); 
    if(id != null){
      setId(id);
      await fetchCategorias(id);
    }
    setOpen(true);
  }

  const totalPages = Math.ceil(categoriasFiltrados.length / itemsPerPage);
  const categoriasPagina = categoriasFiltrados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getPageNumbers = () => {
    let startPage = Math.max(currentPage - Math.floor(visiblePages / 2), 1);
    let endPage = startPage + visiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - visiblePages + 1, 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <>
    <div className="Sub-Container">
        <div className='Title-Container'>
          <h1 className="Ttitle">Categoria</h1>
        </div>
      <div className="user-crud-container">
        <div className="search-container">
          <button className='add-button' onClick={() =>{handleAddCategoria();}}>Añadir</button>
          <input
            type="text"
            placeholder="Buscar categoria..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="search-input"
          />
          <span className='search-icon'><CiSearch /></span>
        </div>

        <div className="user-cards-container">
          {categoriasPagina.length > 0 ? (
            categoriasPagina.map((prov) => (
              <div key={prov.id} onClick={() => {handleViewCategoria(prov.id);}} className="user-card">
                <div className="user-card-info">
                  <div className="user-avatar"></div>
                  <div className="user-details">
                    <span className="user-name">{prov.nombre}</span>
                    <span className="user-role">
                      <p className="p-0">Descripcion: {prov.descripcion} </p>
                    </span>
                  </div>
                </div>
                <button 
                className="edit-button" 
                onClick={(e) =>{
                e.stopPropagation();
                handleEditCategoria(prov.id);
                }}>Editar</button>
              </div>
            ))
          ) : (
            <p>No hay categorias registradas.</p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              &laquo;
            </button>

            {getPageNumbers()[0] > 1 && (
              <>
                <button onClick={() => handlePageChange(1)}>1</button>
                {getPageNumbers()[0] > 2 && <span className="dots">...</span>}
              </>
            )}

            {getPageNumbers().map((page) => (
              <button
                key={page}
                className={currentPage === page ? "active" : ""}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}

            {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
              <>
                {getPageNumbers()[getPageNumbers().length - 1] <
                  totalPages - 1 && <span className="dots">...</span>}
                <button onClick={() => handlePageChange(totalPages)}>
                  {totalPages}
                </button>
              </>
            )}

            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              &raquo;
            </button>
          </div>
        )}
      </div>
    </div>
    <Modal
      inputs={CategoriasFieldBase}
      onSubmit={handleModalSubmit}
      isOpen={open}
      setIsOpen={setOpen}
      View={view}
      setView={setView}
      Title={view ? "Ver Categoria" : edit ? "Editar Categoria" : "Añadir Categoria"}
      defaultValues={selectedCategoria || {}}
    />
    </>
  );
}
