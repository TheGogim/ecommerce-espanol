import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <div className="mb-6">
            <Search className="mx-auto h-12 w-12 text-gray-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Página no encontrada
          </h2>
          
          <p className="text-gray-600 mb-6">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
          
          <div className="space-y-4">
            <Link
              to="/"
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Home className="w-5 h-5 mr-2" />
              Volver al inicio
            </Link>
            
            <Link
              to="/catalogo"
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Explorar productos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;