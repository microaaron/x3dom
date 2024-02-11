/**
 * @file GPURenderPassColorAttachment.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPURenderPassColorAttachment = class GPURenderPassColorAttachment
{
    constructor ( view, depthSlice, resolveTarget, clearValue, loadOp, storeOp )
    {
        this.view = view; //Required GPUTextureView
        this.depthSlice = depthSlice; //GPUIntegerCoordinate
        this.resolveTarget = resolveTarget; //Optional; GPUTextureView
        this.clearValue = clearValue; //Optional; GPUColor; default = {r: 0, g: 0, b: 0, a: 0}
        this.loadOp = loadOp; //Required GPULoadOp
        this.storeOp = storeOp; //Required GPUStoreOp
    }

    setView ( view )
    {
        this.view = view;
    }

    setDepthSlice ( depthSlice )
    {
        this.depthSlice = depthSlice;
    }

    setResolveTarget ( resolveTarget )
    {
        this.resolveTarget = resolveTarget;
    }

    setClearValue ( clearValue )
    {
        this.clearValue = clearValue;
    }

    setLoadOp ( loadOp )
    {
        this.loadOp = loadOp;
    }

    setStoreOp ( storeOp )
    {
        this.storeOp = storeOp;
    }

    newClearValue ()
    {
        return new x3dom.WebGPU.GPUColorDict();
    }

    getAvailableLoadOps ()
    {
        return new x3dom.WebGPU.GPULoadOp();
    }

    getAvailableStoreOps ()
    {
        return new x3dom.WebGPU.GPUStoreOp();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPURenderPassColorAttachment";
    }
};