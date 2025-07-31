/**
 * @file GPURenderBundleDescriptor.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.03
 */
x3dom.WebGPU.GPURenderBundleDescriptor = class GPURenderBundleDescriptor extends x3dom.WebGPU.GPUObjectDescriptorBase
{
    constructor ( label )
    {
        super( label );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPURenderBundleDescriptor";
    }
};