/**
 * @file GPUSamplerDescriptor.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.05
 */
x3dom.WebGPU.GPUSamplerDescriptor = class GPUSamplerDescriptor extends x3dom.WebGPU.GPUObjectDescriptorBase
{
    constructor ( addressModeU, addressModeV, addressModeW, magFilter, minFilter, mipmapFilter, lodMinClamp, lodMaxClamp, compare, maxAnisotropy, label )
    {
        super( label );
        this.addressModeU = addressModeU;//Optional; GPUAddressMode; undefined = "clamp-to-edge"
        this.addressModeV = addressModeV;//Optional; GPUAddressMode; undefined = "clamp-to-edge"
        this.addressModeW = addressModeW;//Optional; GPUAddressMode; undefined = "clamp-to-edge"
        this.magFilter = magFilter;//Optional; GPUFilterMode; undefined = "nearest"
        this.minFilter = minFilter;//Optional; GPUFilterMode; undefined = "nearest"
        this.mipmapFilter = mipmapFilter;//Optional; GPUMipmapFilterMode; undefined = "nearest"
        this.lodMinClamp = lodMinClamp;//Optional; float; undefined = 0
        this.lodMaxClamp = lodMaxClamp;//Optional; float; undefined = 32
        this.compare = compare;//Optional
        this.maxAnisotropy = maxAnisotropy;//Optional; unsigned short; undefined = 1
    }

    setAddressModeU ( addressModeU ){this.addressModeU = addressModeU;}

    setAddressModeV ( addressModeV ){this.addressModeV = addressModeV;}

    setAddressModeW ( addressModeW ){this.addressModeW = addressModeW;}

    setMagFilter ( magFilter ){this.magFilter = magFilter;}

    setMinFilter ( minFilter ){this.minFilter = minFilter;}

    setMipmapFilter ( mipmapFilter ){this.mipmapFilter = mipmapFilter;}

    setLodMinClamp ( lodMinClamp ){this.lodMinClamp = lodMinClamp;}

    setLodMaxClamp ( lodMaxClamp ){this.lodMaxClamp = lodMaxClamp;}

    setCompare ( compare ){this.compare = compare;}

    setMaxAnisotropy ( maxAnisotropy ){this.maxAnisotropy = maxAnisotropy;}

    static getAvailableAddressModeUs (){return new x3dom.WebGPU.GPUAddressMode();}

    static getAvailableAddressModeVs (){return new x3dom.WebGPU.GPUAddressMode();}

    static getAvailableAddressModeWs (){return new x3dom.WebGPU.GPUAddressMode();}

    static getAvailableMagFilters (){return new x3dom.WebGPU.GPUFilterMode();}

    static getAvailableMinFilters (){return new x3dom.WebGPU.GPUFilterMode();}

    static getAvailableMipmapFilters (){return new x3dom.WebGPU.GPUMipmapFilterMode();}

    static getAvailableCompares (){return new x3dom.WebGPU.GPUCompareFunction();}

    get [ Symbol.toStringTag ] ()
    {
        return "GPUSamplerDescriptor";
    }
};
x3dom.WebGPU.GPUSamplerDescriptor.prototype.getAvailableAddressModeUs = x3dom.WebGPU.GPUSamplerDescriptor.getAvailableAddressModeUs;
x3dom.WebGPU.GPUSamplerDescriptor.prototype.getAvailableAddressModeVs = x3dom.WebGPU.GPUSamplerDescriptor.getAvailableAddressModeVs;
x3dom.WebGPU.GPUSamplerDescriptor.prototype.getAvailableAddressModeWs = x3dom.WebGPU.GPUSamplerDescriptor.getAvailableAddressModeWs;
x3dom.WebGPU.GPUSamplerDescriptor.prototype.getAvailableMagFilters = x3dom.WebGPU.GPUSamplerDescriptor.getAvailableMagFilters;
x3dom.WebGPU.GPUSamplerDescriptor.prototype.getAvailableMinFilters = x3dom.WebGPU.GPUSamplerDescriptor.getAvailableMinFilters;
x3dom.WebGPU.GPUSamplerDescriptor.prototype.getAvailableMipmapFilters = x3dom.WebGPU.GPUSamplerDescriptor.getAvailableMipmapFilters;
x3dom.WebGPU.GPUSamplerDescriptor.prototype.getAvailableCompares = x3dom.WebGPU.GPUSamplerDescriptor.getAvailableCompares;