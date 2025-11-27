using System.Collections.Generic;

namespace Domain.Interfaces
{
    public class RolBasicDto
    {
        public int Id { get; set; }
        public string? Nombre { get; set; }
    }

    public interface IRolService
    {
        IEnumerable<RolBasicDto> GetAll();
    }
}