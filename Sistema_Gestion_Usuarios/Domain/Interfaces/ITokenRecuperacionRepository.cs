using Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface ITokenRecuperacionRepository
    {
        Task<int> CreateAsync(TokenRecuperacion token);
        Task<TokenRecuperacion?> GetByTokenAsync(string token);
        Task<bool> MarkAsUsedAsync(int idToken);
        Task<bool> UpdateEstadoAsync(int idToken, string estado);
        Task<IEnumerable<TokenRecuperacion>> GetActiveTokensByUserAsync(int idUsuario);
    }
}
