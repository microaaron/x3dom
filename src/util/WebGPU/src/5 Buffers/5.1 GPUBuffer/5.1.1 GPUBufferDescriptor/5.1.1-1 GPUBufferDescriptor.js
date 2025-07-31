/**
 * @file GPUBufferDescriptor.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPUBufferDescriptor = class GPUBufferDescriptor extends x3dom.WebGPU.GPUObjectDescriptorBase
{
    constructor ( size, usage, mappedAtCreation, label )
    {
        super( label );
        this.size = size; //Required GPUSize64
        this.usage = usage; //Required GPUBufferUsageFlags
        this.mappedAtCreation = mappedAtCreation; //Optional; boolean; undefined = false
    }

    setSize ( size )
    {
        this.size = size;
    }

    setUsage ( usage )
    {
        this.usage = usage;
    }

    setMappedAtCreation ( mappedAtCreation )
    {
        this.mappedAtCreation = mappedAtCreation;
    }

    static getAvailableUsages ()
    {
        return new x3dom.WebGPU.GPUBufferUsage();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUBufferDescriptor";
    }
};
x3dom.WebGPU.GPUBufferDescriptor.prototype.getAvailableUsages = x3dom.WebGPU.GPUBufferDescriptor.getAvailableUsages;