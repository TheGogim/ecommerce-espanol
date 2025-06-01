-- Base de datos para E-commerce en Español
-- MySQL / MariaDB

-- 1. Eliminar base de datos si existe (usar con precaución)
DROP DATABASE IF EXISTS ecommerce_espanol;

-- 2. Crear base de datos
CREATE DATABASE ecommerce_espanol DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 3. Seleccionar la base de datos
USE ecommerce_espanol;

-- 4. Tabla de usuarios
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultima_conexion TIMESTAMP,
  role ENUM('user', 'admin') DEFAULT 'user',
  estado BOOLEAN DEFAULT TRUE
);

-- 5. Tabla de categorías
CREATE TABLE categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  imagen VARCHAR(255),
  categoria_padre_id INT,
  slug VARCHAR(100) UNIQUE,
  activa BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (categoria_padre_id) REFERENCES categorias(id) ON DELETE SET NULL
);

-- 6. Tabla de productos
CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  sku VARCHAR(50) UNIQUE,
  imagen VARCHAR(255),
  imagenes_adicionales JSON,
  categoria_id INT,
  destacado BOOLEAN DEFAULT FALSE,
  descuento DECIMAL(5, 2),
  calificacion DECIMAL(3, 2) DEFAULT 0,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  especificaciones JSON,
  estado ENUM('activo', 'inactivo', 'agotado') DEFAULT 'activo',
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
);

-- 7. Tabla de atributos de productos
CREATE TABLE atributos_producto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  producto_id INT NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  valor VARCHAR(100) NOT NULL,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- 8. Tabla de direcciones
CREATE TABLE direcciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  calle VARCHAR(255) NOT NULL,
  ciudad VARCHAR(100) NOT NULL,
  codigo_postal VARCHAR(10) NOT NULL,
  provincia VARCHAR(100) NOT NULL,
  pais VARCHAR(100) NOT NULL,
  nombre_receptor VARCHAR(100),
  telefono VARCHAR(20),
  es_principal BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 9. Tabla de pedidos
CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  direccion_id INT NOT NULL,
  metodo_pago VARCHAR(50) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  estado ENUM('pendiente', 'procesando', 'enviado', 'entregado', 'cancelado') DEFAULT 'pendiente',
  referencia_pago VARCHAR(100),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  notas TEXT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
  FOREIGN KEY (direccion_id) REFERENCES direcciones(id) ON DELETE RESTRICT
);

-- 10. Tabla de detalles de pedido
CREATE TABLE detalles_pedido (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT
);

-- 11. Tabla de carrito
CREATE TABLE carrito (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL DEFAULT 1,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_product (usuario_id, producto_id)
);

-- 12. Tabla de reseñas
CREATE TABLE resenas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  producto_id INT NOT NULL,
  usuario_id INT NOT NULL,
  calificacion INT NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
  comentario TEXT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_product_review (usuario_id, producto_id)
);

-- 13. Tabla de cupones
CREATE TABLE cupones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  tipo ENUM('porcentaje', 'fijo') NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  uso_maximo INT,
  usos_actuales INT DEFAULT 0,
  minimo_compra DECIMAL(10, 2),
  activo BOOLEAN DEFAULT TRUE
);

-- 14. Tabla de zonas de envío
CREATE TABLE zonas_envio (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  pais VARCHAR(100) NOT NULL,
  codigo_postal_inicio VARCHAR(10),
  codigo_postal_fin VARCHAR(10),
  costo_envio DECIMAL(10, 2) NOT NULL,
  tiempo_estimado VARCHAR(50),
  activo BOOLEAN DEFAULT TRUE
);

-- 15. Tabla de configuración de la tienda
CREATE TABLE configuracion (
  id INT NOT NULL DEFAULT 1,
  nombre_tienda VARCHAR(100) NOT NULL,
  logo VARCHAR(255),
  email_contacto VARCHAR(100),
  telefono VARCHAR(20),
  direccion TEXT,
  moneda VARCHAR(3) DEFAULT 'EUR',
  iva DECIMAL(5, 2) DEFAULT 21.00,
  tema_color VARCHAR(20),
  tema_modo ENUM('claro', 'oscuro') DEFAULT 'claro',
  redes_sociales JSON,
  metodos_pago JSON,
  configuracion_correo JSON,
  PRIMARY KEY (id)
);

