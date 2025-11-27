using Common;
using Domain.Entities;
using Domain.Interfaces;
using System.Collections.Generic;
using System.Linq;

namespace Application.Services
{
    public class RolService : IRolService
    {
        private readonly IRolRepository _rolRepository;

        public RolService(IRolRepository rolRepository)
        {
            _rolRepository = rolRepository;
        }

        public IEnumerable<Domain.Interfaces.RolBasicDto> GetAll()
        {
            // Llamada síncrona para mantener la interfaz, aunque el repo es async
            var roles = _rolRepository.GetAllAsync(default).GetAwaiter().GetResult();
            return roles.Select(r => new Domain.Interfaces.RolBasicDto
            {
                Id = r.Id,
                Nombre = r.Nombre
            });
        }
    }
}
