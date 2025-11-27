# ProveedoresService

API RESTful para la gestión de **proveedores**, sus **teléfonos**, **direcciones**, **categorías** y **productos ofertados**, orientada a microservicios y al trabajo por Stored Procedures en la base **Proveedores_Compras_API_2**.

---

## 🏗️ Características Principales

- CRUD completo de Proveedores
- Gestión de teléfonos, direcciones y categorías por proveedor
- Asociación de productos ofrecidos por cada proveedor
- Soft delete (alta/baja lógica) y filtros activos/inactivos
- Validación y lógica de negocio centralizada en la base vía SP
- Documentación Swagger interactiva

---

## 🗂️ Estructura de Carpetas

```
/API/Controllers             - Endpoints HTTP para cada recurso
/Application
  /DTOs                      - Objetos de transferencia de datos (input/output)
  /Interfaces, /Services     - Lógica de negocio y contratos Services
/Common                      - Utilidades y abstracciones, enums y excepciones
/Domain
  /Entities                  - Entidades modelo de dominio
  /Interfaces                - Contratos de acceso a datos (Repo)
/Infrastructure
  /Data                      - Infraestructura de DB
  /Repositories              - Implementación de IRepos via SQL/SP
  /Mappers                   - Conversores entre DTOs y Entities
```

---

## 🚀 Puesta en marcha

1. **Restaurar la base de datos**  
   Ejecuta los scripts SQL en `/db` para crear la base y los stored procedures necesarios.

2. **Configurar `.env`**  
   Crea un archivo `.env`:

   ```
   ASPNETCORE_URLS=http://127.0.0.1:5090
   ConnectionStrings__ProveedoresDb=Server=.;Database=Proveedores_Compras_API_2;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true
   ```

3. **appsettings.json**  
   Verifica que existe y coincide la clave `ProveedoresDb` en la sección `ConnectionStrings`.

4. **Ejecutar el servicio**  
   ```
   dotnet run
   ```

5. **Acceder a la documentación Swagger**
   ```
   http://127.0.0.1:5090/swagger
   ```

---

## 🔑 Endpoints Principales

- `/api/proveedores`  
  CRUD y búsqueda de proveedores

- `/api/proveedores/{proveedorId}/telefonos`  
  CRUD de teléfonos de proveedor

- `/api/proveedores/{proveedorId}/direcciones`  
  CRUD de direcciones de proveedor

- `/api/proveedores/{proveedorId}/categorias`  
  Vinculación proveedor-categoría

- `/api/proveedores/{proveedorId}/productos`  
  Productos que ofrece un proveedor

- `/api/categorias`  
  ABM de las categorías

---

## ⚠️ Notas

- La lógica de datos y validación reside principalmente en stored procedures.
- Los cambios de estado (alta/baja) usan el campo `Activo` y los SP filtran por estado según corresponda.
- Las respuestas de la API siguen el esquema DTO para desacoplar la entidad y facilitar la evolución del backend.

---

## 📝 Autores

- [Alecap07](https://github.com/Alecap07)
- Soporte: GitHub Copilot Chat

---

## 📄 Licencia

MIT
