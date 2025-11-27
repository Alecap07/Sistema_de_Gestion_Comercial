import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-white p-4 text-white flex flex-row sticky w-full top-0 z-9999 h-16 shadow-md">
        <ul className="flex space-x-16 w-full justify-center items-center mx-auto text-black">
            <NavLink to="/">Productos</NavLink>
            <NavLink to="/categorias">Categorias</NavLink>
            <NavLink to="/marcas">Marcas</NavLink>
        </ul>
    </nav>
  )
}

function NavLink({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;
    return (
        <li>
        <Link to={to} className={`${className} ${isActive ? 'font-bold underline' : ''}`}>
            {children}
        </Link>
        </li>
    );
}