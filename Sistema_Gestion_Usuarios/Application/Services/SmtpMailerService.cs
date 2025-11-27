using Domain.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace Application.Services
{
    public class SmtpEmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public SmtpEmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string to, string subject, string htmlBody)
        {
            // Leer la configuración desde appsettings.json
            var host = _config["EmailSettings:Host"];
            var portStr = _config["EmailSettings:Port"];
            var from = _config["EmailSettings:From"];
            var pass = _config["EmailSettings:Password"];

            if (string.IsNullOrEmpty(host)) throw new ArgumentNullException(nameof(host), "El host SMTP no está configurado");
            if (string.IsNullOrEmpty(from)) throw new ArgumentNullException(nameof(from), "El correo del remitente no está configurado");
            if (string.IsNullOrEmpty(pass)) throw new ArgumentNullException(nameof(pass), "La contraseña del remitente no está configurada");

            if (!int.TryParse(portStr, out int port))
                port = 587; // puerto por defecto si no está configurado

            using var message = new MailMessage(from, to, subject, htmlBody)
            {
                IsBodyHtml = true
            };

            using var client = new SmtpClient(host, port)
            {
                Credentials = new NetworkCredential(from, pass),
                EnableSsl = true
            };

            await client.SendMailAsync(message);
        }
    }
}
