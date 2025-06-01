import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminDashboardPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
          <Link to="/admin" className="flex items-center">
            <span className="text-xl font-bold text-white">TiendaEsp Admin</span>
          </Link>
          <button
            onClick={toggleSidebar}
            className="p-1 text-gray-400 hover:text-white lg:hidden"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mt-5 px-2">
          <Link
            to="/admin"
            className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <LayoutDashboard className="mr-4 h-6 w-6" />
            Dashboard
          </Link>

          <Link
            to="/admin/pedidos"
            className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <Package className="mr-4 h-6 w-6" />
            Pedidos
          </Link>

          <Link
            to="/admin/productos"
            className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <ShoppingBag className="mr-4 h-6 w-6" />
            Productos
          </Link>

          <Link
            to="/admin/usuarios"
            className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <Users className="mr-4 h-6 w-6" />
            Usuarios
          </Link>

          <Link
            to="/admin/configuracion"
            className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <Settings className="mr-4 h-6 w-6" />
            Configuración
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className={`flex-1 ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        {/* Top bar */}
        <div className="bg-white shadow">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={toggleMobileMenu}
                className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>

              <div className="flex items-center">
                <div className="ml-3 relative">
                  <div>
                    <button
                      type="button"
                      className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      id="user-menu"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      <span className="sr-only">Abrir menú de usuario</span>
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {user?.nombre?.[0].toUpperCase()}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="ml-4 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route index element={<DashboardHome />} />
              <Route path="pedidos" element={<h1>Gestión de Pedidos</h1>} />
              <Route path="productos" element={<h1>Gestión de Productos</h1>} />
              <Route path="usuarios" element={<h1>Gestión de Usuarios</h1>} />
              <Route path="configuracion" element={<h1>Configuración</h1>} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

const DashboardHome: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingBag className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Ventas totales
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    $2,456,789
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                to="/admin/ventas"
                className="font-medium text-blue-700 hover:text-blue-900"
              >
                Ver todas
              </Link>
            </div>
          </div>
        </div>

        {/* Repeat for other metrics */}
      </div>

      {/* Recent activity */}
      <h2 className="mt-8 text-lg font-medium text-gray-900">Actividad reciente</h2>
      
      <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {/* Activity items */}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboardPage;