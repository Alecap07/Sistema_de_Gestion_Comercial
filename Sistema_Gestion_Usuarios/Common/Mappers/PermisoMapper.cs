using Domain.Entities;

namespace Common.Mappers
{
    public static class PermisoMapper
    {
        public static PermisoDto ToDto(Permisos entity) =>
            new PermisoDto
            {
                Id = entity.Id,
                Permiso = entity.Permiso,
                Descripcion = entity.Descripcion
            };

        public static Permisos ToEntity(PermisoDto dto) =>
            new Permisos
            {
                Id = dto.Id,
                Permiso = dto.Permiso,
                Descripcion = dto.Descripcion
            };
    }
}
