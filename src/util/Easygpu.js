/**
 * EASYGPU 0.0.1 alpha
 * Build : 2
 * Revision: 142ec66ac8f10627fdc5b7deecc9863cead23a3e
 * Date: Fri May 10 16:53:06 2024 +0800
 */
/**
 * @file easygpucore.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.04
 */
var easygpu = {
    webgpu : {},
    wgsl   : {}
};
easygpu.BindingListArray = class BindingListArray extends Array
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
        return new BindingListArray.BindingParamsList();
    }

    static BindingParamsList = class BindingParamsList extends Array
    {
        addBindingParams ( name, wgslType, visibility, resourceLayoutObject, addition/*Optional*/ )
        {
            this.push( {
                name                 : name,
                wgslType             : wgslType,
                visibility           : visibility,
                resourceLayoutObject : resourceLayoutObject,
                addition             : addition//Optional
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
            var bindGroupLayoutDescriptor = new easygpu.webgpu.GPUBindGroupLayoutDescriptor();

            for ( var bindingParams of this )
            {
                var entry = bindGroupLayoutDescriptor.newEntry( bindGroupLayoutDescriptor.entries.length, bindingParams.visibility, bindingParams.resourceLayoutObject );
                bindGroupLayoutDescriptor.entries.push( entry );
                const bindingData = new class BindingData
                {
                    name = bindingParams.name;

                    wgslType = bindingParams.wgslType;

                    entry = entry;

                    resourceDescriptor = bindingParams.addition;
                }();
                if ( entry.buffer ){}
                else if ( entry.sampler )
                {
                    bindingData.samplerDescriptor = bindingParams.addition;
                }
                else if ( entry.texture ){}
                else if ( entry.storageTexture ){}
                else if ( entry.externalTexture ){}
                bindingList.push( bindingData );
            }

            bindingList.bindGroupLayoutDescriptor = bindGroupLayoutDescriptor;
            return bindingList;
        }
    };
};
easygpu.BindingListArray.prototype.newBindingParamsList = easygpu.BindingListArray.newBindingParamsList;
easygpu.VertexListArray = class VertexListArray extends Array
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
        return new VertexListArray.VertexParamsList();
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
            var vertexBufferLayout = new easygpu.webgpu.GPUVertexBufferLayout( arrayStride, stepMode );
            var autoArrayStride = 0;
            var vertexFormats = new easygpu.webgpu.GPUVertexFormat();
            for ( var vertexParams of this )
            {
                if ( Number.isInteger( vertexParams.offset ) )
                {
                    var format = vertexParams.format;
                    var offset = vertexParams.offset;
                    var byteSize = vertexFormats.byteSizeOf( format );
                    var vertexAttribute = new easygpu.webgpu.GPUVertexAttribute( format, offset );
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
                    var vertexAttribute = new easygpu.webgpu.GPUVertexAttribute( format, offset );
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
easygpu.VertexListArray.prototype.newVertexParamsList = easygpu.VertexListArray.newVertexParamsList;
easygpu.ShaderModuleInputOutputList = class ShaderModuleInputOutputList extends Array
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
easygpu.PassResource = class PassResource
{
    constructor ( arg0, arg1 )
    {
        if ( arg0 instanceof GPUDevice )
        {
            this.bindingListArray;
            this.bindGroupDescriptors = [];
            this.uniformStorage = {};
            this.bindGroups = [];
            this.assets = {};
            Object.defineProperty( this, `device`, {
                get : function ()
                {
                    return arg0;
                },
                enumerable   : true,
                configurable : true
            } );
        }
        else if ( arg0 instanceof PassResource )
        {
            return arg0.copy( arg1 );
        }
    }

    initBindGroupDescriptor ( bindingList, resources/*(Optional)*/ )
    {
        const device = this.device;
        let updated = true;
        let bindGroup;
        const layout = bindingList.getBindGroupLayout( device );
        const entries = [];
        const label = undefined;
        const bindGroupDescriptor = new class extends easygpu.webgpu.GPUBindGroupDescriptor
        {
            update ()
            {
                updated = true;
            }

            setUpdated ( value )
            {
                updated = value ? true : false;
            }

            isUpdated ()
            {
                return updated;
            }

            getBindGroup ()
            {
                if ( updated )
                {
                    bindGroup = device.createBindGroup( this );
                    updated = false;
                }
                return bindGroup;
            }

            getResources ()
            {
                resources = [];
                for ( const entry of entries )
                {
                    if ( entry && entry.resource )
                    {
                        resources[ entry.binding ] = entry.resource;
                    }
                }
                return resources;
            }

            initEntry ( passResource, bindingData, resources = {} )
            {
                const device = passResource.device;
                const binding = bindingData.entry.binding;
                let resource;
                if ( resources[ bindingData.name ] )
                {
                    resource = resources[ bindingData.name ];
                }
                else if ( resources[ binding ] )
                {
                    resource = resources[ binding ];
                }
                else
                {
                    if ( bindingData.entry.buffer )
                    {
                        let size = easygpu.wgsl.sizeOf( bindingData.wgslType );
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
                        const bufferDescriptor = new easygpu.webgpu.GPUBufferDescriptor( size, usage, mappedAtCreation, label );
                        const buffer = device.createBuffer( bufferDescriptor );
                        const offset = undefined;
                        size = undefined;
                        resource = new easygpu.webgpu.GPUBufferBinding( buffer, offset, size );
                    }
                    else if ( bindingData.entry.sampler )
                    {
                        if ( bindingData.samplerDescriptor )
                        {
                            resource = device.createSampler( bindingData.samplerDescriptor );
                        }
                    }
                    else if ( bindingData.entry.texture )
                    {
                        //do nothing
                    }
                    else if ( bindingData.entry.storageTexture )
                    {
                        //incomplete
                    }
                }
                const entry = easygpu.webgpu.GPUBindGroupDescriptor.newEntry( binding, resource );
                this.entries[ binding ] = entry;
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
                        Object.defineProperty( passResource.uniformStorage, bindingData.name, {
                            get : function ()
                            {
                                return entry.resource.buffer;
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
                                if ( view.byteLength != entry.resource.buffer.size )
                                {
                                    entry.resource.buffer.destroy();
                                    entry.resource.setBuffer( device.createBuffer( new easygpu.webgpu.GPUBufferDescriptor( view.byteLength, entry.resource.buffer.usage, false, entry.resource.buffer.label ) ) );
                                    //resource.setOffset(0);
                                    //resource.setSize(view.byteLength);
                                    updated = true;
                                }
                                device.queue.writeBuffer( entry.resource.buffer, 0, view.buffer, view.byteOffset, view.byteLength );
                            },
                            enumerable   : true,
                            configurable : true
                        } );
                    }
                    else
                    {
                        //resource error
                    }
                }
                else if ( bindingData.entry.sampler )
                {
                    Object.defineProperty( passResource.uniformStorage, bindingData.name, {
                        get : function ()
                        {
                            return entry.resource;
                        },
                        set : function ( value )
                        {
                            switch ( true )
                            {
                                case value instanceof GPUSampler:
                                    entry.setResource( value );
                                    break;
                                default:
                                    entry.setResource( device.createSampler( value ) );
                                    break;
                            }
                        },
                        enumerable   : true,
                        configurable : true
                    } );
                }
                else if ( bindingData.entry.texture )
                {
                    Object.defineProperty( passResource.uniformStorage, bindingData.name, {
                        get : function ()
                        {
                            return entry.resource;
                        },
                        set : function ( value )
                        {
                            switch ( true )
                            {
                                case value instanceof GPUTextureView:
                                    entry.setResource( value );
                                    break;
                                case value instanceof GPUTexture:
                                    entry.setResource( value.createView() );
                                    break;
                            }
                        },
                        enumerable   : true,
                        configurable : true
                    } );
                }
                else if ( bindingData.entry.storageTexture )
                {
                    //incomplete
                }
                updated = true;
            }

            initEntries ( passResource, bindingList, resources )
            {
                for ( const bindingData of bindingList )
                {
                    if ( bindingData )
                    {
                        this.initEntry( passResource, bindingData, resources );
                    }
                }
            }
        }( layout, entries, label );
        bindGroupDescriptor.initEntries( this, bindingList, resources );
        return bindGroupDescriptor;
    }

    initBindGroup ( index, bindGroupDescriptor )
    {
        Object.defineProperty( this.bindGroups, index, {
            get : function ()
            {
                return bindGroupDescriptor.getBindGroup();
            },
            enumerable   : true,
            configurable : true
        } );
    }

    initBindGroups ( bindingListArray = this.bindingListArray, resourcesArray = [] )
    {
        for ( const bindingList of bindingListArray )
        {
            if ( bindingList )
            {
                const index = bindingListArray.indexOf( bindingList );
                const bindGroupDescriptor = this.initBindGroupDescriptor( bindingList, resourcesArray[ index ] );
                this.bindGroupDescriptors[ index ] = bindGroupDescriptor;
                this.initBindGroup( index, bindGroupDescriptor );
            }
        }
    }

    copyUniformStoragePropertyFromPassResource ( passResource, name )
    {
        Object.defineProperty( this.uniformStorage, name, Object.getOwnPropertyDescriptor( passResource.uniformStorage, name ) );
    }

    copy ( override )
    {
        let overridePropertyDescriptors;
        if ( override instanceof Object )
        {
            overridePropertyDescriptors = Object.getOwnPropertyDescriptors( override );
        }
        return Object.defineProperties( new this.constructor(), Object.assign( Object.getOwnPropertyDescriptors( this ), overridePropertyDescriptors ) );
    }
};
easygpu.ComputePassResource = class ComputePassResource extends easygpu.PassResource
{
    constructor ( arg0, arg1 )
    {
        super( arg0, arg1 );
    }
};
easygpu.RenderPassResource = class RenderPassResource extends easygpu.PassResource
{
    constructor ( arg0, arg1 )
    {
        super( arg0, arg1 );
        if ( arg0 instanceof GPUDevice )
        {
            this.vertices = {};
            this.vertexBuffers = [];
        }
    }

    initRenderPipeline ( renderPipelineDescriptor = new easygpu.webgpu.GPURenderPipelineDescriptor() )
    {
        let renderPipeline;
        let updated = true;
        Object.defineProperty( this, `renderPipelineDescriptor`, {
            get : function ()
            {
                return renderPipelineDescriptor;
            },
            set : function ( descriptor )
            {
                renderPipelineDescriptor = descriptor;
                updated = true;
            },
            enumerable   : true,
            configurable : true
        } );
        Object.defineProperty( this, `renderPipeline`, {
            get : function ()
            {
                if ( updated )
                {
                    renderPipeline = this.device.createRenderPipeline( renderPipelineDescriptor );
                    updated = false;
                }
                return renderPipeline;
            },
            enumerable   : true,
            configurable : true
        } );
    }

    initVertexBuffer ( index, vertexList )
    {
        const device = this.device;
        const vertexNames = [];
        for ( const vertexData of vertexList )
        {
            vertexNames.push( vertexData.name );
        }
        let vertexBuffer;
        const vertexBufferName = vertexNames.join( `_` );
        Object.defineProperty( this.vertices, vertexBufferName, {
            get : function ()
            {
                return vertexBuffer;
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
                else if ( value instanceof GPUBuffer )
                {
                    if ( vertexBuffer instanceof GPUBuffer )
                    {
                        vertexBuffer.destroy();
                    }
                    vertexBuffer = value;
                    return;
                }
                else
                {
                    return;//unknow type;
                }
                switch ( true )
                {
                    case vertexBuffer instanceof GPUBuffer && view.byteLength != vertexBuffer.size:
                        vertexBuffer.destroy();
                    case !( vertexBuffer instanceof GPUBuffer ):
                        const size = view.byteLength;
                        const usage = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST;
                        const mappedAtCreation = false;
                        const label = vertexBufferName;
                        const bufferDescriptor = new easygpu.webgpu.GPUBufferDescriptor( size, usage, mappedAtCreation, label );
                        vertexBuffer = device.createBuffer( bufferDescriptor );
                    default:
                        device.queue.writeBuffer( vertexBuffer, 0, view.buffer, view.byteOffset, view.byteLength );
                        break;
                }
            },
            enumerable   : true,
            configurable : true
        } );
        Object.defineProperty( this.vertexBuffers, index, {
            get : function ()
            {
                return vertexBuffer;
            },
            enumerable   : true,
            configurable : true
        } );
    }

    initVertexBuffers ( vertexListArray = this.vertexListArray )
    {
        for ( const vertexList of vertexListArray )
        {
            if ( vertexList )
            {
                this.initVertexBuffer( vertexListArray.indexOf( vertexList ), vertexList );
            }
        }
    }

    initIndexBuffer ()
    {
        const device = this.device;
        let indexBuffer;
        Object.defineProperty( this, `indexBuffer`, {
            get : function ()
            {
                return indexBuffer;
            },
            set : function ( value )
            {
                switch ( true )
                {
                    case value instanceof Uint16Array:
                        this.indexFormat = `uint16`;
                        break;
                    case value instanceof Uint32Array:
                        this.indexFormat = `uint32`;
                        break;
                    case value instanceof Array:
                        value = new Uint32Array( value );
                        this.indexFormat = `uint32`;
                        break;
                    case typeof value === `number` || value instanceof Number:
                        value = new Uint32Array( [ value ] );
                        this.indexFormat = `uint32`;
                        break;
                    case value instanceof GPUBuffer://You need to set indexFormat manually
                        if ( indexBuffer instanceof GPUBuffer )
                        {
                            indexBuffer.destroy();
                        }
                        indexBuffer = value;
                        return;
                        break;
                    default:
                        //unknow value
                        return;
                        break;
                }
                switch ( true )
                {
                    case indexBuffer instanceof GPUBuffer && value.byteLength != indexBuffer.size:
                        indexBuffer.destroy();
                    case !( indexBuffer instanceof GPUBuffer ):
                        const size = value.byteLength;
                        const usage = GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST;
                        const mappedAtCreation = false;
                        let label;
                        const bufferDescriptor = new easygpu.webgpu.GPUBufferDescriptor( size, usage, mappedAtCreation, label );
                        indexBuffer = device.createBuffer( bufferDescriptor );
                    default:
                        device.queue.writeBuffer( indexBuffer, 0, value.buffer, value.byteOffset, value.byteLength );
                        break;
                }
            },
            enumerable   : true,
            configurable : true
        } );
    }
};
/**
 * @file wgsl.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.03
 */
//ref: https://www.w3.org/TR/WGSL/#alignment-and-size
easygpu.wgsl.alignOf = function ( hostShareableType )
{
    var match;
    switch ( true )
    {
        case /^f16$/.test( hostShareableType ):
            return 2;
            break;
        case /^i32$|^u32$|^f32$|^atomic<.*>$/.test( hostShareableType ):
            return 4;
            break;
        case ( match = hostShareableType.match( /^vec(\d+)(.*)$/ ) ) ? true : false:
            var N = Number( match[ 1 ] );//element count of the vector
            var T = match[ 2 ];//<type>
            if ( N == 3 ){N++;}
            switch ( true )
            {
                case ( match = T.match( /^<(.*)>$/ ) ) ? true : false:
                    return N * easygpu.wgsl.sizeOf( match[ 1 ] );
                    break;
                case /^i$|^u$|^f$/.test( T ):
                    return N * 4;
                    break;
                case /^h$/.test( T ):
                    return N * 2;
                    break;
                default:
                    return 0;
                    break;
            }
        case ( match = hostShareableType.match( /^mat\d+x(\d+)(.*)$/ ) ) ? true : false:
            var R = Number( match[ 1 ] );//rows
            var T = match[ 2 ];//<type>
            return easygpu.wgsl.alignOf( `vec${R}${T}` );
            break;
        case ( match = hostShareableType.match( /^array<(.*),\d+>$/ ) ) ? true : false:
        case ( match = hostShareableType.match( /^array<(.*)(?<!,\d+)>$/ ) ) ? true : false:
            var E = match[ 1 ];//element
            return easygpu.wgsl.alignOf( E );
            break;
        default:
            //Structure size cannot be automatically calculated
            return 0;
            break;
    }
};
easygpu.wgsl.sizeOf = function ( hostShareableType )
{
    var match;
    switch ( true )
    {
        case /^f16$/.test( hostShareableType ):
            return 2;
            break;
        case /^i32$|^u32$|^f32$|^atomic<.*>$/.test( hostShareableType ):
            return 4;
            break;
        case ( match = hostShareableType.match( /^vec(\d+)(.*)$/ ) ) ? true : false:
            var N = Number( match[ 1 ] );//element count of the vector
            var T = match[ 2 ];//<type>
            switch ( true )
            {
                case ( match = T.match( /^<(.*)>$/ ) ) ? true : false:
                    return N * easygpu.wgsl.sizeOf( match[ 1 ] );
                    break;
                case /^i$|^u$|^f$/.test( T ):
                    return N * 4;
                    break;
                case /^h$/.test( T ):
                    return N * 2;
                    break;
                default:
                    return 0;
                    break;
            }
            break;
        case ( match = hostShareableType.match( /^mat(\d+)x(\d+)(.*)$/ ) ) ? true : false:
            var C = Number( match[ 1 ] );//columns
            var R = Number( match[ 2 ] );//rows
            var T = match[ 3 ];//<type>
            return easygpu.wgsl.sizeOf( `array<vec${R}${T},${C}>` );
            break;
        case ( match = hostShareableType.match( /^array<(.*),(\d+)>$/ ) ) ? true : false:
            var E = match[ 1 ];//element
            var N = Number( match[ 2 ] );//element count of the array
            var sizeOfE = easygpu.wgsl.sizeOf( E );
            var alignOfE = easygpu.wgsl.alignOf( E );
            return N * ( Math.ceil( sizeOfE / alignOfE ) * alignOfE );
            break;
        default:
            //Runtime-sized array (array<E>) size cannot be automatically calculated
            //Structure size cannot be automatically calculated
            return 0;
            break;
    }
};
/**
 * @file GPUObjectDescriptorBase.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
easygpu.webgpu.GPUObjectDescriptorBase = class GPUObjectDescriptorBase
{
    constructor ( label )
    {
        this.label = label; //Optional
    }

    setLabel ( label )
    {
        this.label = label;
    }
};
/**
 * @file GPUBufferDescriptor.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPUBufferDescriptor = class GPUBufferDescriptor extends easygpu.webgpu.GPUObjectDescriptorBase
{
    constructor ( size, usage, mappedAtCreation, label )
    {
        super( label );
        this.size = size; //Required GPUSize64
        this.usage = usage; //Required GPUBufferUsageFlags
        this.mappedAtCreation = mappedAtCreation; //Optional; boolean; undefined = false
    }

    setSize ( size )
    {
        this.size = size;
    }

    setUsage ( usage )
    {
        this.usage = usage;
    }

    setMappedAtCreation ( mappedAtCreation )
    {
        this.mappedAtCreation = mappedAtCreation;
    }

    static getAvailableUsages ()
    {
        return new easygpu.webgpu.GPUBufferUsage();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUBufferDescriptor";
    }
};
easygpu.webgpu.GPUBufferDescriptor.prototype.getAvailableUsages = easygpu.webgpu.GPUBufferDescriptor.getAvailableUsages;
/**
 * @file GPUBufferUsage.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPUBufferUsage = class GPUBufferUsage
{
    MAP_READ = 0x0001;

    MAP_WRITE = 0x0002;

    COPY_SRC = 0x0004;

    COPY_DST = 0x0008;

    INDEX = 0x0010;

    VERTEX = 0x0020;

    UNIFORM = 0x0040;

    STORAGE = 0x0080;

    INDIRECT = 0x0100;

    QUERY_RESOLVE = 0x0200;

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUBufferUsage";
    }
};
/**
 * @file GPUTextureDescriptor.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPUTextureDescriptor = class GPUTextureDescriptor extends easygpu.webgpu.GPUObjectDescriptorBase
{
    constructor ( size, mipLevelCount, sampleCount, dimension, format, usage, viewFormats = [], label )
    {
        super( label );
        this.size = size; //Required GPUExtent3D
        this.mipLevelCount = mipLevelCount; //Optional; GPUIntegerCoordinate; undefined = 1
        this.sampleCount = sampleCount; //Optional; GPUSize32; undefined = 1
        this.dimension = dimension; //Optional; GPUTextureDimension; undefined = "2d"
        this.format = format; //Required GPUTextureFormat
        this.usage = usage; //Required GPUTextureUsageFlags
        this.viewFormats = viewFormats; //Optional; sequence<GPUTextureFormat>
    }

    setSize ( size )
    {
        this.size = size;
    }

    setMipLevelCount ( mipLevelCount )
    {
        this.mipLevelCount = mipLevelCount;
    }

    setSampleCount ( sampleCount )
    {
        this.sampleCount = sampleCount;
    }

    setDimension ( dimension )
    {
        this.dimension = dimension;
    }

    setFormat ( format )
    {
        this.format = format;
    }

    setUsage ( usage )
    {
        this.usage = usage;
    }

    setViewFormats ( viewFormats )
    {
        this.viewFormats = viewFormats;
    }

    static newSize ( width, height, depthOrArrayLayers )
    {
        return new easygpu.webgpu.GPUExtent3DDict( width, height, depthOrArrayLayers );
    }

    static getAvailableDimensions ()
    {
        return new easygpu.webgpu.GPUTextureDimension();
    }

    static getAvailableFormats ( device )
    {
        return new easygpu.webgpu.GPUTextureFormat( device );
    }

    static getAvailableUsages ()
    {
        return new easygpu.webgpu.GPUTextureUsage();
    }

    static getAvailableViewFormats ( device )
    {
        return new easygpu.webgpu.GPUTextureFormat( device );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUTextureDescriptor";
    }
};
easygpu.webgpu.GPUTextureDescriptor.prototype.newSize = easygpu.webgpu.GPUTextureDescriptor.newSize;
easygpu.webgpu.GPUTextureDescriptor.prototype.getAvailableDimensions = easygpu.webgpu.GPUTextureDescriptor.getAvailableDimensions;
easygpu.webgpu.GPUTextureDescriptor.prototype.getAvailableFormats = easygpu.webgpu.GPUTextureDescriptor.getAvailableFormats;
easygpu.webgpu.GPUTextureDescriptor.prototype.getAvailableUsages = easygpu.webgpu.GPUTextureDescriptor.getAvailableUsages;
easygpu.webgpu.GPUTextureDescriptor.prototype.getAvailableViewFormats = easygpu.webgpu.GPUTextureDescriptor.getAvailableViewFormats;
/**
 * @file GPUTextureDimension.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPUTextureDimension = class GPUTextureDimension
{
    _1d = "1d";

    _2d = "2d";

    _3d = "3d";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUTextureDimension";
    }
};
/**
 * @file GPUTextureUsage.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPUTextureUsage = class GPUTextureUsage
{
    COPY_SRC = 0x01;

    COPY_DST = 0x02;

    TEXTURE_BINDING = 0x04;

    STORAGE_BINDING = 0x08;

    RENDER_ATTACHMENT = 0x10;

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUTextureUsage";
    }
};
/**
 * @file GPUTextureViewDescriptor.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPUTextureViewDescriptor = class GPUTextureViewDescriptor extends easygpu.webgpu.GPUObjectDescriptorBase
{
    constructor ( format, dimension, aspect, baseMipLevel, mipLevelCount, baseArrayLayer, arrayLayerCount, label )
    {
        super( label );
        this.format = format; //Optional; GPUTextureFormat
        this.dimension = dimension; //Optional; GPUTextureViewDimension
        this.aspect = aspect; //Optional; GPUTextureAspect; undefined = "all"
        this.baseMipLevel = baseMipLevel; //Optional; GPUIntegerCoordinate; undefined = 0
        this.mipLevelCount = mipLevelCount; //Optional; GPUIntegerCoordinate
        this.baseArrayLayer = baseArrayLayer; //Optional; GPUIntegerCoordinate; undefined = 0
        this.arrayLayerCount = arrayLayerCount; //Optional; GPUIntegerCoordinate
    }

    setFormat ( format )
    {
        this.format = format;
    }

    setDimension ( dimension )
    {
        this.dimension = dimension;
    }

    setAspect ( aspect )
    {
        this.aspect = aspect;
    }

    setBaseMipLevel ( baseMipLevel )
    {
        this.baseMipLevel = baseMipLevel;
    }

    setMipLevelCount ( mipLevelCount )
    {
        this.mipLevelCount = mipLevelCount;
    }

    setBaseArrayLayer ( baseArrayLayer )
    {
        this.baseArrayLayer = baseArrayLayer;
    }

    setArrayLayerCount ( arrayLayerCount )
    {
        this.arrayLayerCount = arrayLayerCount;
    }

    static getAvailableFormats ( device )
    {
        return new easygpu.webgpu.GPUTextureFormat( device );
    }

    static getAvailableDimensions ()
    {
        return new easygpu.webgpu.GPUTextureViewDimension();
    }

    static getAvailableAspects ()
    {
        return new easygpu.webgpu.GPUTextureAspect();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUTextureViewDescriptor";
    }
};
easygpu.webgpu.GPUTextureViewDescriptor.prototype.getAvailableFormats = easygpu.webgpu.GPUTextureViewDescriptor.getAvailableFormats;
easygpu.webgpu.GPUTextureViewDescriptor.prototype.getAvailableDimensions = easygpu.webgpu.GPUTextureViewDescriptor.getAvailableDimensions;
easygpu.webgpu.GPUTextureViewDescriptor.prototype.getAvailableAspects = easygpu.webgpu.GPUTextureViewDescriptor.getAvailableAspects;
/**
 * @file GPUTextureViewDimension.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPUTextureViewDimension = class GPUTextureViewDimension
{
    _1d = "1d";

    _2d = "2d";

    _2d_array = "2d-array";

    cube = "cube";

    cube_array = "cube-array";

    _3d = "3d";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUTextureViewDimension";
    }
};
/**
 * @file GPUTextureAspect.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPUTextureAspect = class GPUTextureAspect
{
    all = "all";

    stencil_only = "stencil-only";

    depth_only = "depth-only";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUTextureAspect";
    }
};
/**
 * @file GPUTextureFormat.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
easygpu.webgpu.GPUTextureFormat = class GPUTextureFormat
{
    // 8-bit formats
    r8unorm = "r8unorm";

    r8snorm = "r8snorm";

    r8uint = "r8uint";

    r8sint = "r8sint";

    // 16-bit formats
    r16uint = "r16uint";

    r16sint = "r16sint";

    r16float = "r16float";

    rg8unorm = "rg8unorm";

    rg8snorm = "rg8snorm";

    rg8uint = "rg8uint";

    rg8sint = "rg8sint";

    // 32-bit formats
    r32uint = "r32uint";

    r32sint = "r32sint";

    r32float = "r32float";

    rg16uint = "rg16uint";

    rg16sint = "rg16sint";

    rg16float = "rg16float";

    rgba8unorm = "rgba8unorm";

    rgba8unorm_srgb = "rgba8unorm-srgb";

    rgba8snorm = "rgba8snorm";

    rgba8uint = "rgba8uint";

    rgba8sint = "rgba8sint";

    bgra8unorm = "bgra8unorm";

    bgra8unorm_srgb = "bgra8unorm-srgb";

    // Packed 32-bit formats
    rgb9e5ufloat = "rgb9e5ufloat";

    rgb10a2uint = "rgb10a2uint";

    rgb10a2unorm = "rgb10a2unorm";

    rg11b10ufloat = "rg11b10ufloat";

    // 64-bit formats
    rg32uint = "rg32uint";

    rg32sint = "rg32sint";

    rg32float = "rg32float";

    rgba16uint = "rgba16uint";

    rgba16sint = "rgba16sint";

    rgba16float = "rgba16float";

    // 128-bit formats
    rgba32uint = "rgba32uint";

    rgba32sint = "rgba32sint";

    rgba32float = "rgba32float";

    // Depth/stencil formats
    stencil8 = "stencil8";

    depth16unorm = "depth16unorm";

    depth24plus = "depth24plus";

    depth24plus_stencil8 = "depth24plus-stencil8";

    depth32float = "depth32float";

    constructor ( device )
    {
        if ( !device || device.features.has( "depth32float-stencil8" ) )
        {
            // "depth32float-stencil8" feature
            this.depth32float_stencil8 = "depth32float-stencil8";
        }
        if ( !device || device.features.has( "texture-compression-bc" ) )
        {
            // BC compressed formats usable if "texture-compression-bc" is both
            // supported by the device/user agent and enabled in requestDevice.
            this.bc1_rgba_unorm = "bc1-rgba-unorm";
            this.bc1_rgba_unorm_srgb = "bc1-rgba-unorm-srgb";
            this.bc2_rgba_unorm = "bc2-rgba-unorm";
            this.bc2_rgba_unorm_srgb = "bc2-rgba-unorm-srgb";
            this.bc3_rgba_unorm = "bc3-rgba-unorm";
            this.bc3_rgba_unorm_srgb = "bc3-rgba-unorm-srgb";
            this.bc4_r_unorm = "bc4-r-unorm";
            this.bc4_r_snorm = "bc4-r-snorm";
            this.bc5_rg_unorm = "bc5-rg-unorm";
            this.bc5_rg_snorm = "bc5-rg-snorm";
            this.bc6h_rgb_ufloat = "bc6h-rgb-ufloat";
            this.bc6h_rgb_float = "bc6h-rgb-float";
            this.bc7_rgba_unorm = "bc7-rgba-unorm";
            this.bc7_rgba_unorm_srgb = "bc7-rgba-unorm-srgb";
        }
        if ( !device || device.features.has( "texture-compression-etc2" ) )
        {
            // ETC2 compressed formats usable if "texture-compression-etc2" is both
            // supported by the device/user agent and enabled in requestDevice.
            this.etc2_rgb8unorm = "etc2-rgb8unorm";
            this.etc2_rgb8unorm_srgb = "etc2-rgb8unorm-srgb";
            this.etc2_rgb8a1unorm = "etc2-rgb8a1unorm";
            this.etc2_rgb8a1unorm_srgb = "etc2-rgb8a1unorm-srgb";
            this.etc2_rgba8unorm = "etc2-rgba8unorm";
            this.etc2_rgba8unorm_srgb = "etc2-rgba8unorm-srgb";
            this.eac_r11unorm = "eac-r11unorm";
            this.eac_r11snorm = "eac-r11snorm";
            this.eac_rg11unorm = "eac-rg11unorm";
            this.eac_rg11snorm = "eac-rg11snorm";
        }
        if ( !device || device.features.has( "texture-compression-astc" ) )
        {
            // ASTC compressed formats usable if "texture-compression-astc" is both
            // supported by the device/user agent and enabled in requestDevice.
            this.astc_4x4_unorm = "astc-4x4-unorm";
            this.astc_4x4_unorm_srgb = "astc-4x4-unorm-srgb";
            this.astc_5x4_unorm = "astc-5x4-unorm";
            this.astc_5x4_unorm_srgb = "astc-5x4-unorm-srgb";
            this.astc_5x5_unorm = "astc-5x5-unorm";
            this.astc_5x5_unorm_srgb = "astc-5x5-unorm-srgb";
            this.astc_6x5_unorm = "astc-6x5-unorm";
            this.astc_6x5_unorm_srgb = "astc-6x5-unorm-srgb";
            this.astc_6x6_unorm = "astc-6x6-unorm";
            this.astc_6x6_unorm_srgb = "astc-6x6-unorm-srgb";
            this.astc_8x5_unorm = "astc-8x5-unorm";
            this.astc_8x5_unorm_srgb = "astc-8x5-unorm-srgb";
            this.astc_8x6_unorm = "astc-8x6-unorm";
            this.astc_8x6_unorm_srgb = "astc-8x6-unorm-srgb";
            this.astc_8x8_unorm = "astc-8x8-unorm";
            this.astc_8x8_unorm_srgb = "astc-8x8-unorm-srgb";
            this.astc_10x5_unorm = "astc-10x5-unorm";
            this.astc_10x5_unorm_srgb = "astc-10x5-unorm-srgb";
            this.astc_10x6_unorm = "astc-10x6-unorm";
            this.astc_10x6_unorm_srgb = "astc-10x6-unorm-srgb";
            this.astc_10x8_unorm = "astc-10x8-unorm";
            this.astc_10x8_unorm_srgb = "astc-10x8-unorm-srgb";
            this.astc_10x10_unorm = "astc-10x10-unorm";
            this.astc_10x10_unorm_srgb = "astc-10x10-unorm-srgb";
            this.astc_12x10_unorm = "astc-12x10-unorm";
            this.astc_12x10_unorm_srgb = "astc-12x10-unorm-srgb";
            this.astc_12x12_unorm = "astc-12x12-unorm";
            this.astc_12x12_unorm_srgb = "astc-12x12-unorm-srgb";
        }
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUTextureFormat";
    }
};
/**
 * @file GPUSamplerDescriptor.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.05
 */
easygpu.webgpu.GPUSamplerDescriptor = class GPUSamplerDescriptor extends easygpu.webgpu.GPUObjectDescriptorBase
{
    constructor ( addressModeU, addressModeV, addressModeW, magFilter, minFilter, mipmapFilter, lodMinClamp, lodMaxClamp, compare, maxAnisotropy, label )
    {
        super( label );
        this.addressModeU = addressModeU;//Optional; GPUAddressMode; undefined = "clamp-to-edge"
        this.addressModeV = addressModeV;//Optional; GPUAddressMode; undefined = "clamp-to-edge"
        this.addressModeW = addressModeW;//Optional; GPUAddressMode; undefined = "clamp-to-edge"
        this.magFilter = magFilter;//Optional; GPUFilterMode; undefined = "nearest"
        this.minFilter = minFilter;//Optional; GPUFilterMode; undefined = "nearest"
        this.mipmapFilter = mipmapFilter;//Optional; GPUMipmapFilterMode; undefined = "nearest"
        this.lodMinClamp = lodMinClamp;//Optional; float; undefined = 0
        this.lodMaxClamp = lodMaxClamp;//Optional; float; undefined = 32
        this.compare = compare;//Optional
        this.maxAnisotropy = maxAnisotropy;//Optional; unsigned short; undefined = 1
    }

    setAddressModeU ( addressModeU ){this.addressModeU = addressModeU;}

    setAddressModeV ( addressModeV ){this.addressModeV = addressModeV;}

    setAddressModeW ( addressModeW ){this.addressModeW = addressModeW;}

    setMagFilter ( magFilter ){this.magFilter = magFilter;}

    setMinFilter ( minFilter ){this.minFilter = minFilter;}

    setMipmapFilter ( mipmapFilter ){this.mipmapFilter = mipmapFilter;}

    setLodMinClamp ( lodMinClamp ){this.lodMinClamp = lodMinClamp;}

    setLodMaxClamp ( lodMaxClamp ){this.lodMaxClamp = lodMaxClamp;}

    setCompare ( compare ){this.compare = compare;}

    setMaxAnisotropy ( maxAnisotropy ){this.maxAnisotropy = maxAnisotropy;}

    static getAvailableAddressModeUs (){return new easygpu.webgpu.GPUAddressMode();}

    static getAvailableAddressModeVs (){return new easygpu.webgpu.GPUAddressMode();}

    static getAvailableAddressModeWs (){return new easygpu.webgpu.GPUAddressMode();}

    static getAvailableMagFilters (){return new easygpu.webgpu.GPUFilterMode();}

    static getAvailableMinFilters (){return new easygpu.webgpu.GPUFilterMode();}

    static getAvailableMipmapFilters (){return new easygpu.webgpu.GPUMipmapFilterMode();}

    static getAvailableCompares (){return new easygpu.webgpu.GPUCompareFunction();}

    get [ Symbol.toStringTag ] ()
    {
        return "GPUSamplerDescriptor";
    }
};
easygpu.webgpu.GPUSamplerDescriptor.prototype.getAvailableAddressModeUs = easygpu.webgpu.GPUSamplerDescriptor.getAvailableAddressModeUs;
easygpu.webgpu.GPUSamplerDescriptor.prototype.getAvailableAddressModeVs = easygpu.webgpu.GPUSamplerDescriptor.getAvailableAddressModeVs;
easygpu.webgpu.GPUSamplerDescriptor.prototype.getAvailableAddressModeWs = easygpu.webgpu.GPUSamplerDescriptor.getAvailableAddressModeWs;
easygpu.webgpu.GPUSamplerDescriptor.prototype.getAvailableMagFilters = easygpu.webgpu.GPUSamplerDescriptor.getAvailableMagFilters;
easygpu.webgpu.GPUSamplerDescriptor.prototype.getAvailableMinFilters = easygpu.webgpu.GPUSamplerDescriptor.getAvailableMinFilters;
easygpu.webgpu.GPUSamplerDescriptor.prototype.getAvailableMipmapFilters = easygpu.webgpu.GPUSamplerDescriptor.getAvailableMipmapFilters;
easygpu.webgpu.GPUSamplerDescriptor.prototype.getAvailableCompares = easygpu.webgpu.GPUSamplerDescriptor.getAvailableCompares;
/**
 * @file GPUAddressMode.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.05
 */
easygpu.webgpu.GPUAddressMode = class GPUAddressMode
{
    clamp_to_edge = "clamp-to-edge";

    repeat = "repeat";

    mirror_repeat = "mirror-repeat";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUAddressMode";
    }
};
/**
 * @file GPUFilterMode.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.05
 */
