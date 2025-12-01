using AutoMapper;
using NotasPedidoService.Application.DTOs;
using NotasPedidoService.Application.Services;
using NotasPedidoService.Domain.Entities;
using NotasPedidoService.Domain.IRepositories;

namespace NotasPedidoService.Application.Services.Impl

{
    public class NotasPedidoVentaService : INotasPedidoVentaService
    {
        private readonly INotasPedidoVentaRepository _notasRepo;
        private readonly INotaPedidoVentaItemsRepository _itemsRepo;
        private readonly IMapper _mapper;

        public NotasPedidoVentaService(
            INotasPedidoVentaRepository notasRepo,
            INotaPedidoVentaItemsRepository itemsRepo,
            IMapper mapper)
        {
            _notasRepo = notasRepo;
            _itemsRepo = itemsRepo;
            _mapper = mapper;
        }

        public async Task<int> CreateAsync(NotaPedidoVentaCreateDTO dto)
        {
            if (dto.ClienteId <= 0) throw new ArgumentException("ClienteId inválido");

            var entity = _mapper.Map<NotaPedidoVenta>(dto);
            if (entity.Fecha == default) entity.Fecha = DateTime.Now;
            if (string.IsNullOrWhiteSpace(entity.Estado)) entity.Estado = "Creado";

            return await _notasRepo.CreateAsync(entity);
        }

        public async Task<NotaPedidoVentaReadDTO?> GetByIdAsync(int id)
        {
            var nota = await _notasRepo.GetByIdAsync(id);
            if (nota == null) return null;

            var read = _mapper.Map<NotaPedidoVentaReadDTO>(nota);

            var items = await _itemsRepo.ListByNotaAsync(id, false);
            read.Items = items.Select(i => _mapper.Map<NotaPedidoVentaItemReadDTO>(i)).ToList();

            return read;
        }

        public async Task<IEnumerable<NotaPedidoVentaReadDTO>> ListAsync(bool includeInactive)
        {
            var list = await _notasRepo.ListAsync(includeInactive);
            return list.Select(n => _mapper.Map<NotaPedidoVentaReadDTO>(n));
        }

        public async Task UpdateAsync(int id, NotaPedidoVentaUpdateDTO dto)
        {
            var existing = await _notasRepo.GetByIdAsync(id)
                ?? throw new Exception("NotaPedidoVenta no encontrada");

            _mapper.Map(dto, existing); 
            await _notasRepo.UpdateAsync(id, existing);
        }

        public async Task CancelAsync(int id)
        {
            await _notasRepo.CancelAsync(id);
        }
    }
}
