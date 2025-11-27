# Compras Service API

API RESTful para la gestión de **Presupuestos**, **Órdenes de Compra**, y sus **Ítems**. Diseñada para microservicios, con lógica de datos encapsulada en stored procedures y soporte para soft delete.

---

## 🏗️ Características Principales

- CRUD completo para Presupuestos, PresupuestoItems, OrdenesCompra y OrdenCompraItems.
- Búsqueda avanzada y filtros opcionales (por fechas, estado, proveedor, etc.).
- Soft delete (`Activo`) en todos los recursos.
- Acceso a datos desacoplado (Repositories, Services, DTOs).
- Lógica robusta en stored procedures SQL.
- Documentación interactiva vía Swagger.
- Pensada para escalar y crecer con nuevas entidades (Remitos, Facturas, Devoluciones, etc.).

---

## 🗂️ Estructura del Proyecto

```
/API/Controllers
    PresupuestosController.cs
    PresupuestoItemsController.cs
    OrdenesCompraController.cs
    OrdenCompraItemsController.cs

/Application
    /DTOs
    /Interfaces
    /Services

/Domain
    /Entities
    /Interfaces

/Infrastructure
    /Repositories
    /Data

/Mappers
/Common
    /Enums
    /Abstractions

Program.cs
ComprasService.csproj
appsettings.json
.env
.gitignore
README.md
```

---

## 🚀 Instalación y puesta en marcha

1. **Configura la base de datos**
   - Usar el nombre: `Compras_Compras_API_3`
   - Ejecuta los scripts SQL provistos para crear tablas y SPs.

2. **Configura el proyecto**
   - Ajusta `appsettings.json` y `.env` con tu cadena de conexión:
     ```
     Server=.;Database=Compras_Compras_API_3;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true
     ```

3. **Recupera paquetes y ejecuta**
   ```
   dotnet restore
   dotnet run
   ```

4. **Accede a Swagger UI**
   - [http://localhost:5100/swagger](http://localhost:5100/swagger)

---

## 🔑 Endpoints principales

- `/api/presupuestos`           → CRUD y búsqueda de presupuestos
- `/api/presupuesto-items`      → CRUD y filtro de ítems de presupuesto
- `/api/ordenes-compra`         → CRUD y búsqueda de órdenes de compra
- `/api/orden-compra-items`     → CRUD y filtro de ítems de orden de compra

Todos los recursos soportan filtros opcionales en los GET.

---

## ⚠️ Notas

- Los endpoints de lectura permiten filtrar por ID o devolver listado general con filtros opcionales (más flexible).
- El campo lógico `Activo` implementa soft delete.
- Las stored procedures centralizan el acceso/validación.

---

## ✍️ Pendiente / Sugerencias

- Agregar módulos de Remitos, Facturas, Notas de Crédito/Débito y Reportes.
- Implementar seguridad/autorización.
- Automatizar tests.
- Mejorar paginación y performance para grandes volúmenes de datos.

---

## 👨‍💻 Autor

- [Alecap07](https://github.com/Alecap07)

---