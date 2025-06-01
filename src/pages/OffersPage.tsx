import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { Heart } from 'lucide-react';

interface Product {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  descuento: number;
  categoria: string;
}

const OffersPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/productos?ofertas=true');
        setProducts(response.data);
      } catch (error) {
        console.error('Error al cargar ofertas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Ofertas Especiales</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="relative">
                <img
                  src={product.imagen}
                  alt={product.nombre}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded">
                  -{product.descuento}%
                </div>
                <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                  <Heart className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">{product.nombre}</h3>
                <p className="text-gray-600 mb-2">{product.categoria}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold text-gray-900">
                      {(product.precio * (1 - product.descuento / 100)).toLocaleString('es-CO', {
                        style: 'currency',
                        currency: 'COP'
                      })}
                    </span>
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      {product.precio.toLocaleString('es-CO', {
                        style: 'currency',
                        currency: 'COP'
                      })}
                    </span>
                  </div>
                  <button 
                    onClick={() => addToCart({
                      id: 0,
                      productoId: product.id,
                      nombre: product.nombre,
                      precio: product.precio * (1 - product.descuento / 100),
                      imagen: product.imagen,
                      cantidad: 1
                    })}
                    className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors"
                  >
                    Añadir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OffersPage;