using Microsoft.OpenApi.Models;
using RemitosService.Common.Abstractions;
using RemitosService.Infrastructure.Data;
using RemitosService.Domain.Interfaces;
using RemitosService.Infrastructure.Repositories;
using RemitosService.Application.Interfaces;
using RemitosService.Application.Services;

var builder = WebApplication.CreateBuilder(args);

// Configurar puerto específico para RemitosService
builder.WebHost.UseUrls("http://localhost:5110");

// Configuración de DI para la capa de Datos
var connString = builder.Configuration.GetConnectionString("RemitosDb");
if (string.IsNullOrWhiteSpace(connString))
    throw new InvalidOperationException("La cadena de conexión 'RemitosDb' no está configurada.");
builder.Services.AddSingleton<IDbConnectionFactory>(new DbConnectionFactory(connString));

builder.Services.AddScoped<IRemitoRepository, RemitoRepository>();
builder.Services.AddScoped<IRemitoItemRepository, RemitoItemRepository>();
builder.Services.AddScoped<IDevolucionProveedorRepository, DevolucionProveedorRepository>();
builder.Services.AddScoped<IDevolucionItemRepository, DevolucionItemRepository>();

builder.Services.AddScoped<IRemitoService, RemitoService>();
builder.Services.AddScoped<IRemitoItemService, RemitoItemService>();
builder.Services.AddScoped<IDevolucionProveedorService, DevolucionProveedorService>();
builder.Services.AddScoped<IDevolucionItemService, DevolucionItemService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Remitos Service API", Version = "v1" });
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
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Remitos Service API V1");
        c.RoutePrefix = "";
    });
}

app.UseCors("AllowAll");

app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

app.Run();