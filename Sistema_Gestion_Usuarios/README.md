# Sistema de Gestión de Stock

## Requisitos
- Node.js (recomendado v18+)
- .NET 9.0 SDK
- SQL Server (con la base de datos configurada)

## Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/Alecap07/Sistema-de-Gestion-de-Stock.git
cd Sistema-de-Gestion-de-Stock
```

### 2. Backend (.NET)
Instala las dependencias NuGet:
```bash
dotnet restore
```

Compila y ejecuta la API:
```bash
cd Api
dotnet build
dotnet run
```

### 3. Frontend (React)


Instala las dependencias npm (incluye react-router-dom):
```bash
cd ../frontend
npm install --legacy-peer-deps
```

Inicia la app React:
```bash
npm start
```

## Notas
- El archivo `.gitignore` evita subir dependencias (`node_modules`, `bin/`, `obj/`, etc). Por eso siempre debes correr los comandos de instalación antes de ejecutar el proyecto.
- Configura tu cadena de conexión a SQL Server en `Api/appsettings.json` si es necesario.

---

¿Dudas? Crea un issue en el repo o contacta al autor.
