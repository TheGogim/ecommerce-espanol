# E-commerce en Español - Guía de Instalación

## Requisitos Previos

1. Instalar Node.js y npm:
```bash
sudo apt update
sudo apt install nodejs npm
```

2. Instalar MySQL:
```bash
sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

3. Crear la base de datos:
```bash
mysql -u root -p
CREATE DATABASE ecommerce_espanol;
exit;
```

4. Importar el esquema:
```bash
mysql -u root -p ecommerce_espanol < database/schema.sql
```

## Configuración del Proyecto

1. Clonar el repositorio:
```bash
git clone <tu-repositorio>
cd ecommerce-espanol
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar .env con tus credenciales.

## Configuración de Google OAuth2

1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. Crear un nuevo proyecto
3. Habilitar Google+ API
4. Crear credenciales OAuth 2.0
5. Configurar URI de redirección: http://localhost:5000/api/auth/google/callback
6. Copiar Client ID y Secret al .env

## Configuración de PayPal

1. Crear cuenta en [PayPal Developer](https://developer.paypal.com)
2. Obtener credenciales de sandbox
3. Copiar Client ID y Secret al .env

## Configuración de Dominio Local

1. Instalar Nginx:
```bash
sudo apt install nginx
```

2. Configurar Nginx:
```bash
sudo nano /etc/nginx/sites-available/ecommerce
```

Añadir:
```nginx
server {
    listen 80;
    server_name tudominio.local;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. Activar el sitio:
```bash
sudo ln -s /etc/nginx/sites-available/ecommerce /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

4. Configurar hosts locales:
```bash
sudo nano /etc/hosts
```

Añadir:
```
127.0.0.1 tudominio.local
```

## Iniciar el Proyecto

Desarrollo:
```bash
npm run dev:full
```

El sitio estará disponible en:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- O usando el dominio local: http://tudominio.local

## Dominio Gratuito (Opcional)

1. Registrar dominio gratuito en [Freenom](https://www.freenom.com)
2. Configurar DNS para apuntar a tu IP
3. Actualizar la configuración de Nginx con el nuevo dominio

## Consideraciones de Seguridad

1. Configurar firewall:
```bash
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

2. Instalar certificado SSL (opcional):
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx
```