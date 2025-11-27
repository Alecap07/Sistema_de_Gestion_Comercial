# ReservaProductosService

Microservicio para gestionar productos reservados (apartados) asociados a una Nota de Pedido de Venta.

## Endpoints

| Método | Ruta                                      | Descripción                                    |
|--------|-------------------------------------------|------------------------------------------------|
| POST   | /api/productos-reservados                | Crear un producto reservado                    |
| GET    | /api/productos-reservados                | Listar productos reservados activos            |
| GET    | /api/productos-reservados/{id}           | Obtener un producto reservado por Id (incluye inactivo) |
| PUT    | /api/productos-reservados/{id}           | Actualizar campos (ignora nulls)               |
| PATCH  | /api/productos-reservados/{id}/cancelar  | Marcar como inactivo (soft delete)             |

## Estructura de capas

- Domain: Entidades y contratos (interfaces repositorio).
- Infrastructure: Implementaciones Dapper y acceso a SQL Server.
- Application: DTOs, Mapping y Services (usa Result<T>).
- Api: Controllers que exponen endpoints REST.
- Common: Utilidades compartidas (Result, PaginatedResult).
- Properties: Configuración (appsettings, launchSettings).

## Stored Procedures usados

- sp_ProductosReservados_Create
- sp_ProductosReservados_GetById
- sp_ProductosReservados_List (activos)
- sp_ProductosReservados_Update
- sp_ProductosReservados_Cancel (soft delete)

## Variables de entorno (.env)

```
ASPNETCORE_URLS=http://localhost:5500
DB_SERVER=localhost
DB_DATABASE=ReservaProductos_Ventas_API_3
DB_USER=sa
DB_PASSWORD=SuperSecret123!
DB_TRUST_CERT=True
```

Si `DB_USER` y `DB_PASSWORD` no se definen, se usa Trusted_Connection.

## Ejecución

```bash
dotnet restore
dotnet run --project src/ReservaProductosService/ReservaProductosService.csproj
```

## Futuras mejoras

- Paginación (añadir SP o SELECT con OFFSET/FETCH).
- Auditoría (fechas creación/modificación).
- Middleware global de excepciones y logging estructurado.
- Cache para GET por Id si se consulta frecuentemente.

## Licencia

Uso interno.