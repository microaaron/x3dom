/**
 * @file GPUStorageTextureAccess.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPUStorageTextureAccess = class GPUStorageTextureAccess
{
    write_only = "write-only";

    read_only = "read-only";

    read_write = "read-write";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUStorageTextureAccess";
    }
};