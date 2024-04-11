/**
 * @file WebGPU.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.04
 */
x3dom.WebGPU = {};
x3dom.WebGPU.BindingListArray = class BindingListArray extends Array
{
    addBindingList ( bindingList )
    {
        this.push( bindingList );
        return this;
    }

    createShaderModuleBindingCodes ()
    {
        var vertexBindingCode = ``;
        var fragmentBindingCode = ``;
        var computeBindingCode = ``;
        for ( var bindingList of this )
        {
            var groupId = this.indexOf( bindingList );
            for ( var bindingData of bindingList )
            {
                var bindingId = bindingData.entry.binding;
                var declaration = `var`;
                if ( bindingData.entry.buffer )
                {
                    let bufferType = bindingData.entry.buffer.type;
                    bufferType = bufferType ? bufferType : `uniform`;
                    let addressSpace;
                    let accessMode = undefined;
                    switch ( bufferType )
                    {
                        case `uniform`:
                            addressSpace = `uniform`;
                            break;
                        case `storage`:
                            addressSpace = `storage`;
                            accessMode = `read_write`;
                            break;
                        case `read-only-storage`:
                            addressSpace = `storage`;
                            //accessMode = `read`;
                            break;
                    }
                    declaration += `<${addressSpace}${accessMode ? `,${accessMode}` : ``}>`;
                }
                var code = `@group(${groupId}) @binding(${bindingId}) ${declaration} ${bindingData.name}: ${bindingData.wgslType};\n`;
                var visibility = bindingData.entry.visibility;
                if ( visibility & GPUShaderStage.VERTEX ){vertexBindingCode += code;}
                if ( visibility & GPUShaderStage.FRAGMENT ){fragmentBindingCode += code;}
                if ( visibility & GPUShaderStage.COMPUTE ){computeBindingCode += code;}
            }
        }
        return {
            vertexBindingCode   : vertexBindingCode,
            fragmentBindingCode : fragmentBindingCode,
            computeBindingCode  : computeBindingCode
        };
    }

    getBindGroupLayouts ( device )
    {
        if ( !this.bindGroupLayouts )
        {
            this.bindGroupLayouts = [];
            for ( var bindingList of this )
            {
                this.bindGroupLayouts.push( bindingList.getBindGroupLayout( device ) );
            }
        }
        return this.bindGroupLayouts;
    }

    static newBindingParamsList ()
    {
        return new this.BindingParamsList();
    }

    static BindingParamsList = class BindingParamsList extends Array
    {
        addBindingParams ( name, wgslType, visibility, resourceLayoutObject, size/*Optional*/ )
        {
            this.push( {
                name                 : name,
                wgslType             : wgslType,
                visibility           : visibility,
                resourceLayoutObject : resourceLayoutObject,
                size                 : size//Optional;
            } );
            return this;
        }

        createBindingList ()
        {
            var bindingList = new class BindingList extends Array
            {
                createBindGroupLayout ( device )
                {
                    return this.bindGroupLayout = device.createBindGroupLayout( this.bindGroupLayoutDescriptor );
                }

                getBindGroupLayout ( device )
                {
                    return this.bindGroupLayout ? this.bindGroupLayout : this.createBindGroupLayout( device );
                }
            }();
            var bindGroupLayoutDescriptor = new x3dom.WebGPU.GPUBindGroupLayoutDescriptor();

            for ( var bindingParams of this )
            {
                var entry = bindGroupLayoutDescriptor.newEntry( bindGroupLayoutDescriptor.entries.length, bindingParams.visibility, bindingParams.resourceLayoutObject );
                bindGroupLayoutDescriptor.entries.push( entry );
                bindingList.push( new class BindingData
                {
                    name = bindingParams.name;

                    wgslType = bindingParams.wgslType;

                    entry = entry;

                    size = bindingParams.size;
                }() );
            }

            bindingList.bindGroupLayoutDescriptor = bindGroupLayoutDescriptor;
            return bindingList;
        }
    };
};
x3dom.WebGPU.BindingListArray.prototype.newBindingParamsList = x3dom.WebGPU.BindingListArray.newBindingParamsList;

