using Domain.Entities;

namespace Common.Mappers
{
    public static class PersonaMapper
    {
        public static PersonaDto ToDto(Persona entity) =>
            new PersonaDto
            {
                Id = entity.Id,
                Legajo = entity.Legajo,
                Nombre = entity.Nombre,
                Apellido = entity.Apellido,
                Tipo_Doc = entity.Tipo_Doc,
                Num_Doc = entity.Num_Doc,
                Cuil = entity.Cuil,
                Calle = entity.Calle,
                Altura = entity.Altura,
                Cod_Post = entity.Cod_Post,
                Id_Provi = entity.Id_Provi,
                Id_Partido = entity.Id_Partido,
                Id_Local = entity.Id_Local,
                Genero = entity.Genero,
                Telefono = entity.Telefono,
                Email_Personal = entity.Email_Personal
            };

        public static Persona ToEntity(PersonaDto dto) =>
            new Persona
            {
                Id = dto.Id,
                Legajo = dto.Legajo,
                Nombre = dto.Nombre,
                Apellido = dto.Apellido,
                Tipo_Doc = dto.Tipo_Doc,
                Num_Doc = dto.Num_Doc,
                Cuil = dto.Cuil,
                Calle = dto.Calle,
                Altura = dto.Altura,
                Cod_Post = dto.Cod_Post,
                Id_Provi = dto.Id_Provi,
                Id_Partido = dto.Id_Partido,
                Id_Local = dto.Id_Local,
                Genero = dto.Genero,
                Telefono = dto.Telefono,
                Email_Personal = dto.Email_Personal
            };
    }
}
