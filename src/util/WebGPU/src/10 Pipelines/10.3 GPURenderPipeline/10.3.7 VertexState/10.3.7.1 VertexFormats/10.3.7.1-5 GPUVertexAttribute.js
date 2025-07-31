/**
 * @file GPUVertexAttribute.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
x3dom.WebGPU.GPUVertexAttribute = class GPUVertexAttribute
{
    constructor ( format, offset, shaderLocation )
    {
        this.format = format;
        this.offset = offset;
        this.shaderLocation = shaderLocation;
    }

    setFormat ( format )
    {
        this.format = format;
    }

    setOffset ( offset )
    {
        this.offset = offset;
    }

    setShaderLocation ( shaderLocation )
    {
        this.shaderLocation = shaderLocation;
    }

    static getAvailableFormats ()
    {
        return new x3dom.WebGPU.GPUVertexFormat();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUVertexAttribute";
    }
};
x3dom.WebGPU.GPUVertexAttribute.prototype.getAvailableFormats = x3dom.WebGPU.GPUVertexAttribute.getAvailableFormats;