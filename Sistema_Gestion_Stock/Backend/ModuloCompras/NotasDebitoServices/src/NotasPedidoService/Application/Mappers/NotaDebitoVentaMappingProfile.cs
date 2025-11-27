using AutoMapper;
using NotasDebitoService.Domain.Entities;
using NotasDebitoService.Application.DTOs;

namespace NotasDebitoService.Application.Mappers
{
    public class NotaDebitoVentaMappingProfile : Profile
    {
        public NotaDebitoVentaMappingProfile()
        {
            // Mapeos para NotaDebitoVenta
            CreateMap<NotaDebitoVentaCreateDTO, NotaDebitoVenta>();
            CreateMap<NotaDebitoVentaUpdateDTO, NotaDebitoVenta>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<NotaDebitoVenta, NotaDebitoVentaReadDTO>();
        }
    }
}
