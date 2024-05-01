/**
 * @file GPUAddressMode.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.05
 */
x3dom.WebGPU.GPUAddressMode = class GPUAddressMode
{
    clamp_to_edge = "clamp-to-edge";

    repeat = "repeat";

    mirror_repeat = "mirror-repeat";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUAddressMode";
    }
};