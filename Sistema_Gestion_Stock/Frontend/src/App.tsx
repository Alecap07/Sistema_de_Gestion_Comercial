import Navbar from './components/Navbar';
import ClientesDTO from './pages/ClientesDTO'
import MarcasCrud from './pages/MarcasCrud'
import Dashboard from './pages/Dashboard'
import CategoriasCrud from './pages/CategoriasCrud'
import PresupuestoCrud from './pages/Presupuesto';
import PresupuestoVentaItemCrud from './pages/PresupuestoVentaItem';
import Categoria from './pages/Categorias'
import Proveedores from './pages/Proveedores'
import './styles/general.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles/PanelAdmin.css'
import NotasPedidoCrud from './pages/NotasPedidoCrud';
import NotasDebitoCrud from './pages/NotasDebitoCrud';
import ProductoReservadoCrud from './pages/ProductoReservadoCrud';
import Compras from './pages/Compras';
import NotasCreditoCrud from './pages/NotasCreditoCrud';
import DevolucionesCrud from './pages/Devoluciones';
import RemitosCrud from './pages/Remitos';
import FacturasCrud from './pages/Factura';
import ProductosCrud from './pages/ProductosCrud';
import ScrapPage from './pages/ScrapPage';
import MovimientosHistorial from './pages/MovimientosPage';
import ProductosPage from './pages/ProductosPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/clientes' element={<ClientesDTO />} />
          <Route path='/proveedores' element={<Proveedores />} />
          <Route path='/presupuesto' element={<PresupuestoCrud />} />
          <Route path='/presupuesto-items' element={<PresupuestoVentaItemCrud />} />
          <Route path='/productos-crud' element={<ProductosCrud />} />
          <Route path='/marcas' element={<MarcasCrud />} />
          <Route path='/categorias' element={<CategoriasCrud />} />
          <Route path='/categoria' element={<Categoria />} />
          <Route path='/notas-pedido' element={<NotasPedidoCrud />} />
          <Route path='/productos-reservados' element={<ProductoReservadoCrud />} />
          <Route path='/compras' element={<Compras />} />
          <Route path='/notas-credito' element={<NotasCreditoCrud />} />
          <Route path='/notas-debito' element={<NotasDebitoCrud />} />
          <Route path='/devoluciones' element={<DevolucionesCrud />} />
          <Route path='/remitos' element={<RemitosCrud />} />
          <Route path='/facturas' element={<FacturasCrud />} />
          <Route path='/scrap' element={<ScrapPage />} />
          <Route path='/movimientos-historial' element={<MovimientosHistorial />} />
          <Route path='/productos' element={<ProductosPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
