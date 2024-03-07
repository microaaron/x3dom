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

    static getAvailableCompares ()
    {
        return new x3dom.WebGPU.GPUCompareFunction();
    }

    static getAvailableFailOps ()
    {
        return new x3dom.WebGPU.GPUStencilOperation();
    }

    static getAvailableDepthFailOps ()
    {
        return new x3dom.WebGPU.GPUStencilOperation();
    }

    static getAvailablePassOps ()
    {
        return new x3dom.WebGPU.GPUStencilOperation();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUStencilFaceState";
    }
};
x3dom.WebGPU.GPUStencilFaceState.prototype.getAvailableCompares = x3dom.WebGPU.GPUStencilFaceState.getAvailableCompares;
x3dom.WebGPU.GPUStencilFaceState.prototype.getAvailableFailOps = x3dom.WebGPU.GPUStencilFaceState.getAvailableFailOps;
x3dom.WebGPU.GPUStencilFaceState.prototype.getAvailableDepthFailOps = x3dom.WebGPU.GPUStencilFaceState.getAvailableDepthFailOps;
x3dom.WebGPU.GPUStencilFaceState.prototype.getAvailablePassOps = x3dom.WebGPU.GPUStencilFaceState.getAvailablePassOps;