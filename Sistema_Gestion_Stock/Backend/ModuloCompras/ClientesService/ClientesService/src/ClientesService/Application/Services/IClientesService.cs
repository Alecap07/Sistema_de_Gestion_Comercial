using ClientesService.Application.DTOs;
using ClientesService.Common;

namespace ClientesService.Application.Services;

public interface IClientesService
{
    Task<Result<int>> CreateAsync(ClienteCreateDto dto);
    Task<Result<ClienteReadDto>> GetAsync(int id);
    Task<Result<IReadOnlyList<ClienteReadDto>>> ListAsync(bool includeInactive);
    Task<Result<bool>> UpdateAsync(int id, ClienteUpdateDto dto);
    Task<Result<bool>> DeleteAsync(int id);
}