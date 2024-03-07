/**
 * @file GPUFragmentState.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
x3dom.WebGPU.GPUFragmentState = class GPUFragmentState extends x3dom.WebGPU.GPUProgrammableStage
{
    constructor ( module, entryPoint, constants, targets = [] )
    {
        super( module, entryPoint, constants );
        this.targets = targets; //Optional
    }

    setTargets ( targets )
    {
        this.targets = targets;
    }

    static newTarget ( format, blend, writeMask )
    {
        return new x3dom.WebGPU.GPUColorTargetState( format, blend, writeMask );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUFragmentState";
    }
};
x3dom.WebGPU.GPUFragmentState.prototype.newTarget = x3dom.WebGPU.GPUFragmentState.newTarget;