x3dom.WebGPU.VertexListArray = class VertexListArray extends Array
{
    addVertexList ( vertexList )
    {
        this.push( vertexList );
        return this;
    }

    createVertexBufferLayouts ()
    {
        this.vertexBufferLayouts = new class VertexBufferLayouts extends Array{}();
        var shaderLocation = 0;
        for ( var vertexList of this )
        {
            for ( var attribute of vertexList.vertexBufferLayout.attributes )
            {
                attribute.shaderLocation = shaderLocation;
                shaderLocation++;
            }
            this.vertexBufferLayouts.push( vertexList.vertexBufferLayout );
        }
        return this.vertexBufferLayouts;
    }

    createShaderModuleVertexInputCode ()
    {
        if ( !this.vertexBufferLayouts )
        {
            this.createVertexBufferLayouts();
        }
        var vertexInputCodes = [];
        for ( var vertexList of this )
        {
            for ( var vertex of vertexList )
            {
                vertexInputCodes.push( `@location(${vertex.vertexAttribute.shaderLocation}) ${vertex.name}: ${vertex.wgslType}` );
            }
        }
        return vertexInputCodes.join();
    }

    static newVertexParamsList ()
    {
        return new this.VertexParamsList();
    }

    static VertexParamsList = class extends Array
    {
        addVertexParams ( name, wgslType, format, offset/*(Optional)*/ )
        {
            this.push( {
                name     : name,
                wgslType : wgslType,
                format   : format,
                offset   : offset
            } );
            return this;
        }

        createVertexList ( arrayStride/*(Optional)*/, stepMode/*(Optional)*/ )
        {
            var vertexList = new class VertexList extends Array{}();
            var vertexBufferLayout = new x3dom.WebGPU.GPUVertexBufferLayout( arrayStride, stepMode );
            var autoArrayStride = 0;
            var vertexFormats = new x3dom.WebGPU.GPUVertexFormat();
            for ( var vertexParams of this )
            {
                if ( Number.isInteger( vertexParams.offset ) )
                {
                    var format = vertexParams.format;
                    var offset = vertexParams.offset;
                    var byteSize = vertexFormats.byteSizeOf( format );
                    var vertexAttribute = new x3dom.WebGPU.GPUVertexAttribute( format, offset );
                    vertexBufferLayout.attributes.push( vertexAttribute );
                    vertexList.push( {
                        name            : vertexParams.name,
                        wgslType        : vertexParams.wgslType,
                        vertexAttribute : vertexAttribute
                    } );
                    autoArrayStride = ( autoArrayStride > offset ? autoArrayStride : offset ) + byteSize;
                }
            }
            for ( var vertexParams of this )
            {
                if ( !Number.isInteger( vertexParams.offset ) )
                {
                    var format = vertexParams.format;
                    var offset = autoArrayStride;
                    var byteSize = vertexFormats.byteSizeOf( format );
                    var vertexAttribute = new x3dom.WebGPU.GPUVertexAttribute( format, offset );
                    vertexBufferLayout.attributes.push( vertexAttribute );
                    vertexList.push( new class vertexData
                    {
                        name = vertexParams.name;

                        wgslType = vertexParams.wgslType;

                        vertexAttribute = vertexAttribute;
                    }() );
                    autoArrayStride += byteSize;
                }
            }
            vertexBufferLayout.setArrayStride( Number.isInteger( arrayStride ) ? ( arrayStride ? arrayStride : autoArrayStride ) : autoArrayStride );
            vertexList.vertexBufferLayout = vertexBufferLayout;
            return vertexList;
        }
    };
};
x3dom.WebGPU.VertexListArray.prototype.newVertexParamsList = x3dom.WebGPU.VertexListArray.newVertexParamsList;

