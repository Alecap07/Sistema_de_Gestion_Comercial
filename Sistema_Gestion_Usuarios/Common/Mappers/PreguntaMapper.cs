using Domain.Entities;

namespace Common.Mappers
{
    public static class PreguntaMapper
    {
        public static PreguntaDto ToDto(Preguntas entity) =>
            new PreguntaDto { Id = entity.Id, Pregunta = entity.Texto, Activa = entity.Activa };

        public static Preguntas ToEntity(PreguntaDto dto) =>
            new Preguntas { Id = dto.Id, Texto = dto.Pregunta ?? string.Empty, Activa = dto.Activa };
    }
}