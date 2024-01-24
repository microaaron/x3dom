x3dom.webgpu.createBindGroup = function ( device, GPUBindGroupDescriptor )
{
    device.createBindGroup( GPUBindGroupDescriptor );
};

x3dom.webgpu.GPUBindGroupDescriptor = class
{
    constructor ( layout, entries = [], label = "" )
    {
        this.layout = layout;
        this.entries = entries;
        this.label = label;
    }
};