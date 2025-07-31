/**
 * @file GPUColorDict.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPUColorDict = class GPUColorDict
{
    constructor ( r, g, b, a )
    {
        this.r = r; //Required double
        this.g = g; //Required double
        this.b = b; //Required double
        this.a = a; //Required double
    }

    setR ( r )
    {
        this.r = r;
    }

    setG ( g )
    {
        this.g = g;
    }

    setB ( b )
    {
        this.b = b;
    }

    setA ( a )
    {
        this.a = a;
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUColorDict";
    }
};