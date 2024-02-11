/**
 * @file GPURenderPassLayout.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPURenderPassLayout = class GPURenderPassLayout extends x3dom.WebGPU.GPUObjectDescriptorBase
{
    constructor ( colorFormats = [], depthStencilFormat, sampleCount, label )
    {
        super( label );
        this.colorFormats = colorFormats; //Required sequence<GPUTextureFormat?>
        this.depthStencilFormat = depthStencilFormat; //Optional; GPUTextureFormat
        this.sampleCount = sampleCount; //Optional; GPUSize32; undefined = 1
    }

    setColorFormats ( colorFormats )
    {
        this.colorFormats = colorFormats;
    }

    setDepthStencilFormat ( depthStencilFormat )
    {
        this.depthStencilFormat = depthStencilFormat;
    }

    setSampleCount ( sampleCount )
    {
        this.sampleCount = sampleCount;
    }

    getAvailableColorFormats ( device )
    {
        return new x3dom.WebGPU.GPUTextureFormat( device );
    }

    getAvailableDepthStencilFormats ( device )
    {
        return new x3dom.WebGPU.GPUTextureFormat( device );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPURenderPassLayout";
    }
};