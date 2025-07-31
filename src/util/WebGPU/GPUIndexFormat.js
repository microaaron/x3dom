/**
 * @file GPUIndexFormat.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
x3dom.WebGPU.GPUIndexFormat = class GPUIndexFormat
{
    uint16 = "uint16";

    uint32 = "uint32";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUIndexFormat";
    }
};