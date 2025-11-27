using AutoMapper;
using NotasDebitoService.Application.Mappers;
using NotasDebitoService.Application.Services;
using NotasDebitoService.Application.Services.Impl;
using NotasDebitoService.Domain.IRepositories;
using NotasDebitoService.Infrastructure.Data;
using NotasDebitoService.Infrastructure.Repositories;

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
builder.Services.AddAutoMapper(typeof(NotaDebitoVentaMappingProfile).Assembly);

// Database Factory + DI setup
builder.Services.AddSingleton<DbConnectionFactory>();

// Repositories
builder.Services.AddScoped<INotasDebitoVentasRepository, NotasDebitoVentasRepository>();

// Services
builder.Services.AddScoped<INotasDebitoVentasService, NotasDebitoVentasService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "NotasDebitoService v1");
        options.RoutePrefix = ""; // Swagger en la raíz
    });
}

app.UseHttpsRedirection();

// CORS debe ir antes de Authorization
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
