/**
 * @file GPUStencilOperation.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPUStencilOperation = class GPUStencilOperation
{
    keep = "keep";

    zero = "zero";

    replace = "replace";

    invert = "invert";

    increment_clamp = "increment-clamp";

    decrement_clamp = "decrement-clamp";

    increment_wrap = "increment-wrap";

    decrement_wrap = "decrement-wrap";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUStencilOperation";
    }
};