using Microsoft.OpenApi.Models;
using ProveedoresService.Common.Abstractions;
using ProveedoresService.Infrastructure.Data;
using ProveedoresService.Domain.Interfaces;
using ProveedoresService.Infrastructure.Repositories;
using ProveedoresService.Application.Interfaces;
using ProveedoresService.Application.Services;
using DotNetEnv;
using System.Globalization;
using System.Threading;

Thread.CurrentThread.CurrentCulture = CultureInfo.InvariantCulture;
Thread.CurrentThread.CurrentUICulture = CultureInfo.InvariantCulture;

// Fuerza soporte de globalización (opcional)
AppContext.SetSwitch("System.Globalization.Invariant", false);

var builder = WebApplication.CreateBuilder(args);

// Cargar variables de .env si existe
try
{
    Env.Load(System.IO.Path.Combine(AppContext.BaseDirectory, ".env"));
}
catch { }

// Si se definió ASPNETCORE_URLS, forzar los puertos
var urls = Environment.GetEnvironmentVariable("ASPNETCORE_URLS");
if (!string.IsNullOrWhiteSpace(urls))
{
    var listenUrls = urls.Split(';', StringSplitOptions.RemoveEmptyEntries);
    builder.WebHost.UseUrls(listenUrls);
    Console.WriteLine($"[Startup] ASPNETCORE_URLS: {string.Join(", ", listenUrls)}");
}

// Controllers
builder.Services.AddControllers();

// CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
         policy.AllowAnyOrigin()
               .AllowAnyHeader()
               .AllowAnyMethod());
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "ProveedoresService API",
        Version = "v1",
        Description = "API de Proveedores basada en Stored Procedures"
    });

    var xmlFilename = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFilename);
    if (File.Exists(xmlPath))
    {
        options.IncludeXmlComments(xmlPath, includeControllerXmlComments: true);
    }
});

// DI
builder.Services.AddSingleton<IDbConnectionFactory>(sp =>
{
    var cs = builder.Configuration.GetConnectionString("ProveedoresDb");
    return new DbConnectionFactory(cs!);
});

// Aquí irán tus servicios, repositorios e interfaces reales
// Ejemplo con proveedores:
builder.Services.AddScoped<IProveedorRepository, ProveedorRepository>();
builder.Services.AddScoped<IProveedorService, ProveedorService>();

builder.Services.AddScoped<ICategoriaService, CategoriaService>();
builder.Services.AddScoped<ICategoriaRepository, CategoriaRepository>();

builder.Services.AddScoped<IProveedorTelefonoRepository, ProveedorTelefonoRepository>();
builder.Services.AddScoped<IProveedorTelefonoService, ProveedorTelefonoService>();

builder.Services.AddScoped<IProveedorProductoRepository, ProveedorProductoRepository>();
builder.Services.AddScoped<IProveedorProductoService, ProveedorProductoService>();

builder.Services.AddScoped<IProveedorDireccionRepository, ProveedorDireccionRepository>();
builder.Services.AddScoped<IProveedorDireccionService, ProveedorDireccionService>();

builder.Services.AddScoped<IProveedorCategoriaRepository, ProveedorCategoriaRepository>();
builder.Services.AddScoped<IProveedorCategoriaService, ProveedorCategoriaService>();

var app = builder.Build();

// SOLO en Producción forzamos HTTPS
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors();
app.UseAuthorization();

// SOLO en Desarrollo habilitamos Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "ProveedoresService API v1");
        c.RoutePrefix = "swagger";
    });
}

app.MapControllers();

app.MapGet("/", () => Results.Ok(new
{
    service = "ProveedoresService",
    status = "OK",
    env = app.Environment.EnvironmentName
}));
Console.WriteLine($"[Debug] Culture: {System.Globalization.CultureInfo.CurrentCulture}");
Console.WriteLine($"[Debug] UI Culture: {System.Globalization.CultureInfo.CurrentUICulture}");
Console.WriteLine($"[Debug] Invariant Culture? {System.Globalization.CultureInfo.CurrentCulture.Name == string.Empty}");


app.Run();