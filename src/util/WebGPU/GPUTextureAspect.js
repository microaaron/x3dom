/**
 * @file GPUTextureAspect.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPUTextureAspect = class GPUTextureAspect
{
    all = "all";

    stencil_only = "stencil-only";

    depth_only = "depth-only";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUTextureAspect";
    }
};