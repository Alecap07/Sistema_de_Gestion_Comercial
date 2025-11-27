using System.Data;

namespace RemitosService.Common.Abstractions;

public interface IDbConnectionFactory
{
    IDbConnection CreateConnection();
}