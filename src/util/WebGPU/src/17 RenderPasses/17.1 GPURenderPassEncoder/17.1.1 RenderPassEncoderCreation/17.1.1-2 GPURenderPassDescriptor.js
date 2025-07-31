/**
 * @file GPURenderPassDescriptor.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPURenderPassDescriptor = class GPURenderPassDescriptor extends x3dom.WebGPU.GPUObjectDescriptorBase
{
    constructor ( colorAttachments = [], depthStencilAttachment, occlusionQuerySet, timestampWrites, maxDrawCount, label )
    {
        super( label );
        this.colorAttachments = colorAttachments; //Required sequence<GPURenderPassColorAttachment?>
        this.depthStencilAttachment = depthStencilAttachment; //Optional; GPURenderPassDepthStencilAttachment
        this.occlusionQuerySet = occlusionQuerySet; //Optional; GPUQuerySet
        this.timestampWrites = timestampWrites; //Optional; GPURenderPassTimestampWrites
        this.maxDrawCount = maxDrawCount; //Optional; GPUSize64; undefined = 50000000
    }

    setColorAttachments ( colorAttachments )
    {
        this.colorAttachments = colorAttachments;
    }

    setDepthStencilAttachment ( depthStencilAttachment )
    {
        this.depthStencilAttachment = depthStencilAttachment;
    }

    setOcclusionQuerySet ( occlusionQuerySet )
    {
        this.occlusionQuerySet = occlusionQuerySet;
    }

    setTimestampWrites ( timestampWrites )
    {
        this.timestampWrites = timestampWrites;
    }

    setMaxDrawCount ( maxDrawCount )
    {
        this.maxDrawCount = maxDrawCount;
    }

    static newColorAttachment ()
    {
        return new x3dom.WebGPU.GPURenderPassColorAttachment();
    }

    static newDepthStencilAttachment ()
    {
        return new x3dom.WebGPU.GPURenderPassDepthStencilAttachment();
    }

    static newTimestampWrites ()
    {
        return new x3dom.WebGPU.GPURenderPassTimestampWrites();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPURenderPassDescriptor";
    }
};
x3dom.WebGPU.GPURenderPassDescriptor.prototype.newColorAttachment = x3dom.WebGPU.GPURenderPassDescriptor.newColorAttachment;
x3dom.WebGPU.GPURenderPassDescriptor.prototype.newDepthStencilAttachment = x3dom.WebGPU.GPURenderPassDescriptor.newDepthStencilAttachment;
x3dom.WebGPU.GPURenderPassDescriptor.prototype.newTimestampWrites = x3dom.WebGPU.GPURenderPassDescriptor.newTimestampWrites;