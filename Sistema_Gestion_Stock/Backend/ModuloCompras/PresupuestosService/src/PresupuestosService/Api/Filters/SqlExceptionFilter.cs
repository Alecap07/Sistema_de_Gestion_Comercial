using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Data.SqlClient;

namespace PresupuestosService.Api.Filters;

public class SqlExceptionFilter : IExceptionFilter
{
    public void OnException(ExceptionContext context)
    {
        if (context.Exception is not SqlException sqlEx) return;

        int statusCode;
        string message;

        // Map common error numbers
        switch (sqlEx.Number)
        {
            case 18456: // Login failed
                statusCode = 401;
                message = "Credenciales de SQL incorrectas o login deshabilitado.";
                break;
            // 10061 connection refused (mapped via Win32Exception, Number sometimes 10061 or 0 with message describing network error)
            default:
                if (sqlEx.Message.Contains("network-related", StringComparison.OrdinalIgnoreCase) ||
                    sqlEx.Message.Contains("denegó expresamente", StringComparison.OrdinalIgnoreCase) ||
                    sqlEx.Number == 10061)
                {
                    statusCode = 503;
                    message = "No se puede conectar al servidor SQL (revisar host/puerto/instancia).";
                }
                else
                {
                    statusCode = 500;
                    message = "Error de base de datos.";
                }
                break;
        }

        context.Result = new ObjectResult(new { error = message }) { StatusCode = statusCode };
        context.ExceptionHandled = true;
    }
}