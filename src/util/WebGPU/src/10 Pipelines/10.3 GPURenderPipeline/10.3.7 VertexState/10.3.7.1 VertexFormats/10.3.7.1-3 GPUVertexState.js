/**
 * @file GPUVertexState.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
x3dom.WebGPU.GPUVertexState = class GPUVertexState extends x3dom.WebGPU.GPUProgrammableStage
{
    constructor ( module, entryPoint, constants, buffers = [] )
    {
        super( module, entryPoint, constants );
        this.buffers = buffers; //Optional
    }

    setBuffers ( buffers )
    {
        this.buffers = buffers;
    }

    static newBuffer ( arrayStride, stepMode, attributes )
    {
        return new x3dom.WebGPU.GPUVertexBufferLayout( arrayStride, stepMode, attributes );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUVertexState";
    }
};
x3dom.WebGPU.GPUVertexState.prototype.newBuffer = x3dom.WebGPU.GPUVertexState.newBuffer;