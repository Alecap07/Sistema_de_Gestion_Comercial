using System.Data;

namespace ComprasService.Common.Abstractions;

public interface IDbConnectionFactory
{
    IDbConnection CreateConnection();
}