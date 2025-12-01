using AutoMapper;
using NotasDebitoService.Application.DTOs;
using NotasDebitoService.Application.Services;
using NotasDebitoService.Domain.Entities;
using NotasDebitoService.Domain.IRepositories;

namespace NotasDebitoService.Application.Services.Impl
{
    public class NotasDebitoVentasService : INotasDebitoVentasService
    {
        private readonly INotasDebitoVentasRepository _repository;
        private readonly IMapper _mapper;

        public NotasDebitoVentasService(
            INotasDebitoVentasRepository repository,
            IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<int> CreateAsync(NotaDebitoVentaCreateDTO dto)
        {
            if (dto.ClienteId <= 0) throw new ArgumentException("ClienteId inválido");
            if (dto.Monto <= 0) throw new ArgumentException("Monto debe ser mayor a 0");

            var entity = _mapper.Map<NotaDebitoVenta>(dto);
            return await _repository.CreateAsync(entity);
        }

        public async Task<NotaDebitoVentaReadDTO?> GetByIdAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return null;

            return _mapper.Map<NotaDebitoVentaReadDTO>(entity);
        }

        public async Task<IEnumerable<NotaDebitoVentaReadDTO>> ListAsync(bool includeInactive)
        {
            var list = await _repository.ListAsync(includeInactive);
            var result = new List<NotaDebitoVentaReadDTO>();
            foreach (var item in list)
            {
                result.Add(_mapper.Map<NotaDebitoVentaReadDTO>(item));
            }
            return result;
        }

        public async Task UpdateAsync(int id, NotaDebitoVentaUpdateDTO dto)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null) throw new Exception("Nota de débito no encontrada");

            _mapper.Map(dto, existing); 
            await _repository.UpdateAsync(id, existing);
        }

        public async Task CancelAsync(int id)
        {
            await _repository.CancelAsync(id);
        }
    }
}
