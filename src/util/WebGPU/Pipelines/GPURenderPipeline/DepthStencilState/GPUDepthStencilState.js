/**
 * @file GPUDepthStencilState.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
x3dom.WebGPU.GPUDepthStencilState  = class GPUDepthStencilState
{
    constructor ( format, depthWriteEnabled, depthCompare, stencilFront, stencilBack, stencilReadMask, stencilWriteMask, depthBias, depthBiasSlopeScale, depthBiasClamp )
    {
        this.format = format;
        this.depthWriteEnabled = depthWriteEnabled;
        this.depthCompare = depthCompare;
        this.stencilFront = stencilFront; //Optional
        this.stencilBack = stencilBack; //Optional
        this.stencilReadMask = stencilReadMask; //Optional
        this.stencilWriteMask = stencilWriteMask; //Optional
        this.depthBias = depthBias; //Optional
        this.depthBiasSlopeScale = depthBiasSlopeScale; //Optional
        this.depthBiasClamp = depthBiasClamp; //Optional
    }

    setFormat ( format )
    {
        this.format = format;
    }

    setDepthWriteEnabled ( depthWriteEnabled )
    {
        this.depthWriteEnabled = depthWriteEnabled;
    }

    setDepthCompare ( depthCompare )
    {
        this.depthCompare = depthCompare;
    }

    setStencilFront ( stencilFront )
    {
        this.stencilFront = stencilFront;
    }

    setStencilBack ( stencilBack )
    {
        this.stencilBack = stencilBack;
    }

    setStencilReadMask ( stencilReadMask )
    {
        this.stencilReadMask = stencilReadMask;
    }

    setStencilWriteMask ( stencilWriteMask )
    {
        this.stencilWriteMask = stencilWriteMask;
    }

    setDepthBias ( depthBias )
    {
        this.depthBias = depthBias;
    }

    setDepthBiasSlopeScale ( depthBiasSlopeScale )
    {
        this.depthBiasSlopeScale = depthBiasSlopeScale;
    }

    setDepthBiasClamp ( depthBiasClamp )
    {
        this.depthBiasClamp = depthBiasClamp;
    }

    /*    newBlend ( color, alpha )
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
*/
    get [ Symbol.toStringTag ] ()
    {
        return "GPUDepthStencilState";
    }
};