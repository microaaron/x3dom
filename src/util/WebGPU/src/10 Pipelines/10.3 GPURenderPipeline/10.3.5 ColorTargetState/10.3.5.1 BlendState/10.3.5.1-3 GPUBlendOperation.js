/**
 * @file GPUBlendOperation.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
x3dom.WebGPU.GPUBlendOperation = class GPUBlendOperation
{
    add = "add";

    subtract = "subtract";

    reverse_subtract = "reverse-subtract";

    min = "min";

    max = "max";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUBlendOperation";
    }
};