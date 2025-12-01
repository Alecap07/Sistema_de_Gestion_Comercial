using AutoMapper;
using DevolucionesService.Domain.Entities;
using DevolucionesService.Application.DTOs;

namespace DevolucionesService.Application.Mappers
{
    public class DevolucionVentaItemMappingProfile : Profile
    {
        public DevolucionVentaItemMappingProfile()
        {
            CreateMap<DevolucionVentaItemCreateDTO, DevolucionVentaItem>();
            CreateMap<DevolucionVentaItemUpdateDTO, DevolucionVentaItem>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<DevolucionVentaItem, DevolucionVentaItemReadDTO>();
        }
    }
}
