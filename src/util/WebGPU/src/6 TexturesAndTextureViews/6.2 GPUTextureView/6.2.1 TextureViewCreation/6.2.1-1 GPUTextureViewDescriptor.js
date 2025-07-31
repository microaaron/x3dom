/**
 * @file GPUTextureViewDescriptor.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPUTextureViewDescriptor = class GPUTextureViewDescriptor extends x3dom.WebGPU.GPUObjectDescriptorBase
{
    constructor ( format, dimension, aspect, baseMipLevel, mipLevelCount, baseArrayLayer, arrayLayerCount, label )
    {
        super( label );
        this.format = format; //Optional; GPUTextureFormat
        this.dimension = dimension; //Optional; GPUTextureViewDimension
        this.aspect = aspect; //Optional; GPUTextureAspect; undefined = "all"
        this.baseMipLevel = baseMipLevel; //Optional; GPUIntegerCoordinate; undefined = 0
        this.mipLevelCount = mipLevelCount; //Optional; GPUIntegerCoordinate
        this.baseArrayLayer = baseArrayLayer; //Optional; GPUIntegerCoordinate; undefined = 0
        this.arrayLayerCount = arrayLayerCount; //Optional; GPUIntegerCoordinate
    }

    setFormat ( format )
    {
        this.format = format;
    }

    setDimension ( dimension )
    {
        this.dimension = dimension;
    }

    setAspect ( aspect )
    {
        this.aspect = aspect;
    }

    setBaseMipLevel ( baseMipLevel )
    {
        this.baseMipLevel = baseMipLevel;
    }

    setMipLevelCount ( mipLevelCount )
    {
        this.mipLevelCount = mipLevelCount;
    }

    setBaseArrayLayer ( baseArrayLayer )
    {
        this.baseArrayLayer = baseArrayLayer;
    }

    setArrayLayerCount ( arrayLayerCount )
    {
        this.arrayLayerCount = arrayLayerCount;
    }

    static getAvailableFormats ( device )
    {
        return new x3dom.WebGPU.GPUTextureFormat( device );
    }

    static getAvailableDimensions ()
    {
        return new x3dom.WebGPU.GPUTextureViewDimension();
    }

    static getAvailableAspects ()
    {
        return new x3dom.WebGPU.GPUTextureAspect();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUTextureViewDescriptor";
    }
};
x3dom.WebGPU.GPUTextureViewDescriptor.prototype.getAvailableFormats = x3dom.WebGPU.GPUTextureViewDescriptor.getAvailableFormats;
x3dom.WebGPU.GPUTextureViewDescriptor.prototype.getAvailableDimensions = x3dom.WebGPU.GPUTextureViewDescriptor.getAvailableDimensions;
x3dom.WebGPU.GPUTextureViewDescriptor.prototype.getAvailableAspects = x3dom.WebGPU.GPUTextureViewDescriptor.getAvailableAspects;