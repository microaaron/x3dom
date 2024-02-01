/**
 * @file GPUCompareFunction.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPUCompareFunction = class GPUCompareFunction
{
    never = "never";

    less = "less";

    equal = "equal";

    less_equal = "less-equal";

    greater = "greater";

    not_equal = "not-equal";

    greater_equal = "greater-equal";

    always = "always";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUCompareFunction";
    }
};