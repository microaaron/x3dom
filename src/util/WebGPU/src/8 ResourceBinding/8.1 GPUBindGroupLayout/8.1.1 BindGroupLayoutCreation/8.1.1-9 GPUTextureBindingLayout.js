/**
 * @file GPUTextureBindingLayout.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPUTextureBindingLayout = class GPUTextureBindingLayout
{
    constructor ( sampleType, viewDimension, multisampled )
    {
        this.sampleType = sampleType;//Optional; GPUTextureSampleType; undefined = "float"
        this.viewDimension = viewDimension;//Optional; GPUTextureViewDimension; undefined = "2d"
        this.multisampled = multisampled;//Optional; boolean; undefined = false
    }

    setSampleType ( sampleType )
    {
        this.sampleType = sampleType;
    }

    setViewDimension ( viewDimension )
    {
        this.viewDimension = viewDimension;
    }

    setFalse ( multisampled )
    {
        this.multisampled = multisampled;
    }

    static getAvailableSampleTypes ()
    {
        return new x3dom.WebGPU.GPUTextureSampleType();
    }

    static getAvailableViewDimensions ()
    {
        return new x3dom.WebGPU.GPUTextureViewDimension();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUTextureBindingLayout";
    }
};
x3dom.WebGPU.GPUTextureBindingLayout.prototype.getAvailableSampleTypes = x3dom.WebGPU.GPUTextureBindingLayout.getAvailableSampleTypes;
x3dom.WebGPU.GPUTextureBindingLayout.prototype.getAvailableViewDimensions = x3dom.WebGPU.GPUTextureBindingLayout.getAvailableViewDimensions;