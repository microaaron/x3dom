/**
 * @file GPURenderPipeline.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
x3dom.webgpu.GPURenderPipeline = class
{
    constructor ( device, descriptor = newDescriptor() )
    {
        this.device = device;
        this.descriptor = descriptor;
    }

    setDevice ( device )
    {
        this.device = device;
    }

    setDescriptor ( descriptor )
    {
        this.descriptor = descriptor;
    }

    newDescriptor ( layout = "auto", vertex = this.newVrtex(), fragment = this.newFragment(), primitive, depthStencil, multisample, label = "" )
    {
        return new x3dom.webgpu.GPURenderPipeline.Descriptor( layout, vertex, fragment, primitive, depthStencil, multisample, label );
    }

    create ()
    {
        this.renderPipeline = this.device.createRenderPipeline( this.descriptor );
        return this.renderPipeline;
    }

    async createAsync ()
    {
        this.renderPipeline = await this.device.createRenderPipelineAsync( this.descriptor );
        return this.renderPipeline;
    }
};

//refer: https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createRenderPipeline#descriptor
x3dom.webgpu.GPURenderPipeline.Descriptor = class GPURenderPipeline_Descriptor
{
    constructor ( layout = "auto", vertex = this.newVrtex(), fragment = this.newFragment(), primitive, depthStencil, multisample, label = "" )
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

    newVrtex ( module, entryPoint, buffers = [], constants = {} )
    {
        return new x3dom.webgpu.GPURenderPipeline.Descriptor.Vertex( module, entryPoint, buffers, constants );
    }

    newFragment ()
    {
        return;
    }
};

//refer: https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createRenderPipeline#vertex_object_structure
x3dom.webgpu.GPURenderPipeline.Descriptor.Vertex = class GPURenderPipeline_Descriptor_Vertex
{
    constructor ( module, entryPoint, buffers = [], constants = newConstants() )
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

    newBuffer ( arrayStride, attributes = [], stepMode )
    {
        return new x3dom.webgpu.GPURenderPipeline.Descriptor.Vertex.Buffer( arrayStride, attributes = [], stepMode );
    }

    newConstants ( constants )
    {
        return new x3dom.webgpu.GPURenderPipeline.Descriptor.Vertex.Constants( constants );
    }
};

//refer: https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createRenderPipeline#buffers
x3dom.webgpu.GPURenderPipeline.Descriptor.Vertex.Buffer = class GPURenderPipeline_Descriptor_Vertex_Buffer
{
    constructor ( arrayStride, attributes = [], stepMode )
    {
        this.arrayStride = arrayStride;
        this.attributes = attributes;
        this.stepMode = stepMode;
    }

    setArrayStride ( arrayStride )
    {
        this.arrayStride = arrayStride;
    }

    setAttributes ( attributes )
    {
        this.attributes = attributes;
    }

    setStepMode ( stepMode )
    {
        this.stepMode = stepMode;
    }

    getAvailableStepModes ()
    {
        return new x3dom.webgpu.GPURenderPipeline.Descriptor.Vertex.Buffer.StepModes();
    };
};

//refer: https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createRenderPipeline#attributes
x3dom.webgpu.GPURenderPipeline.Descriptor.Vertex.Buffer.Attribute = class GPURenderPipeline_Descriptor_Vertex_Buffer_Attribute
{
    constructor ( shaderLocation, offset, format )
    {
        this.shaderLocation = shaderLocation;
        this.offset = offset;
        this.format = format;
    }

    setShaderLocation ( shaderLocation )
    {
        this.shaderLocation = shaderLocation;
    }

    setOffset ( offset )
    {
        this.offset = offset;
    }

    setFormat ( format )
    {
        this.format = format;
    }

    getAvailableFormats ()
    {
        return new x3dom.webgpu.GPURenderPipeline.Descriptor.Vertex.Buffer.Attribute.GPUVertexFormats();
    };
};

//refer: https://gpuweb.github.io/gpuweb/#enumdef-gpuvertexformat
x3dom.webgpu.GPURenderPipeline.Descriptor.Vertex.Buffer.Attribute.GPUVertexFormats = class GPURenderPipeline_Descriptor_Vertex_Buffer_Attribute_GPUVertexFormats
{
    uint8x2 = "uint8x2";

    uint8x4 = "uint8x4";

    sint8x2 = "sint8x2";

    sint8x4 = "sint8x4";

    unorm8x2 = "unorm8x2";

    unorm8x4 = "unorm8x4";

    snorm8x2 = "snorm8x2";

    snorm8x4 = "snorm8x4";

    uint16x2 = "uint16x2";

    uint16x4 = "uint16x4";

    sint16x2 = "sint16x2";

    sint16x4 = "sint16x4";

    unorm16x2 = "unorm16x2";

    unorm16x4 = "unorm16x4";

    snorm16x2 = "snorm16x2";

    snorm16x4 = "snorm16x4";

    float16x2 = "float16x2";

    float16x4 = "float16x4";

    float32 = "float32";

    float32x2 = "float32x2";

    float32x3 = "float32x3";

    float32x4 = "float32x4";

    uint32 = "uint32";

    uint32x2 = "uint32x2";

    uint32x3 = "uint32x3";

    uint32x4 = "uint32x4";

    sint32 = "sint32";

    sint32x2 = "sint32x2";

    sint32x3 = "sint32x3";

    sint32x4 = "sint32x4";

    unorm10_10_10_2 = "unorm10-10-10-2";

    constructor ()
    {
        Object.freeze( this );
    }
};

//refer: https://gpuweb.github.io/gpuweb/#enumdef-gpuvertexstepmode
x3dom.webgpu.GPURenderPipeline.Descriptor.Vertex.Buffer.StepModes = class GPURenderPipeline_Descriptor_Vertex_Buffer_StepModes
{
    vertex = "vertex";

    instance = "instance";

    constructor ()
    {
        Object.freeze( this );
    }
};

//refer: https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createRenderPipeline#constants_2
x3dom.webgpu.GPURenderPipeline.Descriptor.Vertex.Constants = class GPURenderPipeline_Descriptor_VertexFragment_Constants
{
    constructor ( constants )
    {
        Object.assign( this, constants );
    }

    add ( constants )
    {
        Object.assign( this, constants );
    }
};

//refer: https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createRenderPipeline#fragment_object_structure
x3dom.webgpu.GPURenderPipeline.Descriptor.Fragment = class GPURenderPipeline_Descriptor_Fragment
{
    constructor ( module, entryPoint, targets = [], constants = newConstants() )
    {
        this.module = module;
        this.entryPoint = entryPoint;
        this.targets = targets;
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

    setBuffers ( targets )
    {
        this.targets = targets;
    }

    setConstants ( constants )
    {
        this.constants = constants;
    }

    newConstants ( constants )
    {
        return new x3dom.webgpu.GPURenderPipeline.Descriptor.Fragment.Constants( constants );
    }
};

//refer: https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createRenderPipeline#targets
x3dom.webgpu.GPURenderPipeline.Descriptor.Fragment.Target = class GPURenderPipeline_Descriptor_Fragment_Target
{
    constructor ( format, blend, writeMask )
    {
        this.format = format;
        this.blend = blend;
        this.writeMask = writeMask;
    }

    setModule ( format )
    {
        this.format = format;
    }

    setEntryPoint ( blend )
    {
        this.blend = blend;
    }

    setBuffers ( writeMask )
    {
        this.writeMask = writeMask;
    }
};

x3dom.webgpu.GPURenderPipeline.Descriptor.Fragment.Target.Blend = class GPURenderPipeline_Descriptor_Fragment_Target_Blend
{
    constructor ( color, alpha )
    {
        this.color = color;
        this.alpha = alpha;
    }

    setModule ( color )
    {
        this.color = color;
    }

    setEntryPoint ( alpha )
    {
        this.alpha = alpha;
    }
};

x3dom.webgpu.GPURenderPipeline.Descriptor.Fragment.Target.Blend.Color = class GPURenderPipeline_Descriptor_Fragment_Target_Blend_ColorAlpha
{
    constructor ( srcFactor, dstFactor, operation )
    {
        this.srcFactor = srcFactor;
        this.dstFactor = dstFactor;
        this.operation = operation;
    }

    setModule ( srcFactor )
    {
        this.srcFactor = srcFactor;
    }

    setEntryPoint ( dstFactor )
    {
        this.dstFactor = dstFactor;
    }

    setEntryPoint ( operation )
    {
        this.operation = operation;
    }
};

x3dom.webgpu.GPURenderPipeline.Descriptor.Fragment.Target.Blend.Alpha = x3dom.webgpu.GPURenderPipeline.Descriptor.Fragment.Target.Blend.Color;

x3dom.webgpu.GPURenderPipeline.Descriptor.Fragment.Target.Blend.Color.dstFactor = x3dom.webgpu.GPURenderPipeline.Descriptor.Fragment.Target.Blend.Color.srcFactor = {
    constant : "constant"

};

x3dom.webgpu.GPURenderPipeline.Descriptor.Fragment.Constants = x3dom.webgpu.GPURenderPipeline.Descriptor.Vertex.Constants;