easygpu.webgpu.GPUFilterMode = class GPUFilterMode
{
    nearest = "nearest";

    linear = "linear";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUFilterMode";
    }
};
/**
 * @file GPUMipmapFilterMode.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.05
 */
easygpu.webgpu.GPUMipmapFilterMode = class GPUMipmapFilterMode
{
    nearest = "nearest";

    linear = "linear";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUMipmapFilterMode";
    }
};
/**
 * @file GPUCompareFunction.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPUCompareFunction = class GPUCompareFunction
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
/**
 * @file GPUBindGroupLayoutDescriptor.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPUBindGroupLayoutDescriptor = class GPUBindGroupLayoutDescriptor extends easygpu.webgpu.GPUObjectDescriptorBase
{
    constructor ( entries = [], label )
    {
        super( label );
        this.entries = entries; //Required sequence<GPUBindGroupLayoutEntry>
    }

    setEntries ( entries )
    {
        this.entries = entries;
    }

    static newEntry ( binding, visibility, resourceLayoutObject )
    {
        return new easygpu.webgpu.GPUBindGroupLayoutEntry( binding, visibility, resourceLayoutObject );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUBindGroupLayoutDescriptor";
    }
};
easygpu.webgpu.GPUBindGroupLayoutDescriptor.prototype.newEntry = easygpu.webgpu.GPUBindGroupLayoutDescriptor.newEntry;
/**
 * @file GPUStorageTextureAccess.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPUStorageTextureAccess = class GPUStorageTextureAccess
{
    write_only = "write-only";

    read_only = "read-only";

    read_write = "read-write";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUStorageTextureAccess";
    }
};
/**
 * @file GPUStorageTextureBindingLayout.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPUStorageTextureBindingLayout = class GPUStorageTextureBindingLayout
{
    constructor ( access, format, viewDimension )
    {
        this.access = access; //Optional; GPUStorageTextureAccess; undefined = "write-only""
        this.format = format; //Required GPUTextureFormat;
        this.viewDimension = viewDimension; //Optional; GPUTextureViewDimension; undefined = "2d"
    }

    setAccess ( access )
    {
        this.access = access;
    }

    setFormat ( format )
    {
        this.format = format;
    }

    setViewDimension ( viewDimension )
    {
        this.viewDimension = viewDimension;
    }

    static getAvailableFormats ( device )
    {
        return new easygpu.webgpu.GPUTextureFormat( device );
    }

    static getAvailableViewDimensions ()
    {
        return new easygpu.webgpu.GPUTextureViewDimension();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUStorageTextureBindingLayout";
    }
};
easygpu.webgpu.GPUStorageTextureBindingLayout.prototype.getAvailableFormats = easygpu.webgpu.GPUStorageTextureBindingLayout.getAvailableFormats;
easygpu.webgpu.GPUStorageTextureBindingLayout.prototype.getAvailableViewDimensions = easygpu.webgpu.GPUStorageTextureBindingLayout.getAvailableViewDimensions;
/**
 * @file GPUExternalTextureBindingLayout .js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPUExternalTextureBindingLayout = class GPUExternalTextureBindingLayout
{
    get [ Symbol.toStringTag ] ()
    {
        return "GPUExternalTextureBindingLayout ";
    }
};
/**
 * @file GPUBindGroupLayoutEntry.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPUBindGroupLayoutEntry = class GPUBindGroupLayoutEntry
{
    constructor ( binding, visibility, resourceLayoutObject )
    {
        this.binding = binding; //Required GPUIndex32
        this.visibility = visibility; //Required GPUShaderStageFlag(s)
        //An object that defines the required binding resource type and structure of the GPUBindGroup entry corresponding to this entry. This property can be one of buffer, externalTexture, sampler, storageTexture, or texture.
        if ( resourceLayoutObject instanceof easygpu.webgpu.GPUBufferBindingLayout )
        {
            this.buffer = resourceLayoutObject;
        }
        else if ( resourceLayoutObject instanceof easygpu.webgpu.GPUSamplerBindingLayout )
        {
            this.sampler = resourceLayoutObject;
        }
        else if ( resourceLayoutObject instanceof easygpu.webgpu.GPUTextureBindingLayout )
        {
            this.texture = resourceLayoutObject;
        }
        else if ( resourceLayoutObject instanceof easygpu.webgpu.GPUStorageTextureBindingLayout )
        {
            this.storageTexture = resourceLayoutObject;
        }
        else if ( resourceLayoutObject instanceof easygpu.webgpu.GPUExternalTextureBindingLayout )
        {
            this.externalTexture = resourceLayoutObject;
        }
        //e.g. {buffer:{...}}
        else if ( resourceLayoutObject instanceof Object )
        {
            if ( resourceLayoutObject.buffer instanceof Object )
            {
                this.buffer = resourceLayoutObject.buffer;
            }
            else if ( resourceLayoutObject.sampler instanceof Object )
            {
                this.sampler = resourceLayoutObject.sampler;
            }
            else if ( resourceLayoutObject.texture instanceof Object )
            {
                this.texture = resourceLayoutObject.texture;
            }
            else if ( resourceLayoutObject.storageTexture instanceof Object )
            {
                this.storageTexture = resourceLayoutObject.storageTexture;
            }
            else if ( resourceLayoutObject.externalTexture instanceof Object )
            {
                this.externalTexture = resourceLayoutObject.externalTexture;
            }
            else
            {
                //x3dom.debug.logWarning('unknown resourceLayoutObject')
                console.warn( "unknown resourceLayoutObject" );
            }
        }
        else
        {
            //x3dom.debug.logWarning('unknown resourceLayoutObject')
            console.warn( "unknown resourceLayoutObject" );
        }
    }

    setBinding ( binding )
    {
        this.deleteResourceLayoutObject();
        this.binding = binding;
    }

    setVisibility ( visibility )
    {
        this.deleteResourceLayoutObject();
        this.visibility = visibility;
    }

    setBuffer ( buffer )
    {
        this.deleteResourceLayoutObject();
        this.buffer = buffer;
    }

    setSampler ( sampler )
    {
        this.deleteResourceLayoutObject();
        this.sampler = sampler;
    }

    setTexture ( texture )
    {
        this.deleteResourceLayoutObject();
        this.texture = texture;
    }

    setStorageTexture ( storageTexture )
    {
        this.deleteResourceLayoutObject();
        this.storageTexture = storageTexture;
    }

    setExternalTexture ( externalTexture )
    {
        this.deleteResourceLayoutObject();
        this.externalTexture = externalTexture;
    }

    deleteResourceLayoutObject ()
    {
        delete this.buffer;
        delete this.sampler;
        delete this.texture;
        delete this.storageTexture;
        delete this.externalTexture;
    }

    static newBuffer ( type, hasDynamicOffset, minBindingSize )
    {
        return new easygpu.webgpu.GPUBufferBindingLayout( type, hasDynamicOffset, minBindingSize );
    }

    static newSampler ( type )
    {
        return new easygpu.webgpu.GPUSamplerBindingLayout( type );
    }

    static newTexture ( sampleType, viewDimension, multisampled )
    {
        return new easygpu.webgpu.GPUTextureBindingLayout( sampleType, viewDimension, multisampled );
    }

    static newStorageTexture ( access, format, viewDimension )
    {
        return new easygpu.webgpu.GPUStorageTextureBindingLayout( access, format, viewDimension );
    }

    static newExternalTexture ()
    {
        return new easygpu.webgpu.GPUExternalTextureBindingLayout();
    }

    static getAvailableVisibilities ()
    {
        return new easygpu.webgpu.GPUShaderStage();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUBindGroupLayoutEntry";
    }
};
easygpu.webgpu.GPUBindGroupLayoutEntry.prototype.newBuffer = easygpu.webgpu.GPUBindGroupLayoutEntry.newBuffer;
easygpu.webgpu.GPUBindGroupLayoutEntry.prototype.newSampler = easygpu.webgpu.GPUBindGroupLayoutEntry.newSampler;
easygpu.webgpu.GPUBindGroupLayoutEntry.prototype.newTexture = easygpu.webgpu.GPUBindGroupLayoutEntry.newTexture;
easygpu.webgpu.GPUBindGroupLayoutEntry.prototype.newStorageTexture = easygpu.webgpu.GPUBindGroupLayoutEntry.newStorageTexture;
easygpu.webgpu.GPUBindGroupLayoutEntry.prototype.newExternalTexture = easygpu.webgpu.GPUBindGroupLayoutEntry.newExternalTexture;
easygpu.webgpu.GPUBindGroupLayoutEntry.prototype.getAvailableVisibilities = easygpu.webgpu.GPUBindGroupLayoutEntry.getAvailableVisibilities;
/**
 * @file GPUShaderStage.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPUShaderStage = class GPUShaderStage
{
    VERTEX = 0x1;

    FRAGMENT = 0x2;

    COMPUTE = 0x4;

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUShaderStage";
    }
};
/**
 * @file GPUBufferBindingType.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPUBufferBindingType = class GPUBufferBindingType
{
    uniform = "uniform";

    storage = "storage";

    read_only_storage = "read-only-storage";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUBufferBindingType";
    }
};
/**
 * @file GPUBufferBindingLayout.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPUBufferBindingLayout = class GPUBufferBindingLayout
{
    constructor ( type, hasDynamicOffset, minBindingSize )
    {
        this.type = type; //Optional; GPUBufferBindingType; undefined = "uniform"
        this.hasDynamicOffset = hasDynamicOffset; //Optional; boolean; undefined = false
        this.minBindingSize = minBindingSize; //Optional; GPUSize64; undefined = 0
    }

    setType ( type )
    {
        this.type = type;
    }

    setHasDynamicOffset ( hasDynamicOffset )
    {
        this.hasDynamicOffset = hasDynamicOffset;
    }

    setMinBindingSize ( minBindingSize )
    {
        this.minBindingSize = minBindingSize;
    }

    static getAvailableTypes ()
    {
        return new easygpu.webgpu.GPUBufferBindingType();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUBufferBindingLayout";
    }
};
easygpu.webgpu.GPUBufferBindingLayout.prototype.getAvailableTypes = easygpu.webgpu.GPUBufferBindingLayout.getAvailableTypes;
/**
 * @file GPUSamplerBindingType.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPUSamplerBindingType = class GPUSamplerBindingType
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
/**
 * @file GPUSamplerBindingLayout.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPUSamplerBindingLayout = class GPUSamplerBindingLayout
{
    constructor ( type )
    {
        this.type = type; //Optional; GPUSamplerBindingType; undefined = "filtering"
    }

    setType ( type )
    {
        this.type = type;
    }

    static getAvailableTypes ()
    {
        return new easygpu.webgpu.GPUSamplerBindingType();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUSamplerBindingLayout";
    }
};
easygpu.webgpu.GPUSamplerBindingLayout.prototype.getAvailableTypes = easygpu.webgpu.GPUSamplerBindingLayout.getAvailableTypes;
/**
 * @file GPUTextureSampleType.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPUTextureSampleType = class GPUTextureSampleType
{
    float = "float";

    unfilterable_float = "unfilterable-float";

    depth = "depth";

    sint = "sint";

    uint = "uint";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUTextureSampleType";
    }
};
/**
 * @file GPUTextureBindingLayout.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPUTextureBindingLayout = class GPUTextureBindingLayout
{
    constructor ( sampleType, viewDimension, multisampled )
    {
        this.sampleType = sampleType;//Optional; GPUTextureSampleType; undefined = "float"
        this.viewDimension = viewDimension;//Optional; GPUTextureViewDimension; undefined = "2d"
        this.multisampled = multisampled;//Optional; boolean; undefined = false
    }

    setSampleType ( sampleType )
    {
        this.sampleType = sampleType;
    }

    setViewDimension ( viewDimension )
    {
        this.viewDimension = viewDimension;
    }

    setFalse ( multisampled )
    {
        this.multisampled = multisampled;
    }

    static getAvailableSampleTypes ()
    {
        return new easygpu.webgpu.GPUTextureSampleType();
    }

    static getAvailableViewDimensions ()
    {
        return new easygpu.webgpu.GPUTextureViewDimension();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUTextureBindingLayout";
    }
};
easygpu.webgpu.GPUTextureBindingLayout.prototype.getAvailableSampleTypes = easygpu.webgpu.GPUTextureBindingLayout.getAvailableSampleTypes;
easygpu.webgpu.GPUTextureBindingLayout.prototype.getAvailableViewDimensions = easygpu.webgpu.GPUTextureBindingLayout.getAvailableViewDimensions;
/**
 * @file GPUBindGroupDescriptor.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPUBindGroupDescriptor = class GPUBindGroupDescriptor extends easygpu.webgpu.GPUObjectDescriptorBase
{
    constructor ( layout, entries = [], label )
    {
        super( label );
        this.layout = layout; //Required GPUBindGroupLayout
        this.entries = entries; //Required sequence<GPUBindGroupEntry>
    }

    setLayout ( layout )
    {
        this.layout = layout;
    }

    setEntries ( entries )
    {
        this.entries = entries;
    }

    static newEntry ( binding, resource )
    {
        return new easygpu.webgpu.GPUBindGroupEntry( binding, resource );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUBindGroupDescriptor";
    }
};
easygpu.webgpu.GPUBindGroupDescriptor.prototype.newEntry = easygpu.webgpu.GPUBindGroupDescriptor.newEntry;
/**
 * @file GPUBindGroupEntry.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPUBindGroupEntry = class GPUBindGroupEntry
{
    constructor ( binding, resource )
    {
        this.binding = binding; //Required GPUIndex32
        this.resource = resource; //Required GPUBindingResource; typedef (GPUSampler or GPUTextureView or GPUBufferBinding or GPUExternalTexture) GPUBindingResource
    }

    setBinding ( binding )
    {
        this.binding = binding;
    }

    setResource ( resource )
    {
        this.resource = resource;
    }

    static newResource_GPUBufferBinding ( buffer, offset, size )
    {
        return new easygpu.webgpu.GPUBufferBinding( buffer, offset, size );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUBindGroupEntry";
    }
};
easygpu.webgpu.GPUBindGroupEntry.prototype.newResource_GPUBufferBinding = easygpu.webgpu.GPUBindGroupEntry.newResource_GPUBufferBinding;
/**
 * @file GPUBufferBinding.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPUBufferBinding = class GPUBufferBinding
{
    constructor ( buffer, offset, size )
    {
        this.buffer = buffer; //Required GPUBuffer
        this.offset = offset; //Optional; GPUSize64; undefined = 0
        this.size = size;//Optional; GPUSize64; The size, in bytes, of the buffer binding. If not provided, specifies the range starting at offset and ending at the end of buffer.
    }

    setBuffer ( buffer )
    {
        this.buffer = buffer;
    }

    setOffset ( offset )
    {
        this.offset = offset;
    }

    setSize ( size )
    {
        this.size = size;
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUBufferBinding";
    }
};
/**
 * @file GPUPipelineLayoutDescriptor.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPUPipelineLayoutDescriptor = class GPUPipelineLayoutDescriptor extends easygpu.webgpu.GPUObjectDescriptorBase
{
    constructor ( bindGroupLayouts = [], label )
    {
        super( label );
        this.bindGroupLayouts = bindGroupLayouts; //Required sequence<GPUBindGroupLayout>
    }

    setBindGroupLayouts ( bindGroupLayouts )
    {
        this.bindGroupLayouts = bindGroupLayouts;
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUPipelineLayoutDescriptor";
    }
};
/**
 * @file GPUShaderModuleDescriptor.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.03
 */
