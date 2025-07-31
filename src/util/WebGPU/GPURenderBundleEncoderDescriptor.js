/**
 * @file GPURenderBundleEncoderDescriptor.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.03
 */
x3dom.WebGPU.GPURenderBundleEncoderDescriptor = class GPURenderBundleEncoderDescriptor extends x3dom.WebGPU.GPURenderPassLayout
{
    constructor ( colorFormats = [], depthStencilFormat, sampleCount, depthReadOnly, stencilReadOnly, label )
    {
        super( colorFormats, depthStencilFormat, sampleCount, label );
        this.depthStencilFormat = depthStencilFormat; //Optional; boolean; undefined = false
        this.sampleCount = sampleCount; //Optional; boolean; undefined = false
    }

    setDepthStencilFormat ( depthStencilFormat )
    {
        this.depthStencilFormat = depthStencilFormat;
    }

    setSampleCount ( sampleCount )
    {
        this.sampleCount = sampleCount;
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPURenderBundleEncoderDescriptor";
    }
};