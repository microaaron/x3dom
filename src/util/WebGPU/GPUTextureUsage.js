/**
 * @file GPUTextureUsage.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPUTextureUsage = class GPUTextureUsage
{
    COPY_SRC = 0x01;

    COPY_DST = 0x02;

    TEXTURE_BINDING = 0x04;

    STORAGE_BINDING = 0x08;

    RENDER_ATTACHMENT = 0x10;

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUTextureUsage";
    }
};