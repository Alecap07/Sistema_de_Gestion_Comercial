using Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Dtos;

namespace Domain.Interfaces
{
    public interface IRespuestaRepository
    {
        Task<int> AddRespuestaAsync(Respuesta respuesta);
        Task<int> UpdateRespuestaAsync(Respuesta respuesta);
        Task<List<Respuesta>> GetRespuestasByUserAsync(int idUser);
        Task<Respuesta?> GetRespuestaAsync(int idUser, int idPregun);
        Task<IEnumerable<Respuesta>> ObtenerPorUsuarioAsync(int idUser);
        Task<List<PreguntaRecuperacionDto>> ObtenerPreguntasDelUsuarioAsync(int idUsuario);
        Task<bool> ValidarRespuestasUsuarioAsync(int idUsuario, List<PreguntaRespuestaRecuperacionDto> respuestas);


    }
}
