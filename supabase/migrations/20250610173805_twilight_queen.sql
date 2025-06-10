/*
  # E-commerce Schema for Supabase

  1. New Tables
    - `usuarios` - User profiles extending auth.users
    - `categorias` - Product categories
    - `productos` - Products catalog
    - `carrito` - Shopping cart items
    - `direcciones` - User addresses
    - `pedidos` - Orders
    - `detalles_pedido` - Order items
    - `resenas` - Product reviews
    - `favoritos` - User favorites
    - `newsletter_subscribers` - Newsletter subscriptions

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add admin policies where needed
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create usuarios table (extends auth.users)
CREATE TABLE IF NOT EXISTS usuarios (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  telefono text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categorias table
CREATE TABLE IF NOT EXISTS categorias (
  id serial PRIMARY KEY,
  nombre text NOT NULL,
  descripcion text,
  imagen text,
  categoria_padre_id integer REFERENCES categorias(id) ON DELETE SET NULL,
  slug text UNIQUE NOT NULL,
  activa boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create productos table
CREATE TABLE IF NOT EXISTS productos (
  id serial PRIMARY KEY,
  nombre text NOT NULL,
  descripcion text,
  precio decimal(10,2) NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  sku text UNIQUE,
  imagen text,
  imagenes_adicionales jsonb,
  categoria_id integer REFERENCES categorias(id) ON DELETE SET NULL,
  destacado boolean DEFAULT false,
  descuento decimal(5,2),
  calificacion decimal(3,2) DEFAULT 0,
  especificaciones jsonb,
  estado text DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'agotado')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create carrito table
CREATE TABLE IF NOT EXISTS carrito (
  id serial PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  producto_id integer REFERENCES productos(id) ON DELETE CASCADE,
  cantidad integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, producto_id)
);

-- Create direcciones table
CREATE TABLE IF NOT EXISTS direcciones (
  id serial PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  calle text NOT NULL,
  ciudad text NOT NULL,
  codigo_postal text NOT NULL,
  provincia text NOT NULL,
  pais text NOT NULL,
  nombre_receptor text,
  telefono text,
  es_principal boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create pedidos table
CREATE TABLE IF NOT EXISTS pedidos (
  id serial PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT,
  direccion_id integer REFERENCES direcciones(id) ON DELETE RESTRICT,
  metodo_pago text NOT NULL,
  total decimal(10,2) NOT NULL,
  estado text DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'procesando', 'enviado', 'entregado', 'cancelado')),
  referencia_pago text,
  notas text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create detalles_pedido table
CREATE TABLE IF NOT EXISTS detalles_pedido (
  id serial PRIMARY KEY,
  pedido_id integer REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id integer REFERENCES productos(id) ON DELETE RESTRICT,
  cantidad integer NOT NULL,
  precio_unitario decimal(10,2) NOT NULL,
  subtotal decimal(10,2) NOT NULL
);

-- Create resenas table
CREATE TABLE IF NOT EXISTS resenas (
  id serial PRIMARY KEY,
  producto_id integer REFERENCES productos(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  calificacion integer NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
  comentario text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, producto_id)
);

-- Create favoritos table
CREATE TABLE IF NOT EXISTS favoritos (
  id serial PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  producto_id integer REFERENCES productos(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, producto_id)
);

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id serial PRIMARY KEY,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE carrito ENABLE ROW LEVEL SECURITY;
ALTER TABLE direcciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE detalles_pedido ENABLE ROW LEVEL SECURITY;
ALTER TABLE resenas ENABLE ROW LEVEL SECURITY;
ALTER TABLE favoritos ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Policies for usuarios
CREATE POLICY "Users can read own profile" ON usuarios
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON usuarios
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON usuarios
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policies for categorias (public read)
CREATE POLICY "Anyone can read categories" ON categorias
  FOR SELECT TO anon, authenticated
  USING (activa = true);

-- Policies for productos (public read)
CREATE POLICY "Anyone can read active products" ON productos
  FOR SELECT TO anon, authenticated
  USING (estado = 'activo');

-- Policies for carrito
CREATE POLICY "Users can manage own cart" ON carrito
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for direcciones
CREATE POLICY "Users can manage own addresses" ON direcciones
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for pedidos
CREATE POLICY "Users can read own orders" ON pedidos
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON pedidos
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for detalles_pedido
CREATE POLICY "Users can read own order details" ON detalles_pedido
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pedidos 
      WHERE pedidos.id = detalles_pedido.pedido_id 
      AND pedidos.user_id = auth.uid()
    )
  );

-- Policies for resenas
CREATE POLICY "Anyone can read reviews" ON resenas
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Users can manage own reviews" ON resenas
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for favoritos
CREATE POLICY "Users can manage own favorites" ON favoritos
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for newsletter_subscribers
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Insert sample data
INSERT INTO categorias (nombre, descripcion, imagen, slug, activa) VALUES
('Tecnología', 'Productos electrónicos y gadgets', 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600', 'tecnologia', true),
('Hogar', 'Artículos para el hogar y decoración', 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=600', 'hogar', true),
('Moda', 'Ropa, calzado y accesorios', 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=600', 'moda', true),
('Deportes', 'Equipamiento y ropa deportiva', 'https://images.pexels.com/photos/3761089/pexels-photo-3761089.jpeg?auto=compress&cs=tinysrgb&w=600', 'deportes', true),
('Belleza', 'Productos de belleza y cuidado personal', 'https://images.pexels.com/photos/3373746/pexels-photo-3373746.jpeg?auto=compress&cs=tinysrgb&w=600', 'belleza', true);

INSERT INTO productos (nombre, descripcion, precio, stock, sku, imagen, categoria_id, destacado, calificacion, estado) VALUES
('Smartphone XTech Pro', 'Smartphone de última generación con cámara de 48MP y batería de larga duración.', 1299900, 50, 'TECH-001', 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 1, true, 4.8, 'activo'),
('Laptop UltraBook 15', 'Portátil ultraligero con procesador i7 y 16GB de RAM.', 2299900, 25, 'TECH-002', 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600', 1, true, 4.7, 'activo'),
('Auriculares Bluetooth Pro', 'Auriculares inalámbricos con cancelación de ruido y 30h de batería.', 189900, 100, 'TECH-003', 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600', 1, true, 4.6, 'activo'),
('Smart TV 50 pulgadas', 'Televisor LED 4K con sistema operativo Android TV integrado.', 1299900, 15, 'TECH-004', 'https://images.pexels.com/photos/6782566/pexels-photo-6782566.jpeg?auto=compress&cs=tinysrgb&w=600', 1, false, 4.4, 'activo'),
('Batidora de vaso 2L', 'Batidora potente con múltiples velocidades y vaso de 2 litros.', 149900, 30, 'HOME-001', 'https://images.pexels.com/photos/3872373/pexels-photo-3872373.jpeg?auto=compress&cs=tinysrgb&w=600', 2, false, 4.3, 'activo'),
('Sofá 3 plazas', 'Sofá moderno y cómodo con tapizado resistente.', 899900, 5, 'HOME-002', 'https://images.pexels.com/photos/6489107/pexels-photo-6489107.jpeg?auto=compress&cs=tinysrgb&w=600', 2, false, 4.5, 'activo'),
('Camiseta algodón premium', 'Camiseta de algodón 100% de alta calidad.', 49900, 200, 'FASH-001', 'https://images.pexels.com/photos/5384423/pexels-photo-5384423.jpeg?auto=compress&cs=tinysrgb&w=600', 3, false, 4.2, 'activo'),
('Zapatillas Running Air', 'Zapatillas ligeras ideales para running y entrenamiento.', 329900, 40, 'SPORT-001', 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600', 4, true, 4.5, 'activo'),
('Set mancuernas ajustables', 'Set de mancuernas con peso ajustable de 2 a 20kg.', 379900, 20, 'SPORT-002', 'https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=600', 4, false, 4.4, 'activo'),
('Paleta de sombras', 'Paleta de 24 colores de sombras para ojos.', 79900, 60, 'BEAUTY-001', 'https://images.pexels.com/photos/2253833/pexels-photo-2253833.jpeg?auto=compress&cs=tinysrgb&w=600', 5, false, 4.3, 'activo');

-- Update some products with discounts
UPDATE productos SET descuento = 20 WHERE id = 4;
UPDATE productos SET descuento = 15 WHERE id = 5;
UPDATE productos SET descuento = 25 WHERE id = 7;
UPDATE productos SET descuento = 10 WHERE id = 10;

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO usuarios (id, nombre)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nombre', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();