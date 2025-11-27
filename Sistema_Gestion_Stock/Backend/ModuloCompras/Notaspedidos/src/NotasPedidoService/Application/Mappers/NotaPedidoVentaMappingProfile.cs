using AutoMapper;
using NotasPedidoService.Domain.Entities;
using NotasPedidoService.Application.DTOs;

namespace NotasPedidoService.Application.Mappers
{
    public class NotaPedidoVentaMappingProfile : Profile
    {
        public NotaPedidoVentaMappingProfile()
        {
            // Mapeos para NotaPedidoVenta
            CreateMap<NotaPedidoVentaCreateDTO, NotaPedidoVenta>()
                .ForMember(dest => dest.Fecha, opt => opt.MapFrom(src => src.Fecha ?? DateTime.Now));

            CreateMap<NotaPedidoVentaUpdateDTO, NotaPedidoVenta>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<NotaPedidoVenta, NotaPedidoVentaReadDTO>();
        }
    }
}
