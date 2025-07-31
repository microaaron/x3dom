/**
 * @file GPUDepthStencilState.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
x3dom.WebGPU.GPUDepthStencilState = class GPUDepthStencilState
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

    static newStencilFront ()
    {
        return new x3dom.WebGPU.GPUStencilFaceState();
    }

    static newStencilBack ()
    {
        return new x3dom.WebGPU.GPUStencilFaceState();
    }

    static getAvailableFormats ( device )
    {
        return new x3dom.WebGPU.GPUTextureFormat( device );
    }

    static getAvailableDepthCompares ()
    {
        return new x3dom.WebGPU.GPUCompareFunction();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUDepthStencilState";
    }
};
x3dom.WebGPU.GPUDepthStencilState.prototype.newStencilFront = x3dom.WebGPU.GPUDepthStencilState.newStencilFront;
x3dom.WebGPU.GPUDepthStencilState.prototype.newStencilBack = x3dom.WebGPU.GPUDepthStencilState.newStencilBack;
x3dom.WebGPU.GPUDepthStencilState.prototype.getAvailableFormats = x3dom.WebGPU.GPUDepthStencilState.getAvailableFormats;
x3dom.WebGPU.GPUDepthStencilState.prototype.getAvailableDepthCompares = x3dom.WebGPU.GPUDepthStencilState.getAvailableDepthCompares;