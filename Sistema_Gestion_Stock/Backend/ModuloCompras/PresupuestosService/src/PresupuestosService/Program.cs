using PresupuestosService.Infrastructure.Data;
using PresupuestosService.Infrastructure.Repositories;
using PresupuestosService.Domain.Repositories;
using PresupuestosService.Application.Services;
using DotNetEnv;
using PresupuestosService.Api.Filters;

var builder = WebApplication.CreateBuilder(args);

// Cargar .env si existe (no falla si falta)
try { Env.Load(); } catch { /* ignore */ }

// Aplicar puerto desde ASPNETCORE_URLS si se pasa por .env (launchSettings ya fija 5400 en dev)
var customUrls = Environment.GetEnvironmentVariable("ASPNETCORE_URLS");
if (!string.IsNullOrWhiteSpace(customUrls))
{
    builder.WebHost.UseUrls(customUrls);
}

// Construir connection string dinámicamente si se definieron DB_USER / DB_PASSWORD
var dbServer = Environment.GetEnvironmentVariable("DB_SERVER") ?? "localhost";
var dbPort   = Environment.GetEnvironmentVariable("DB_PORT");
var dbName   = Environment.GetEnvironmentVariable("DB_DATABASE") ?? "Presupuestos_Ventas_API_2";
var dbUser   = Environment.GetEnvironmentVariable("DB_USER");
var dbPass   = Environment.GetEnvironmentVariable("DB_PASSWORD");
var trust    = Environment.GetEnvironmentVariable("DB_TRUST_CERT") ?? "True";

var serverWithPort = string.IsNullOrWhiteSpace(dbPort) ? dbServer : $"{dbServer},{dbPort}";
string connectionString = (string.IsNullOrWhiteSpace(dbUser) || string.IsNullOrWhiteSpace(dbPass))
    ? $"Server={serverWithPort};Database={dbName};Trusted_Connection=True;TrustServerCertificate={trust};"
    : $"Server={serverWithPort};Database={dbName};User Id={dbUser};Password={dbPass};TrustServerCertificate={trust};";

builder.Configuration["ConnectionStrings:DefaultConnection"] = connectionString;

// Log básico para diagnóstico (sin password)
var redacted = string.IsNullOrWhiteSpace(dbPass)
    ? connectionString
    : connectionString.Replace(dbPass, "****");
Console.WriteLine($"[Startup] Using DB connection: {redacted}");

// Servicios (DI)
builder.Services.AddSingleton<ISqlConnectionFactory, SqlConnectionFactory>();
builder.Services.AddScoped<IPresupuestosVentasRepository, PresupuestosVentasRepository>();
builder.Services.AddScoped<IPresupuestosVentasItemsRepository, PresupuestosVentasItemsRepository>();
builder.Services.AddScoped<IPresupuestosVentasService, PresupuestosVentasService>();
builder.Services.AddScoped<IPresupuestosVentasItemsService, PresupuestosVentasItemsService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddControllers(o => o.Filters.Add<SqlExceptionFilter>());
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.MapControllers();

app.Run();