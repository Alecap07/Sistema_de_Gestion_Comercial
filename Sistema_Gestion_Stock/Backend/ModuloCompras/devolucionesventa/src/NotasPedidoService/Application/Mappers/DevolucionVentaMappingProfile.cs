using AutoMapper;
using DevolucionesService.Domain.Entities;
using DevolucionesService.Application.DTOs;

namespace DevolucionesService.Application.Mappers
{
    public class DevolucionVentaMappingProfile : Profile
    {
        public DevolucionVentaMappingProfile()
        {
            // Mapeos para DevolucionVenta
            CreateMap<DevolucionVentaCreateDTO, DevolucionVenta>();
            CreateMap<DevolucionVentaUpdateDTO, DevolucionVenta>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<DevolucionVenta, DevolucionVentaReadDTO>();

            // Mapeos para DevolucionVentaItem
            CreateMap<DevolucionVentaItemCreateDTO, DevolucionVentaItem>();
            CreateMap<DevolucionVentaItemUpdateDTO, DevolucionVentaItem>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<DevolucionVentaItem, DevolucionVentaItemReadDTO>();
        }
    }
}