x3dom.WebGPU.ShaderModuleInputOutputList = class ShaderModuleInputOutputList extends Array
{
    add ( name, wgslType )
    {
        this.push( {
            name     : name,
            wgslType : wgslType
        } );
        return this;
    }

    createShaderModuleInputOutputCode ()
    {
        var location = 0;
        var inputOutputCodes = [];
        for ( var inputOutput of this )
        {
            inputOutputCodes.push( `@location(${location}) ${inputOutput.name}: ${inputOutput.wgslType}` );
            location++;
        }
        return inputOutputCodes.join();
    }
};
x3dom.WebGPU.Shader = class Shader
{
    constructor ( device )
    {
        this.uniformStorage = {};
        this.bindGroups = [];
        this.assets = {};
        let renderPipeline;
        let renderPipelineDescriptor;
        let renderPipelineDescriptorUpdated;
        Object.defineProperty( this, "device", {
            get : function ()
            {
                return device;
            }
        } );
        Object.defineProperty( this, "renderPipelineDescriptor", {
            get : function ()
            {
                return renderPipelineDescriptor;
            },
            set : function ( descriptor )
            {
                renderPipelineDescriptor = descriptor;
                renderPipelineDescriptorUpdated = true;
            }
        } );
        Object.defineProperty( this, "renderPipeline", {
            get : function ()
            {
                if ( renderPipelineDescriptorUpdated )
                {
                    renderPipeline = this.device.createRenderPipeline( renderPipelineDescriptor );
                    renderPipelineDescriptorUpdated = false;
                }
                return renderPipeline;
            }
        } );
    }

    initBindGroupDescriptor ( bindingList, resources = {}/*(Optional)*/ )
    {
        const device = this.device;
        let updated = true;
        let bindGroup;
        const layout = bindingList.getBindGroupLayout();
        const entries = [];
        const label = undefined;
        for ( const bindingData of bindingList )
        {
            const binding = bindingData.entry.binding;
            let resource;
            if ( resources[ bindingData.name ] )
            {
                resource = resources[ bindingData.name ];
            }
            else
            {
                if ( bindingData.entry.buffer )
                {
                    let size = bindingData.size ? bindingData.size : x3dom.WGSL.sizeOf( bindingData.wgslType );
                    let usage = GPUBufferUsage.COPY_DST;
                    switch ( bindingData.entry.buffer.type )
                    {
                        case `storage`:
                            usage |= GPUBufferUsage.SRC;
                        case `read-only-storage`:
                            usage |= GPUBufferUsage.STORAGE;
                            break;
                        case `uniform`:
                        case undefined:
                            usage |= GPUBufferUsage.UNIFORM;
                            break;
                    }
                    const mappedAtCreation = false;
                    const label = bindingData.name;
                    const bufferDescriptor = new x3dom.WebGPU.GPUBufferDescriptor( size, usage, mappedAtCreation, label );
                    const buffer = this.device.createBuffer( bufferDescriptor );
                    const offset = undefined;
                    size = undefined;
                    resource = new x3dom.WebGPU.GPUBufferBinding( buffer, offset, size );
                }
                else if ( bindingData.entry.sampler )
                {
                //incomplete
                }
                else if ( bindingData.entry.texture )
                {
                //incomplete
                }
                else if ( bindingData.entry.storageTexture )
                {
                //incomplete
                }
            }
            entries.push( x3dom.WebGPU.GPUBindGroupDescriptor.newEntry( binding, resource ) );
            //set properties
            if ( bindingData.entry.buffer )
            {
                if ( resource.buffer instanceof GPUBuffer )
                {
                    const typedArray = ( function getTypedArray ( hostShareableType )
                    {
                        var match;
                        switch ( true )
                        {
                            case /^f16$/.test( hostShareableType ):
                                return ;//not supported
                                break;
                            case /^i32$/.test( hostShareableType ):
                                return Int32Array;
                                break;
                            case /^u32$/.test( hostShareableType ):
                                return Uint32Array;
                                break;
                            case /^f32$/.test( hostShareableType ):
                                return Float32Array;
                                break;
                            case ( match = hostShareableType.match( /^atomic<(.*)>$/ ) ) ? true : false:
                                return getTypedArray( match[ 1 ] );
                                break;
                            case ( match = hostShareableType.match( /^vec\d+(.*)$/ ) ) ? true : false:
                                var T = match[ 1 ];//<type>
                                switch ( true )
                                {
                                    case ( match = T.match( /^<(.*)>$/ ) ) ? true : false:
                                        return getTypedArray( match[ 1 ] );
                                        break;
                                    case /^h$/.test( T ):
                                        return getTypedArray( `f16` );
                                        break;
                                    case /^i$/.test( T ):
                                        return getTypedArray( `i32` );
                                        break;
                                    case /^u$/.test( T ):
                                        return getTypedArray( `u32` );
                                        break;
                                    case /^f$/.test( T ):
                                        return getTypedArray( `f32` );
                                        break;
                                    default:
                                        return;
                                        break;
                                }
                            case ( match = hostShareableType.match( /^mat\d+x(\d+)(.*)$/ ) ) ? true : false:
                                var R = Number( match[ 1 ] );//rows
                                var T = match[ 2 ];//<type>
                                return getTypedArray( `vec${R}${T}` );
                                break;
                            case ( match = hostShareableType.match( /^array<(.*),\d+>$/ ) ) ? true : false:
                            case ( match = hostShareableType.match( /^array<(.*)(?<!,\d+)>$/ ) ) ? true : false:
                                var E = match[ 1 ];//element
                                return getTypedArray( E );
                                break;
                            default:
                                return;
                                break;
                        }
                    } )( bindingData.wgslType );
                    Object.defineProperty( this.uniformStorage, bindingData.name, {
                        get : function ()
                        {
                            return resource.buffer;
                        },
                        set : function ( value )
                        {
                            let view;
                            if ( ArrayBuffer.isView( value ) )
                            {
                                view = value;
                            }
                            else if ( value instanceof ArrayBuffer )
                            {
                                view = new DataView( value );
                            }
                            else if ( typedArray )
                            {
                                if ( typeof value === `number` || value instanceof Number )
                                {
                                    view = new typedArray( [ value ] );
                                }
                                else if ( value instanceof Array )
                                {
                                    view = new typedArray( value );
                                }
                                else
                                {
                                    return;//unknow value;
                                }
                            }
                            else
                            {
                                return;//unknow type;
                            }
                            if ( view.byteLength != resource.buffer.size )
                            {
                                resource.buffer.destroy();
                                resource.setBuffer( device.createBuffer( new x3dom.WebGPU.GPUBufferDescriptor( view.byteLength, resource.buffer.usage, false, resource.buffer.label ) ) );
                                //resource.setOffset(0);
                                //resource.setSize(view.byteLength);
                                updated = true;
                            }
                            device.queue.writeBuffer( resource.buffer, 0, view.buffer, view.byteOffset, view.byteLength );
                        }
                    } );
                }
                else
                {
                    //resource error
                }
            }
            else if ( bindingData.entry.sampler )
            {
            //incomplete
            }
            else if ( bindingData.entry.texture )
            {
            //incomplete
            }
            else if ( bindingData.entry.storageTexture )
            {
            //incomplete
            }
        }
        return new class extends x3dom.WebGPU.GPUBindGroupDescriptor
        {
            getBindGroup ()
            {
                if ( updated )
                {
                    bindGroup = device.createBindGroup( this );
                    updated = false;
                }
                return bindGroup;
            }
        }( layout, entries, label );
    }

    initBindGroup ( index, bindGroupDescriptor )
    {
        Object.defineProperty( this.bindGroups, index, {
            get : function ()
            {
                return bindGroupDescriptor.getBindGroup();
            }
        } );
    }
};