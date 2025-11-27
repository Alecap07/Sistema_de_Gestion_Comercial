// placeholder
# Facturas Service API

Microservicio RESTful para la gestión de **Facturas de Compra**, **Ítems de Factura**, **Remitos vinculados**, **Notas de Crédito** y **Notas de Débito**.

---

## 🚀 Características Principales

- CRUD completo para FacturasCompra, FacturaCompraItems, FacturaCompraRemitos, NotasCredito y NotasDebito.
- Filtros opcionales y búsqueda avanzada en endpoints GET.
- Soft delete en todas las entidades (`Activo`).
- Arquitectura por capas (Domain, Application, Infrastructure).
- Acceso a base de datos mediante stored procedures.
- Validaciones, manejo de excepciones personalizadas y utilidades propias.
- Documentación interactiva automáticamente vía Swagger.
- Listo para ampliarse a nuevos comprobantes o integraciones.

---

## 🗂️ Estructura del Proyecto

```
/API/Controllers
    FacturaCompraItemsController.cs
    FacturaCompraRemitosController.cs
    FacturasCompraController.cs
    NotasCreditoController.cs
    NotasDebitoController.cs

/Application
    /DTOs
    /Interfaces
    /Services

/Common
    /Abstractions
    /Enums
    /Exceptions
    /Utilities

/Domain
    /Entities
    /Interfaces

/Infrastructure
    /Data
    /Repositories

/Mappers

Program.cs
appsettings.json
.env
.gitignore
FacturasService.csproj
README.md
```

---

## 🛠️ Instalación y ejecución

1. **Configura la base de datos**
   - Genera y ejecuta las tablas y stored procedures (ver `/sql/` si incluyes los scripts).
   - Usa el nombre sugerido: `Facturas_API_1`.

2. **Configura la app**
   - Modifica el string de conexión en `appsettings.json` o `.env`:
     ```
     Server=.;Database=Facturas_API_1;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true
     ```

3. **Restaurar dependencias y ejecutar**
   ```sh
   dotnet restore
   dotnet run
   ```

4. **Explora la API en Swagger**
   - [http://localhost:5300/swagger](http://localhost:5300/swagger)

---

## 🔑 Endpoints principales

- `/api/facturas-compra`           → CRUD y búsqueda de facturas
- `/api/factura-compra-items`      → CRUD y filtro de ítems de factura
- `/api/factura-compra-remitos`    → CRUD y vinculación factura-remito
- `/api/notas-credito`             → CRUD y consulta de notas de crédito
- `/api/notas-debito`              → CRUD y consulta de notas de débito

Todos los endpoints soportan filtros y paginación/ordenamiento si se agrega.

---

## ⚠️ Notas

- El borrado lógico se realiza modificando el campo `Activo` (soft delete).
- Los servicios usan stored procedures. La lógica en C# es simple y desacoplada.
- Existen utilidades para fechas y strings; excepciones de validación y no encontrado.

---

## 💡 Extras y recomendaciones

- Agregar autenticación/seguridad (JWT o similar).
- Sumar control de auditoría (campos CreatedAt/UpdatedAt).
- Implementar tests y documentación extendida.
- Paginación y ordenamiento en listados para grandes volúmenes.

---

## 👨‍💻 Autor

- [Alecap07](https://github.com/Alecap07)

---