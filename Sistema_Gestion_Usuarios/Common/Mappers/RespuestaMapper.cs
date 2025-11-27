using Domain.Entities;

namespace Common.Mappers
{
    public static class RespuestaMapper
    {
        public static RespuestaDto ToDto(Respuesta entity)
        {
            return new RespuestaDto
            {
                Id_User = entity.Id_User,
                Id_Pregun = entity.Id_Pregun,
                Respuesta = entity.Texto // ✅ cambio aquí
            };
        }

        public static Respuesta ToEntity(RespuestaDto dto)
        {
            return new Respuesta
            {
                Id_User = dto.Id_User,
                Id_Pregun = dto.Id_Pregun,
                Texto = dto.Respuesta // ✅ cambio aquí
            };
        }
    }

    public static class PreguntaRespuestaMapper
    {
        public static PreguntaRespuestaDto ToDto(int idPregun, string? pregunta, string? respuesta)
        {
            return new PreguntaRespuestaDto
            {
                Id_Pregun = idPregun,
                Pregunta = pregunta,
                Respuesta = respuesta
            };
        }
    }
}
