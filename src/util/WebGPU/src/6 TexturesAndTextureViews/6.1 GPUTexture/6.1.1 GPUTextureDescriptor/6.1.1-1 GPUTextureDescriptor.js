/**
 * @file GPUTextureDescriptor.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPUTextureDescriptor = class GPUTextureDescriptor extends x3dom.WebGPU.GPUObjectDescriptorBase
{
    constructor ( size, mipLevelCount, sampleCount, dimension, format, usage, viewFormats = [], label )
    {
        super( label );
        this.size = size; //Required GPUExtent3D
        this.mipLevelCount = mipLevelCount; //Optional; GPUIntegerCoordinate; undefined = 1
        this.sampleCount = sampleCount; //Optional; GPUSize32; undefined = 1
        this.dimension = dimension; //Optional; GPUTextureDimension; undefined = "2d"
        this.format = format; //Required GPUTextureFormat
        this.usage = usage; //Required GPUTextureUsageFlags
        this.viewFormats = viewFormats; //Optional; sequence<GPUTextureFormat>
    }

    setSize ( size )
    {
        this.size = size;
    }

    setMipLevelCount ( mipLevelCount )
    {
        this.mipLevelCount = mipLevelCount;
    }

    setSampleCount ( sampleCount )
    {
        this.sampleCount = sampleCount;
    }

    setDimension ( dimension )
    {
        this.dimension = dimension;
    }

    setFormat ( format )
    {
        this.format = format;
    }

    setUsage ( usage )
    {
        this.usage = usage;
    }

    setViewFormats ( viewFormats )
    {
        this.viewFormats = viewFormats;
    }

    static newSize ( width, height, depthOrArrayLayers )
    {
        return new x3dom.WebGPU.GPUExtent3DDict( width, height, depthOrArrayLayers );
    }

    static getAvailableDimensions ()
    {
        return new x3dom.WebGPU.GPUTextureDimension();
    }

    static getAvailableFormats ( device )
    {
        return new x3dom.WebGPU.GPUTextureFormat( device );
    }

    static getAvailableUsages ()
    {
        return new x3dom.WebGPU.GPUTextureUsage();
    }

    static getAvailableViewFormats ( device )
    {
        return new x3dom.WebGPU.GPUTextureFormat( device );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUTextureDescriptor";
    }
};
x3dom.WebGPU.GPUTextureDescriptor.prototype.newSize = x3dom.WebGPU.GPUTextureDescriptor.newSize;
x3dom.WebGPU.GPUTextureDescriptor.prototype.getAvailableDimensions = x3dom.WebGPU.GPUTextureDescriptor.getAvailableDimensions;
x3dom.WebGPU.GPUTextureDescriptor.prototype.getAvailableFormats = x3dom.WebGPU.GPUTextureDescriptor.getAvailableFormats;
x3dom.WebGPU.GPUTextureDescriptor.prototype.getAvailableUsages = x3dom.WebGPU.GPUTextureDescriptor.getAvailableUsages;
x3dom.WebGPU.GPUTextureDescriptor.prototype.getAvailableViewFormats = x3dom.WebGPU.GPUTextureDescriptor.getAvailableViewFormats;