using Domain.Entities;

namespace Common.Mappers
{
    public static class UsuarioMapper
    {
        public static UsuarioDto ToDto(Usuario usuario, string? nombreRol = null, string? nombrePersona = null)
        {
            return new UsuarioDto
            {
                Id = usuario.Id,
                Nombre_Usuario = usuario.Nombre_Usuario,
                Id_Rol = usuario.Id_Rol,
                Id_Per = usuario.Id_Per,
                Nombre_Persona = nombrePersona,
                Usuario_Bloqueado = usuario.Usuario_Bloqueado,
                PrimeraVez = usuario.PrimeraVez,
                Fecha_Block = usuario.Fecha_Block,
                Fecha_Ult_Cambio = usuario.Fecha_Usu_Cambio
            };
        }

        public static Usuario ToEntity(UsuarioDto dto, string? contraseña = null)
        {
            return new Usuario
            {
                Id = dto.Id,
                Nombre_Usuario = dto.Nombre_Usuario,
                Contraseña = contraseña,
                Fecha_Block = dto.Fecha_Block,
                Usuario_Bloqueado = dto.Usuario_Bloqueado,
                Fecha_Usu_Cambio = dto.Fecha_Ult_Cambio,
                Id_Rol = dto.Id_Rol,
                Id_Per = dto.Id_Per,
                PrimeraVez = dto.PrimeraVez
            };
        }
    }
}