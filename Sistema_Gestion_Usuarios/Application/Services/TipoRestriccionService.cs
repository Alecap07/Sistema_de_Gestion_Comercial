using Common;
using Common.Mappers;
using Domain.Entities;
using Domain.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Services
{
    public class TipoRestriccionService
    {
        private readonly ITipoRestriccionRepository _tipoRestriccionRepository;
        public TipoRestriccionService(ITipoRestriccionRepository tipoRestriccionRepository)
        {
            _tipoRestriccionRepository = tipoRestriccionRepository;
        }

        public async Task<IEnumerable<TipoRestriccionDto>> GetAllAsync()
        {
            var entities = await _tipoRestriccionRepository.GetAllAsync();
            return entities.Select(TipoRestriccionMapper.ToDto);
        }
    }
}
