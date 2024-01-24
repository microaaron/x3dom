x3dom.webgpu.createBindGroupLayout = function ( device, GPUBindGroupLayoutDescriptor )
{
    device.createBindGroupLayout( GPUBindGroupLayoutDescriptor );
};

x3dom.webgpu.GPUBindGroupLayoutDescriptor = class
{
    constructor ( entries = [], label = "" )
    {
        this.entries = entries;
        this.label = label;
    }
};