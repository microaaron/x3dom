/**
 * @file GPUBufferBindingLayout.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPUBufferBindingLayout = class GPUBufferBindingLayout
{
    constructor ( type, hasDynamicOffset, minBindingSize )
    {
        this.type = type; //Optional; GPUBufferBindingType; undefined = "uniform"
        this.hasDynamicOffset = hasDynamicOffset; //Optional; boolean; undefined = false
        this.minBindingSize = minBindingSize; //Optional; GPUSize64; undefined = 0
    }

    setType ( type )
    {
        this.type = type;
    }

    setHasDynamicOffset ( hasDynamicOffset )
    {
        this.hasDynamicOffset = hasDynamicOffset;
    }

    setMinBindingSize ( minBindingSize )
    {
        this.minBindingSize = minBindingSize;
    }

    static getAvailableTypes ()
    {
        return new x3dom.WebGPU.GPUBufferBindingType();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUBufferBindingLayout";
    }
};
x3dom.WebGPU.GPUBufferBindingLayout.prototype.getAvailableTypes = x3dom.WebGPU.GPUBufferBindingLayout.getAvailableTypes;