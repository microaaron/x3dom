/**
 * @file GPUBlendState.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
x3dom.WebGPU.GPUBlendState = class GPUBlendState
{
    constructor ( color = this.newColor(), alpha = this.newColor() )
    {
        this.color = color;
        this.alpha = alpha;
    }

    setColor ( color )
    {
        this.color = color;
    }

    setAlpha ( alpha )
    {
        this.alpha = alpha;
    }

    static newColor ( operation, srcFactor, dstFactor )
    {
        return new x3dom.WebGPU.GPUBlendComponent( operation, srcFactor, dstFactor );
    }

    static newAlpha ( operation, srcFactor, dstFactor )
    {
        return new x3dom.WebGPU.GPUBlendComponent( operation, srcFactor, dstFactor );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUBlendState";
    }
};
x3dom.WebGPU.GPUBlendState.prototype.newColor = x3dom.WebGPU.GPUBlendState.newColor;
x3dom.WebGPU.GPUBlendState.prototype.newAlpha = x3dom.WebGPU.GPUBlendState.newAlpha;