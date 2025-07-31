/**
 * @file GPUVertexStepMode.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
x3dom.WebGPU.GPUVertexStepMode = class GPUVertexStepMode
{
    vertex = "vertex";

    instance = "instance";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUVertexStepMode";
    }
};