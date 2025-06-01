import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Truck, ShieldCheck, ArrowLeft, Minus, Plus, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;
  imagenes_adicionales: string[];
  categoria: string;
  destacado: boolean;
  descuento: number | null;
  calificacion: number;
  especificaciones: Record<string, string>;
}

interface Review {
  id: number;
  usuario_id: number;
  nombre_usuario: string;
  calificacion: number;
  comentario: string;
  fecha: string;
}

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/productos/${id}`);
        setProduct(response.data);
        
        // En un entorno real, esta sería una llamada API separada
        const mockReviews: Review[] = [
          {
            id: 1,
            usuario_id: 1,
            nombre_usuario: "María García",
            calificacion: 5,
            comentario: "Excelente producto, cumple perfectamente con lo descrito. La calidad es muy buena y llegó antes de lo esperado.",
            fecha: "2024-02-15"
          },
          {
            id: 2,
            usuario_id: 2,
            nombre_usuario: "Juan Pérez",
            calificacion: 4,
            comentario: "Buen producto en general, aunque el empaque podría mejorar. La relación calidad-precio es muy buena.",
            fecha: "2024-02-10"
          }
        ];
        setReviews(mockReviews);
      } catch (error) {
        console.error('Error al cargar el producto:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= (product?.stock || 1)) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (product) {
      addToCart({
        id: 0,
        productoId: product.id,
        nombre: product.nombre,
        precio: product.descuento 
          ? product.precio * (1 - product.descuento / 100)
          : product.precio,
        imagen: product.imagen,
        cantidad: quantity
      });
    }
  };

  const handleAddToFavorites = () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    // Aquí iría la lógica para añadir a favoritos
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="w-5 h-5 fill-amber-400 text-amber-400" />);
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half-star" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-amber-400">
          <defs>
            <linearGradient id="half" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="50%" stopColor="#FFC107" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <polygon fill="url(#half)" points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    }

    for (let i = stars.length; i < 5; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="w-5 h-5 text-amber-400" />);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h2>
          <Link to="/catalogo" className="text-blue-600 hover:text-blue-700">
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/catalogo" className="flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver al catálogo
          </Link>
        </div>

        {/* Producto Principal */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Galería de Imágenes */}
            <div className="space-y-4">
              <div className="aspect-w-1 aspect-h-1 relative">
                <img
                  src={selectedImage === 0 ? product.imagen : product.imagenes_adicionales?.[selectedImage - 1]}
                  alt={product.nombre}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <button 
                  onClick={handleAddToFavorites}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                >
                  <Heart className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              
              {/* Miniaturas */}
              {product.imagenes_adicionales && (
                <div className="grid grid-cols-5 gap-2">
                  <button
                    onClick={() => setSelectedImage(0)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImage === 0 ? 'border-blue-600' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={product.imagen}
                      alt={`${product.nombre} - Principal`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                  {product.imagenes_adicionales.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index + 1)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 ${
                        selectedImage === index + 1 ? 'border-blue-600' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.nombre} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Información del Producto */}
            <div>
              <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.nombre}</h1>
                <Link to={`/catalogo?categoria=${product.categoria}`} className="text-blue-600 hover:text-blue-700">
                  {product.categoria}
                </Link>
              </div>

              <div className="flex items-center mb-4">
                <div className="flex mr-2">
                  {renderStars(product.calificacion)}
                </div>
                <span className="text-gray-600">({product.calificacion} de 5)</span>
                <span className="mx-2">•</span>
                <Link to="#reviews" className="text-blue-600 hover:text-blue-700">
                  {reviews.length} valoraciones
                </Link>
              </div>

              <div className="mb-6">
                {product.descuento ? (
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <span className="text-3xl font-bold text-gray-900">
                        {(product.precio * (1 - product.descuento / 100)).toLocaleString('es-ES', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </span>
                      <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-sm font-medium rounded">
                        -{product.descuento}%
                      </span>
                    </div>
                    <span className="text-gray-500 line-through">
                      {product.precio.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">
                    {product.precio.toLocaleString('es-ES', {
                      style: 'currency',
                      currency: 'EUR'
                    })}
                  </span>
                )}
              </div>

              <div className="mb-6">
                <p className="text-gray-700 whitespace-pre-line">{product.descripcion}</p>
              </div>

              {/* Stock y Cantidad */}
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <span className={`w-3 h-3 rounded-full mr-2 ${
                    product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                  <span className={product.stock > 0 ? 'text-green-700' : 'text-red-700'}>
                    {product.stock > 0 ? 'En stock' : 'Agotado'}
                  </span>
                  {product.stock > 0 && (
                    <span className="text-gray-600 ml-2">
                      ({product.stock} unidades disponibles)
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="p-2 hover:bg-gray-100"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="w-16 text-center border-x p-2"
                      min="1"
                      max={product.stock}
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="p-2 hover:bg-gray-100"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 bg-blue-900 text-white py-3 px-6 rounded-md hover:bg-blue-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Añadir al carrito
                  </button>
                </div>
              </div>

              {/* Beneficios */}
              <div className="border-t pt-6 space-y-4">
                <div className="flex items-center">
                  <Truck className="w-5 h-5 text-gray-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">Envío gratis</h4>
                    <p className="text-sm text-gray-600">En pedidos superiores a 50€</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <ShieldCheck className="w-5 h-5 text-gray-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">Garantía de devolución</h4>
                    <p className="text-sm text-gray-600">30 días para devolver tu compra</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Especificaciones */}
        {product.especificaciones && Object.keys(product.especificaciones).length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Especificaciones</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.especificaciones).map(([key, value]) => (
                <div key={key} className="flex">
                  <span className="font-medium text-gray-900 w-1/3">{key}:</span>
                  <span className="text-gray-600">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Valoraciones */}
        <div id="reviews" className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Valoraciones</h2>
          
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                  <div className="flex items-center mb-2">
                    <div className="flex mr-2">
                      {renderStars(review.calificacion)}
                    </div>
                    <span className="text-gray-600">
                      por {review.nombre_usuario}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{review.comentario}</p>
                  <span className="text-sm text-gray-500">
                    {new Date(review.fecha).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">
              Este producto aún no tiene valoraciones. ¡Sé el primero en opinar!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;