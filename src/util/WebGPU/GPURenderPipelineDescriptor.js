/**
 * @file GPURenderPipelineDescriptor.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
x3dom.WebGPU.GPURenderPipelineDescriptor = class GPURenderPipelineDescriptor extends x3dom.WebGPU.GPUPipelineDescriptorBase
{
    constructor ( layout, vertex = this.newVrtex(), fragment, primitive, depthStencil, multisample, label )
    {
        super( layout, label );
        this.vertex = vertex;
        this.fragment = fragment; //Optional
        this.primitive = primitive; //Optional
        this.depthStencil = depthStencil; //Optional
        this.multisample = multisample; //Optional
    }

    setVrtex ( vertex )
    {
        this.vertex = vertex;
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

    setFragment ( fragment )
    {
        this.fragment = fragment;
    }

    newVrtex ( module, entryPoint, constants, buffers )
    {
        return new x3dom.WebGPU.GPUVertexState( module, entryPoint, constants, buffers );
    }

    newFragment ( module, entryPoint, constants, targets )
    {
        return x3dom.WebGPU.WebGPU.Fragment( module, entryPoint, constants, targets );
    }

    newPrimitive ( topology, stripIndexFormat, frontFace, cullMode, unclippedDepth )
    {
        return x3dom.WebGPU.GPUPrimitiveState( topology, stripIndexFormat, frontFace, cullMode, unclippedDepth );
    }

    newDepthStencil ( format, depthWriteEnabled, depthCompare, stencilFront, stencilBack, stencilReadMask, stencilWriteMask, depthBias, depthBiasSlopeScale, depthBiasClamp )
    {
        return x3dom.WebGPU.GPUDepthStencilState( format, depthWriteEnabled, depthCompare, stencilFront, stencilBack, stencilReadMask, stencilWriteMask, depthBias, depthBiasSlopeScale, depthBiasClamp );
    }

    newMultisample ( count, mask, alphaToCoverageEnabled )
    {
        return x3dom.WebGPU.GPUMultisampleState( count, mask, alphaToCoverageEnabled );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPURenderPipelineDescriptor";
    }
};