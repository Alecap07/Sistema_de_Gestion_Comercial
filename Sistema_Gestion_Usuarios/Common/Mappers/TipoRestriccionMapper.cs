using Domain.Entities;

namespace Common.Mappers
{
    public static class TipoRestriccionMapper
    {
        public static TipoRestriccionDto ToDto(TipoRestriccion entity) =>
            new TipoRestriccionDto
            {
                Id = entity.Id,
                Tipo = entity.Tipo
            };

        public static TipoRestriccion ToEntity(TipoRestriccionDto dto) =>
            new TipoRestriccion
            {
                Id = dto.Id,
                Tipo = dto.Tipo
            };
    }
}
