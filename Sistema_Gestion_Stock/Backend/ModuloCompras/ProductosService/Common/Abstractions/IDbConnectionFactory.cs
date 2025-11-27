using System.Data;

namespace ProductosService.Common.Abstractions;

public interface IDbConnectionFactory
{
    IDbConnection CreateConnection();
}