/**
 * @file GPUBufferUsage.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPUBufferUsage = class GPUBufferUsage
{
    MAP_READ = 0x0001;

    MAP_WRITE = 0x0002;

    COPY_SRC = 0x0004;

    COPY_DST = 0x0008;

    INDEX = 0x0010;

    VERTEX = 0x0020;

    UNIFORM = 0x0040;

    STORAGE = 0x0080;

    INDIRECT = 0x0100;

    QUERY_RESOLVE = 0x0200;

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUBufferUsage";
    }
};