easygpu.webgpu.GPUShaderModuleDescriptor = class GPUShaderModuleDescriptor extends easygpu.webgpu.GPUObjectDescriptorBase
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
/**
 * @file GPUAutoLayoutMode.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
easygpu.webgpu.GPUAutoLayoutMode = class GPUAutoLayoutMode
{
    auto = "auto";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUAutoLayoutMode";
    }
};
/**
 * @file GPUPipelineDescriptorBase.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
easygpu.webgpu.GPUPipelineDescriptorBase = class GPUPipelineDescriptorBase extends easygpu.webgpu.GPUObjectDescriptorBase
{
    constructor ( layout = "auto", label )
    {
        super( label );
        this.layout = layout;
    }

    setLayout ( layout )
    {
        this.layout = layout;
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUPipelineDescriptorBase";
    }
};
/**
 * @file GPUProgrammableStage.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
easygpu.webgpu.GPUProgrammableStage = class GPUProgrammableStage
{
    constructor ( module, entryPoint, constants )
    {
        this.module = module;
        this.entryPoint = entryPoint;
        this.constants = constants; //Optional
    }

    setModule ( module )
    {
        this.module = module;
    }

    setEntryPoint ( entryPoint )
    {
        this.entryPoint = entryPoint;
    }

    setConstants ( constants )
    {
        this.constants = constants;
    }

    static newConstants ( constants )
    {
        class Constants
        {
            constructor ( constants )
            {
                Object.assign( this, constants );
            }

            add ( constants )
            {
                Object.assign( this, constants );
            }
        }
        return new Constants( constants );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUProgrammableStage";
    }
};
easygpu.webgpu.GPUProgrammableStage.prototype.newConstants = easygpu.webgpu.GPUProgrammableStage.newConstants;
/**
 * @file GPURenderPipelineDescriptor.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
easygpu.webgpu.GPURenderPipelineDescriptor = class GPURenderPipelineDescriptor extends easygpu.webgpu.GPUPipelineDescriptorBase
{
    constructor ( layout, vertex, fragment, primitive, depthStencil, multisample, label )
    {
        super( layout, label );
        this.vertex = vertex;
        this.fragment = fragment; //Optional
        this.primitive = primitive; //Optional
        this.depthStencil = depthStencil; //Optional
        this.multisample = multisample; //Optional
        if ( !this.vertex )
        {this.vertex = this.newVrtex();}
    }

    setVrtex ( vertex )
    {
        this.vertex = vertex;
    }

    setPrimitive ( primitive )
    {
        this.primitive = primitive;
    }

    setDepthStencil ( depthStencil )
    {
        this.depthStencil = depthStencil;
    }

    setMultisample ( multisample )
    {
        this.multisample = multisample;
    }

    setFragment ( fragment )
    {
        this.fragment = fragment;
    }

    static newVrtex ( module, entryPoint, constants, buffers )
    {
        return new easygpu.webgpu.GPUVertexState( module, entryPoint, constants, buffers );
    }

    static newFragment ( module, entryPoint, constants, targets )
    {
        return new easygpu.webgpu.GPUFragmentState( module, entryPoint, constants, targets );
    }

    static newPrimitive ( topology, stripIndexFormat, frontFace, cullMode, unclippedDepth )
    {
        return new easygpu.webgpu.GPUPrimitiveState( topology, stripIndexFormat, frontFace, cullMode, unclippedDepth );
    }

    static newDepthStencil ( format, depthWriteEnabled, depthCompare, stencilFront, stencilBack, stencilReadMask, stencilWriteMask, depthBias, depthBiasSlopeScale, depthBiasClamp )
    {
        return new easygpu.webgpu.GPUDepthStencilState( format, depthWriteEnabled, depthCompare, stencilFront, stencilBack, stencilReadMask, stencilWriteMask, depthBias, depthBiasSlopeScale, depthBiasClamp );
    }

    static newMultisample ( count, mask, alphaToCoverageEnabled )
    {
        return new easygpu.webgpu.GPUMultisampleState( count, mask, alphaToCoverageEnabled );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPURenderPipelineDescriptor";
    }
};
easygpu.webgpu.GPURenderPipelineDescriptor.prototype.newVrtex = easygpu.webgpu.GPURenderPipelineDescriptor.newVrtex;
easygpu.webgpu.GPURenderPipelineDescriptor.prototype.newFragment = easygpu.webgpu.GPURenderPipelineDescriptor.newFragment;
easygpu.webgpu.GPURenderPipelineDescriptor.prototype.newPrimitive = easygpu.webgpu.GPURenderPipelineDescriptor.newPrimitive;
easygpu.webgpu.GPURenderPipelineDescriptor.prototype.newDepthStencil = easygpu.webgpu.GPURenderPipelineDescriptor.newDepthStencil;
easygpu.webgpu.GPURenderPipelineDescriptor.prototype.newMultisample = easygpu.webgpu.GPURenderPipelineDescriptor.newMultisample;
/**
 * @file GPUPrimitiveState.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
easygpu.webgpu.GPUPrimitiveState = class GPUPrimitiveState
{
    constructor ( topology, stripIndexFormat, frontFace, cullMode, unclippedDepth )
    {
        this.topology = topology; //Optional
        this.stripIndexFormat = stripIndexFormat; //Optional
        this.frontFace = frontFace; //Optional
        this.cullMode = cullMode; //Optional

        // Requires "depth-clip-control" feature.
        this.unclippedDepth = unclippedDepth; //Optional; boolean; undefined = false; Requires "depth-clip-control" feature.
    }

    setTopology ( topology )
    {
        this.topology = topology;
    }

    setStripIndexFormat ( stripIndexFormat )
    {
        this.stripIndexFormat = stripIndexFormat;
    }

    setFrontFace ( frontFace )
    {
        this.frontFace = frontFace;
    }

    setCullMode ( cullMode )
    {
        this.cullMode = cullMode;
    }

    setUnclippedDepth ( unclippedDepth )
    {
        this.unclippedDepth = unclippedDepth;
    }

    static getAvailableTopologys ()
    {
        return new easygpu.webgpu.GPUPrimitiveTopology();
    }

    static getAvailableStripIndexFormats ()
    {
        return new easygpu.webgpu.GPUIndexFormat();
    }

    static getAvailableFrontFaces ()
    {
        return new easygpu.webgpu.GPUFrontFace();
    }

    static getAvailableCullModes ()
    {
        return new easygpu.webgpu.GPUCullMode();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUPrimitiveState";
    }
};
easygpu.webgpu.GPUPrimitiveState.prototype.getAvailableTopologys = easygpu.webgpu.GPUPrimitiveState.getAvailableTopologys;
easygpu.webgpu.GPUPrimitiveState.prototype.getAvailableStripIndexFormats = easygpu.webgpu.GPUPrimitiveState.getAvailableStripIndexFormats;
easygpu.webgpu.GPUPrimitiveState.prototype.getAvailableFrontFaces = easygpu.webgpu.GPUPrimitiveState.getAvailableFrontFaces;
easygpu.webgpu.GPUPrimitiveState.prototype.getAvailableCullModes = easygpu.webgpu.GPUPrimitiveState.getAvailableCullModes;
/**
 * @file GPUPrimitiveTopology.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
easygpu.webgpu.GPUPrimitiveTopology = class GPUPrimitiveTopology
{
    point_list = "point-list";

    line_list = "line-list";

    line_strip = "line-strip";

    triangle_list = "triangle-list";

    triangle_strip = "triangle-strip";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUPrimitiveTopology";
    }
};
/**
 * @file GPUFrontFace.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
easygpu.webgpu.GPUFrontFace = class GPUFrontFace
{
    ccw = "ccw";

    cw = "cw";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUFrontFace";
    }
};
/**
 * @file GPUCullMode.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
easygpu.webgpu.GPUCullMode = class GPUCullMode
{
    none = "none";

    front = "front";

    back = "back";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUCullMode";
    }
};
/**
 * @file GPUMultisampleState.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPUMultisampleState = class GPUMultisampleState
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
/**
 * @file GPUFragmentState.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
easygpu.webgpu.GPUFragmentState = class GPUFragmentState extends easygpu.webgpu.GPUProgrammableStage
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
        return new easygpu.webgpu.GPUColorTargetState( format, blend, writeMask );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUFragmentState";
    }
};
easygpu.webgpu.GPUFragmentState.prototype.newTarget = easygpu.webgpu.GPUFragmentState.newTarget;
/**
 * @file GPUColorTargetState.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
easygpu.webgpu.GPUColorTargetState  = class GPUColorTargetState
{
    constructor ( format, blend, writeMask )
    {
        this.format = format;
        this.blend = blend; //Optional
        this.writeMask = writeMask; //Optional
    }

    setFormat ( format )
    {
        this.format = format;
    }

    setBlend ( blend )
    {
        this.blend = blend;
    }

    setWriteMask ( writeMask )
    {
        this.writeMask = writeMask;
    }

    static newBlend ( color, alpha )
    {
        return new easygpu.webgpu.GPUBlendState( color, alpha );
    }

    static getAvailableFormats ( device )
    {
        return new easygpu.webgpu.GPUTextureFormat( device );
    }

    static getAvailableWriteMasks ()
    {
        return new easygpu.webgpu.GPUColorWrite();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUColorTargetState";
    }
};
easygpu.webgpu.GPUColorTargetState.prototype.newBlend = easygpu.webgpu.GPUColorTargetState.newBlend;
easygpu.webgpu.GPUColorTargetState.prototype.getAvailableFormats = easygpu.webgpu.GPUColorTargetState.getAvailableFormats;
easygpu.webgpu.GPUColorTargetState.prototype.getAvailableWriteMasks = easygpu.webgpu.GPUColorTargetState.getAvailableWriteMasks;
/**
 * @file GPUBlendState.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
easygpu.webgpu.GPUBlendState = class GPUBlendState
{
    constructor ( color = this.newColor(), alpha = this.newColor() )
    {
        this.color = color;
        this.alpha = alpha;
    }

    setColor ( color )
    {
        this.color = color;
    }

    setAlpha ( alpha )
    {
        this.alpha = alpha;
    }

    static newColor ( operation, srcFactor, dstFactor )
    {
        return new easygpu.webgpu.GPUBlendComponent( operation, srcFactor, dstFactor );
    }

    static newAlpha ( operation, srcFactor, dstFactor )
    {
        return new easygpu.webgpu.GPUBlendComponent( operation, srcFactor, dstFactor );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUBlendState";
    }
};
easygpu.webgpu.GPUBlendState.prototype.newColor = easygpu.webgpu.GPUBlendState.newColor;
easygpu.webgpu.GPUBlendState.prototype.newAlpha = easygpu.webgpu.GPUBlendState.newAlpha;
/**
 * @file GPUColorWrite.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
easygpu.webgpu.GPUColorWrite = class GPUColorWrite
{
    RED = 0x1;

    GREEN = 0x2;

    BLUE = 0x4;

    ALPHA = 0x8;

    ALL = 0xF;

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUColorWrite";
    }
};
/**
 * @file GPUBlendComponent.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
easygpu.webgpu.GPUBlendComponent = class GPUBlendComponent
{
    constructor ( operation, srcFactor, dstFactor )
    {
        this.operation = operation; //Optional
        this.srcFactor = srcFactor; //Optional
        this.dstFactor = dstFactor; //Optional
    }

    setOperation ( operation )
    {
        this.operation = operation;
    }

    setSrcFactor ( srcFactor )
    {
        this.srcFactor = srcFactor;
    }

    setDstFactor ( dstFactor )
    {
        this.dstFactor = dstFactor;
    }

    static getAvailableOperations ()
    {
        return new easygpu.webgpu.GPUBlendOperation();
    }

    static getAvailableSrcFactors ()
    {
        return new easygpu.webgpu.GPUBlendFactor();
    }

    static getAvailableDstFactors ()
    {
        return new easygpu.webgpu.GPUBlendFactor();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUBlendComponent";
    }
};
easygpu.webgpu.GPUBlendComponent.prototype.getAvailableOperations = easygpu.webgpu.GPUBlendComponent.getAvailableOperations;
easygpu.webgpu.GPUBlendComponent.prototype.getAvailableSrcFactors = easygpu.webgpu.GPUBlendComponent.getAvailableSrcFactors;
easygpu.webgpu.GPUBlendComponent.prototype.getAvailableDstFactors = easygpu.webgpu.GPUBlendComponent.getAvailableDstFactors;
/**
 * @file GPUBlendFactor.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
easygpu.webgpu.GPUBlendFactor = class GPUBlendFactor
{
    zero = "zero";

    one = "one";

    src = "src";

    one_minus_src = "one-minus-src";

    src_alpha = "src-alpha";

    one_minus_src_alpha = "one-minus-src-alpha";

    dst = "dst";

    one_minus_dst = "one-minus-dst";

    dst_alpha = "dst-alpha";

    one_minus_dst_alpha = "one-minus-dst-alpha";

    src_alpha_saturated = "src-alpha-saturated";

    constant = "constant";

    one_minus_constant = "one-minus-constant";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUBlendFactor";
    }
};
/**
 * @file GPUBlendOperation.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
easygpu.webgpu.GPUBlendOperation = class GPUBlendOperation
{
    add = "add";

    subtract = "subtract";

    reverse_subtract = "reverse-subtract";

    min = "min";

    max = "max";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUBlendOperation";
    }
};
/**
 * @file GPUDepthStencilState.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
easygpu.webgpu.GPUDepthStencilState = class GPUDepthStencilState
{
    constructor ( format, depthWriteEnabled, depthCompare, stencilFront, stencilBack, stencilReadMask, stencilWriteMask, depthBias, depthBiasSlopeScale, depthBiasClamp )
    {
        this.format = format;
        this.depthWriteEnabled = depthWriteEnabled;
        this.depthCompare = depthCompare;
        this.stencilFront = stencilFront; //Optional
        this.stencilBack = stencilBack; //Optional
        this.stencilReadMask = stencilReadMask; //Optional
        this.stencilWriteMask = stencilWriteMask; //Optional
        this.depthBias = depthBias; //Optional
        this.depthBiasSlopeScale = depthBiasSlopeScale; //Optional
        this.depthBiasClamp = depthBiasClamp; //Optional
    }

    setFormat ( format )
    {
        this.format = format;
    }

    setDepthWriteEnabled ( depthWriteEnabled )
    {
        this.depthWriteEnabled = depthWriteEnabled;
    }

    setDepthCompare ( depthCompare )
    {
        this.depthCompare = depthCompare;
    }

    setStencilFront ( stencilFront )
    {
        this.stencilFront = stencilFront;
    }

    setStencilBack ( stencilBack )
    {
        this.stencilBack = stencilBack;
    }

    setStencilReadMask ( stencilReadMask )
    {
        this.stencilReadMask = stencilReadMask;
    }

    setStencilWriteMask ( stencilWriteMask )
    {
        this.stencilWriteMask = stencilWriteMask;
    }

    setDepthBias ( depthBias )
    {
        this.depthBias = depthBias;
    }

    setDepthBiasSlopeScale ( depthBiasSlopeScale )
    {
        this.depthBiasSlopeScale = depthBiasSlopeScale;
    }

    setDepthBiasClamp ( depthBiasClamp )
    {
        this.depthBiasClamp = depthBiasClamp;
    }

    static newStencilFront ()
    {
        return new easygpu.webgpu.GPUStencilFaceState();
    }

    static newStencilBack ()
    {
        return new easygpu.webgpu.GPUStencilFaceState();
    }

    static getAvailableFormats ( device )
    {
        return new easygpu.webgpu.GPUTextureFormat( device );
    }

    static getAvailableDepthCompares ()
    {
        return new easygpu.webgpu.GPUCompareFunction();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUDepthStencilState";
    }
};
easygpu.webgpu.GPUDepthStencilState.prototype.newStencilFront = easygpu.webgpu.GPUDepthStencilState.newStencilFront;
easygpu.webgpu.GPUDepthStencilState.prototype.newStencilBack = easygpu.webgpu.GPUDepthStencilState.newStencilBack;
easygpu.webgpu.GPUDepthStencilState.prototype.getAvailableFormats = easygpu.webgpu.GPUDepthStencilState.getAvailableFormats;
easygpu.webgpu.GPUDepthStencilState.prototype.getAvailableDepthCompares = easygpu.webgpu.GPUDepthStencilState.getAvailableDepthCompares;
/**
 * @file GPUStencilFaceState.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPUStencilFaceState = class GPUStencilFaceState
{
    constructor ( compare, failOp, depthFailOp, passOp )
    {
        this.compare = compare;//Optional
        this.failOp = failOp;//Optional
        this.depthFailOp = depthFailOp;//Optional
        this.passOp = passOp;//Optional
    }

    setCompare ( compare )
    {
        this.compare = compare;
    }

    setFailOp ( failOp )
    {
        this.failOp = failOp;
    }

    setDepthFailOp ( depthFailOp )
    {
        this.depthFailOp = depthFailOp;
    }

    setPassOp ( passOp )
    {
        this.passOp = passOp;
    }

    static getAvailableCompares ()
    {
        return new easygpu.webgpu.GPUCompareFunction();
    }

    static getAvailableFailOps ()
    {
        return new easygpu.webgpu.GPUStencilOperation();
    }

    static getAvailableDepthFailOps ()
    {
        return new easygpu.webgpu.GPUStencilOperation();
    }

    static getAvailablePassOps ()
    {
        return new easygpu.webgpu.GPUStencilOperation();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUStencilFaceState";
    }
};
easygpu.webgpu.GPUStencilFaceState.prototype.getAvailableCompares = easygpu.webgpu.GPUStencilFaceState.getAvailableCompares;
easygpu.webgpu.GPUStencilFaceState.prototype.getAvailableFailOps = easygpu.webgpu.GPUStencilFaceState.getAvailableFailOps;
easygpu.webgpu.GPUStencilFaceState.prototype.getAvailableDepthFailOps = easygpu.webgpu.GPUStencilFaceState.getAvailableDepthFailOps;
easygpu.webgpu.GPUStencilFaceState.prototype.getAvailablePassOps = easygpu.webgpu.GPUStencilFaceState.getAvailablePassOps;
/**
 * @file GPUStencilOperation.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPUStencilOperation = class GPUStencilOperation
{
    keep = "keep";

    zero = "zero";

    replace = "replace";

    invert = "invert";

    increment_clamp = "increment-clamp";

    decrement_clamp = "decrement-clamp";

    increment_wrap = "increment-wrap";

    decrement_wrap = "decrement-wrap";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUStencilOperation";
    }
};
/**
 * @file GPUIndexFormat.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
easygpu.webgpu.GPUIndexFormat = class GPUIndexFormat
{
    uint16 = "uint16";

    uint32 = "uint32";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUIndexFormat";
    }
};
/**
 * @file GPUVertexFormat.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
easygpu.webgpu.GPUVertexFormat = class GPUVertexFormat
{
    uint8x2 = new String( "uint8x2" );

    uint8x4 = new String( "uint8x4" );

    sint8x2 = new String( "sint8x2" );

    sint8x4 = new String( "sint8x4" );

    unorm8x2 = new String( "unorm8x2" );

    unorm8x4 = new String( "unorm8x4" );

    snorm8x2 = new String( "snorm8x2" );

    snorm8x4 = new String( "snorm8x4" );

    uint16x2 = new String( "uint16x2" );

    uint16x4 = new String( "uint16x4" );

    sint16x2 = new String( "sint16x2" );

    sint16x4 = new String( "sint16x4" );

    unorm16x2 = new String( "unorm16x2" );

    unorm16x4 = new String( "unorm16x4" );

    snorm16x2 = new String( "snorm16x2" );

    snorm16x4 = new String( "snorm16x4" );

    float16x2 = new String( "float16x2" );

    float16x4 = new String( "float16x4" );

    float32 = new String( "float32" );

    float32x2 = new String( "float32x2" );

    float32x3 = new String( "float32x3" );

    float32x4 = new String( "float32x4" );

    uint32 = new String( "uint32" );

    uint32x2 = new String( "uint32x2" );

    uint32x3 = new String( "uint32x3" );

    uint32x4 = new String( "uint32x4" );

    sint32 = new String( "sint32" );

    sint32x2 = new String( "sint32x2" );

    sint32x3 = new String( "sint32x3" );

    sint32x4 = new String( "sint32x4" );

    unorm10_10_10_2 = new String( "unorm10-10-10-2" );

    constructor ()
    {
        this.uint8x2.components = 2;
        this.uint8x2.byteSize = 2;
        this.uint8x4.components = 4;
        this.uint8x4.byteSize = 4;
        this.sint8x2.components = 2;
        this.sint8x2.byteSize = 2;
        this.sint8x4.components = 4;
        this.sint8x4.byteSize = 4;
        this.unorm8x2.components = 2;
        this.unorm8x2.byteSize = 2;
        this.unorm8x4.components = 4;
        this.unorm8x4.byteSize = 4;
        this.snorm8x2.components = 2;
        this.snorm8x2.byteSize = 2;
        this.snorm8x4.components = 4;
        this.snorm8x4.byteSize = 4;
        this.uint16x2.components = 2;
        this.uint16x2.byteSize = 4;
        this.uint16x4.components = 4;
        this.uint16x4.byteSize = 8;
        this.sint16x2.components = 2;
        this.sint16x2.byteSize = 4;
        this.sint16x4.components = 4;
        this.sint16x4.byteSize = 8;
        this.unorm16x2.components = 2;
        this.unorm16x2.byteSize = 4;
        this.unorm16x4.components = 4;
        this.unorm16x4.byteSize = 8;
        this.snorm16x2.components = 2;
        this.snorm16x2.byteSize = 4;
        this.snorm16x4.components = 4;
        this.snorm16x4.byteSize = 8;
        this.float16x2.components = 2;
        this.float16x2.byteSize = 4;
        this.float16x4.components = 4;
        this.float16x4.byteSize = 8;
        this.float32.components = 1;
        this.float32.byteSize = 4;
        this.float32x2.components = 2;
        this.float32x2.byteSize = 8;
        this.float32x3.components = 3;
        this.float32x3.byteSize = 12;
        this.float32x4.components = 4;
        this.float32x4.byteSize = 16;
        this.uint32.components = 1;
        this.uint32.byteSize = 4;
        this.uint32x2.components = 2;
        this.uint32x2.byteSize = 8;
        this.uint32x3.components = 3;
        this.uint32x3.byteSize = 12;
        this.uint32x4.components = 4;
        this.uint32x4.byteSize = 16;
        this.sint32.components = 1;
        this.sint32.byteSize = 4;
        this.sint32x2.components = 2;
        this.sint32x2.byteSize = 8;
        this.sint32x3.components = 3;
        this.sint32x3.byteSize = 12;
        this.sint32x4.components = 4;
        this.sint32x4.byteSize = 16;
        this.unorm10_10_10_2.components = 4;
        this.unorm10_10_10_2.byteSize = 4;
        Object.freeze( this );
    }

    componentsOf ( vertexFormat )
    {
        switch ( vertexFormat )
        {
            case "unorm10-10-10-2":
                return this.unorm10_10_10_2.components;
                break;
            default:
                return this[ vertexFormat ].components;
                break;
        }
    }

    byteSizeOf ( vertexFormat )
    {
        switch ( vertexFormat )
        {
            case "unorm10-10-10-2":
                return this.unorm10_10_10_2.byteSize;
                break;
            default:
                return this[ vertexFormat ].byteSize;
                break;
        }
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUVertexFormat";
    }
};
/**
 * @file GPUVertexStepMode.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
easygpu.webgpu.GPUVertexStepMode = class GPUVertexStepMode
{
    vertex = "vertex";

    instance = "instance";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUVertexStepMode";
    }
};
/**
 * @file GPUVertexState.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
easygpu.webgpu.GPUVertexState = class GPUVertexState extends easygpu.webgpu.GPUProgrammableStage
{
    constructor ( module, entryPoint, constants, buffers = [] )
    {
        super( module, entryPoint, constants );
        this.buffers = buffers; //Optional
    }

    setBuffers ( buffers )
    {
        this.buffers = buffers;
    }

    static newBuffer ( arrayStride, stepMode, attributes )
    {
        return new easygpu.webgpu.GPUVertexBufferLayout( arrayStride, stepMode, attributes );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUVertexState";
    }
};
easygpu.webgpu.GPUVertexState.prototype.newBuffer = easygpu.webgpu.GPUVertexState.newBuffer;
/**
 * @file GPUVertexBufferLayout.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
easygpu.webgpu.GPUVertexBufferLayout = class GPUVertexBufferLayout
{
    constructor ( arrayStride, stepMode, attributes = [] )
    {
        this.arrayStride = arrayStride;
        this.stepMode = stepMode; //Optional
        this.attributes = attributes;
    }

    setArrayStride ( arrayStride )
    {
        this.arrayStride = arrayStride;
    }

    setStepMode ( stepMode )
    {
        this.stepMode = stepMode;
    }

    setAttributes ( attributes )
    {
        this.attributes = attributes;
    }

    static newAttribute ( format, offset, shaderLocation )
    {
        return new easygpu.webgpu.GPUVertexAttribute( format, offset, shaderLocation );
    }

    static getAvailableStepModes ()
    {
        return new easygpu.webgpu.GPUVertexStepMode();
    }
};
easygpu.webgpu.GPUVertexBufferLayout.prototype.newAttribute = easygpu.webgpu.GPUVertexBufferLayout.newAttribute;
easygpu.webgpu.GPUVertexBufferLayout.prototype.newgetAvailableStepModesAttribute = easygpu.webgpu.GPUVertexBufferLayout.getAvailableStepModes;
/**
 * @file GPUVertexAttribute.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.01
 */
