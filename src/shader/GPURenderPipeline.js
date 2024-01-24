x3dom.webgpu.createRenderPipeline = function ( device, GPURenderPipelineDescriptor )
{
    device.createRenderPipeline( GPURenderPipelineDescriptor );
};

x3dom.webgpu.GPURenderPipelineDescriptor = class
{
    constructor ( layout = "auto", vertex, fragment, primitive, depthStencil, multisample, label = "" )
    {
        this.layout = layout;
        this.vertex = vertex;
        this.fragment = fragment;
        this.primitive = primitive;
        this.depthStencil = depthStencil;
        this.multisample = multisample;
        this.label = label;
    }

    setLayout ( layout )
    {
        this.layout = layout;
    }

    setVrtex ( vertex )
    {
        this.vertex = vertex;
    }

    setFragment ( fragment )
    {
        this.fragment = fragment;
    }

    setPrimitive ( primitive )
    {
        this.primitive = primitive;
    }

    setDepthStencil ( depthStencil )
    {
        this.depthStencil = depthStencil;
    }

    setMultisample ( multisample )
    {
        this.multisample = multisample;
    }

    setLabel ( label )
    {
        this.label = label;
    }
};

x3dom.webgpu.GPURenderPipelineDescriptorVertex = class
{
    constructor ( module, entryPoint, buffers = [], constants = {} )
    {
        this.module = module;
        this.entryPoint = entryPoint;
        this.buffers = buffers;
        this.constants = constants;
    }

    setModule ( module )
    {
        this.module = module;
    }

    setEntryPoint ( entryPoint )
    {
        this.entryPoint = entryPoint;
    }

    setBuffers ( buffers )
    {
        this.buffers = buffers;
    }

    setConstants ( constants )
    {
        this.constants = constants;
    }
};