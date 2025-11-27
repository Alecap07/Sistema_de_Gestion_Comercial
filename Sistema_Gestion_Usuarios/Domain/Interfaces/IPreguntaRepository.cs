using Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IPreguntaRepository
    {
        Task<List<Preguntas>> GetAllAsync(string? busqueda = null);
        Task<int> AddAsync(Preguntas pregunta);
        Task<int> UpdateAsync(Preguntas pregunta);
        Task<Preguntas?> GetByIdAsync(int id);
        // No hay Delete ni Inhabilitar
        Task<IEnumerable<Preguntas>> ObtenerPorIdsAsync(IEnumerable<int> ids);
    }
}