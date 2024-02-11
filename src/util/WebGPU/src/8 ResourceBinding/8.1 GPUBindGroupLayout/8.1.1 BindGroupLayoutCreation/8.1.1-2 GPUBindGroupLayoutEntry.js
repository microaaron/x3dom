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
            return this;
        }
        if ( resourceLayoutObject instanceof x3dom.WebGPU.GPUSamplerBindingLayout )
        {
            this.sampler = resourceLayoutObject;
            return this;
        }
        if ( resourceLayoutObject instanceof x3dom.WebGPU.GPUTextureBindingLayout )
        {
            this.texture = resourceLayoutObject;
            return this;
        }
        if ( resourceLayoutObject instanceof x3dom.WebGPU.GPUStorageTextureBindingLayout )
        {
            this.storageTexture = resourceLayoutObject;
            return this;
        }
        if ( resourceLayoutObject instanceof x3dom.WebGPU.GPUExternalTextureBindingLayout )
        {
            this.externalTexture = resourceLayoutObject;
            return this;
        }
        if ( resourceLayoutObject instanceof x3dom.WebGPU.GPUExternalTextureBindingLayout )
        {
            this.externalTexture = resourceLayoutObject;
            return this;
        }
        //e.g. {buffer:{...}}
        if ( resourceLayoutObject instanceof Object )
        {
            if ( resourceLayoutObject.buffer instanceof Object )
            {
                this.buffer = resourceLayoutObject.buffer;
                return this;
            }
            if ( resourceLayoutObject.sampler instanceof Object )
            {
                this.sampler = resourceLayoutObject.sampler;
                return this;
            }
            if ( resourceLayoutObject.texture instanceof Object )
            {
                this.texture = resourceLayoutObject.texture;
                return this;
            }
            if ( resourceLayoutObject.storageTexture instanceof Object )
            {
                this.storageTexture = resourceLayoutObject.storageTexture;
                return this;
            }
            if ( resourceLayoutObject.externalTexture instanceof Object )
            {
                this.externalTexture = resourceLayoutObject.externalTexture;
                return this;
            }
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

    newBuffer ()
    {
        return new x3dom.WebGPU.GPUBufferBindingLayout();
    }

    newSampler ()
    {
        return new x3dom.WebGPU.GPUSamplerBindingLayout();
    }

    newTexture ()
    {
        return new x3dom.WebGPU.GPUTextureBindingLayout();
    }

    newStorageTexture ()
    {
        return new x3dom.WebGPU.GPUStorageTextureBindingLayout();
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