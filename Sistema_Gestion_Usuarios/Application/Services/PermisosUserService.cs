using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Common;
using Common.Mappers;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.Services
{
    public class PermisosUserService
    {
        private readonly IPermisosUserRepository _repository;
        public PermisosUserService(IPermisosUserRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<PermisosUserDto>> GetAllAsync(CancellationToken ct)
        {
            var entities = await _repository.GetAllAsync(ct);
            return entities.Select(PermisosUserMapper.ToDto).ToList();
        }

        public Task AddAsync(PermisosUserDto dto, CancellationToken ct)
        {
            var entity = PermisosUserMapper.ToEntity(dto);
            return _repository.AddAsync(entity, ct);
        }

         public Task UpdateAsync(PermisosUserDto dto, CancellationToken ct)
        {
            // Mapeo DTO → Entity, incluyendo claves originales
            var entity = PermisosUserMapper.ToEntity(dto);

            // Solo para Update, si Original_Id_* son null, asigno los actuales
            if (!entity.Original_Id_User.HasValue)
                entity.Original_Id_User = entity.Id_User;
            if (!entity.Original_Id_Permi.HasValue)
                entity.Original_Id_Permi = entity.Id_Permi;

            return _repository.UpdateAsync(entity, ct);
        }
    }
}
