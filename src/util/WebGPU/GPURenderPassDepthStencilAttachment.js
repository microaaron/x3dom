/**
 * @file GPURenderPassDepthStencilAttachment.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPURenderPassDepthStencilAttachment = class GPURenderPassDepthStencilAttachment
{
    constructor ( view, depthClearValue, depthLoadOp, depthStoreOp, depthReadOnly, stencilClearValue, stencilLoadOp, stencilStoreOp, stencilReadOnly )
    {
        this.view = view; //Required GPUTextureView;
        this.depthClearValue = depthClearValue; //Optional; float
        this.depthLoadOp = depthLoadOp; //Optional; GPULoadOp
        this.depthStoreOp = depthStoreOp; //Optional; GPUStoreOp
        this.depthReadOnly = depthReadOnly; //Optional; boolean; default = false
        this.stencilClearValue = stencilClearValue; //Optional; GPUStencilValue; default =0
        this.stencilLoadOp = stencilLoadOp; //Optional; GPULoadOp
        this.stencilStoreOp = stencilStoreOp; //Optional; GPUStoreOp
        this.stencilReadOnly = stencilReadOnly; //Optional; boolean; default = false
    }

    setView ( view )
    {
        this.view = view;
    }

    setDepthClearValue ( depthClearValue )
    {
        this.depthClearValue = depthClearValue;
    }

    setDepthLoadOp ( depthLoadOp )
    {
        this.depthLoadOp = depthLoadOp;
    }

    setDepthStoreOp ( depthStoreOp )
    {
        this.depthStoreOp = depthStoreOp;
    }

    setDepthReadOnly ( depthReadOnly )
    {
        this.depthReadOnly = depthReadOnly;
    }

    setStencilClearValue ( stencilClearValue )
    {
        this.stencilClearValue = stencilClearValue;
    }

    setStencilLoadOp ( stencilLoadOp )
    {
        this.stencilLoadOp = stencilLoadOp;
    }

    setStencilStoreOp ( stencilStoreOp )
    {
        this.stencilStoreOp = stencilStoreOp;
    }

    setStencilReadOnly ( stencilReadOnly )
    {
        this.stencilReadOnly = stencilReadOnly;
    }

    static getAvailableDepthLoadOps ()
    {
        return new x3dom.WebGPU.GPULoadOp();
    }

    static getAvailableDepthStoreOps ()
    {
        return new x3dom.WebGPU.GPUStoreOp();
    }

    static getAvailableStencilLoadOps ()
    {
        return new x3dom.WebGPU.GPULoadOp();
    }

    static getAvailableStencilStoreOps ()
    {
        return new x3dom.WebGPU.GPUStoreOp();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPURenderPassDepthStencilAttachment";
    }
};
x3dom.WebGPU.GPURenderPassDepthStencilAttachment.prototype.getAvailableDepthLoadOps = x3dom.WebGPU.GPURenderPassDepthStencilAttachment.getAvailableDepthLoadOps;
x3dom.WebGPU.GPURenderPassDepthStencilAttachment.prototype.getAvailableDepthStoreOps = x3dom.WebGPU.GPURenderPassDepthStencilAttachment.getAvailableDepthStoreOps;
x3dom.WebGPU.GPURenderPassDepthStencilAttachment.prototype.getAvailableStencilLoadOps = x3dom.WebGPU.GPURenderPassDepthStencilAttachment.getAvailableStencilLoadOps;
x3dom.WebGPU.GPURenderPassDepthStencilAttachment.prototype.getAvailableStencilStoreOps = x3dom.WebGPU.GPURenderPassDepthStencilAttachment.getAvailableStencilStoreOps;