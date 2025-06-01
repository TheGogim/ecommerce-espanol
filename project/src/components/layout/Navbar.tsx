import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, Package, Heart, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogo?buscar=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-blue-900">TiendaEsp</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-900">Inicio</Link>
            <Link to="/catalogo" className="text-gray-700 hover:text-blue-900">Catálogo</Link>
            <Link to="/ofertas" className="text-gray-700 hover:text-blue-900">Ofertas</Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full py-1.5 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search size={18} />
              </button>
            </form>
          </div>

          {/* User Actions - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/carrito" className="relative">
              <ShoppingCart className="text-gray-700 hover:text-blue-900" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-xs text-gray-900 font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="relative">
                <button 
                  onClick={toggleUserMenu}
                  className="flex items-center text-gray-700 hover:text-blue-900"
                >
                  <User size={20} />
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.nombre}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link 
                      to="/perfil" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User size={16} className="mr-2" />
                      Mi Perfil
                    </Link>
                    <Link 
                      to="/pedidos" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Package size={16} className="mr-2" />
                      Mis Pedidos
                    </Link>
                    <Link 
                      to="/favoritos" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Heart size={16} className="mr-2" />
                      Favoritos
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut size={16} className="mr-2" />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-blue-900 flex items-center">
                <User size={20} className="mr-1" />
                <span>Iniciar Sesión</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/carrito" className="relative">
              <ShoppingCart className="text-gray-700" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-xs text-gray-900 font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <button onClick={toggleMenu} className="text-gray-700">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <form onSubmit={handleSearch} className="mb-4 relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search size={18} />
              </button>
            </form>
            
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700" onClick={toggleMenu}>Inicio</Link>
              <Link to="/catalogo" className="text-gray-700" onClick={toggleMenu}>Catálogo</Link>
              <Link to="/ofertas" className="text-gray-700" onClick={toggleMenu}>Ofertas</Link>
              
              {user ? (
                <>
                  <Link to="/perfil" className="text-gray-700" onClick={toggleMenu}>Mi Perfil</Link>
                  <Link to="/pedidos" className="text-gray-700" onClick={toggleMenu}>Mis Pedidos</Link>
                  <button onClick={handleLogout} className="text-left text-gray-700">Cerrar Sesión</button>
                </>
              ) : (
                <Link to="/login" className="text-gray-700" onClick={toggleMenu}>Iniciar Sesión</Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;