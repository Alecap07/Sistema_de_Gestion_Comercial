using AutoMapper;
using NotasCreditoService.Application.DTOs;
using NotasCreditoService.Application.Services;
using NotasCreditoService.Domain.Entities;
using NotasCreditoService.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NotasCreditoService.Application.Services.Impl
{
    public class NotasCreditoVentasService : INotasCreditoVentasService
    {
        private readonly INotasCreditoVentasRepository _repository;
        private readonly IMapper _mapper;

        public NotasCreditoVentasService(
            INotasCreditoVentasRepository repository,
            IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<int> CreateAsync(NotaCreditoVentaCreateDTO dto)
        {
            // Validation
            if (dto.ClienteId <= 0) 
                throw new ArgumentException("ClienteId inválido");
            
            if (dto.Monto <= 0) 
                throw new ArgumentException("Monto debe ser mayor a cero");

            var entity = _mapper.Map<NotaCreditoVenta>(dto);

            return await _repository.CreateAsync(entity);
        }

        public async Task<NotaCreditoVentaReadDTO?> GetByIdAsync(int id)
        {
            var notaCredito = await _repository.GetByIdAsync(id);
            if (notaCredito == null) return null;

            return _mapper.Map<NotaCreditoVentaReadDTO>(notaCredito);
        }

        public async Task<IEnumerable<NotaCreditoVentaReadDTO>> ListAsync()
        {
            var list = await _repository.ListAsync();
            
            var result = new List<NotaCreditoVentaReadDTO>();
            foreach (var item in list)
            {
                result.Add(_mapper.Map<NotaCreditoVentaReadDTO>(item));
            }
            return result;
        }

        public async Task UpdateAsync(int id, NotaCreditoVentaUpdateDTO dto)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null) 
                throw new Exception("Nota de crédito no encontrada");

            _mapper.Map(dto, existing); // only non-null will be mapped
            await _repository.UpdateAsync(id, existing);
        }

        public async Task CancelAsync(int id)
        {
            await _repository.CancelAsync(id);
        }
    }
}
