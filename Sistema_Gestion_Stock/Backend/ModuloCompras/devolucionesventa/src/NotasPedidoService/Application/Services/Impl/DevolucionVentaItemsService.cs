using AutoMapper;
using DevolucionesService.Application.DTOs;
using DevolucionesService.Application.Services;
using DevolucionesService.Domain.IRepositories;
using DevolucionesService.Domain.Entities;

namespace DevolucionesService.Application.Services.Impl
{
    public class DevolucionVentaItemsService : IDevolucionVentaItemsService
    {
        private readonly IDevolucionVentaItemsRepository _itemsRepo;
        private readonly IMapper _mapper;

        public DevolucionVentaItemsService(IDevolucionVentaItemsRepository itemsRepo, IMapper mapper)
        {
            _itemsRepo = itemsRepo;
            _mapper = mapper;
        }

        public async Task<int> CreateAsync(DevolucionVentaItemCreateDTO dto)
        {
            var entity = _mapper.Map<DevolucionVentaItem>(dto);
            return await _itemsRepo.CreateAsync(entity);
        }

        public async Task<DevolucionVentaItemReadDTO?> GetByIdAsync(int id)
        {
            var entity = await _itemsRepo.GetByIdAsync(id);
            if (entity == null) return null;
            return _mapper.Map<DevolucionVentaItemReadDTO>(entity);
        }

        public async Task<IEnumerable<DevolucionVentaItemReadDTO>> ListByDevolucionAsync(int devolucionVentaId, bool includeInactive)
        {
            var list = await _itemsRepo.ListByDevolucionAsync(devolucionVentaId, includeInactive);
            var result = new List<DevolucionVentaItemReadDTO>();
            foreach(var item in list)
            {
                result.Add(_mapper.Map<DevolucionVentaItemReadDTO>(item));
            }
            return result;
        }

        public async Task UpdateAsync(int id, DevolucionVentaItemUpdateDTO dto)
        {
            var existing = await _itemsRepo.GetByIdAsync(id);
            if (existing == null) throw new Exception("Item de DevolucionVenta no encontrado");

            _mapper.Map(dto, existing);
            await _itemsRepo.UpdateAsync(id, existing);
        }

        public async Task CancelAsync(int id)
        {
            await _itemsRepo.CancelAsync(id);
        }
    }
}
