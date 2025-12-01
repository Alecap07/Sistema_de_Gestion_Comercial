# Sistema de Gestión Comercial

Sistema modular para la gestión integral de un entorno comercial, incluyendo stock, compras, ventas y usuarios.
El proyecto está dividido en múltiples servicios backend en .NET y varios frontends en React/Vite.

## Módulos principales

- **Sistema_Gestion_Stock**
	- **Backend**
		- `Backend/ModuloAlmacenes/AlmacenesService`: gestión de productos, movimientos de stock y scrap.
		- `Backend/ModuloCompras/ComprasService`: presupuestos y órdenes de compra.
		- `Backend/ModuloCompras/FacturasService`: facturas de compra, notas de crédito y débito.
		- `Backend/ModuloCompras/devolucionesventa`: devoluciones de venta.
		- `Backend/ModuloCompras/NotasCreditoService`: notas de crédito de venta.
		- `Backend/ModuloCompras/NotasDebitoServices`: notas débito de venta.
		- `Backend/ModuloCompras/Notaspedidos`: notas de pedido de venta.
		- `Backend/ModuloCompras/PresupuestosService`: presupuestos de ventas.
		- `Backend/ModuloCompras/ProductosService`: catálogo de productos.
		- `Backend/ModuloCompras/ProveedoresService`: gestión de proveedores.
		- `Backend/ModuloCompras/RemitosService`: remitos y devoluciones a proveedores.
		- `Backend/ModuloCompras/ReservaProductosService`: reserva de productos.
	- **Frontend**
		- `Sistema_Gestion_Stock/Frontend`: panel principal de stock/compras/ventas (React + Vite + TypeScript).
		- Frontends específicos dentro de algunos servicios (por ejemplo, productos, proveedores, almacenes).

- **Sistema_Gestion_Usuarios**
	- API en .NET para autenticación, autorización y administración de usuarios, roles y permisos.
	- Frontend React independiente en `Sistema_Gestion_Usuarios/frontend`.

## Tecnologías

- **Backend**
	- .NET / ASP.NET Core (APIs REST).
	- SQL Server (archivos `.bak` en la carpeta `BD'S/`).

- **Frontend**
	- React + Vite.
	- TypeScript en el frontend principal de stock.
	- Axios para llamadas HTTP.
	- TailwindCSS y CSS modular.
	- styled-components.

## Requisitos previos

- **Node.js** (versión recomendada: LTS actual).
- **npm** o **pnpm**.
- **.NET SDK** (versión compatible con los proyectos `.csproj`, por ejemplo .NET 8 o similar).
- **SQL Server** (local o remoto) para restaurar las bases de datos `.bak`.

## Puesta en marcha rápida

### 1. Backend (servicios principales)

En la raíz del repo (`Sistema_de_Gestion_Comercial`) puedes usar el script:

```powershell
.\run_backend.ps1
```

Este script intenta levantar varios proyectos backend (`dotnet run`) en ventanas de PowerShell separadas (Almacenes, Compras, Facturas, Devoluciones, Notas, Proveedores, etc.).

También puedes ejecutarlos manualmente, por ejemplo:

```powershell
cd .\Sistema_Gestion_Stock\Backend\ModuloCompras\ComprasService
dotnet run
```

Repite en cada servicio que necesites.

### 2. Frontend de Stock / Compras / Ventas

```powershell
cd .\Sistema_Gestion_Stock\Frontend
npm install
npm run dev
```

Luego abre el navegador en la URL que muestre Vite (por defecto `http://localhost:5173`).

### 3. Frontend de Usuarios

```powershell
cd .\Sistema_Gestion_Usuarios\frontend
npm install
npm run dev
```

## Bases de datos

En la carpeta `BD'S/` se incluyen backups `.bak` para las distintas APIs:

- `Almacen_Stock_API_1.bak`
- `Compras_Compras_API_3.bak`
- `DevolucionesVenta_Ventas_API_7.bak`
- `Facturas_Compras_API_5.bak`
- `Gestion_Usuarios.bak`
- `Intranet.bak`
- `NotasCredito_Ventas_API_4.bak`
- `NotasDebito_Ventas_API_5.bak`
- `NotasPedido_Ventas_API_6.bak`
- `Presupuestos_Ventas_API_2.bak`
- `Productos_Compras_API_1.bak`
- `Proveedores_Compras_API_2.bak`
- `Remitos_Compras_API_4.bak`
- `ReservaProductos_Ventas_API_3.bak`

Restáuralas en tu instancia de SQL Server y configura las cadenas de conexión (`connectionStrings`) en los `appsettings.json` correspondientes de cada servicio.

## Estructura de carpetas (resumen)

- `BD'S/` – backups de bases de datos.
- `DiseñoArquitectura/` – diagramas y documentación de arquitectura.
- `Documentacion/` – documentación adicional.
- `Sistema_Gestion_Stock/`
	- `Backend/` – todos los microservicios de stock/compras/ventas.
	- `Frontend/` – frontend principal (React/Vite/TypeScript).
- `Sistema_Gestion_Usuarios/`
	- `Api/` – API de usuarios.
	- `frontend/` – frontend de gestión de usuarios.

## Estado del proyecto

Este repositorio se encuentra en desarrollo activo y puede contener cambios frecuentes en la estructura de servicios y frontends.
Se recomienda revisar los `README.md` dentro de cada servicio para detalles específicos de endpoints y configuración.

---

Cualquier contribución o mejora es bienvenida mediante *pull requests* o *issues* en este repositorio.
