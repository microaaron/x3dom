x3dom.webgpu.createPipelineLayout = function ( device, GPUPipelineLayoutDescriptor )
{
    device.createPipelineLayout( GPUPipelineLayoutDescriptor );
};

x3dom.webgpu.GPUPipelineLayoutDescriptor = class
{
    constructor ( bindGroupLayouts = [], label = "" )
    {
        this.bindGroupLayouts = bindGroupLayouts;
        this.label = label;
    }
};