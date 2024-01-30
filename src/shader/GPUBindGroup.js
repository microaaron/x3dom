x3dom.WebGPU.createBindGroup = function ( device, GPUBindGroupDescriptor )
{
    device.createBindGroup( GPUBindGroupDescriptor );
};

x3dom.WebGPU.GPUBindGroupDescriptor = class
{
    constructor ( layout, entries = [], label = "" )
    {
        this.layout = layout;
        this.entries = entries;
        this.label = label;
    }
};