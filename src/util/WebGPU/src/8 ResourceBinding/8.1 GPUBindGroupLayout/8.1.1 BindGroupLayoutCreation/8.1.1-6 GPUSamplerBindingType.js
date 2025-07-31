/**
 * @file GPUSamplerBindingType.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPUSamplerBindingType = class GPUSamplerBindingType
{
    filtering = "filtering";

    non_filtering = "non-filtering";

    comparison = "comparison";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUSamplerBindingType";
    }
};