# ProductosService (Módulo Compras) — .NET 8 + Stored Procedures

Microservicio de Productos para el Módulo de Compras. Arquitectura por capas (Domain, Application, Infrastructure, API, Common y Mappers), acceso a datos con ADO.NET y lógica en Stored Procedures de SQL Server. Swagger habilitado solo en entorno Development.

Además:
- Soft delete por campo Activo (BIT). No hay endpoints DELETE.
- Filtro tri-estado en listados con `estado=activos|inactivos|todos` (enum `EstadoFiltro`).
- Variables en `.env` para puertos y cadenas de conexión (DotNetEnv).
- Health-check en `/` (oculto en Swagger).
- Ajuste de stock como comando no idempotente.

Si replicás este patrón para otros microservicios (Proveedores, Compras, Almacén, Facturación), copiá estructura y adapta entidades, SPs y endpoints.

---

## Requisitos

- .NET SDK 8.x
- SQL Server (local o remoto)
- Base de datos existente: `Productos_Compras_API_1`
- Tablas: `dbo.Productos`, `dbo.Categorias`, `dbo.Marcas` (cada una con columna `Activo BIT NOT NULL DEFAULT(1)`)
- Stored Procedures cargados en la BD (ver sección “Base de datos”)

---

## Estructura del proyecto

```
ProductosService/
├─ ProductosService.csproj
├─ Program.cs
├─ appsettings.json
├─ .env
├─ API/
│  └─ Controllers/
│     ├─ ProductosController.cs
│     ├─ CategoriasController.cs
│     └─ MarcasController.cs
├─ Application/
│  ├─ DTOs/
│  │  ├─ ProductoDTO.cs
│  │  ├─ CategoriaDTO.cs
│  │  └─ MarcaDTO.cs
│  ├─ Interfaces/
│  │  ├─ IProductoService.cs
│  │  ├─ ICategoriaService.cs
│  │  └─ IMarcaService.cs
│  └─ Services/
│     ├─ ProductoService.cs
│     ├─ CategoriaService.cs
│     └─ MarcaService.cs
├─ Domain/
│  ├─ Entities/
│  │  ├─ Producto.cs
│  │  ├─ Categoria.cs
│  │  └─ Marca.cs
│  └─ Interfaces/
│     ├─ IProductoRepository.cs
│     ├─ ICategoriaRepository.cs
│     └─ IMarcaRepository.cs
├─ Infrastructure/
│  ├─ Data/
│  │  └─ DbConnectionFactory.cs
│  └─ Repositories/
│     ├─ ProductoRepository.cs
│     ├─ CategoriaRepository.cs
│     └─ MarcaRepository.cs
├─ Common/
│  ├─ Abstractions/
│  │  └─ IDbConnectionFactory.cs
│  ├─ Enums/
│  │  └─ EstadoFiltro.cs          # Todos=0, Activos=1, Inactivos=2
│  └─ Exceptions/
│     ├─ NotFoundException.cs
│     └─ ValidationException.cs
└─ Mappers/
   ├─ ProductoMapper.cs
   ├─ CategoriaMapper.cs
   └─ MarcaMapper.cs
```

---

## Configuración de entorno (.env)

El servicio carga variables desde `.env` (copiado al directorio de salida por el `.csproj`) usando [DotNetEnv].

Ejemplo de `.env` (puerto 5080 y cadena de conexión):

```
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://127.0.0.1:5080
ConnectionStrings__ProductosDb=Server=.;Database=Productos_Compras_API_1;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true
```

Notas:
- Podés sobreescribir `appsettings.json` con variables de entorno como `ConnectionStrings__ProductosDb`.
- Si agregás HTTPS, confiá el certificado de desarrollo: `dotnet dev-certs https --trust`.

---

## Configuración (appsettings.json)

```json
{
  "ConnectionStrings": {
    "ProductosDb": "Server=.;Database=Productos_Compras_API_1;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

---

## Paquetes NuGet

- `Microsoft.Data.SqlClient`
- `Swashbuckle.AspNetCore` (Swagger)
- `DotNetEnv` (lectura de .env; se sugiere 3.0.0)

```xml
<ItemGroup>
  <PackageReference Include="Microsoft.Data.SqlClient" Version="5.2.1" />
  <PackageReference Include="Swashbuckle.AspNetCore" Version="6.6.2" />
  <PackageReference Include="DotNetEnv" Version="3.0.0" />
</ItemGroup>

<ItemGroup>
  <None Include=".env">
    <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
  </None>