easygpu.webgpu.GPUVertexAttribute = class GPUVertexAttribute
{
    constructor ( format, offset, shaderLocation )
    {
        this.format = format;
        this.offset = offset;
        this.shaderLocation = shaderLocation;
    }

    setFormat ( format )
    {
        this.format = format;
    }

    setOffset ( offset )
    {
        this.offset = offset;
    }

    setShaderLocation ( shaderLocation )
    {
        this.shaderLocation = shaderLocation;
    }

    static getAvailableFormats ()
    {
        return new easygpu.webgpu.GPUVertexFormat();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUVertexAttribute";
    }
};
easygpu.webgpu.GPUVertexAttribute.prototype.getAvailableFormats = easygpu.webgpu.GPUVertexAttribute.getAvailableFormats;
/**
 * @file GPURenderPassTimestampWrites.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPURenderPassTimestampWrites = class GPURenderPassTimestampWrites
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
/**
 * @file GPURenderPassDescriptor.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPURenderPassDescriptor = class GPURenderPassDescriptor extends easygpu.webgpu.GPUObjectDescriptorBase
{
    constructor ( colorAttachments = [], depthStencilAttachment, occlusionQuerySet, timestampWrites, maxDrawCount, label )
    {
        super( label );
        this.colorAttachments = colorAttachments; //Required sequence<GPURenderPassColorAttachment?>
        this.depthStencilAttachment = depthStencilAttachment; //Optional; GPURenderPassDepthStencilAttachment
        this.occlusionQuerySet = occlusionQuerySet; //Optional; GPUQuerySet
        this.timestampWrites = timestampWrites; //Optional; GPURenderPassTimestampWrites
        this.maxDrawCount = maxDrawCount; //Optional; GPUSize64; undefined = 50000000
    }

    setColorAttachments ( colorAttachments )
    {
        this.colorAttachments = colorAttachments;
    }

    setDepthStencilAttachment ( depthStencilAttachment )
    {
        this.depthStencilAttachment = depthStencilAttachment;
    }

    setOcclusionQuerySet ( occlusionQuerySet )
    {
        this.occlusionQuerySet = occlusionQuerySet;
    }

    setTimestampWrites ( timestampWrites )
    {
        this.timestampWrites = timestampWrites;
    }

    setMaxDrawCount ( maxDrawCount )
    {
        this.maxDrawCount = maxDrawCount;
    }

    static newColorAttachment ()
    {
        return new easygpu.webgpu.GPURenderPassColorAttachment();
    }

    static newDepthStencilAttachment ()
    {
        return new easygpu.webgpu.GPURenderPassDepthStencilAttachment();
    }

    static newTimestampWrites ()
    {
        return new easygpu.webgpu.GPURenderPassTimestampWrites();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPURenderPassDescriptor";
    }
};
easygpu.webgpu.GPURenderPassDescriptor.prototype.newColorAttachment = easygpu.webgpu.GPURenderPassDescriptor.newColorAttachment;
easygpu.webgpu.GPURenderPassDescriptor.prototype.newDepthStencilAttachment = easygpu.webgpu.GPURenderPassDescriptor.newDepthStencilAttachment;
easygpu.webgpu.GPURenderPassDescriptor.prototype.newTimestampWrites = easygpu.webgpu.GPURenderPassDescriptor.newTimestampWrites;
/**
 * @file GPURenderPassColorAttachment.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPURenderPassColorAttachment = class GPURenderPassColorAttachment
{
    constructor ( view, depthSlice, resolveTarget, clearValue, loadOp, storeOp )
    {
        this.view = view; //Required GPUTextureView
        this.depthSlice = depthSlice; //GPUIntegerCoordinate
        this.resolveTarget = resolveTarget; //Optional; GPUTextureView
        this.clearValue = clearValue; //Optional; GPUColor; default = {r: 0, g: 0, b: 0, a: 0}
        this.loadOp = loadOp; //Required GPULoadOp
        this.storeOp = storeOp; //Required GPUStoreOp
    }

    setView ( view )
    {
        this.view = view;
    }

    setDepthSlice ( depthSlice )
    {
        this.depthSlice = depthSlice;
    }

    setResolveTarget ( resolveTarget )
    {
        this.resolveTarget = resolveTarget;
    }

    setClearValue ( clearValue )
    {
        this.clearValue = clearValue;
    }

    setLoadOp ( loadOp )
    {
        this.loadOp = loadOp;
    }

    setStoreOp ( storeOp )
    {
        this.storeOp = storeOp;
    }

    static newClearValue ( r, g, b, a )
    {
        return new easygpu.webgpu.GPUColorDict( r, g, b, a );
    }

    static getAvailableLoadOps ()
    {
        return new easygpu.webgpu.GPULoadOp();
    }

    static getAvailableStoreOps ()
    {
        return new easygpu.webgpu.GPUStoreOp();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPURenderPassColorAttachment";
    }
};
easygpu.webgpu.GPURenderPassColorAttachment.prototype.newClearValue = easygpu.webgpu.GPURenderPassColorAttachment.newClearValue;
easygpu.webgpu.GPURenderPassColorAttachment.prototype.getAvailableLoadOps = easygpu.webgpu.GPURenderPassColorAttachment.getAvailableLoadOps;
easygpu.webgpu.GPURenderPassColorAttachment.prototype.getAvailableStoreOps = easygpu.webgpu.GPURenderPassColorAttachment.getAvailableStoreOps;
/**
 * @file GPURenderPassDepthStencilAttachment.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPURenderPassDepthStencilAttachment = class GPURenderPassDepthStencilAttachment
{
    constructor ( view, depthClearValue, depthLoadOp, depthStoreOp, depthReadOnly, stencilClearValue, stencilLoadOp, stencilStoreOp, stencilReadOnly )
    {
        this.view = view; //Required GPUTextureView;
        this.depthClearValue = depthClearValue; //Optional; float
        this.depthLoadOp = depthLoadOp; //Optional; GPULoadOp
        this.depthStoreOp = depthStoreOp; //Optional; GPUStoreOp
        this.depthReadOnly = depthReadOnly; //Optional; boolean; default = false
        this.stencilClearValue = stencilClearValue; //Optional; GPUStencilValue; default =0
        this.stencilLoadOp = stencilLoadOp; //Optional; GPULoadOp
        this.stencilStoreOp = stencilStoreOp; //Optional; GPUStoreOp
        this.stencilReadOnly = stencilReadOnly; //Optional; boolean; default = false
    }

    setView ( view )
    {
        this.view = view;
    }

    setDepthClearValue ( depthClearValue )
    {
        this.depthClearValue = depthClearValue;
    }

    setDepthLoadOp ( depthLoadOp )
    {
        this.depthLoadOp = depthLoadOp;
    }

    setDepthStoreOp ( depthStoreOp )
    {
        this.depthStoreOp = depthStoreOp;
    }

    setDepthReadOnly ( depthReadOnly )
    {
        this.depthReadOnly = depthReadOnly;
    }

    setStencilClearValue ( stencilClearValue )
    {
        this.stencilClearValue = stencilClearValue;
    }

    setStencilLoadOp ( stencilLoadOp )
    {
        this.stencilLoadOp = stencilLoadOp;
    }

    setStencilStoreOp ( stencilStoreOp )
    {
        this.stencilStoreOp = stencilStoreOp;
    }

    setStencilReadOnly ( stencilReadOnly )
    {
        this.stencilReadOnly = stencilReadOnly;
    }

    static getAvailableDepthLoadOps ()
    {
        return new easygpu.webgpu.GPULoadOp();
    }

    static getAvailableDepthStoreOps ()
    {
        return new easygpu.webgpu.GPUStoreOp();
    }

    static getAvailableStencilLoadOps ()
    {
        return new easygpu.webgpu.GPULoadOp();
    }

    static getAvailableStencilStoreOps ()
    {
        return new easygpu.webgpu.GPUStoreOp();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPURenderPassDepthStencilAttachment";
    }
};
easygpu.webgpu.GPURenderPassDepthStencilAttachment.prototype.getAvailableDepthLoadOps = easygpu.webgpu.GPURenderPassDepthStencilAttachment.getAvailableDepthLoadOps;
easygpu.webgpu.GPURenderPassDepthStencilAttachment.prototype.getAvailableDepthStoreOps = easygpu.webgpu.GPURenderPassDepthStencilAttachment.getAvailableDepthStoreOps;
easygpu.webgpu.GPURenderPassDepthStencilAttachment.prototype.getAvailableStencilLoadOps = easygpu.webgpu.GPURenderPassDepthStencilAttachment.getAvailableStencilLoadOps;
easygpu.webgpu.GPURenderPassDepthStencilAttachment.prototype.getAvailableStencilStoreOps = easygpu.webgpu.GPURenderPassDepthStencilAttachment.getAvailableStencilStoreOps;
/**
 * @file GPULoadOp.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPULoadOp = class GPULoadOp
{
    load = "load";

    clear = "clear";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPULoadOp";
    }
};
/**
 * @file  GPUStoreOp.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu. GPUStoreOp = class  GPUStoreOp
{
    load = "store";

    discard = "discard";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return " GPUStoreOp";
    }
};
/**
 * @file GPURenderPassLayout.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPURenderPassLayout = class GPURenderPassLayout extends easygpu.webgpu.GPUObjectDescriptorBase
{
    constructor ( colorFormats = [], depthStencilFormat, sampleCount, label )
    {
        super( label );
        this.colorFormats = colorFormats; //Required sequence<GPUTextureFormat?>
        this.depthStencilFormat = depthStencilFormat; //Optional; GPUTextureFormat
        this.sampleCount = sampleCount; //Optional; GPUSize32; undefined = 1
    }

    setColorFormats ( colorFormats )
    {
        this.colorFormats = colorFormats;
    }

    setDepthStencilFormat ( depthStencilFormat )
    {
        this.depthStencilFormat = depthStencilFormat;
    }

    setSampleCount ( sampleCount )
    {
        this.sampleCount = sampleCount;
    }

    static getAvailableColorFormats ( device )
    {
        return new easygpu.webgpu.GPUTextureFormat( device );
    }

    static getAvailableDepthStencilFormats ( device )
    {
        return new easygpu.webgpu.GPUTextureFormat( device );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPURenderPassLayout";
    }
};
easygpu.webgpu.GPURenderPassLayout.prototype.getAvailableColorFormats = easygpu.webgpu.GPURenderPassLayout.getAvailableColorFormats;
easygpu.webgpu.GPURenderPassLayout.prototype.getAvailableDepthStencilFormats = easygpu.webgpu.GPURenderPassLayout.getAvailableDepthStencilFormats;
/**
 * @file GPURenderBundleDescriptor.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.03
 */
