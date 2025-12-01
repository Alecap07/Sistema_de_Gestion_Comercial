using AutoMapper;
using DevolucionesService.Application.Mappers;
using DevolucionesService.Application.Services;
using DevolucionesService.Application.Services.Impl;
using DevolucionesService.Domain.IRepositories;
using DevolucionesService.Infrastructure.Data;
using DevolucionesService.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseUrls("http://localhost:5120");

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAutoMapper(typeof(DevolucionVentaMappingProfile).Assembly);

builder.Services.AddSingleton<DbConnectionFactory>();


builder.Services.AddScoped<IDevolucionesVentaRepository, DevolucionesVentaRepository>();
builder.Services.AddScoped<IDevolucionVentaItemsRepository, DevolucionVentaItemsRepository>();

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

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
