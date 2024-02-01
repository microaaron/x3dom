/**
 * @file GPUPrimitiveState.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
x3dom.WebGPU.GPUPrimitiveState = class GPUPrimitiveState
{
    constructor ( topology, stripIndexFormat, frontFace, cullMode, unclippedDepth )
    {
        this.topology = topology; //Optional
        this.stripIndexFormat = stripIndexFormat; //Optional
        this.frontFace = frontFace; //Optional
        this.cullMode = cullMode; //Optional

        // Requires "depth-clip-control" feature.
        this.unclippedDepth = unclippedDepth; //Optional
    }

    setTopology ( topology )
    {
        this.topology = topology;
    }

    setStripIndexFormat ( stripIndexFormat )
    {
        this.stripIndexFormat = stripIndexFormat;
    }

    setFrontFace ( frontFace )
    {
        this.frontFace = frontFace;
    }

    setCullMode ( cullMode )
    {
        this.cullMode = cullMode;
    }

    setUnclippedDepth ( unclippedDepth )
    {
        this.unclippedDepth = unclippedDepth;
    }

    getAvailableTopologys ()
    {
        return new x3dom.WebGPU.GPUPrimitiveTopology();
    }

    getAvailableStripIndexFormats ()
    {
        return new x3dom.WebGPU.GPUIndexFormat();
    }

    getAvailableFrontFaces ()
    {
        return new x3dom.WebGPU.GPUFrontFace();
    }

    getAvailableCullModes ()
    {
        return new x3dom.WebGPU.GPUCullMode();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUPrimitiveState";
    }
};