using Domain.Entities;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IUsuarioRepository
    {
        Task<List<Usuario>> GetAllAsync(CancellationToken ct);
        Task<Usuario?> GetByIdAsync(int id, CancellationToken ct);
        Task<int> AddAsync(Usuario usuario, CancellationToken ct);
        Task<bool> UpdateAsync(Usuario usuario, CancellationToken ct);
        // Métodos enriquecidos deben implementarse fuera de Domain
        Task<Usuario?> GetByNombreExactoAsync(string nombre, CancellationToken ct);
        Task GuardarRespuestaAsync(Respuesta respuesta, CancellationToken ct);
        Task<(Usuario? usuario, string? email)> GetUsuarioConEmailAsync(string usuarioOEmail);        
        Task<List<string>> GetPermisosUsuarioAsync(int idUsuario, CancellationToken ct);


    }
}