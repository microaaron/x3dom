/**
 * @file GPUVertexFormat.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
x3dom.WebGPU.GPUVertexFormat = class GPUVertexFormat
{
    uint8x2 = new String( "uint8x2" );

    uint8x4 = new String( "uint8x4" );

    sint8x2 = new String( "sint8x2" );

    sint8x4 = new String( "sint8x4" );

    unorm8x2 = new String( "unorm8x2" );

    unorm8x4 = new String( "unorm8x4" );

    snorm8x2 = new String( "snorm8x2" );

    snorm8x4 = new String( "snorm8x4" );

    uint16x2 = new String( "uint16x2" );

    uint16x4 = new String( "uint16x4" );

    sint16x2 = new String( "sint16x2" );

    sint16x4 = new String( "sint16x4" );

    unorm16x2 = new String( "unorm16x2" );

    unorm16x4 = new String( "unorm16x4" );

    snorm16x2 = new String( "snorm16x2" );

    snorm16x4 = new String( "snorm16x4" );

    float16x2 = new String( "float16x2" );

    float16x4 = new String( "float16x4" );

    float32 = new String( "float32" );

    float32x2 = new String( "float32x2" );

    float32x3 = new String( "float32x3" );

    float32x4 = new String( "float32x4" );

    uint32 = new String( "uint32" );

    uint32x2 = new String( "uint32x2" );

    uint32x3 = new String( "uint32x3" );

    uint32x4 = new String( "uint32x4" );

    sint32 = new String( "sint32" );

    sint32x2 = new String( "sint32x2" );

    sint32x3 = new String( "sint32x3" );

    sint32x4 = new String( "sint32x4" );

    unorm10_10_10_2 = new String( "unorm10-10-10-2" );

    constructor ()
    {
        this.uint8x2.components = 2;
        this.uint8x2.byteSize = 2;
        this.uint8x4.components = 4;
        this.uint8x4.byteSize = 4;
        this.sint8x2.components = 2;
        this.sint8x2.byteSize = 2;
        this.sint8x4.components = 4;
        this.sint8x4.byteSize = 4;
        this.unorm8x2.components = 2;
        this.unorm8x2.byteSize = 2;
        this.unorm8x4.components = 4;
        this.unorm8x4.byteSize = 4;
        this.snorm8x2.components = 2;
        this.snorm8x2.byteSize = 2;
        this.snorm8x4.components = 4;
        this.snorm8x4.byteSize = 4;
        this.uint16x2.components = 2;
        this.uint16x2.byteSize = 4;
        this.uint16x4.components = 4;
        this.uint16x4.byteSize = 8;
        this.sint16x2.components = 2;
        this.sint16x2.byteSize = 4;
        this.sint16x4.components = 4;
        this.sint16x4.byteSize = 8;
        this.unorm16x2.components = 2;
        this.unorm16x2.byteSize = 4;
        this.unorm16x4.components = 4;
        this.unorm16x4.byteSize = 8;
        this.snorm16x2.components = 2;
        this.snorm16x2.byteSize = 4;
        this.snorm16x4.components = 4;
        this.snorm16x4.byteSize = 8;
        this.float16x2.components = 2;
        this.float16x2.byteSize = 4;
        this.float16x4.components = 4;
        this.float16x4.byteSize = 8;
        this.float32.components = 1;
        this.float32.byteSize = 4;
        this.float32x2.components = 2;
        this.float32x2.byteSize = 8;
        this.float32x3.components = 3;
        this.float32x3.byteSize = 12;
        this.float32x4.components = 4;
        this.float32x4.byteSize = 16;
        this.uint32.components = 1;
        this.uint32.byteSize = 4;
        this.uint32x2.components = 2;
        this.uint32x2.byteSize = 8;
        this.uint32x3.components = 3;
        this.uint32x3.byteSize = 12;
        this.uint32x4.components = 4;
        this.uint32x4.byteSize = 16;
        this.sint32.components = 1;
        this.sint32.byteSize = 4;
        this.sint32x2.components = 2;
        this.sint32x2.byteSize = 8;
        this.sint32x3.components = 3;
        this.sint32x3.byteSize = 12;
        this.sint32x4.components = 4;
        this.sint32x4.byteSize = 16;
        this.unorm10_10_10_2.components = 4;
        this.unorm10_10_10_2.byteSize = 4;
        Object.freeze( this );
    }

    componentsOf ( vertexFormat )
    {
        switch ( vertexFormat )
        {
            case "unorm10-10-10-2":
                return this.unorm10_10_10_2.components;
                break;
            default:
                return this[ vertexFormat ].components;
                break;
        }
    }

    byteSizeOf ( vertexFormat )
    {
        switch ( vertexFormat )
        {
            case "unorm10-10-10-2":
                return this.unorm10_10_10_2.byteSize;
                break;
            default:
                return this[ vertexFormat ].byteSize;
                break;
        }
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUVertexFormat";
    }
};