# Inmobiliaria - Backend API

## Universidad Tecnológica Equinoccial

<div align="center">
<img src="https://ute.edu.ec/wp-content/uploads/2021/08/LogoUteTrans.png" alt="UTE - Escuela de Tecnologías" width="250"/>
</div>

<hr>

<div style="border-left: 4px solid #1e88e5; padding-left: 15px; margin-top: 20px;">
<p><strong>Universidad Tecnológica Equinoccial</strong></p>
<p><strong>Escuela de Tecnologías</strong></p>
<p><strong>Carrera:</strong> Desarrollo de Software</p>
<p><strong>Asignatura:</strong> Programación III</p>
</div>

<br>

<p><strong>Tema:</strong> Construcción Backend Proyecto Integrador.</p>

<br>

<p><strong>Fecha:</strong> 21/12/2025</p>
<p><strong>Equipo de trabajo:</strong></p>

<ul>
<li>Zambrano Colcha Carlos Andrés</li>
<li>Guamán Pillajo Danny Alexander</li>
<li>Macias Caiza Alex Gabriel</li>
</ul>

<p><strong>Docente:</strong> Francisco Javier Higuera González </p>

<hr>

## 📋 Guía de instalación y ejecución del backend

### Requisitos Previos
- Node.js >= 16.x --version
- PostgreSQL
- MongoDB
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone [https://github.com/andreeesz17/inmobiliaria_backend.git]

# Instalar dependencias
npm install

# Configurar variables de entorno
crear un archivo .env

# Iniciar el servidor en modo desarrollo
npm run start:dev
```

### Variables de Entorno
Configure las siguientes variables en el archivo `.env`:

```env
# PostgreSQL Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_password
DB_NAME=db_inmobiliaria

# MongoDB
MONGO_URI=mongodb://localhost:27017/db_inmo

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=3600s

# Email
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
```

## 🔐 Autenticación

La mayoría de los endpoints requieren autenticación mediante JWT. Para obtener un token:

1. Registre un usuario: `POST /auth/register`
2. Inicie sesión: `POST /auth/login`
3. Use el token en el header: `Authorization: Bearer <token>`

## 📡 Listado de Endpoints

### Módulo: Auth
<table>
<thead>
<tr>
<th>Método</th>
<th>Endpoint</th>
<th>Descripción</th>
<th>Requiere Auth</th>
</tr>
</thead>
<tbody>
<tr>
<td>POST</td>
<td>/auth/register</td>
<td>Registrar un nuevo usuario</td>
<td>No</td>
</tr>
<tr>
<td>POST</td>
<td>/auth/login</td>
<td>Iniciar sesión y obtener token</td>
<td>No</td>
</tr>
</tbody>
</table>

### Módulo: Properties
<table>
<thead>
<tr>
<th>Método</th>
<th>Endpoint</th>
<th>Descripción</th>
<th>Requiere Auth</th>
</tr>
</thead>
<tbody>
<tr>
<td>GET</td>
<td>/properties</td>
<td>Obtener todas las propiedades</td>
<td>No</td>
</tr>
<tr>
<td>GET</td>
<td>/properties/:id</td>
<td>Obtener propiedad por ID</td>
<td>No</td>
</tr>
<tr>
<td>POST</td>
<td>/properties</td>
<td>Crear una nueva propiedad</td>
<td>Sí</td>
</tr>
<tr>
<td>PUT</td>
<td>/properties/:id</td>
<td>Actualizar propiedad</td>
<td>Sí</td>
</tr>
<tr>
<td>DELETE</td>
<td>/properties/:id</td>
<td>Eliminar propiedad</td>
<td>Sí</td>
</tr>
</tbody>
</table>

### Módulo: Locations
<table>
<thead>
<tr>
<th>Método</th>
<th>Endpoint</th>
<th>Descripción</th>
<th>Requiere Auth</th>
</tr>
</thead>
<tbody>
<tr>
<td>GET</td>
<td>/locations</td>
<td>Obtener todas las ubicaciones</td>
<td>No</td>
</tr>
<tr>
<td>GET</td>
<td>/locations/:id</td>
<td>Obtener ubicación por ID</td>
<td>No</td>
</tr>
<tr>
<td>POST</td>
<td>/locations</td>
<td>Crear una nueva ubicación</td>
<td>Sí</td>
</tr>
<tr>
<td>PUT</td>
<td>/locations/:id</td>
<td>Actualizar ubicación</td>
<td>Sí</td>
</tr>
<tr>
<td>DELETE</td>
<td>/locations/:id</td>
<td>Eliminar ubicación</td>
<td>Sí</td>
</tr>
</tbody>
</table>

### Módulo: Property Features
<table>
<thead>
<tr>
<th>Método</th>
<th>Endpoint</th>
<th>Descripción</th>
<th>Requiere Auth</th>
</tr>
</thead>
<tbody>
<tr>
<td>GET</td>
<td>/property-features</td>
<td>Obtener todas las características</td>
<td>No</td>
</tr>
<tr>
<td>GET</td>
<td>/property-features/:id</td>
<td>Obtener característica por ID</td>
<td>No</td>
</tr>
<tr>
<td>POST</td>
<td>/property-features</td>
<td>Crear una nueva característica</td>
<td>Sí</td>
</tr>
<tr>
<td>PUT</td>
<td>/property-features/:id</td>
<td>Actualizar característica</td>
<td>Sí</td>
</tr>
<tr>
<td>DELETE</td>
<td>/property-features/:id</td>
<td>Eliminar característica</td>
<td>Sí</td>
</tr>
</tbody>
</table>

### Módulo: Categories
<table>
<thead>
<tr>
<th>Método</th>
<th>Endpoint</th>
<th>Descripción</th>
<th>Requiere Auth</th>
</tr>
</thead>
<tbody>
<tr>
<td>GET</td>
<td>/categories</td>
<td>Obtener todas las categorías</td>
<td>No</td>
</tr>
<tr>
<td>GET</td>
<td>/categories/:id</td>
<td>Obtener categoría por ID</td>
<td>No</td>
</tr>
<tr>
<td>POST</td>
<td>/categories</td>
<td>Crear una nueva categoría</td>
<td>Sí</td>
</tr>
<tr>
<td>PUT</td>
<td>/categories/:id</td>
<td>Actualizar categoría</td>
<td>Sí</td>
</tr>
<tr>
<td>DELETE</td>
<td>/categories/:id</td>
<td>Eliminar categoría</td>
<td>Sí</td>
</tr>
</tbody>
</table>

### Módulo: Appointments
<table>
<thead>
<tr>
<th>Método</th>
<th>Endpoint</th>
<th>Descripción</th>
<th>Requiere Auth</th>
</tr>
</thead>
<tbody>
<tr>
<td>GET</td>
<td>/appointments</td>
<td>Obtener todas las citas</td>
<td>No</td>
</tr>
<tr>
<td>GET</td>
<td>/appointments/:id</td>
<td>Obtener cita por ID</td>
<td>No</td>
</tr>
<tr>
<td>POST</td>
<td>/appointments</td>
<td>Crear una nueva cita</td>
<td>Sí</td>
</tr>
<tr>
<td>PUT</td>
<td>/appointments/:id</td>
<td>Actualizar cita</td>
<td>Sí</td>
</tr>
<tr>
<td>DELETE</td>
<td>/appointments/:id</td>
<td>Eliminar cita</td>
<td>Sí</td>
</tr>
</tbody>
</table>

### Módulo: Users
<table>
<thead>
<tr>
<th>Método</th>
<th>Endpoint</th>
<th>Descripción</th>
<th>Requiere Auth</th>
</tr>
</thead>
<tbody>
<tr>
<td>GET</td>
<td>/users</td>
<td>Obtener todos los usuarios</td>
<td>Sí (Admin)</td>
</tr>
<tr>
<td>GET</td>
<td>/users/:id</td>
<td>Obtener usuario por ID</td>
<td>Sí (Admin)</td>
</tr>
<tr>
<td>PUT</td>
<td>/users/:id</td>
<td>Actualizar usuario</td>
<td>Sí (Admin)</td>
</tr>
<tr>
<td>DELETE</td>
<td>/users/:id</td>
<td>Eliminar usuario</td>
<td>Sí (Admin)</td>
</tr>
</tbody>
</table>

### Módulo: Mail
<table>
<thead>
<tr>
<th>Método</th>
<th>Endpoint</th>
<th>Descripción</th>
<th>Requiere Auth</th>
</tr>
</thead>
<tbody>
<tr>
<td>POST</td>
<td>/mail/send</td>
<td>Enviar correo electrónico</td>
<td>Sí</td>
</tr>
<tr>
<td>GET</td>
<td>/mail/logs</td>
<td>Obtener logs de correos</td>
<td>Sí</td>
</tr>
</tbody>
</table>

### Módulo: Images
<table>
<thead>
<tr>
<th>Método</th>
<th>Endpoint</th>
<th>Descripción</th>
<th>Requiere Auth</th>
</tr>
</thead>
<tbody>
<tr>
<td>POST</td>
<td>/images/upload</td>
<td>Subir imagen</td>
<td>Sí</td>
</tr>
<tr>
<td>GET</td>
<td>/images/casa/:id_casa</td>
<td>Obtener imágenes por propiedad</td>
<td>No</td>
</tr>
<tr>
<td>GET</td>
<td>/images</td>
<td>Obtener todas las imágenes</td>
<td>No</td>
</tr>
</tbody>
</table>

### Módulo: Requests
<table>
<thead>
<tr>
<th>Método</th>
<th>Endpoint</th>
<th>Descripción</th>
<th>Requiere Auth</th>
</tr>
</thead>
<tbody>
<tr>
<td>POST</td>
<td>/requests</td>
<td>Crear solicitud</td>
<td>Sí</td>
</tr>
<tr>
<td>GET</td>
<td>/requests</td>
<td>Obtener todas las solicitudes</td>
<td>No</td>
</tr>
<tr>
<td>GET</td>
<td>/requests/:id</td>
<td>Obtener solicitud por ID</td>
<td>No</td>
</tr>
</tbody>
</table>

### Módulo: Transactions
<table>
<thead>
<tr>
<th>Método</th>
<th>Endpoint</th>
<th>Descripción</th>
<th>Requiere Auth</th>
</tr>
</thead>
<tbody>
<tr>
<td>POST</td>
<td>/transactions</td>
<td>Crear transacción</td>
<td>Sí</td>
</tr>
<tr>
<td>GET</td>
<td>/transactions</td>
<td>Obtener todas las transacciones</td>
<td>No</td>
</tr>
<tr>
<td>GET</td>
<td>/transactions/:id</td>
<td>Obtener transacción por ID</td>
<td>No</td>
</tr>
<tr>
<td>GET</td>
<td>/transactions/cliente/:id_cliente</td>
<td>Obtener transacciones por cliente</td>
<td>No</td>
</tr>
</tbody>
</table>

### Módulo: Contracts
<table>
<thead>
<tr>
<th>Método</th>
<th>Endpoint</th>
<th>Descripción</th>
<th>Requiere Auth</th>
</tr>
</thead>
<tbody>
<tr>
<td>POST</td>
<td>/contracts</td>
<td>Crear contrato</td>
<td>Sí</td>
</tr>
<tr>
<td>GET</td>
<td>/contracts</td>
<td>Obtener todos los contratos</td>
<td>No</td>
</tr>
<tr>
<td>GET</td>
<td>/contracts/:id</td>
<td>Obtener contrato por ID</td>
<td>No</td>
</tr>
<tr>
<td>GET</td>
<td>/contracts/user/:userId</td>
<td>Obtener contratos por usuario</td>
<td>No</td>
</tr>
</tbody>
</table>

## 💡 Ejemplos de Uso de la API

### Registro de Usuario
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "contraseña123"
  }'
```

### Inicio de Sesión
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jorgeyunda@gmail.com",
    "password": "contraseña"
  }'
