using AutoMapper;
using NotasCreditoService.Application.Mappers;
using NotasCreditoService.Application.Services;
using NotasCreditoService.Application.Services.Impl;
using NotasCreditoService.Domain.IRepositories;
using NotasCreditoService.Infrastructure.Data;
using NotasCreditoService.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

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
builder.Services.AddAutoMapper(typeof(NotaCreditoVentaMappingProfile).Assembly);

// Database Factory + DI setup
builder.Services.AddSingleton<DbConnectionFactory>();

// Repositories
builder.Services.AddScoped<INotasCreditoVentasRepository, NotasCreditoVentasRepository>();

// Services
builder.Services.AddScoped<INotasCreditoVentasService, NotasCreditoVentasService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "NotasCreditoService v1");
        options.RoutePrefix = ""; // Swagger en la raíz
    });
}

app.UseHttpsRedirection();

// CORS debe ir antes de Authorization
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
