/**
 * @file GPURenderPassTimestampWrites.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPURenderPassTimestampWrites = class GPURenderPassTimestampWrites
{
    constructor ( querySet, beginningOfPassWriteIndex, endOfPassWriteIndex )
    {
        this.querySet = querySet; //Required GPUQuerySet
        this.beginningOfPassWriteIndex = beginningOfPassWriteIndex; //GPUSize32
        this.endOfPassWriteIndex = beginningOfPassWriteIndex; //GPUSize32
    }

    setQuerySet ( querySet )
    {
        this.querySet = querySet;
    }

    setBeginningOfPassWriteIndex ( beginningOfPassWriteIndex )
    {
        this.beginningOfPassWriteIndex = beginningOfPassWriteIndex;
    }

    setEndOfPassWriteIndex ( endOfPassWriteIndex )
    {
        this.endOfPassWriteIndex = endOfPassWriteIndex;
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPURenderPassTimestampWrites";
    }
};