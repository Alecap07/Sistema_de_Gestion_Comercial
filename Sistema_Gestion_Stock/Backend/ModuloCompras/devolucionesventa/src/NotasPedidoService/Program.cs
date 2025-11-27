using AutoMapper;
using DevolucionesService.Application.Mappers;
using DevolucionesService.Application.Services;
using DevolucionesService.Application.Services.Impl;
using DevolucionesService.Domain.IRepositories;
using DevolucionesService.Infrastructure.Data;
using DevolucionesService.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Configurar puerto 5120
builder.WebHost.UseUrls("http://localhost:5120");

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

// Controllers
builder.Services.AddControllers();

// Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// AutoMapper - registra todos los profiles del assembly
builder.Services.AddAutoMapper(typeof(DevolucionVentaMappingProfile).Assembly);

// Database Factory + DI setup
builder.Services.AddSingleton<DbConnectionFactory>();

// Repositories
builder.Services.AddScoped<IDevolucionesVentaRepository, DevolucionesVentaRepository>();
builder.Services.AddScoped<IDevolucionVentaItemsRepository, DevolucionVentaItemsRepository>();

// Services
builder.Services.AddScoped<IDevolucionesVentaService, DevolucionesVentaService>();
builder.Services.AddScoped<IDevolucionVentaItemsService, DevolucionVentaItemsService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "DevolucionesService v1");
        options.RoutePrefix = ""; // Swagger en la raíz
    });
}

app.UseHttpsRedirection();

// CORS debe ir antes de Authorization
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
