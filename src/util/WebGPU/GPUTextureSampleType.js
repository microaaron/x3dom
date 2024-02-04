/**
 * @file GPUTextureSampleType.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPUTextureSampleType = class GPUTextureSampleType
{
    float = "float";

    unfilterable_float = "unfilterable-float";

    depth = "depth";

    sint = "sint";

    uint = "uint";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUTextureSampleType";
    }
};