easygpu.webgpu.GPURenderBundleDescriptor = class GPURenderBundleDescriptor extends easygpu.webgpu.GPUObjectDescriptorBase
{
    constructor ( label )
    {
        super( label );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPURenderBundleDescriptor";
    }
};
/**
 * @file GPURenderBundleEncoderDescriptor.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.03
 */
easygpu.webgpu.GPURenderBundleEncoderDescriptor = class GPURenderBundleEncoderDescriptor extends easygpu.webgpu.GPURenderPassLayout
{
    constructor ( colorFormats = [], depthStencilFormat, sampleCount, depthReadOnly, stencilReadOnly, label )
    {
        super( colorFormats, depthStencilFormat, sampleCount, label );
        this.depthStencilFormat = depthStencilFormat; //Optional; boolean; undefined = false
        this.sampleCount = sampleCount; //Optional; boolean; undefined = false
    }

    setDepthStencilFormat ( depthStencilFormat )
    {
        this.depthStencilFormat = depthStencilFormat;
    }

    setSampleCount ( sampleCount )
    {
        this.sampleCount = sampleCount;
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPURenderBundleEncoderDescriptor";
    }
};
/**
 * @file GPUQuerySetDescriptor.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPUQuerySetDescriptor = class GPUQuerySetDescriptor extends easygpu.webgpu.GPUObjectDescriptorBase
{
    constructor ( type, count, label )
    {
        super( label );
        this.type = type; //Required GPUQueryType
        this.count = count; //Required GPUSize32
    }

    setType ( type )
    {
        this.type = type;
    }

    setCount ( count )
    {
        this.count = count;
    }

    static getAvailableTypes ()
    {
        return new easygpu.webgpu.GPUQueryType();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUQuerySetDescriptor";
    }
};
easygpu.webgpu.GPUQuerySetDescriptor.prototype.getAvailableTypes = easygpu.webgpu.GPUQuerySetDescriptor.getAvailableTypes;
/**
 * @file GPUQueryType.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPUQueryType = class GPUQueryType
{
    occlusion = "occlusion";

    timestamp = "timestamp";

    constructor ()
    {
        Object.freeze( this );
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUQueryType";
    }
};
/**
 * @file GPUColorDict.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPUColorDict = class GPUColorDict
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
/**
 * @file GPUExtent3DDict.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
easygpu.webgpu.GPUExtent3DDict = class GPUExtent3DDict
{
    constructor ( width, height, depthOrArrayLayers )
    {
        this.width = width; //Required GPUIntegerCoordinate
        this.height = height; //Optional; GPUIntegerCoordinate; undefined = 1
        this.depthOrArrayLayers = depthOrArrayLayers; //Optional; GPUIntegerCoordinate; undefined = 1
    }

    setWidth ( width )
    {
        this.width = width;
    }

    setHeight ( height )
    {
        this.height = height;
    }

    setDepthOrArrayLayers ( depthOrArrayLayers )
    {
        this.depthOrArrayLayers = depthOrArrayLayers;
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUExtent3DDict";
    }
};