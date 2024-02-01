/**
 * @file GPUColorTargetState.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
x3dom.WebGPU.GPUColorTargetState  = class GPUColorTargetState
{
    constructor ( format, blend, writeMask )
    {
        this.format = format;
        this.blend = blend; //Optional
        this.writeMask = writeMask; //Optional
    }

    setFormat ( format )
    {
        this.format = format;
    }

    setBlend ( blend )
    {
        this.blend = blend;
    }

    setWriteMask ( writeMask )
    {
        this.writeMask = writeMask;
    }

    newBlend ( color, alpha )
    {
        return new x3dom.WebGPU.GPUBlendState( color, alpha );
    }

    getAvailableFormats ()
    {
        return new x3dom.WebGPU.GPUTextureFormat();
    }

    getAvailableWriteMasks ()
    {
        return new x3dom.WebGPU.GPUColorWrite();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUColorTargetState";
    }
};