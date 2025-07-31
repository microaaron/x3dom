/**
 * @file GPUMipmapFilterMode.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.05
 */
x3dom.WebGPU.GPUMipmapFilterMode = class GPUMipmapFilterMode
{
    nearest = "nearest";

    linear = "linear";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUMipmapFilterMode";
    }
};