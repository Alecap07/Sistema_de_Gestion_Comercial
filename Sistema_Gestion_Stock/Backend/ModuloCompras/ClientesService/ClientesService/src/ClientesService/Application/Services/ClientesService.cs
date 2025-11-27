using ClientesService.Application.DTOs;
using ClientesService.Application.Mapping;
using ClientesService.Common;
using ClientesService.Domain.Entities;
using ClientesService.Domain.Repositories;

namespace ClientesService.Application.Services;

public class ClientesService : IClientesService
{
    private readonly IClientesRepository _repo;

    public ClientesService(IClientesRepository repo) => _repo = repo;

    public async Task<Result<int>> CreateAsync(ClienteCreateDto dto)
    {
        var entity = new Cliente
        {
            PersonaId = dto.PersonaId,
            Codigo = dto.Codigo,
            LimiteCredito = dto.LimiteCredito,
            Descuento = dto.Descuento,
            FormasPago = dto.FormasPago,
            Observacion = dto.Observacion,
            Activo = true
        };
        var id = await _repo.CreateAsync(entity);
        return Result<int>.Ok(id);
    }

    public async Task<Result<ClienteReadDto>> GetAsync(int id)
    {
        var entity = await _repo.GetByIdAsync(id);
        return entity is null
            ? Result<ClienteReadDto>.Fail("Cliente no encontrado")
            : Result<ClienteReadDto>.Ok(entity.ToReadDto());
    }

    public async Task<Result<IReadOnlyList<ClienteReadDto>>> ListAsync(bool includeInactive)
    {
        var list = await _repo.ListAsync(includeInactive);
        var mapped = list.Select(c => c.ToReadDto()).ToList();
        return Result<IReadOnlyList<ClienteReadDto>>.Ok(mapped);
    }

    public async Task<Result<bool>> UpdateAsync(int id, ClienteUpdateDto dto)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity is null) return Result<bool>.Fail("Cliente no encontrado");
        entity.ApplyUpdate(dto);
        var ok = await _repo.UpdateAsync(entity);
        return ok ? Result<bool>.Ok(true) : Result<bool>.Fail("No se pudo actualizar");
    }

    public async Task<Result<bool>> DeleteAsync(int id)
    {
        var ok = await _repo.DeleteAsync(id);
        return ok ? Result<bool>.Ok(true) : Result<bool>.Fail("No se pudo eliminar");
    }
}