import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

interface CartItem {
  id: number;
  productoId: number;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
}

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Cargar carrito al iniciar o cambiar de usuario
  useEffect(() => {
    if (user) {
      fetchUserCart();
    } else {
      // Si no hay usuario, cargar del localStorage
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    }
  }, [user]);

  // Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const fetchUserCart = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCartItems(response.data);
    } catch (error) {
      console.error('Error al cargar el carrito', error);
    } finally {
      setLoading(false);
    }
  };

  const saveUserCart = async () => {
    if (!user) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/cart', { items: cartItems }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error al guardar el carrito', error);
    }
  };

  const addToCart = (product: CartItem) => {
    setCartItems(currentItems => {
      const existingItem = currentItems.find(item => item.productoId === product.productoId);
      
      if (existingItem) {
        // Si el producto ya está en el carrito, actualizar cantidad
        const updatedItems = currentItems.map(item => 
          item.productoId === product.productoId 
            ? { ...item, cantidad: item.cantidad + product.cantidad } 
            : item
        );
        
        if (user) saveUserCart();
        return updatedItems;
      } else {
        // Si es un producto nuevo, añadirlo al carrito
        const newItems = [...currentItems, product];
        if (user) saveUserCart();
        return newItems;
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(currentItems => {
      const newItems = currentItems.filter(item => item.productoId !== productId);
      if (user) saveUserCart();
      return newItems;
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(currentItems => {
      const updatedItems = currentItems.map(item => 
        item.productoId === productId ? { ...item, cantidad: quantity } : item
      );
      
      if (user) saveUserCart();
      return updatedItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    if (user) saveUserCart();
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};