```

### Crear una Propiedad (con token)
```bash
curl -X POST http://localhost:3000/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "Departamento Moderno",
    "description": "Hermoso departamento en el centro",
    "type": "apartamento",
    "price": 150000,
    "address": "Av. Principal 123"
  }'
```

### Obtener Todas las Propiedades
```bash
curl -X GET http://localhost:3000/properties
```

## 📦 Colección de Postman

La colección completa de Postman está disponible para descargar e importar directamente en tu cliente de Postman. Contiene todos los endpoints organizados por módulos con ejemplos de datos y configuración automática de tokens.

### Importar Colección
1. Abre Postman
2. Haz clic en "Import"
3. Selecciona el archivo de colección proporcionado
4. Configura las variables de entorno según tus credenciales

**Link de la colección:** `https://bold-water-9342402.postman.co/workspace/Andr%C3%A9s-Zambrano's-Workspace~bc8af3d5-d860-417a-8bc0-a9628a39ce27/collection/44963018-32ce9fa7-0b3e-4ff2-85ef-ad7e75fd1c19?action=share&source=copy-link&creator=44963082`

### Variables de Entorno en Postman
- `baseUrl`: http://localhost:3000
- `token`: (se establece automáticamente al iniciar sesión)

<hr>

<p align="center"><em>— Sistema de Gestión Inmobiliaria —</em></p>
