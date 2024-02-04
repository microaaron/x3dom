/**
 * @file GPUTextureViewDimension.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPUTextureViewDimension = class GPUTextureViewDimension
{
    _1d = "1d";

    _2d = "2d";

    _2d_array = "2d-array";

    cube = "cube";

    cube_array = "cube-array";

    _3d = "3d";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUTextureViewDimension";
    }
};