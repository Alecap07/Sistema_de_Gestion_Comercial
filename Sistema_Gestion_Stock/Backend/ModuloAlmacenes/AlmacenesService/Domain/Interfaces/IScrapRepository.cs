using Domain.Entities;

namespace Domain.Interfaces
{
    public interface IScrapRepository
    {
        Task<IEnumerable<Scrap>> GetAllAsync();
        Task<Scrap?> GetByIdAsync(int id);
        Task AddAsync(Scrap scrap);
        Task UpdateAsync(Scrap scrap);
        Task DeleteAsync(int id);
    }
}
