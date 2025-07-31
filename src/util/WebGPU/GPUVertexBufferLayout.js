/**
 * @file GPUVertexBufferLayout.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
x3dom.WebGPU.GPUVertexBufferLayout = class GPUVertexBufferLayout
{
    constructor ( arrayStride, stepMode, attributes = [] )
    {
        this.arrayStride = arrayStride;
        this.stepMode = stepMode; //Optional
        this.attributes = attributes;
    }

    setArrayStride ( arrayStride )
    {
        this.arrayStride = arrayStride;
    }

    setStepMode ( stepMode )
    {
        this.stepMode = stepMode;
    }

    setAttributes ( attributes )
    {
        this.attributes = attributes;
    }

    static newAttribute ( format, offset, shaderLocation )
    {
        return new x3dom.WebGPU.GPUVertexAttribute( format, offset, shaderLocation );
    }

    static getAvailableStepModes ()
    {
        return new x3dom.WebGPU.GPUVertexStepMode();
    }
};
x3dom.WebGPU.GPUVertexBufferLayout.prototype.newAttribute = x3dom.WebGPU.GPUVertexBufferLayout.newAttribute;
x3dom.WebGPU.GPUVertexBufferLayout.prototype.newgetAvailableStepModesAttribute = x3dom.WebGPU.GPUVertexBufferLayout.getAvailableStepModes;