using Application.Services;
using Domain.Interfaces;
using Infrastructure.Data;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// =========================
// 🔗 CONFIGURACIÓN DE LA BD
// =========================
builder.Services.AddDbContext<AlmacenDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ==============================
// 🧩 INYECCIÓN DE DEPENDENCIAS
// ==============================
builder.Services.AddScoped<IProductoRepository, ProductoRepository>();
builder.Services.AddScoped<IMovimientoStockRepository, MovimientoStockRepository>();
builder.Services.AddScoped<IScrapRepository, ScrapRepository>(); // ✅ nuevo repo

builder.Services.AddScoped<ProductoService>();
builder.Services.AddScoped<MovimientoStockService>();
builder.Services.AddScoped<ScrapService>(); // ✅ nuevo service

// ===================
// 🌐 CONFIGURAR CORS
// ===================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});

// ===================
// ⚙️ CONFIGURAR MVC
// ===================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ===================
// 🚀 CONSTRUIR APP
// ===================
var app = builder.Build();

// ===================
// 💻 ENTORNO DEV
// ===================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ===================
// 🔒 MIDDLEWARES
// ===================
app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.MapControllers();

// ===================
// 🏁 EJECUCIÓN
// ===================
app.Run();
