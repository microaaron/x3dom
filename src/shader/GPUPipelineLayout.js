x3dom.WebGPU.createPipelineLayout = function ( device, GPUPipelineLayoutDescriptor )
{
    device.createPipelineLayout( GPUPipelineLayoutDescriptor );
};

x3dom.WebGPU.GPUPipelineLayoutDescriptor = class
{
    constructor ( bindGroupLayouts = [], label = "" )
    {
        this.bindGroupLayouts = bindGroupLayouts;
        this.label = label;
    }
};