/**
 * @file GPUStorageTextureBindingLayout.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPUStorageTextureBindingLayout = class GPUStorageTextureBindingLayout
{
    constructor ( access, format, viewDimension )
    {
        this.access = access; //Optional; GPUStorageTextureAccess; undefined = "write-only""
        this.format = format; //Required GPUTextureFormat;
        this.viewDimension = viewDimension; //Optional; GPUTextureViewDimension; undefined = "2d"
    }

    setAccess ( access )
    {
        this.access = access;
    }

    setFormat ( format )
    {
        this.format = format;
    }

    setViewDimension ( viewDimension )
    {
        this.viewDimension = viewDimension;
    }

    static getAvailableFormats ( device )
    {
        return new x3dom.WebGPU.GPUTextureFormat( device );
    }

    static getAvailableViewDimensions ()
    {
        return new x3dom.WebGPU.GPUTextureViewDimension();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUStorageTextureBindingLayout";
    }
};
x3dom.WebGPU.GPUStorageTextureBindingLayout.prototype.getAvailableFormats = x3dom.WebGPU.GPUStorageTextureBindingLayout.getAvailableFormats;
x3dom.WebGPU.GPUStorageTextureBindingLayout.prototype.getAvailableViewDimensions = x3dom.WebGPU.GPUStorageTextureBindingLayout.getAvailableViewDimensions;