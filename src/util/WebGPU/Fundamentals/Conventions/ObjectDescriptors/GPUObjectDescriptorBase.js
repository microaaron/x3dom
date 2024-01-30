/**
 * @file GPUObjectDescriptorBase.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
x3dom.WebGPU.GPUObjectDescriptorBase = class GPUObjectDescriptorBase
{
    constructor ( label = "" )
    {
        this.label = label; //Optional
    }

    setLabel ( label )
    {
        this.label = label;
    }
};