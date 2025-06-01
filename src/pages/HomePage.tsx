import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  ChevronRight, 
  Star, 
  TrendingUp, 
  Award, 
  Heart,
  Truck,
  ShieldCheck,
  CreditCard,
  Mail
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = () => {
    if (!user) {
      // Redirigir a login si no hay usuario
      window.location.href = '/login';
      return;
    }

    addToCart({
      id: 0,
      productoId: 1,
      nombre: "Smartphone XTech Pro",
      precio: 599.99,
      imagen: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      cantidad: 1
    });
  };

  const handleAddToFavorites = () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    // Aquí iría la lógica para añadir a favoritos
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Tu tienda online de confianza
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Los mejores productos con los mejores precios. Envíos a todo Colombia.
            </p>
            <Link
              to="/catalogo"
              className="inline-flex items-center bg-amber-400 text-gray-900 px-6 py-3 rounded-md hover:bg-amber-500 transition-colors font-medium"
            >
              Explorar productos
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-center p-4">
              <Truck className="h-8 w-8 text-blue-900 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">Envío Gratis</h3>
                <p className="text-gray-600">En pedidos superiores a $200.000</p>
              </div>
            </div>
            <div className="flex items-center p-4">
              <ShieldCheck className="h-8 w-8 text-blue-900 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">Compra Segura</h3>
                <p className="text-gray-600">100% garantizado</p>
              </div>
            </div>
            <div className="flex items-center p-4">
              <CreditCard className="h-8 w-8 text-blue-900 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">Pago Seguro</h3>
                <p className="text-gray-600">Múltiples métodos de pago</p>
              </div>
            </div>
            <div className="flex items-center p-4">
              <Mail className="h-8 w-8 text-blue-900 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">Soporte 24/7</h3>
                <p className="text-gray-600">Atención personalizada</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Productos Destacados</h2>
            <Link
              to="/catalogo"
              className="text-blue-600 hover:text-blue-700 flex items-center"
            >
              Ver todos
              <ChevronRight className="ml-1 h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Product Card Example */}
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <Link to="/producto/1" className="relative block">
                <img
                  src="https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="Producto 1"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToFavorites();
                  }}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                >
                  <Heart className="h-5 w-5 text-gray-600" />
                </button>
              </Link>
              <div className="p-4">
                <Link to="/producto/1" className="block">
                  <h3 className="text-lg font-medium text-gray-900">Smartphone XTech Pro</h3>
                  <p className="text-gray-600 mb-2">Tecnología</p>
                  <div className="flex items-center mb-2">
                    <Star className="h-5 w-5 text-amber-400 fill-current" />
                    <Star className="h-5 w-5 text-amber-400 fill-current" />
                    <Star className="h-5 w-5 text-amber-400 fill-current" />
                    <Star className="h-5 w-5 text-amber-400 fill-current" />
                    <Star className="h-5 w-5 text-amber-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">(5.0)</span>
                  </div>
                </Link>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">$1.299.900</span>
                  <button 
                    onClick={handleAddToCart}
                    className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors"
                  >
                    Añadir
                  </button>
                </div>
              </div>
            </div>

            {/* More product cards would go here */}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Categorías Populares</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/catalogo?categoria=tecnologia"
              className="relative rounded-lg overflow-hidden group"
            >
              <img
                src="https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Tecnología"
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <h3 className="text-white font-medium">Tecnología</h3>
              </div>
            </Link>

            <Link
              to="/catalogo?categoria=moda"
              className="relative rounded-lg overflow-hidden group"
            >
              <img
                src="https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Moda"
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <h3 className="text-white font-medium">Moda</h3>
              </div>
            </Link>

            <Link
              to="/catalogo?categoria=hogar"
              className="relative rounded-lg overflow-hidden group"
            >
              <img
                src="https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Hogar"
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <h3 className="text-white font-medium">Hogar</h3>
              </div>
            </Link>

            <Link
              to="/catalogo?categoria=deportes"
              className="relative rounded-lg overflow-hidden group"
            >
              <img
                src="https://images.pexels.com/photos/3761089/pexels-photo-3761089.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Deportes"
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <h3 className="text-white font-medium">Deportes</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">¿Por qué elegirnos?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-blue-900 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mejores Precios</h3>
              <p className="text-gray-600">
                Garantizamos los mejores precios del mercado en todos nuestros productos.
              </p>
            </div>
            <div className="text-center">
              <Award className="h-12 w-12 text-blue-900 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Calidad Garantizada</h3>
              <p className="text-gray-600">
                Todos nuestros productos pasan por rigurosos controles de calidad.
              </p>
            </div>
            <div className="text-center">
              <ShoppingBag className="h-12 w-12 text-blue-900 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Compra Fácil</h3>
              <p className="text-gray-600">
                Proceso de compra simple y seguro con múltiples métodos de pago.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Suscríbete a nuestro boletín</h2>
            <p className="text-blue-100 mb-6">
              Recibe las últimas novedades y ofertas exclusivas directamente en tu correo.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 px-4 py-2 rounded-md text-gray-900"
              />
              <button
                type="submit"
                className="bg-amber-400 text-gray-900 px-6 py-2 rounded-md hover:bg-amber-500 transition-colors font-medium"
              >
                Suscribirse
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;