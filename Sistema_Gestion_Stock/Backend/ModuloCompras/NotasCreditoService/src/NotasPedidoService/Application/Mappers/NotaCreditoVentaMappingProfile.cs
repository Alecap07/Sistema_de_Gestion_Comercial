using AutoMapper;
using NotasCreditoService.Domain.Entities;
using NotasCreditoService.Application.DTOs;

namespace NotasCreditoService.Application.Mappers
{
    public class NotaCreditoVentaMappingProfile : Profile
    {
        public NotaCreditoVentaMappingProfile()
        {
            // Mapeos para NotaCreditoVenta
            CreateMap<NotaCreditoVentaCreateDTO, NotaCreditoVenta>();
            CreateMap<NotaCreditoVentaUpdateDTO, NotaCreditoVenta>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<NotaCreditoVenta, NotaCreditoVentaReadDTO>();
        }
    }
}
