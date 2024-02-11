/**
 * @file GPULoadOp.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPULoadOp = class GPULoadOp
{
    load = "load";

    clear = "clear";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPULoadOp";
    }
};