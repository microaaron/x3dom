/**
 * @file GPUShaderStage.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPUShaderStage = class GPUShaderStage
{
    VERTEX = 0x1;

    FRAGMENT = 0x2;

    COMPUTE = 0x4;

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUShaderStage";
    }
};