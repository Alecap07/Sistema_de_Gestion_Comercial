using AutoMapper;
using DevolucionesService.Application.DTOs;
using DevolucionesService.Application.Services;
using DevolucionesService.Domain.IRepositories;
using DevolucionesService.Domain.Entities;

namespace DevolucionesService.Application.Services.Impl
{
    public class DevolucionesVentaService : IDevolucionesVentaService
    {
        private readonly IDevolucionesVentaRepository _devolRepo;
        private readonly IDevolucionVentaItemsRepository _itemsRepo;
        private readonly IMapper _mapper;

        public DevolucionesVentaService(
            IDevolucionesVentaRepository devolRepo,
            IDevolucionVentaItemsRepository itemsRepo,
            IMapper mapper)
        {
            _devolRepo = devolRepo;
            _itemsRepo = itemsRepo;
            _mapper = mapper;
        }

        public async Task<int> CreateAsync(DevolucionVentaCreateDTO dto)
        {
            if (dto.ClienteId <= 0) throw new ArgumentException("ClienteId inválido");

            var entity = _mapper.Map<DevolucionVenta>(dto);

            return await _devolRepo.CreateAsync(entity);
        }

        public async Task<DevolucionVentaReadDTO?> GetByIdAsync(int id)
        {
            var devol = await _devolRepo.GetByIdAsync(id);
            if (devol == null) return null;

            var read = _mapper.Map<DevolucionVentaReadDTO>(devol);

            var items = await _itemsRepo.ListByDevolucionAsync(id, false);

            var itemsList = new List<DevolucionVentaItemReadDTO>();
            foreach(var item in items)
            {
                itemsList.Add(_mapper.Map<DevolucionVentaItemReadDTO>(item));
            }
            read.Items = itemsList;

            return read;
        }

        public async Task<IEnumerable<DevolucionVentaReadDTO>> ListAsync(bool includeInactive)
        {
            var list = await _devolRepo.ListAsync(includeInactive);

            var result = new List<DevolucionVentaReadDTO>();
            foreach(var item in list)
            {
                result.Add(_mapper.Map<DevolucionVentaReadDTO>(item));
            }
            return result;
        }

        public async Task UpdateAsync(int id, DevolucionVentaUpdateDTO dto)
        {
            var existing = await _devolRepo.GetByIdAsync(id);
            if (existing == null) throw new Exception("DevolucionVenta no encontrada");

            _mapper.Map(dto, existing); 
            await _devolRepo.UpdateAsync(id, existing);
        }

        public async Task CancelAsync(int id)
        {
            await _devolRepo.CancelAsync(id);
        }
    }
}
