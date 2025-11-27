using Domain.Entities;

namespace Common
{
    public static class RolMapper
    {
        public static RolDto ToDto(Rol entity)
        {
            return new RolDto
            {
                Id = entity.Id,
                Rol = entity.Nombre
            };
        }

        public static Rol ToEntity(RolDto dto)
        {
            return new Rol
            {
                Id = dto.Id,
                Nombre = dto.Rol
            };
        }
    }
}
