/**
 * @file GPUStencilFaceState.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPUStencilFaceState = class GPUStencilFaceState
{
    constructor ( compare, failOp, depthFailOp, passOp )
    {
        this.compare = compare;//Optional
        this.failOp = failOp;//Optional
        this.depthFailOp = depthFailOp;//Optional
        this.passOp = passOp;//Optional
    }

    setCompare ( compare )
    {
        this.compare = compare;
    }

    setFailOp ( failOp )
    {
        this.failOp = failOp;
    }

    setDepthFailOp ( depthFailOp )
    {
        this.depthFailOp = depthFailOp;
    }

    setPassOp ( passOp )
    {
        this.passOp = passOp;
    }

    getAvailableCompares ()
    {
        return new x3dom.WebGPU.GPUCompareFunction();
    }

    getAvailableFailOps ()
    {
        return new x3dom.WebGPU.GPUStencilOperation();
    }

    getAvailableDepthFailOps ()
    {
        return new x3dom.WebGPU.GPUStencilOperation();
    }

    getAvailablePassOps ()
    {
        return new x3dom.WebGPU.GPUStencilOperation();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUStencilFaceState";
    }
};