<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

<p align="center">
  Backend API desarrollada con <a href="http://nodejs.org" target="_blank">Node.js</a> y
  <a href="https://nestjs.com" target="_blank">NestJS</a> para la gestión de una plataforma inmobiliaria.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-v10-red" alt="NestJS" />
  <img src="https://img.shields.io/badge/PostgreSQL-DB-blue" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/MongoDB-NoSQL-green" alt="MongoDB" />
  <img src="https://img.shields.io/badge/JWT-Auth-orange" alt="JWT" />
</p>

---

## 📄 Description

API backend para una **plataforma inmobiliaria**, desarrollada con **NestJS**.
El sistema permite administrar usuarios, agentes, propiedades, categorías, ubicaciones,
citas, contratos, transacciones y solicitudes, utilizando **JWT**, **control de roles**,
**paginación estándar** y conexión a **PostgreSQL y MongoDB**.

---

## 🚀 Technologies

- Node.js
- NestJS
- PostgreSQL
- MongoDB
- TypeORM
- Mongoose
- Passport JWT
- nestjs-typeorm-paginate
- class-validator
- dotenv

---

## ⚙️ Project setup

```bash
npm install
```

---

## 🔐 Environment variables

Crear un archivo `.env` en la raíz del proyecto:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=tu_password
DB_NAME=inmobiliaria_db
MONGO_URI=mongodb://localhost:27017/inmobiliaria
JWT_SECRET=supersecret
JWT_EXPIRES_IN=3600s
```

---

## ▶️ Compile and run the project

```bash
npm run start
npm run start:dev
npm run start:prod
```

Servidor disponible en `http://localhost:3000`

---

## Project structure

```
src/
│── auth/
│── users/
│── agents/
│── properties/
│── property-features/
│── categories/
│── locations/
│── appointments/
│── contracts/
│── transactions/
│── mail/
│── images/        # MongoDB
│── requests/      # MongoDB
│── common/
│── app.module.ts
│── main.ts
```

---

## Modules

```
🔐 Auth

Login y registro de usuarios

Autenticación JWT

Guards y roles

👤 Users

Gestión de usuarios

Roles (admin, agente, cliente)

🧑‍💼 Agents

Información de agentes inmobiliarios

🏡 Properties

Gestión de propiedades

Precio, estado y descripción

🧩 Property Features

Características de propiedades

Habitaciones, baños, parqueadero

🗂️ Categories

Tipos de propiedades

📍 Locations

Ubicación de propiedades

📅 Appointments

Citas entre clientes y agentes

📑 Contracts

Contratos de alquiler o venta

💰 Transactions

Registro de pagos y transacciones

✉️ Mail

Envío y registro de correos

🖼️ Images (MongoDB)

Almacenamiento de imágenes

📨 Requests (MongoDB)

Solicitudes de contacto
```

---

## Pagination

```
Se utiliza nestjs-typeorm-paginate en todos los endpoints de listado.

Formato de respuesta estándar:
{
  "data": [],
  "meta": {
    "totalItems": 0,
    "itemCount": 0,
    "itemsPerPage": 10,
    "totalPages": 0,
    "currentPage": 1
  }
}
```

---

## Common

```
Carpeta de recursos compartidos del proyecto.

DTOs

query.dto.ts

response.dto.ts

Filters

http-exception.filter.ts

Guards & Decorators

JwtAuthGuard

RolesGuard

@Roles()
```

---

## Authentication

```
Login:

POST /auth/login


Uso del token:

Authorization: Bearer <JWT_TOKEN>
```

---

## Notes

```
1. synchronize: true solo para desarrollo

2. No subir el archivo .env al repositorio

3. MongoDB se usa para datos no relacionales
```

---

## Authors

```
Proyecto desarrollado por `Andrés Zambrano`, `Danny Guaman` y `Alex Macias`
Backend – NestJS | PostgreSQL | MongoDB
```

