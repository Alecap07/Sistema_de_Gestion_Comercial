using ClientesService.Domain.Entities;

namespace ClientesService.Domain.Repositories;

public interface IClientesRepository
{
    Task<int> CreateAsync(Cliente cliente);
    Task<Cliente?> GetByIdAsync(int id);
    Task<IReadOnlyList<Cliente>> ListAsync(bool includeInactive);
    Task<bool> UpdateAsync(Cliente cliente);
    Task<bool> DeleteAsync(int id); // SP de baja (lógica o física según tu implementación)
}