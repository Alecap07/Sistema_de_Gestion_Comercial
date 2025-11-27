using AutoMapper;
using NotasPedidoService.Application.DTOs;
using NotasPedidoService.Application.Services;
using NotasPedidoService.Domain.Entities;
using NotasPedidoService.Domain.IRepositories;

namespace NotasPedidoService.Application.Services.Impl

{
    public class NotaPedidoVentaItemsService : INotaPedidoVentaItemsService
    {
        private readonly INotaPedidoVentaItemsRepository _itemsRepo;
        private readonly IMapper _mapper;

        public NotaPedidoVentaItemsService(INotaPedidoVentaItemsRepository itemsRepo, IMapper mapper)
        {
            _itemsRepo = itemsRepo;
            _mapper = mapper;
        }

        public async Task<int> CreateAsync(NotaPedidoVentaItemCreateDTO dto)
        {
            var entity = _mapper.Map<NotaPedidoVentaItem>(dto);
            return await _itemsRepo.CreateAsync(entity);
        }

        public async Task<NotaPedidoVentaItemReadDTO?> GetByIdAsync(int id)
        {
            var e = await _itemsRepo.GetByIdAsync(id);
            return e == null ? null : _mapper.Map<NotaPedidoVentaItemReadDTO>(e);
        }

        public async Task<IEnumerable<NotaPedidoVentaItemReadDTO>> ListByNotaAsync(int notaPedidoVentaId, bool includeInactive)
        {
            var items = await _itemsRepo.ListByNotaAsync(notaPedidoVentaId, includeInactive);
            return items.Select(i => _mapper.Map<NotaPedidoVentaItemReadDTO>(i));
        }

        public async Task UpdateAsync(int id, NotaPedidoVentaItemUpdateDTO dto)
        {
            var entity = await _itemsRepo.GetByIdAsync(id) ?? throw new Exception("Item no encontrado");
            _mapper.Map(dto, entity);
            await _itemsRepo.UpdateAsync(id, entity);
        }

        public async Task CancelAsync(int id)
        {
            await _itemsRepo.CancelAsync(id);
        }
    }
}
