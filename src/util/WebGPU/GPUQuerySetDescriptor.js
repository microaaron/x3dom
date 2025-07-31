/**
 * @file GPUQuerySetDescriptor.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPUQuerySetDescriptor = class GPUQuerySetDescriptor extends x3dom.WebGPU.GPUObjectDescriptorBase
{
    constructor ( type, count, label )
    {
        super( label );
        this.type = type; //Required GPUQueryType
        this.count = count; //Required GPUSize32
    }

    setType ( type )
    {
        this.type = type;
    }

    setCount ( count )
    {
        this.count = count;
    }

    static getAvailableTypes ()
    {
        return new x3dom.WebGPU.GPUQueryType();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUQuerySetDescriptor";
    }
};
x3dom.WebGPU.GPUQuerySetDescriptor.prototype.getAvailableTypes = x3dom.WebGPU.GPUQuerySetDescriptor.getAvailableTypes;