/**
 * @file GPUPrimitiveTopology.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
x3dom.WebGPU.GPUPrimitiveTopology = class GPUPrimitiveTopology
{
    point_list = "point-list";

    line_list = "line-list";

    line_strip = "line-strip";

    triangle_list = "triangle-list";

    triangle_strip = "triangle-strip";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUPrimitiveTopology";
    }
};