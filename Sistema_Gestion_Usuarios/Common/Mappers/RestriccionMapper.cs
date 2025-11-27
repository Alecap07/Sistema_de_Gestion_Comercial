using Domain.Entities;

namespace Common.Mappers
{
    public static class RestriccionMapper
    {
        public static RestriccionDto ToDto(Restriccion entity) =>
            new RestriccionDto
            {
                Id = entity.Id,
                Cod_Restri = entity.Cod_Restri,
                Descripcion = entity.Descripcion,
                Id_TipoRestri = entity.Id_TipoRestri,
                Activa = entity.Activa,
                Cantidad = entity.Cantidad
            };

        public static Restriccion ToEntity(RestriccionDto dto) =>
            new Restriccion
            {
                Id = dto.Id,
                Cod_Restri = dto.Cod_Restri,
                Descripcion = dto.Descripcion,
                Id_TipoRestri = dto.Id_TipoRestri,
                Activa = dto.Activa,
                Cantidad = dto.Cantidad
            };
    }
}
