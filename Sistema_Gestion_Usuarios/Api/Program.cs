using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Domain.Interfaces;
using Application.Services;
using Application.UseCases;
using Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// 🔹 Configuración JWT
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings.GetValue<string>("SecretKey") 
                ?? throw new InvalidOperationException("JwtSettings:SecretKey no está configurada");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings.GetValue<string>("Issuer") ?? throw new InvalidOperationException("JwtSettings:Issuer no está configurado"),
        ValidAudience = jwtSettings.GetValue<string>("Audience") ?? throw new InvalidOperationException("JwtSettings:Audience no está configurado"),
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});

// 🔹 Autorización
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("UsuarioAutenticado", policy =>
    {
        policy.RequireAuthenticatedUser();
    });
});

// 🔹 Dependencias
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrEmpty(connectionString))
    throw new InvalidOperationException("La cadena de conexión 'DefaultConnection' no está configurada");

builder.Services.AddScoped<IProvinciaRepository>(p => new ProvinciaRepository(connectionString));
builder.Services.AddScoped<IPartidoRepository>(p => new PartidoRepository(connectionString));
builder.Services.AddScoped<ILocalidadRepository>(p => new LocalidadRepository(connectionString));
builder.Services.AddScoped<IUsuarioRepository>(p => new UsuarioRepository(connectionString));
builder.Services.AddScoped<HashService>();
builder.Services.AddScoped<UsuarioService>();
builder.Services.AddScoped<LoginUseCase>();

builder.Services.AddScoped<IRolRepository>(p => new RolRepository(connectionString));
builder.Services.AddScoped<IRolService, RolService>(); // ✅ Registramos IRolService

builder.Services.AddScoped<IPersonaRepository>(p => new PersonaRepository(connectionString));
builder.Services.AddScoped<IRestriccionRepository>(p => new RestriccionRepository(connectionString));
builder.Services.AddScoped<IPreguntaRepository>(p => new PreguntaRepository(connectionString));
builder.Services.AddScoped<PreguntaService>();
builder.Services.AddScoped<IRespuestaRepository>(p => new RespuestaRepository(connectionString));
builder.Services.AddScoped<RespuestaService>();
builder.Services.AddScoped<ITipoRestriccionRepository>(p => new TipoRestriccionRepository(connectionString));
builder.Services.AddScoped<TipoRestriccionService>();
builder.Services.AddScoped<IPermisoRepository>(p => new PermisoRepository(connectionString));
builder.Services.AddScoped<PermisoService>();
builder.Services.AddScoped<PermisosRolRepository>(p => new PermisosRolRepository(connectionString));
builder.Services.AddScoped<PermisosRolService>();
builder.Services.AddScoped<IPermisosUserRepository>(p => new PermisosUserRepository(connectionString));
builder.Services.AddScoped<PermisosUserService>();

// 🔹 Servicios de recuperación de contraseña
builder.Services.AddScoped<ITokenRecuperacionRepository>(p => new TokenRecuperacionRepository(connectionString));

// 🔹 👇 Agregado: servicio de envío de correos (SMTP)
builder.Services.AddScoped<IEmailService, SmtpEmailService>(); 

// 🔹 Servicio principal de recuperación de contraseña
builder.Services.AddScoped<PasswordRecoveryService>();

// 🔹 Configuración de controladores y JSON
builder.Services.AddControllers().AddJsonOptions(opt =>
{
    opt.JsonSerializerOptions.PropertyNamingPolicy = null;
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(opt =>
{
    opt.AddDefaultPolicy(policy => policy
        .AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod());
});

var app = builder.Build();

// 🔹 Middleware de desarrollo
app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "StoredProcApi v1"));

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// 🔹 Muestra errores detallados en el navegador
app.UseDeveloperExceptionPage();

app.Run();
