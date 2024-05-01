/**
 * @file GPUFilterMode.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.05
 */
x3dom.WebGPU.GPUFilterMode = class GPUFilterMode
{
    nearest = "nearest";

    linear = "linear";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUFilterMode";
    }
};