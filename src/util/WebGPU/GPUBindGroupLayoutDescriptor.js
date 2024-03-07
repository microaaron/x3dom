/**
 * @file GPUBindGroupLayoutDescriptor.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPUBindGroupLayoutDescriptor = class GPUBindGroupLayoutDescriptor extends x3dom.WebGPU.GPUObjectDescriptorBase
{
    constructor ( entries = [], label )
    {
        super( label );
        this.entries = entries; //Required sequence<GPUBindGroupLayoutEntry>
    }

    setEntries ( entries )
    {
        this.entries = entries;
    }

    static newEntry ( binding, visibility, resourceLayoutObject )
    {
        return new x3dom.WebGPU.GPUBindGroupLayoutEntry( binding, visibility, resourceLayoutObject );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUBindGroupLayoutDescriptor";
    }
};
x3dom.WebGPU.GPUBindGroupLayoutDescriptor.prototype.newEntry = x3dom.WebGPU.GPUBindGroupLayoutDescriptor.newEntry;