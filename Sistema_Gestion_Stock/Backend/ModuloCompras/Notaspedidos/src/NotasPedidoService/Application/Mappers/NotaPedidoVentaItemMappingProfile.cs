using AutoMapper;
using NotasPedidoService.Domain.Entities;
using NotasPedidoService.Application.DTOs;

namespace NotasPedidoService.Application.Mappers
{
    public class NotaPedidoVentaItemMappingProfile : Profile
    {
        public NotaPedidoVentaItemMappingProfile()
        {
            // Mapeos para NotaPedidoVentaItem
            CreateMap<NotaPedidoVentaItemCreateDTO, NotaPedidoVentaItem>();
            CreateMap<NotaPedidoVentaItemUpdateDTO, NotaPedidoVentaItem>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<NotaPedidoVentaItem, NotaPedidoVentaItemReadDTO>();
        }
    }
}
