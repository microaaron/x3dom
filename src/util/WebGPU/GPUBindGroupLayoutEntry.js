/**
 * @file GPUBindGroupLayoutEntry.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.02
 */
x3dom.WebGPU.GPUBindGroupLayoutEntry = class GPUBindGroupLayoutEntry
{
    constructor ( binding, visibility, resourceLayoutObject )
    {
        this.binding = binding; //Required GPUIndex32
        this.visibility = visibility; //Required GPUShaderStageFlag(s)
        //An object that defines the required binding resource type and structure of the GPUBindGroup entry corresponding to this entry. This property can be one of buffer, externalTexture, sampler, storageTexture, or texture.
        if ( resourceLayoutObject instanceof x3dom.WebGPU.GPUBufferBindingLayout )
        {
            this.buffer = resourceLayoutObject;
        }
        else if ( resourceLayoutObject instanceof x3dom.WebGPU.GPUSamplerBindingLayout )
        {
            this.sampler = resourceLayoutObject;
        }
        else if ( resourceLayoutObject instanceof x3dom.WebGPU.GPUTextureBindingLayout )
        {
            this.texture = resourceLayoutObject;
        }
        else if ( resourceLayoutObject instanceof x3dom.WebGPU.GPUStorageTextureBindingLayout )
        {
            this.storageTexture = resourceLayoutObject;
        }
        else if ( resourceLayoutObject instanceof x3dom.WebGPU.GPUExternalTextureBindingLayout )
        {
            this.externalTexture = resourceLayoutObject;
        }
        else if ( resourceLayoutObject instanceof x3dom.WebGPU.GPUExternalTextureBindingLayout )
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

    newBuffer ( type, hasDynamicOffset, minBindingSize )
    {
        return new x3dom.WebGPU.GPUBufferBindingLayout( type, hasDynamicOffset, minBindingSize );
    }

    newSampler ( type )
    {
        return new x3dom.WebGPU.GPUSamplerBindingLayout( type );
    }

    newTexture ( sampleType, viewDimension, multisampled )
    {
        return new x3dom.WebGPU.GPUTextureBindingLayout( sampleType, viewDimension, multisampled );
    }

    newStorageTexture ( access, format, viewDimension )
    {
        return new x3dom.WebGPU.GPUStorageTextureBindingLayout( access, format, viewDimension );
    }

    newExternalTexture ()
    {
        return new x3dom.WebGPU.GPUExternalTextureBindingLayout();
    }

    getAvailableVisibilities ()
    {
        return new x3dom.WebGPU.GPUShaderStage();
    }

    get [ Symbol.toStringTag ] ()
    {
        return "GPUBindGroupLayoutEntry";
    }
};