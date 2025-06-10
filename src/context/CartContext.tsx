import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import type { CartItem as SupabaseCartItem } from '../lib/supabase';

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
  addToCart: (product: CartItem) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load cart when user changes
  useEffect(() => {
    if (user) {
      fetchUserCart();
    } else {
      // Load from localStorage for anonymous users
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    }
  }, [user]);

  // Save to localStorage for anonymous users
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const fetchUserCart = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('carrito')
        .select(`
          id,
          producto_id,
          cantidad,
          productos (
            id,
            nombre,
            precio,
            imagen,
            descuento
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading cart:', error);
        return;
      }

      const formattedItems: CartItem[] = data?.map((item: any) => ({
        id: item.id,
        productoId: item.producto_id,
        nombre: item.productos.nombre,
        precio: item.productos.descuento 
          ? item.productos.precio * (1 - item.productos.descuento / 100)
          : item.productos.precio,
        imagen: item.productos.imagen,
        cantidad: item.cantidad
      })) || [];

      setCartItems(formattedItems);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: CartItem) => {
    if (!user) {
      // Handle anonymous cart
      setCartItems(currentItems => {
        const existingItem = currentItems.find(item => item.productoId === product.productoId);
        
        if (existingItem) {
          return currentItems.map(item => 
            item.productoId === product.productoId 
              ? { ...item, cantidad: item.cantidad + product.cantidad } 
              : item
          );
        } else {
          return [...currentItems, product];
        }
      });
      return;
    }

    try {
      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from('carrito')
        .select('*')
        .eq('user_id', user.id)
        .eq('producto_id', product.productoId)
        .single();

      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from('carrito')
          .update({ cantidad: existingItem.cantidad + product.cantidad })
          .eq('id', existingItem.id);

        if (error) throw error;
      } else {
        // Insert new item
        const { error } = await supabase
          .from('carrito')
          .insert({
            user_id: user.id,
            producto_id: product.productoId,
            cantidad: product.cantidad
          });

        if (error) throw error;
      }

      await fetchUserCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (productId: number) => {
    if (!user) {
      setCartItems(currentItems => 
        currentItems.filter(item => item.productoId !== productId)
      );
      return;
    }

    try {
      const { error } = await supabase
        .from('carrito')
        .delete()
        .eq('user_id', user.id)
        .eq('producto_id', productId);

      if (error) throw error;

      await fetchUserCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    if (!user) {
      setCartItems(currentItems => 
        currentItems.map(item => 
          item.productoId === productId ? { ...item, cantidad: quantity } : item
        )
      );
      return;
    }

    try {
      const { error } = await supabase
        .from('carrito')
        .update({ cantidad: quantity })
        .eq('user_id', user.id)
        .eq('producto_id', productId);

      if (error) throw error;

      await fetchUserCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearCart = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }

    try {
      const { error } = await supabase
        .from('carrito')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
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