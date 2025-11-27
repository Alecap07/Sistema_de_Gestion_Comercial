// placeholder
using Microsoft.OpenApi.Models;
using FacturasService.Common.Abstractions;
using FacturasService.Infrastructure.Data;
using FacturasService.Domain.Interfaces;
using FacturasService.Infrastructure.Repositories;
using FacturasService.Application.Interfaces;
using FacturasService.Application.Services;

var builder = WebApplication.CreateBuilder(args);

// Configurar puerto específico para FacturasService
builder.WebHost.UseUrls("http://localhost:5100");

var connString = builder.Configuration.GetConnectionString("FacturasDb");
if (string.IsNullOrWhiteSpace(connString))
    throw new InvalidOperationException("No se encontró la cadena de conexión 'FacturasDb'.");
builder.Services.AddSingleton<IDbConnectionFactory>(new DbConnectionFactory(connString));

builder.Services.AddScoped<IFacturaCompraRepository, FacturaCompraRepository>();
builder.Services.AddScoped<IFacturaCompraItemRepository, FacturaCompraItemRepository>();
builder.Services.AddScoped<IFacturaCompraRemitoRepository, FacturaCompraRemitoRepository>();
builder.Services.AddScoped<INotaCreditoRepository, NotaCreditoRepository>();
builder.Services.AddScoped<INotaDebitoRepository, NotaDebitoRepository>();

builder.Services.AddScoped<IFacturaCompraService, FacturaCompraService>();
builder.Services.AddScoped<IFacturaCompraItemService, FacturaCompraItemService>();
builder.Services.AddScoped<IFacturaCompraRemitoService, FacturaCompraRemitoService>();
builder.Services.AddScoped<INotaCreditoService, NotaCreditoService>();
builder.Services.AddScoped<INotaDebitoService, NotaDebitoService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Facturas Service API", Version = "v1" });
});

// Configurar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Facturas Service API V1");
        c.RoutePrefix = "";
    });
}

app.UseCors("AllowAll");

app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

app.Run();