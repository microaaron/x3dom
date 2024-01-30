x3dom.WebGPU.createBindGroupLayout = function ( device, GPUBindGroupLayoutDescriptor )
{
    device.createBindGroupLayout( GPUBindGroupLayoutDescriptor );
};

x3dom.WebGPU.GPUBindGroupLayoutDescriptor = class
{
    constructor ( entries = [], label = "" )
    {
        this.entries = entries;
        this.label = label;
    }
};