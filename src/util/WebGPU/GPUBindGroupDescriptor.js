/**
 * @file GPUBindGroupDescriptor.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPUBindGroupDescriptor = class GPUBindGroupDescriptor extends x3dom.WebGPU.GPUObjectDescriptorBase
{
    constructor ( layout, entries = [], label )
    {
        super( label );
        this.layout = layout; //required GPUBindGroupLayout
        this.entries = entries; //Required sequence<GPUBindGroupEntry>
    }

    setLayout ( layout )
    {
        this.layout = layout;
    }

    setEntries ( entries )
    {
        this.entries = entries;
    }

    static newEntry ( binding, resource )
    {
        return new x3dom.WebGPU.GPUBindGroupEntry( binding, resource );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUBindGroupDescriptor";
    }
};
x3dom.WebGPU.GPUBindGroupDescriptor.prototype.newEntry = x3dom.WebGPU.GPUBindGroupDescriptor.newEntry;