/**
 * @file GPUExtent3DDict.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPUExtent3DDict = class GPUExtent3DDict
{
    constructor ( width, height, depthOrArrayLayers )
    {
        this.width = width; //Required GPUIntegerCoordinate
        this.height = height; //Optional; GPUIntegerCoordinate; undefined = 1
        this.depthOrArrayLayers = depthOrArrayLayers; //Optional; GPUIntegerCoordinate; undefined = 1
    }

    setWidth ( width )
    {
        this.width = width;
    }

    setHeight ( height )
    {
        this.height = height;
    }

    setDepthOrArrayLayers ( depthOrArrayLayers )
    {
        this.depthOrArrayLayers = depthOrArrayLayers;
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUExtent3DDict";
    }
};