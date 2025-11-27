using AutoMapper;
using NotasPedidoService.Application.Mappers;
using NotasPedidoService.Application.Services;
using NotasPedidoService.Application.Services.Impl;
using NotasPedidoService.Domain.IRepositories;
using NotasPedidoService.Infrastructure.Data;
using NotasPedidoService.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// AutoMapper - registra todos los profiles del assembly
builder.Services.AddAutoMapper(typeof(NotaPedidoVentaMappingProfile).Assembly);

// Database Factory + DI setup
builder.Services.AddSingleton<DbConnectionFactory>();
builder.Services.AddScoped<INotasPedidoVentaRepository, NotasPedidoVentaRepository>();
builder.Services.AddScoped<INotaPedidoVentaItemsRepository, NotaPedidoVentaItemsRepository>();
builder.Services.AddScoped<INotasPedidoVentaService, NotasPedidoVentaService>();
builder.Services.AddScoped<INotaPedidoVentaItemsService, NotaPedidoVentaItemsService>();

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

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "NotasPedidoService v1");
        options.RoutePrefix = ""; // Swagger en la raíz
    });
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
