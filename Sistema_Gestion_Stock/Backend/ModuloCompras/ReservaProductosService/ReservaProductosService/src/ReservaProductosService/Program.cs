using DotNetEnv;
using ReservaProductosService.Infrastructure.Data;
using ReservaProductosService.Infrastructure.Repositories;
using ReservaProductosService.Domain.Repositories;
using ReservaProductosService.Application.Services;

var builder = WebApplication.CreateBuilder(args);

// Cargar .env si existe
try { Env.Load(); } catch { /* Ignorar si no está */ }

// Aplicar puerto desde variable (launchSettings ya fija en 5500 para Development)
var customUrls = Environment.GetEnvironmentVariable("ASPNETCORE_URLS");
if (!string.IsNullOrWhiteSpace(customUrls))
{
    builder.WebHost.UseUrls(customUrls);
}

// Construir connection string dinámica (si hay credenciales explícitas)
var dbServer = Environment.GetEnvironmentVariable("DB_SERVER") ?? "localhost";
var dbName   = Environment.GetEnvironmentVariable("DB_DATABASE") ?? "ReservaProductos_Ventas_API_3";
var dbUser   = Environment.GetEnvironmentVariable("DB_USER");
var dbPass   = Environment.GetEnvironmentVariable("DB_PASSWORD");
var trust    = Environment.GetEnvironmentVariable("DB_TRUST_CERT") ?? "True";

var connectionString = (string.IsNullOrWhiteSpace(dbUser) || string.IsNullOrWhiteSpace(dbPass))
    ? $"Server={dbServer};Database={dbName};Trusted_Connection=True;TrustServerCertificate={trust};"
    : $"Server={dbServer};Database={dbName};User Id={dbUser};Password={dbPass};TrustServerCertificate={trust};";

builder.Configuration["ConnectionStrings:DefaultConnection"] = connectionString;

// DI
builder.Services.AddSingleton<ISqlConnectionFactory, SqlConnectionFactory>();
builder.Services.AddScoped<IProductosReservadosRepository, ProductosReservadosRepository>();
builder.Services.AddScoped<IProductosReservadosService, ProductosReservadosService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

var app = builder.Build();

app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

app.Run();