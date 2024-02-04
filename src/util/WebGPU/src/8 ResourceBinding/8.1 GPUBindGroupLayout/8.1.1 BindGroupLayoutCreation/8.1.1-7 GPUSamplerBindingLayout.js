/**
 * @file GPUSamplerBindingLayout.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPUSamplerBindingLayout = class GPUSamplerBindingLayout
{
    constructor ( type )
    {
        this.type = type; //Optional; GPUSamplerBindingType; undefined = "filtering"
    }

    setType ( type )
    {
        this.type = type;
    }

    getAvailableTypes ()
    {
        return new x3dom.WebGPU.GPUSamplerBindingType();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUSamplerBindingLayout";
    }
};