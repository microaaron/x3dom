/**
 * @file GPUBlendState.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
x3dom.WebGPU.GPUBlendState = class GPUBlendState
{
    constructor ( color, alpha )
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

    newColor ( operation, srcFactor, dstFactor )
    {
        return x3dom.WebGPU.GPUBlendComponent( operation, srcFactor, dstFactor );
    }

    newAlpha ( operation, srcFactor, dstFactor )
    {
        return x3dom.WebGPU.GPUBlendComponent( operation, srcFactor, dstFactor );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUBlendState";
    }
};