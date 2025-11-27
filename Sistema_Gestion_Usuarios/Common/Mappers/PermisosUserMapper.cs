using Domain.Entities;

namespace Common.Mappers
{
    public static class PermisosUserMapper
    {
        public static PermisosUserDto ToDto(PermisosUser entity) =>
            new PermisosUserDto
            {
                Id_User = entity.Id_User,
                Id_Permi = entity.Id_Permi,
                Fecha_Vto = entity.Fecha_Vto,
                Original_Id_User = entity.Original_Id_User,
                Original_Id_Permi = entity.Original_Id_Permi
            };

        public static PermisosUser ToEntity(PermisosUserDto dto) =>
            new PermisosUser
            {
                Id_User = dto.Id_User,
                Id_Permi = dto.Id_Permi,
                Fecha_Vto = dto.Fecha_Vto,
                Original_Id_User = dto.Original_Id_User,
                Original_Id_Permi = dto.Original_Id_Permi
            };
    }
}
