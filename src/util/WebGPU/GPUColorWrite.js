/**
 * @file GPUColorWrite.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
x3dom.WebGPU.GPUColorWrite = class GPUColorWrite
{
    RED = 0x1;

    GREEN = 0x2;

    BLUE = 0x4;

    ALPHA = 0x8;

    ALL = 0xF;

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUColorWrite";
    }
};