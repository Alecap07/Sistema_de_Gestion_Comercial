using ClientesService.Application.Services;
using ClientesService.Domain.Repositories;
using ClientesService.Infrastructure.Data;
using ClientesService.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// --- 1. REGISTRO DE SERVICIOS (Incluyendo CORS) ---
// Configuración de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});


// Servicios de Infraestructura y Aplicación
builder.Services.AddSingleton<ISqlConnectionFactory, SqlConnectionFactory>();
builder.Services.AddScoped<IClientesRepository, ClientesRepository>();
builder.Services.AddScoped<IClientesService, ClientesService.Application.Services.ClientesService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();

// --- 2. CONFIGURACIÓN DEL PIPELINE DE MIDDLEWARE ---

// Habilitar CORS
app.UseCors("AllowAll"); // Se debe llamar antes de app.MapControllers()

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();
app.Run();