-- 16. Tabla de favoritos
CREATE TABLE favoritos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  producto_id INT NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_product_fav (usuario_id, producto_id)
);

-- 17. Tabla de métodos de pago guardados
CREATE TABLE metodos_pago_usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo ENUM('tarjeta', 'paypal') NOT NULL,
  datos JSON NOT NULL,
  es_principal BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 18. Tabla de historial de stock
CREATE TABLE historial_stock (
  id INT AUTO_INCREMENT PRIMARY KEY,
  producto_id INT NOT NULL,
  cantidad_anterior INT NOT NULL,
  cantidad_nueva INT NOT NULL,
  tipo_movimiento ENUM('entrada', 'salida', 'ajuste') NOT NULL,
  referencia VARCHAR(100),
  usuario_id INT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- 19. Tabla de sesiones de usuarios
CREATE TABLE sesiones_usuario (
  id VARCHAR(128) PRIMARY KEY,
  usuario_id INT,
  ip VARCHAR(45),
  user_agent TEXT,
  datos JSON,
  expira TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 20. Insertar datos de prueba

-- Insertar administrador
INSERT INTO usuarios (nombre, email, password, role) VALUES
('Administrador', 'admin@tiendaesp.com', '$2a$10$eMVgMU3qA0vGnXSHRCZTz.ZoLGBXPRNJ3KGNh3wF6o8g5Pok9TnVe', 'admin'); -- Contraseña: admin123

-- Insertar categorías principales
INSERT INTO categorias (nombre, descripcion, imagen, slug, activa) VALUES
('Tecnología', 'Productos electrónicos y gadgets', 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600', 'tecnologia', true),
('Hogar', 'Artículos para el hogar y decoración', 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=600', 'hogar', true),
('Moda', 'Ropa, calzado y accesorios', 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=600', 'moda', true),
('Deportes', 'Equipamiento y ropa deportiva', 'https://images.pexels.com/photos/3761089/pexels-photo-3761089.jpeg?auto=compress&cs=tinysrgb&w=600', 'deportes', true),
('Belleza', 'Productos de belleza y cuidado personal', 'https://images.pexels.com/photos/3373746/pexels-photo-3373746.jpeg?auto=compress&cs=tinysrgb&w=600', 'belleza', true);

-- Insertar subcategorías
INSERT INTO categorias (nombre, descripcion, categoria_padre_id, slug, activa) VALUES
('Smartphones', 'Teléfonos móviles y accesorios', 1, 'smartphones', true),
('Ordenadores', 'Portátiles y ordenadores de sobremesa', 1, 'ordenadores', true),
('Audio', 'Auriculares y altavoces', 1, 'audio', true),
('Cocina', 'Electrodomésticos y utensilios de cocina', 2, 'cocina', true),
('Muebles', 'Muebles para el hogar', 2, 'muebles', true),
('Ropa Hombre', 'Moda para hombre', 3, 'ropa-hombre', true),
('Ropa Mujer', 'Moda para mujer', 3, 'ropa-mujer', true),
('Calzado', 'Zapatos y zapatillas', 3, 'calzado', true),
('Fitness', 'Equipamiento para gimnasio y fitness', 4, 'fitness', true),
('Running', 'Productos para corredores', 4, 'running', true),
('Maquillaje', 'Productos de maquillaje', 5, 'maquillaje', true),
('Cuidado Facial', 'Cremas y tratamientos faciales', 5, 'cuidado-facial', true);

-- Insertar productos
INSERT INTO productos (nombre, descripcion, precio, stock, sku, imagen, categoria_id, destacado, calificacion, estado) VALUES
('Smartphone XTech Pro', 'Smartphone de última generación con cámara de 48MP y batería de larga duración.', 599.99, 50, 'TECH-001', 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=600', 6, true, 4.8, 'activo'),
('Laptop UltraBook 15', 'Portátil ultraligero con procesador i7 y 16GB de RAM.', 899.99, 25, 'TECH-002', 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600', 7, true, 4.7, 'activo'),
('Auriculares Bluetooth Pro', 'Auriculares inalámbricos con cancelación de ruido y 30h de batería.', 89.99, 100, 'TECH-003', 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600', 8, true, 4.6, 'activo'),
('Smart TV 50 pulgadas', 'Televisor LED 4K con sistema operativo Android TV integrado.', 499.99, 15, 'TECH-004', 'https://images.pexels.com/photos/6782566/pexels-photo-6782566.jpeg?auto=compress&cs=tinysrgb&w=600', 1, false, 4.4, 'activo'),
('Batidora de vaso 2L', 'Batidora potente con múltiples velocidades y vaso de 2 litros.', 69.99, 30, 'HOME-001', 'https://images.pexels.com/photos/3872373/pexels-photo-3872373.jpeg?auto=compress&cs=tinysrgb&w=600', 9, false, 4.3, 'activo'),
('Sofá 3 plazas', 'Sofá moderno y cómodo con tapizado resistente.', 349.99, 5, 'HOME-002', 'https://images.pexels.com/photos/6489107/pexels-photo-6489107.jpeg?auto=compress&cs=tinysrgb&w=600', 10, false, 4.5, 'activo'),
('Camiseta algodón premium', 'Camiseta de algodón 100% de alta calidad.', 19.99, 200, 'FASH-001', 'https://images.pexels.com/photos/5384423/pexels-photo-5384423.jpeg?auto=compress&cs=tinysrgb&w=600', 11, false, 4.2, 'activo'),
('Zapatillas Running Air', 'Zapatillas ligeras ideales para running y entrenamiento.', 129.99, 40, 'SPORT-001', 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600', 15, true, 4.5, 'activo'),
('Set mancuernas ajustables', 'Set de mancuernas con peso ajustable de 2 a 20kg.', 149.99, 20, 'SPORT-002', 'https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=600', 14, false, 4.4, 'activo'),
('Paleta de sombras', 'Paleta de 24 colores de sombras para ojos.', 29.99, 60, 'BEAUTY-001', 'https://images.pexels.com/photos/2253833/pexels-photo-2253833.jpeg?auto=compress&cs=tinysrgb&w=600', 16, false, 4.3, 'activo'),
('Sérum facial vitamina C', 'Sérum facial con vitamina C para una piel radiante.', 24.99, 80, 'BEAUTY-002', 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=600', 17, false, 4.6, 'activo');

-- Insertar descuentos en algunos productos
UPDATE productos SET descuento = 20 WHERE id = 4; -- Smart TV
UPDATE productos SET descuento = 15 WHERE id = 5; -- Batidora
UPDATE productos SET descuento = 25 WHERE id = 7; -- Camiseta
UPDATE productos SET descuento = 10 WHERE id = 10; -- Paleta sombras

-- Insertar configuración de la tienda
INSERT INTO configuracion (nombre_tienda, email_contacto, telefono, direccion, moneda, iva) VALUES
('TiendaEsp', 'info@tiendaesp.com', '+34 912 345 678', 'Av. Principal 123, Madrid, España', 'EUR', 21.00);

-- Insertar zonas de envío
INSERT INTO zonas_envio (nombre, pais, costo_envio, tiempo_estimado, activo) VALUES
('Península', 'España', 4.99, '24-48 horas', true),
('Islas Baleares', 'España', 6.99, '48-72 horas', true),
('Islas Canarias', 'España', 9.99, '3-5 días', true),
('Portugal', 'Portugal', 7.99, '3-5 días', true),
('Francia', 'Francia', 9.99, '5-7 días', true);

-- Insertar cupones
INSERT INTO cupones (codigo, tipo, valor, fecha_inicio, fecha_fin, uso_maximo, minimo_compra, activo) VALUES
('BIENVENIDA10', 'porcentaje', 10, '2023-01-01', '2025-12-31', 1000, 30.00, true),
('VERANO25', 'porcentaje', 25, '2023-06-01', '2023-09-30', 500, 50.00, true),
('FREESHIPMENT', 'fijo', 4.99, '2023-01-01', '2023-12-31', 200, 100.00, true);