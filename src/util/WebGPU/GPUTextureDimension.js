/**
 * @file GPUTextureDimension.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPUTextureDimension = class GPUTextureDimension
{
    _1d = "1d";

    _2d = "2d";

    _3d = "3d";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUTextureDimension";
    }
};