/**
 * @file GPUMultisampleState.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPUMultisampleState = class GPUMultisampleState
{
    constructor ( count, mask, alphaToCoverageEnabled )
    {
        this.count = count; //Optional
        this.mask = mask; //Optional
        this.alphaToCoverageEnabled = alphaToCoverageEnabled; //Optional
    }

    setCount ( count )
    {
        this.count = count;
    }

    setMask ( mask )
    {
        this.mask = mask;
    }

    setAlphaToCoverageEnabled ( alphaToCoverageEnabled )
    {
        this.alphaToCoverageEnabled = alphaToCoverageEnabled;
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUMultisampleState";
    }
};