</ItemGroup>
```

---

## Base de datos

BD: `Productos_Compras_API_1`.

Asegurate de que cada tabla tenga columna `Activo BIT NOT NULL DEFAULT(1)`. Los Stored Procedures implementan lógica y validaciones, incluyendo el filtro por estado tri-valor.

SPs esperados:

- Categorías
  - `sp_Categorias_GetAll(@Estado TINYINT = 1)` → 0=Todos, 1=Activos, 2=Inactivos
  - `sp_Categorias_GetById(@Id)`
  - `sp_Categorias_Create(@Nombre, @NewId OUTPUT)`
  - `sp_Categorias_Update(@Id, @Nombre, @Activo)`

- Marcas
  - `sp_Marcas_GetAll(@Estado TINYINT = 1)`
  - `sp_Marcas_GetById(@Id)`
  - `sp_Marcas_Create(@Nombre, @NewId OUTPUT)`
  - `sp_Marcas_Update(@Id, @Nombre, @Activo)`

- Productos
  - `sp_Productos_GetById(@Id)`
  - `sp_Productos_GetByCodigo(@Codigo)`
  - `sp_Productos_Search(@Nombre, @CategoriaId, @MarcaId, ... , @Estado TINYINT = 1, @TotalCount OUTPUT)`  ← el servicio usa la parte de resultados
  - `sp_Productos_Create(..., @NewId OUTPUT)`  ← crea con `Activo=1`
  - `sp_Productos_Update(@Id, ..., @Activo)`
  - `sp_Productos_AdjustStockDelta(@ProductoId, @Delta, @NewStock OUTPUT)`  ← valida Activo=1 y no permite stock negativo

Observaciones:
- No se usan SPs de DELETE (soft delete).
- `sp_Productos_AdjustStockDelta` puede fallar si:
  - El producto está deshabilitado (`Activo=0`) al momento del ajuste.
  - La operación dejaría el stock en negativo.

---

## Endpoints (sin DELETE)

Base URL: `http://127.0.0.1:5080/api`

Los listados aceptan `estado=activos|inactivos|todos` (enum `EstadoFiltro`) y por defecto es `activos`.

### Productos

- GET `/api/productos`
  - Query params:
    - `nombre` (string) → busca por Nombre o Código (contains)
    - `categoriaId` (int)
    - `marcaId` (int)
    - `estado` (enum) → `activos` (default) | `inactivos` | `todos`
- GET `/api/productos/{id:int}`
  - Devuelve el producto (incluye `Activo`).
- GET `/api/productos/codigo/{codigo}`
  - Búsqueda directa por código exacto.
- POST `/api/productos`
  - Crea producto (se crea `Activo=true`). Respuesta `201 Created` con Id.
- PUT `/api/productos/{id:int}`
  - Actualiza datos y también permite cambiar `Activo` (habilitar/deshabilitar).
- POST `/api/productos/{id:int}/stock/ajustar?delta={int}`
  - Ajusta el stock sumando `delta` (positivo o negativo).
  - Respuesta: `{ productoId, newStock }`.
  - Reglas: falla si el producto está inactivo o si el stock quedaría negativo.

Ejemplos:
```bash
# Listar activos (default)
curl -s "http://127.0.0.1:5080/api/productos"

# Listar inactivos
curl -s "http://127.0.0.1:5080/api/productos?estado=inactivos"

# Buscar por nombre, incluyendo todos
curl -s "http://127.0.0.1:5080/api/productos?nombre=harina&estado=todos"

# Obtener por código
curl -s "http://127.0.0.1:5080/api/productos/codigo/PR-0001"

# Crear
curl -s -X POST http://127.0.0.1:5080/api/productos -H "Content-Type: application/json" -d '{
  "codigo": "PR-0001",
  "nombre": "Producto Demo",
  "categoriaId": 1,
  "marcaId": 1,
  "precioCompra": 120.50,
  "precioVenta": 200.00,
  "stockActual": 10
}'

# Deshabilitar (vía PUT general incluyendo Activo)
curl -s -X PUT http://127.0.0.1:5080/api/productos/1 -H "Content-Type: application/json" -d '{
  "codigo": "PR-0001",
  "nombre": "Producto Demo",
  "categoriaId": 1,
  "marcaId": 1,
  "precioCompra": 120.50,
  "precioVenta": 200.00,
  "stockActual": 10,
  "activo": false
}'

# Ajustar stock (+5)
curl -s -X POST "http://127.0.0.1:5080/api/productos/1/stock/ajustar?delta=5"
```

### Categorías

- GET `/api/categorias?estado={activos|inactivos|todos}`
- GET `/api/categorias/{id:int}`
- POST `/api/categorias`
- PUT `/api/categorias/{id:int}`  (incluye `Activo` para habilitar/deshabilitar)

