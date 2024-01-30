/**
 * @file GPUFrontFace.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
x3dom.WebGPU.GPUFrontFace = class GPUFrontFace
{
    cw = "ccw";

    cw = "cw";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUFrontFace";
    }
};