using ComprasService.Application.Interfaces;
using ComprasService.Application.Services;
using ComprasService.Domain.Interfaces;
using ComprasService.Infrastructure.Repositories;
using ComprasService.Common.Abstractions;
using Microsoft.OpenApi.Models;
using ComprasService.Infrastructure.Data;
var builder = WebApplication.CreateBuilder(args);

// Cargar configuración y connection string
var connString = builder.Configuration.GetConnectionString("ComprasDb");

// Servicios de acceso a BD
builder.Services.AddSingleton<IDbConnectionFactory>(new SqlConnectionFactory(connString));

// DI para repos y services principales (por cada recurso)
builder.Services.AddScoped<IPresupuestoRepository, PresupuestoRepository>();
builder.Services.AddScoped<IPresupuestoService, PresupuestoService>();
builder.Services.AddScoped<IPresupuestoItemRepository, PresupuestoItemRepository>();
builder.Services.AddScoped<IPresupuestoItemService, PresupuestoItemService>();
builder.Services.AddScoped<IOrdenCompraRepository, OrdenCompraRepository>();
builder.Services.AddScoped<IOrdenCompraService, OrdenCompraService>();
builder.Services.AddScoped<IOrdenCompraItemRepository, OrdenCompraItemRepository>();
builder.Services.AddScoped<IOrdenCompraItemService, OrdenCompraItemService>();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Compras Service API", Version = "v1" });
});

builder.Services.AddControllers();

// CORS
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
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Compras Service API V1");
        c.RoutePrefix = "";
    });
}

app.UseCors("AllowAll");

app.UseHttpsRedirection();
app.UseAuthorization();


app.MapControllers();

app.Run();