Ejemplos:
```bash
curl -s "http://127.0.0.1:5080/api/categorias?estado=todos"
curl -s http://127.0.0.1:5080/api/categorias/1
curl -s -X POST http://127.0.0.1:5080/api/categorias -H "Content-Type: application/json" -d '{"nombre":"Alimentos"}'
curl -s -X PUT http://127.0.0.1:5080/api/categorias/1 -H "Content-Type: application/json" -d '{"nombre":"Bebidas","activo":true}'
```

### Marcas

- GET `/api/marcas?estado={activos|inactivos|todos}`
- GET `/api/marcas/{id:int}`
- POST `/api/marcas`
- PUT `/api/marcas/{id:int}`  (incluye `Activo` para habilitar/deshabilitar)

Ejemplos:
```bash
curl -s "http://127.0.0.1:5080/api/marcas?estado=activos"
curl -s http://127.0.0.1:5080/api/marcas/1
curl -s -X POST http://127.0.0.1:5080/api/marcas -H "Content-Type: application/json" -d '{"nombre":"Acme"}'
curl -s -X PUT http://127.0.0.1:5080/api/marcas/1 -H "Content-Type: application/json" -d '{"nombre":"Acme Updated","activo":false}'
```

### Health-check

- GET `/` → `{ service, status, env }`
- Oculto en Swagger para mantener limpia la especificación.

---

## Ejecución

1) Restaurar y compilar:
```bash
dotnet restore
dotnet build
```

2) Desarrollo (Swagger UI activo):
```bash
set ASPNETCORE_ENVIRONMENT=Development
dotnet run
```
- Swagger UI: `http://127.0.0.1:5080/swagger`
- Health: `http://127.0.0.1:5080/`

3) Producción:
```bash
set ASPNETCORE_ENVIRONMENT=Production
dotnet run
```
- Swagger UI no visible.

---

## Arquitectura y principios

- Capas claras: API → Application (Services/DTOs) → Domain (Entities/Interfaces) → Infrastructure (Repos/ADO.NET) → Common (abstracciones/utilidades) → Mappers.
- Acceso a datos:
  - ADO.NET (`Microsoft.Data.SqlClient`) y `IDbConnectionFactory` para desacoplar la conexión.
  - Lógica crítica y validaciones en Stored Procedures (transacciones con TRY/CATCH y `THROW`).
- Soft delete:
  - Campo `Activo BIT` en todas las entidades principales.
  - No hay DELETE; se usa `PUT` para (des)habilitar.
  - Listados filtran por `EstadoFiltro` (`activos` por default; `inactivos` y `todos` disponibles).
- Diseño de endpoints:
  - `GET` de colección con filtros opcionales; `GET` por Id y por Código (Productos).
  - `POST` crea (siempre `Activo=true`).
  - `PUT` actualiza campos y también `Activo`.
  - Comandos no idempotentes separados (ajuste de stock).

---

## Manejo de errores

- Los SP usan `THROW` con códigos (ej. `50052` stock negativo, `50122` código duplicado).
- Por defecto, errores se traducen a 500. Recomendado agregar middleware global para mapear:
  - Validaciones → 400 Bad Request
  - Conflictos (duplicados) → 409 Conflict
  - No encontrado → 404 Not Found

---

## Extensiones y siguientes pasos

- Paginación y orden en `GET /api/productos` usando los parámetros de `sp_Productos_Search` (`@PageNumber`, `@PageSize`, `@OrderBy`, `@OrderDir`, `@TotalCount`).
- Autenticación/Autorización (JWT).
- Middleware de `ProblemDetails` y logging.
- Comunicación entre microservicios por eventos (opcional):
  - Patrón Transactional Outbox en la BD y publicación a broker (RabbitMQ/Kafka/ASB).
  - Consumidores idempotentes con Inbox.
  - Envelope con `correlationId` y versionado (e.g., `productos.actualizado.v1`).
  - Esta guía se centra en el API/BD; la mensajería se puede integrar como módulo adicional.

---

## Solución de problemas

- “already contains a definition / ambiguous”: archivos duplicados o contenido pegado por duplicado. Borrar duplicados y asegurar una sola clase/interfaz por archivo.
- Limpiar y reconstruir:
  ```bash
  dotnet clean
  dotnet build
  ```
- Ver puertos activos:
  - Swagger UI: `http://127.0.0.1:5080/swagger`
  - Asegurate que `.env` se copia al output (`bin/Debug/net8.0/.env`).

---

## Licencia

Pendiente de definición (MIT, Apache-2.0, etc.).

[DotNetEnv]: https://github.com/tonerdo/dotnet-env