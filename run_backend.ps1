$projects = @(
    "Sistema_Gestion_Stock\Backend\ModuloAlmacenes\AlmacenesService\API",
    "Sistema_Gestion_Usuarios\Api",
    "Sistema_Gestion_Stock\Backend\ModuloCompras\ReservaProductosService\ReservaProductosService\src\ReservaProductosService",
    "Sistema_Gestion_Stock\Backend\ModuloCompras\ProductosService",
    "Sistema_Gestion_Stock\Backend\ModuloCompras\RemitosService",
    "Sistema_Gestion_Stock\Backend\ModuloCompras\FacturasService",
    "Sistema_Gestion_Stock\Backend\ModuloCompras\devolucionesventa\src\NotasPedidoService",
    "Sistema_Gestion_Stock\Backend\ModuloCompras\ProveedoresService",
    "Sistema_Gestion_Stock\Backend\ModuloCompras\ComprasService",
    "Sistema_Gestion_Stock\Backend\ModuloCompras\ClientesService\ClientesService\src\ClientesService",
    "Sistema_Gestion_Stock\Backend\ModuloCompras\PresupuestosService\src\PresupuestosService",
    "Sistema_Gestion_Stock\Backend\ModuloCompras\Notaspedidos\src\NotasPedidoService",
    "Sistema_Gestion_Stock\Backend\ModuloCompras\NotasDebitoServices\src\NotasPedidoService",
    "Sistema_Gestion_Stock\Backend\ModuloCompras\NotasCreditoService\src\NotasPedidoService"
)

$root = Get-Location

foreach ($proj in $projects) {
    $fullPath = Join-Path $root $proj
    if (Test-Path $fullPath) {
        Write-Host "Starting service in: $proj" -ForegroundColor Green
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$fullPath'; dotnet run"
    } else {
        Write-Host "Path not found: $fullPath" -ForegroundColor Red
    }
}
