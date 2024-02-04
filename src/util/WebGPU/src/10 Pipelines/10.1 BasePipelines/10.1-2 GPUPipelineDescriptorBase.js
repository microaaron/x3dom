/**
 * @file GPUPipelineDescriptorBase.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
x3dom.WebGPU.GPUPipelineDescriptorBase = class GPUPipelineDescriptorBase extends x3dom.WebGPU.GPUObjectDescriptorBase
{
    constructor ( layout = "auto", label )
    {
        super( label );
        this.layout = layout;
    }

    setLayout ( layout )
    {
        this.layout = layout;
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUPipelineDescriptorBase";
    }
};