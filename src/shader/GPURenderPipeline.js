/**
 * @file GPURenderPipeline.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
x3dom.WebGPU.GPURenderPipeline = class
{
    constructor ( device, descriptor = this.newDescriptor() )
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

    newDescriptor ( layout, vertex, fragment, primitive, depthStencil, multisample, label )
    {
        return new x3dom.WebGPU.GPURenderPipeline.Descriptor( layout, vertex, fragment, primitive, depthStencil, multisample, label );
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
x3dom.WebGPU.GPURenderPipeline.Descriptor = class GPURenderPipelineDescriptor
{
    constructor ( layout = "auto", vertex = this.newVrtex(), fragment = this.newFragment(), primitive, depthStencil, multisample, label = "" )
    {
        this.layout = layout;
        this.vertex = vertex;
        this.fragment = fragment; //Optional
        this.primitive = primitive; //Optional
        this.depthStencil = depthStencil; //Optional
        this.multisample = multisample; //Optional
        this.label = label; //Optional
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

    newVrtex ( module, entryPoint, buffers, constants )
    {
        return new x3dom.WebGPU.GPURenderPipeline.Descriptor.Vertex( module, entryPoint, buffers, constants );
    }

    newFragment ( module, entryPoint, targets, constants )
    {
        return x3dom.WebGPU.GPURenderPipeline.Descriptor.Fragment( module, entryPoint, targets, constants );
    }
};

//refer: https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createRenderPipeline#vertex_object_structure
x3dom.WebGPU.GPURenderPipeline.Descriptor.Vertex = class GPURenderPipeline_Descriptor_Vertex
{
    constructor ( module, entryPoint, buffers = [], constants = this.newConstants() )
    {
        this.module = module;
        this.entryPoint = entryPoint;
        this.buffers = buffers; //Optional
        this.constants = constants; //Optional
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

    newBuffer ( arrayStride, attributes, stepMode )
    {
        return new x3dom.WebGPU.GPURenderPipeline.Descriptor.Vertex.Buffer( arrayStride, attributes, stepMode );
    }

    newConstants ( constants )
    {
        return new x3dom.WebGPU.GPURenderPipeline.Descriptor.Vertex.Constants( constants );
    }
};

//refer: https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createRenderPipeline#buffers
x3dom.WebGPU.GPURenderPipeline.Descriptor.Vertex.Buffer = class GPURenderPipeline_Descriptor_Vertex_Buffer
{
    constructor ( arrayStride, attributes = [], stepMode )
    {
        this.arrayStride = arrayStride;
        this.attributes = attributes;
        this.stepMode = stepMode; //Optional
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

    newAttribute ( shaderLocation, offset, format )
    {
        return new x3dom.WebGPU.GPURenderPipeline.Descriptor.Vertex.Buffer.Attribute( shaderLocation, offset, format );
    }

    getAvailableStepModes ()
    {
        return new x3dom.WebGPU.GPURenderPipeline.Descriptor.Vertex.Buffer.StepModes();
    }
};

//refer: https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createRenderPipeline#attributes
x3dom.WebGPU.GPURenderPipeline.Descriptor.Vertex.Buffer.Attribute = class GPURenderPipeline_Descriptor_Vertex_Buffer_Attribute
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
        return new x3dom.WebGPU.GPURenderPipeline.Descriptor.Vertex.Buffer.Attribute.Formats();
    }
};

//refer: https://gpuweb.github.io/gpuweb/#enumdef-gpuvertexformat
x3dom.WebGPU.GPURenderPipeline.Descriptor.Vertex.Buffer.Attribute.Formats = class GPUVertexFormats
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
x3dom.WebGPU.GPURenderPipeline.Descriptor.Vertex.Buffer.StepModes = class GPURenderPipeline_Descriptor_Vertex_Buffer_StepModes
{
    vertex = "vertex";

    instance = "instance";

    constructor ()
    {
        Object.freeze( this );
    }
};

//refer: https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createRenderPipeline#constants_2
x3dom.WebGPU.GPURenderPipeline.Descriptor.Vertex.Constants = class GPURenderPipeline_Descriptor_VertexFragment_Constants
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
x3dom.WebGPU.GPURenderPipeline.Descriptor.Fragment = class GPUFragmentState
{
    constructor ( module, entryPoint, targets = [], constants = this.newConstants() )
    {
        this.module = module;
        this.entryPoint = entryPoint;
        this.targets = targets;
        this.constants = constants; //Optional
    }

    setModule ( module )
    {
        this.module = module;
    }

    setEntryPoint ( entryPoint )
    {
        this.entryPoint = entryPoint;
    }

    setTargets ( targets )
    {
        this.targets = targets;
    }

    setConstants ( constants )
    {
        this.constants = constants;
    }

    newConstants ( constants )
    {
        return new x3dom.WebGPU.GPURenderPipeline.Descriptor.Fragment.Constants( constants );
    }
};

//refer: https://gpuweb.github.io/gpuweb/#dictdef-gpucolortargetstate
x3dom.WebGPU.GPURenderPipeline.Descriptor.Fragment.Target = class GPUColorTargetState
{
    constructor ( format, blend, writeMask )
    {
        this.format = format;
        this.blend = blend; //Optional
        this.writeMask = writeMask; //Optional
    }

    setFormat ( format )
    {
        this.format = format;
    }

    setBlend ( blend )
    {
        this.blend = blend;
    }

    setWriteMask ( writeMask )
    {
        this.writeMask = writeMask;
    }

    newBlend ( color, alpha )
    {
        return new x3dom.WebGPU.GPURenderPipeline.Descriptor.Fragment.Target.Blend( color, alpha );
    }

    getAvailableFormats ()
    {
        return new x3dom.WebGPU.GPURenderPipeline.Descriptor.Fragment.Target.Formats();
    }
};
x3dom.WebGPU.GPURenderPipeline.Descriptor.Fragment.Target.Formats = x3dom.WebGPU.GPUTexture.GPUTextureFormats();

x3dom.WebGPU.GPURenderPipeline.Descriptor.Fragment.Target.Blend = class GPUBlendState
{
    constructor ( color, alpha )
    {
        this.color = color;
        this.alpha = alpha;
    }

    setColor ( color )
    {
        this.color = color;
    }

    setAlpha ( alpha )
    {
        this.alpha = alpha;
    }

    newColor ( srcFactor, dstFactor, operation )
    {
        return new x3dom.WebGPU.GPURenderPipeline.Descriptor.Fragment.Target.Blend.Color( color );
    }

    newAlpha ( srcFactor, dstFactor, operation )
    {
        return new x3dom.WebGPU.GPURenderPipeline.Descriptor.Fragment.Target.Blend.Alpha( alpha );
    }
};

x3dom.WebGPU.GPURenderPipeline.Descriptor.Fragment.Target.Blend.Color = class GPUBlendComponent
{
    constructor ( srcFactor, dstFactor, operation )
    {
        this.srcFactor = srcFactor; //Optional
        this.dstFactor = dstFactor; //Optional
        this.operation = operation; //Optional
    }

    setSrcFactor ( srcFactor )
    {
        this.srcFactor = srcFactor;
    }

    setDstFactor ( dstFactor )
    {
        this.dstFactor = dstFactor;
    }

    setOperation ( operation )
    {
        this.operation = operation;
    }

    getAvailableSrcFactors ()
    {
        return new x3dom.WebGPU.GPUTexture.GPUTextureFormats();
    }

    getAvailableDstFactors ()
    {
        return new x3dom.WebGPU.GPUTexture.GPUTextureFormats();
    }

    getAvailableOperations ()
    {
        return new x3dom.WebGPU.GPUTexture.GPUTextureFormats();
    }
};

x3dom.WebGPU.GPURenderPipeline.Descriptor.Fragment.Target.Blend.Color.SrcFactors = class GPUBlendFactor
{
    zero = "zero";

    one = "one";

    src = "src";

    one_minus_src = "one-minus-src";

    src_alpha = "src-alpha";

    one_minus_src_alpha = "one-minus-src-alpha";

    dst = "dst";

    one_minus_dst = "one-minus-dst";

    dst_alpha = "dst-alpha";

    one_minus_dst_alpha = "one-minus-dst-alpha";

    src_alpha_saturated = "src-alpha-saturated";

    constant = "constant";

    one_minus_constant = "one-minus-constant";

    constructor ()
    {
        Object.freeze( this );
    }
};

x3dom.WebGPU.GPURenderPipeline.Descriptor.Fragment.Target.Blend.Alpha = x3dom.WebGPU.GPURenderPipeline.Descriptor.Fragment.Target.Blend.Color;

x3dom.WebGPU.GPURenderPipeline.Descriptor.Fragment.Target.Blend.Color.dstFactor = x3dom.WebGPU.GPURenderPipeline.Descriptor.Fragment.Target.Blend.Color.srcFactor = {
    constant : "constant"

};

x3dom.WebGPU.GPURenderPipeline.Descriptor.Fragment.Constants = x3dom.WebGPU.GPURenderPipeline.Descriptor.Vertex.Constants;