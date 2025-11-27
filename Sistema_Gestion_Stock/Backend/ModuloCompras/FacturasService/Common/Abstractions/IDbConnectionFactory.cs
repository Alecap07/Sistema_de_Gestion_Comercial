// placeholder
using System.Data;

namespace FacturasService.Common.Abstractions;

public interface IDbConnectionFactory
{
    IDbConnection CreateConnection();
}