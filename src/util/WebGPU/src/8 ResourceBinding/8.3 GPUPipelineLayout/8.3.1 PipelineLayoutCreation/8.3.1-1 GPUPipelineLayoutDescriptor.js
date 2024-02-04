/**
 * @file GPUPipelineLayoutDescriptor.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPUPipelineLayoutDescriptor = class GPUPipelineLayoutDescriptor extends x3dom.WebGPU.GPUObjectDescriptorBase
{
    constructor ( bindGroupLayouts = [], label )
    {
        super( label );
        this.bindGroupLayouts = bindGroupLayouts; //Required; sequence<GPUBindGroupLayout>
    }

    setBindGroupLayouts ( bindGroupLayouts )
    {
        this.bindGroupLayouts = bindGroupLayouts;
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUPipelineLayoutDescriptor";
    }
};