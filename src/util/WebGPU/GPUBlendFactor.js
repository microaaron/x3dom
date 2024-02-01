/**
 * @file GPUBlendFactor.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
x3dom.WebGPU.GPUBlendFactor = class GPUBlendFactor
{
    zero = "zero";

    one = "one";

    src = "src";

    one_minus_src = "one-minus-src";

    src_alpha = "src-alpha";

    one_minus_src_alpha = "one-minus-src-alpha";

    dst = "dst";

    one_minus_dst = "one-minus-dst";

    dst_alpha = "dst-alpha";

    one_minus_dst_alpha = "one-minus-dst-alpha";

    src_alpha_saturated = "src-alpha-saturated";

    constant = "constant";

    one_minus_constant = "one-minus-constant";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUBlendFactor";
    }
};