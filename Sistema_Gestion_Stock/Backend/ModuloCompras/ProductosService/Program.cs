using Microsoft.OpenApi.Models;
using ProductosService.Common.Abstractions;
using ProductosService.Infrastructure.Data;
using ProductosService.Domain.Interfaces;
using ProductosService.Infrastructure.Repositories;
using ProductosService.Application.Interfaces;
using ProductosService.Application.Services;
using DotNetEnv;

Environment.SetEnvironmentVariable("DOTNET_SYSTEM_GLOBALIZATION_INVARIANT", "0");

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

// CORS (✅ permite peticiones desde React localhost:5173)
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173") // tu frontend React
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "ProductosService API",
        Version = "v1",
        Description = "API de Productos (Compras) basada en Stored Procedures"
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
    var cs = builder.Configuration.GetConnectionString("ProductosDb");
    return new DbConnectionFactory(cs!);
});

builder.Services.AddScoped<IProductoRepository, ProductoRepository>();
builder.Services.AddScoped<IMarcaRepository, MarcaRepository>();
builder.Services.AddScoped<ICategoriaRepository, CategoriaRepository>();

builder.Services.AddScoped<IProductoService, ProductoService>();
builder.Services.AddScoped<IMarcaService, MarcaService>();
builder.Services.AddScoped<ICategoriaService, CategoriaService>();

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

app.UseCors("AllowAll");

app.UseAuthorization();

// Swagger en desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "ProductosService API v1");
        c.RoutePrefix = "swagger";
    });
}

// Map Controllers
app.MapControllers();

// Endpoint raíz
app.MapGet("/", () => Results.Ok(new
{
    service = "ProductosService",
    status = "OK",
    env = app.Environment.EnvironmentName
}));

app.Run();
