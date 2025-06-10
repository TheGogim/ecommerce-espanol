import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface User {
  id: string
  email: string
  nombre: string
  telefono?: string
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

export interface Product {
  id: number
  nombre: string
  descripcion: string
  precio: number
  stock: number
  sku: string
  imagen: string
  imagenes_adicionales?: string[]
  categoria_id: number
  destacado: boolean
  descuento?: number
  calificacion: number
  especificaciones?: Record<string, string>
  estado: 'activo' | 'inactivo' | 'agotado'
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  nombre: string
  descripcion?: string
  imagen?: string
  categoria_padre_id?: number
  slug: string
  activa: boolean
}

export interface CartItem {
  id: number
  user_id: string
  producto_id: number
  cantidad: number
  created_at: string
  productos: Product
}

export interface Order {
  id: number
  user_id: string
  direccion_id: number
  metodo_pago: string
  total: number
  estado: 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado'
  referencia_pago?: string
  created_at: string
  updated_at: string
  notas?: string
}

export interface Address {
  id: number
  user_id: string
  calle: string
  ciudad: string
  codigo_postal: string
  provincia: string
  pais: string
  nombre_receptor: string
  telefono: string
  es_principal: boolean
}