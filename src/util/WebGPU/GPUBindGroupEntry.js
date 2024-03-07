/**
 * @file GPUBindGroupEntry.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPUBindGroupEntry = class GPUBindGroupEntry
{
    constructor ( binding, resource )
    {
        this.binding = binding; //Required GPUIndex32
        this.resource = resource; //Required GPUBindingResource; typedef (GPUSampler or GPUTextureView or GPUBufferBinding or GPUExternalTexture) GPUBindingResource
    }

    setBinding ( binding )
    {
        this.binding = binding;
    }

    setResource ( resource )
    {
        this.resource = resource;
    }

    static newResource_GPUBufferBinding ( buffer, offset, size )
    {
        return new x3dom.WebGPU.GPUBufferBinding( buffer, offset, size );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUBindGroupEntry";
    }
};
x3dom.WebGPU.GPUBindGroupEntry.prototype.newResource_GPUBufferBinding = x3dom.WebGPU.GPUBindGroupEntry.newResource_GPUBufferBinding;