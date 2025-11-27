import "./App.css";
import "./styles/general.css";
import "./styles/user.css";
import "./styles/Navbar.css";
import "./styles/PersonaCrud.css"; // 👈 para usar el estilo de las tarjetas
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProductosPage from "./pages/ProductosPage";
import MovimientosPage from "./pages/MovimientosPage";
import ScrapPage from "./pages/ScrapPage"; 

import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <main className="main-container">
        <Routes>
          <Route path="/" element={<ProductosPage />} />
          <Route path="/movimientos" element={<MovimientosPage />} />
          <Route path="/scrap" element={<ScrapPage />} /> 
        </Routes>
      </main>
    </Router>
  );
}

export default App;
