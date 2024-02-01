/**
 * @file GPUBlendComponent.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
x3dom.WebGPU.GPUBlendComponent = class GPUBlendComponent
{
    constructor ( operation, srcFactor, dstFactor )
    {
        this.operation = operation; //Optional
        this.srcFactor = srcFactor; //Optional
        this.dstFactor = dstFactor; //Optional
    }

    setOperation ( operation )
    {
        this.operation = operation;
    }

    setSrcFactor ( srcFactor )
    {
        this.srcFactor = srcFactor;
    }

    setDstFactor ( dstFactor )
    {
        this.dstFactor = dstFactor;
    }

    getAvailableOperations ()
    {
        return new x3dom.WebGPU.GPUBlendOperation();
    }

    getAvailableSrcFactors ()
    {
        return new x3dom.WebGPU.GPUBlendFactor();
    }

    getAvailableDstFactors ()
    {
        return new x3dom.WebGPU.GPUBlendFactor();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUBlendComponent";
    }
};