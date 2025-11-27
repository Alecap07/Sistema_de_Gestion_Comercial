import './App.css'
import './styles/general.css'
import './styles/user.css'
import './styles/Navbar.css'
import { Routes, Route } from 'react-router-dom'
import Proveedores from './pages/Proveedores'
import Categoria from './pages/Categorias'
import Navbar from './components/Navbar'

function App() {

  return (
    <>
    <Navbar/>
    <div className='Container'>
      <Routes>
         <Route path='/' element={<Proveedores/>}/>
         <Route path='/categoria' element={<Categoria/>}/>
      </Routes>
      </div>
    </>
  )
}

export default App
