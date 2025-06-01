import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Truck, ShieldCheck, HelpCircle, Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-8 border-b border-gray-800">
          <div className="flex items-center">
            <CreditCard className="mr-3 text-amber-400" size={24} />
            <div>
              <h4 className="font-semibold">Pago Seguro</h4>
              <p className="text-sm text-gray-300">Múltiples métodos de pago</p>
            </div>
          </div>
          <div className="flex items-center">
            <Truck className="mr-3 text-amber-400" size={24} />
            <div>
              <h4 className="font-semibold">Envío Rápido</h4>
              <p className="text-sm text-gray-300">A todo el país</p>
            </div>
          </div>
          <div className="flex items-center">
            <ShieldCheck className="mr-3 text-amber-400" size={24} />
            <div>
              <h4 className="font-semibold">Compra Protegida</h4>
              <p className="text-sm text-gray-300">Garantía de devolución</p>
            </div>
          </div>
          <div className="flex items-center">
            <HelpCircle className="mr-3 text-amber-400" size={24} />
            <div>
              <h4 className="font-semibold">Soporte 24/7</h4>
              <p className="text-sm text-gray-300">Estamos para ayudarte</p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-8">
          {/* About Column */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4">TiendaEsp</h3>
            <p className="text-gray-300 text-sm mb-4">
              Tu tienda en línea de confianza con los mejores productos y precios del mercado.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Categories Column */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4">Categorías</h3>
            <ul className="space-y-2">
              <li><Link to="/catalogo?categoria=tecnologia" className="text-gray-300 hover:text-white transition-colors">Tecnología</Link></li>
              <li><Link to="/catalogo?categoria=hogar" className="text-gray-300 hover:text-white transition-colors">Hogar</Link></li>
              <li><Link to="/catalogo?categoria=moda" className="text-gray-300 hover:text-white transition-colors">Moda</Link></li>
              <li><Link to="/catalogo?categoria=deportes" className="text-gray-300 hover:text-white transition-colors">Deportes</Link></li>
              <li><Link to="/catalogo?categoria=belleza" className="text-gray-300 hover:text-white transition-colors">Belleza</Link></li>
            </ul>
          </div>

          {/* Information Column */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4">Información</h3>
            <ul className="space-y-2">
              <li><Link to="/sobre-nosotros" className="text-gray-300 hover:text-white transition-colors">Sobre Nosotros</Link></li>
              <li><Link to="/terminos-condiciones" className="text-gray-300 hover:text-white transition-colors">Términos y Condiciones</Link></li>
              <li><Link to="/politica-privacidad" className="text-gray-300 hover:text-white transition-colors">Política de Privacidad</Link></li>
              <li><Link to="/metodos-pago" className="text-gray-300 hover:text-white transition-colors">Métodos de Pago</Link></li>
              <li><Link to="/envios-devoluciones" className="text-gray-300 hover:text-white transition-colors">Envíos y Devoluciones</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-0.5 text-gray-300" />
                <span className="text-gray-300">Av. Principal 123, Ciudad</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-gray-300" />
                <span className="text-gray-300">+34 912 345 678</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-gray-300" />
                <span className="text-gray-300">info@tiendaesp.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-6 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} TiendaEsp. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;