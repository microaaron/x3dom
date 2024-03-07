/**
 * @file GPUShaderModuleDescriptor.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.03
 */
x3dom.WebGPU.GPUShaderModuleDescriptor = class GPUShaderModuleDescriptor extends x3dom.WebGPU.GPUObjectDescriptorBase
{
    constructor ( code, sourceMap, compilationHints = [], label )
    {
        super( label );
        this.code = code; //Required USVString
        this.sourceMap = sourceMap;//Optional; object
        this.compilationHints = compilationHints;//Optional; sequence<GPUShaderModuleCompilationHint>
    }

    setCode ( code )
    {
        this.code = code;
    }

    setSourceMap ( sourceMap )
    {
        this.sourceMap = sourceMap;
    }

    setCompilationHints ( compilationHints )
    {
        this.compilationHints = compilationHints;
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUShaderModuleDescriptor";
    }
};