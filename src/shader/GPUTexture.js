/**
 * @file GPURenderPipeline.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
x3dom.webgpu.GPUTexture.GPUTextureFormats = class GPUTexture_GPUTextureFormats
{
    constructor ( device )
    {
        var base = {
            // 8-bit formats
            r8unorm : "r8unorm",
            r8snorm : "r8snorm",
            r8uint  : "r8uint",
            r8sint  : "r8sint",

            // 16-bit formats
            r16uint  : "r16uint",
            r16sint  : "r16sint",
            r16float : "r16float",
            rg8unorm : "rg8unorm",
            rg8snorm : "rg8snorm",
            rg8uint  : "rg8uint",
            rg8sint  : "rg8sint",

            // 32-bit formats
            r32uint         : "r32uint",
            r32sint         : "r32sint",
            r32float        : "r32float",
            rg16uint        : "rg16uint",
            rg16sint        : "rg16sint",
            rg16float       : "rg16float",
            rgba8unorm      : "rgba8unorm",
            rgba8unorm_srgb : "rgba8unorm-srgb",
            rgba8snorm      : "rgba8snorm",
            rgba8uint       : "rgba8uint",
            rgba8sint       : "rgba8sint",
            bgra8unorm      : "bgra8unorm",
            bgra8unorm_srgb : "bgra8unorm-srgb",
            // Packed 32-bit formats
            rgb9e5ufloat    : "rgb9e5ufloat",
            rgb10a2uint     : "rgb10a2uint",
            rgb10a2unorm    : "rgb10a2unorm",
            rg11b10ufloat   : "rg11b10ufloat",

            // 64-bit formats
            rg32uint    : "rg32uint",
            rg32sint    : "rg32sint",
            rg32float   : "rg32float",
            rgba16uint  : "rgba16uint",
            rgba16sint  : "rgba16sint",
            rgba16float : "rgba16float",

            // 128-bit formats
            rgba32uint  : "rgba32uint",
            rgba32sint  : "rgba32sint",
            rgba32float : "rgba32float",

            // Depth/stencil formats
            stencil8             : "stencil8",
            depth16unorm         : "depth16unorm",
            depth24plus          : "depth24plus",
            depth24plus_stencil8 : "depth24plus-stencil8",
            depth32float         : "depth32float"
        };
        var depth32float_stencil8 = {
            // "depth32float-stencil8" feature
            depth32float_stencil8 : "depth32float-stencil8"
        };
        var texture_compression_bc = {
            // BC compressed formats usable if "texture-compression-bc" is both
            // supported by the device/user agent and enabled in requestDevice.
            bc1_rgba_unorm      : "bc1-rgba-unorm",
            bc1_rgba_unorm_srgb : "bc1-rgba-unorm-srgb",
            bc2_rgba_unorm      : "bc2-rgba-unorm",
            bc2_rgba_unorm_srgb : "bc2-rgba-unorm-srgb",
            bc3_rgba_unorm      : "bc3-rgba-unorm",
            bc3_rgba_unorm_srgb : "bc3-rgba-unorm-srgb",
            bc4_r_unorm         : "bc4-r-unorm",
            bc4_r_snorm         : "bc4-r-snorm",
            bc5_rg_unorm        : "bc5-rg-unorm",
            bc5_rg_snorm        : "bc5-rg-snorm",
            bc6h_rgb_ufloat     : "bc6h-rgb-ufloat",
            bc6h_rgb_float      : "bc6h-rgb-float",
            bc7_rgba_unorm      : "bc7-rgba-unorm",
            bc7_rgba_unorm_srgb : "bc7-rgba-unorm-srgb"
        };
        var texture_compression_etc2 = {
            // ETC2 compressed formats usable if "texture-compression-etc2" is both
            // supported by the device/user agent and enabled in requestDevice.
            etc2_rgb8unorm        : "etc2-rgb8unorm",
            etc2_rgb8unorm_srgb   : "etc2-rgb8unorm-srgb",
            etc2_rgb8a1unorm      : "etc2-rgb8a1unorm",
            etc2_rgb8a1unorm_srgb : "etc2-rgb8a1unorm-srgb",
            etc2_rgba8unorm       : "etc2-rgba8unorm",
            etc2_rgba8unorm_srgb  : "etc2-rgba8unorm-srgb",
            eac_r11unorm          : "eac-r11unorm",
            eac_r11snorm          : "eac-r11snorm",
            eac_rg11unorm         : "eac-rg11unorm",
            eac_rg11snorm         : "eac-rg11snorm"
        };
        var texture_compression_astc = {
            // ASTC compressed formats usable if "texture-compression-astc" is both
            // supported by the device/user agent and enabled in requestDevice.
            astc_4x4_unorm        : "astc-4x4-unorm",
            astc_4x4_unorm_srgb   : "astc-4x4-unorm-srgb",
            astc_5x4_unorm        : "astc-5x4-unorm",
            astc_5x4_unorm_srgb   : "astc-5x4-unorm-srgb",
            astc_5x5_unorm        : "astc-5x5-unorm",
            astc_5x5_unorm_srgb   : "astc-5x5-unorm-srgb",
            astc_6x5_unorm        : "astc-6x5-unorm",
            astc_6x5_unorm_srgb   : "astc-6x5-unorm-srgb",
            astc_6x6_unorm        : "astc-6x6-unorm",
            astc_6x6_unorm_srgb   : "astc-6x6-unorm-srgb",
            astc_8x5_unorm        : "astc-8x5-unorm",
            astc_8x5_unorm_srgb   : "astc-8x5-unorm-srgb",
            astc_8x6_unorm        : "astc-8x6-unorm",
            astc_8x6_unorm_srgb   : "astc-8x6-unorm-srgb",
            astc_8x8_unorm        : "astc-8x8-unorm",
            astc_8x8_unorm_srgb   : "astc-8x8-unorm-srgb",
            astc_10x5_unorm       : "astc-10x5-unorm",
            astc_10x5_unorm_srgb  : "astc-10x5-unorm-srgb",
            astc_10x6_unorm       : "astc-10x6-unorm",
            astc_10x6_unorm_srgb  : "astc-10x6-unorm-srgb",
            astc_10x8_unorm       : "astc-10x8-unorm",
            astc_10x8_unorm_srgb  : "astc-10x8-unorm-srgb",
            astc_10x10_unorm      : "astc-10x10-unorm",
            astc_10x10_unorm_srgb : "astc-10x10-unorm-srgb",
            astc_12x10_unorm      : "astc-12x10-unorm",
            astc_12x10_unorm_srgb : "astc-12x10-unorm-srgb",
            astc_12x12_unorm      : "astc-12x12-unorm",
            astc_12x12_unorm_srgb : "astc-12x12-unorm-srgb"
        };
        Object.assign( this, base );
        if ( device.features.has( "depth32float-stencil8" ) )
        {Object.assign( this, depth32float_stencil8 );}
        if ( device.features.has( "texture-compression-bc" ) )
        {Object.assign( this, texture_compression_bc );}
        if ( device.features.has( "texture-compression-etc2" ) )
        {Object.assign( this, texture_compression_etc2 );}
        if ( device.features.has( "texture-compression-astc" ) )
        {Object.assign( this, texture_compression_astc );}
        Object.freeze( this );
    }
};