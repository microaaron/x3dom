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

    static newBlend ( color, alpha )
    {
        return new x3dom.WebGPU.GPUBlendState( color, alpha );
    }

    static getAvailableFormats ( device )
    {
        return new x3dom.WebGPU.GPUTextureFormat( device );
    }

    static getAvailableWriteMasks ()
    {
        return new x3dom.WebGPU.GPUColorWrite();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUColorTargetState";
    }
};
x3dom.WebGPU.GPUColorTargetState.prototype.newBlend = x3dom.WebGPU.GPUColorTargetState.newBlend;
x3dom.WebGPU.GPUColorTargetState.prototype.getAvailableFormats = x3dom.WebGPU.GPUColorTargetState.getAvailableFormats;
x3dom.WebGPU.GPUColorTargetState.prototype.getAvailableWriteMasks = x3dom.WebGPU.GPUColorTargetState.getAvailableWriteMasks;