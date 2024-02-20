/**
 * @file GPUBufferBinding.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPUBufferBinding = class GPUBufferBinding
{
    constructor ( buffer, offset, size )
    {
        this.buffer = buffer; //Required GPUBuffer
        this.offset = offset; //Optional; GPUSize64; undefined = 0
        this.size = size;//Optional; GPUSize64; The size, in bytes, of the buffer binding. If not provided, specifies the range starting at offset and ending at the end of buffer.
    }

    setBinding ( binding )
    {
        this.binding = binding;
    }

    setOffset ( offset )
    {
        this.offset = offset;
    }

    setSize ( size )
    {
        this.size = size;
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUBufferBinding";
    }
};