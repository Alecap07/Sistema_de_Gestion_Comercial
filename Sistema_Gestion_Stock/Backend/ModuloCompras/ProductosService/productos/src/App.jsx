import './App.css'
import './styles/general.css'
import './styles/user.css'
import './styles/Navbar.css'
import { Routes, Route } from 'react-router-dom'
import ProductosCrud from './pages/ProductosCrud'
import MarcasCrud from './pages/MarcasCrud'
import CategoriasCrud from './pages/CategoriasCurd'
import Navbar from './components/Navbar'

function App() {

  return (
    <>
    <Navbar/>
    <div className='Container'>
      <Routes>
        <Route path='/productos' element={<ProductosCrud/>}/>
        <Route path='/marcas' element={<MarcasCrud/>}/>
        <Route path='/categorias' element={<CategoriasCrud/>}/>
      </Routes>
    </div>
    </>
  )
}

export default App
