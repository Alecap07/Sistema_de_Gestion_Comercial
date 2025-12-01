using AutoMapper;
using DevolucionesService.Domain.Entities;
using DevolucionesService.Application.DTOs;

namespace DevolucionesService.Application.Mappers
{
    public class DevolucionVentaMappingProfile : Profile
    {
        public DevolucionVentaMappingProfile()
        {
            CreateMap<DevolucionVentaCreateDTO, DevolucionVenta>();
            CreateMap<DevolucionVentaUpdateDTO, DevolucionVenta>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<DevolucionVenta, DevolucionVentaReadDTO>();

            CreateMap<DevolucionVentaItemCreateDTO, DevolucionVentaItem>();
            CreateMap<DevolucionVentaItemUpdateDTO, DevolucionVentaItem>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<DevolucionVentaItem, DevolucionVentaItemReadDTO>();
        }
    }
}
