namespace ProveedoresService.Common.Abstractions;
using System.Data;

public interface IDbConnectionFactory
{
	IDbConnection CreateConnection();
}
