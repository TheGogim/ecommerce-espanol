import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronDown, Search } from 'lucide-react';
import axios from 'axios';

interface Product {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: string;
  descuento: number | null;
  calificacion: number;
}

const CatalogPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');

  const categoria = searchParams.get('categoria');
  const buscar = searchParams.get('buscar');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = 'https://ecommerce-espanol.onrender.com/api/productos?';
        const params = new URLSearchParams();

        if (categoria) params.append('categoria', categoria);
        if (buscar) params.append('buscar', buscar);
        if (priceRange.min) params.append('min_precio', priceRange.min);
        if (priceRange.max) params.append('max_precio', priceRange.max);

        switch (sortBy) {
          case 'price_asc':
            params.append('ordenar', 'precio_asc');
            break;
          case 'price_desc':
            params.append('ordenar', 'precio_desc');
            break;
          case 'rating':
            params.append('ordenar', 'calificacion');
            break;
          default:
            params.append('ordenar', 'newest');
        }

        const response = await axios.get(`${url}${params.toString()}`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoria, buscar, priceRange, selectedCategories, sortBy]);

  const renderProductCard = (product: Product) => (
    <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="relative h-48">
        {product.descuento && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded">
            -{product.descuento}%
          </div>
        )}
        <img 
          src={product.imagen} 
          alt={product.nombre}
          className="w-full h-full object-cover rounded-t-lg"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900">{product.nombre}</h3>
        <p className="text-sm text-gray-600 mb-2">{product.categoria}</p>
        <div className="flex justify-between items-center">
          <div>
            {product.descuento ? (
              <>
                <span className="text-lg font-bold text-gray-900">
                  {(product.precio * (1 - product.descuento / 100)).toLocaleString('es-ES', {
                    style: 'currency',
                    currency: 'EUR'
                  })}
                </span>
                <span className="ml-2 text-sm text-gray-500 line-through">
                  {product.precio.toLocaleString('es-ES', {
                    style: 'currency',
                    currency: 'EUR'
                  })}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                {product.precio.toLocaleString('es-ES', {
                  style: 'currency',
                  currency: 'EUR'
                })}
              </span>
            )}
          </div>
          <button className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors">
            Añadir
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filtros - Escritorio */}
          <div className="hidden md:block w-64 bg-white p-6 rounded-lg shadow-sm h-fit">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Filtros</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Precio</h4>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-3 py-2 border rounded"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-3 py-2 border rounded"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Categorías</h4>
                  <div className="space-y-2">
                    {['Tecnología', 'Hogar', 'Moda', 'Deportes', 'Belleza'].map((cat) => (
                      <label key={cat} className="flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-blue-600"
                          checked={selectedCategories.includes(cat)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCategories([...selectedCategories, cat]);
                            } else {
                              setSelectedCategories(selectedCategories.filter(c => c !== cat));
                            }
                          }}
                        />
                        <span className="ml-2">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="flex-1">
            {/* Barra de Herramientas */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden flex items-center gap-2 px-4 py-2 border rounded-lg"
                >
                  <Filter size={20} />
                  Filtros
                </button>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <input
                      type="text"
                      placeholder="Buscar productos..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  </div>

                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8"
                    >
                      <option value="newest">Más recientes</option>
                      <option value="price_asc">Precio: Menor a Mayor</option>
                      <option value="price_desc">Precio: Mayor a Menor</option>
                      <option value="rating">Mejor valorados</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>
              </div>

              {/* Filtros Móviles */}
              {showFilters && (
                <div className="md:hidden mt-4 border-t pt-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Precio</h4>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          className="w-full px-3 py-2 border rounded"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          className="w-full px-3 py-2 border rounded"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Categorías</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {['Tecnología', 'Hogar', 'Moda', 'Deportes', 'Belleza'].map((cat) => (
                          <label key={cat} className="flex items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox h-4 w-4 text-blue-600"
                              checked={selectedCategories.includes(cat)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCategories([...selectedCategories, cat]);
                                } else {
                                  setSelectedCategories(selectedCategories.filter(c => c !== cat));
                                }
                              }}
                            />
                            <span className="ml-2">{cat}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Grid de Productos */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-900"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(renderProductCard)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
