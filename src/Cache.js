/**
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * Dual licensed under the MIT and GPL
 *
 * Based on code originally provided by
 * Philip Taylor: http://philip.html5.org
 */

/**
 * Cache Constructor
 *
 * @constructor
 */
x3dom.Cache = function ()
{
    this.textures = [];
    this.shaders = [];
    this.passResources = {};
};

/**
 * Returns a Texture 2D
 *
 * @param gl
 * @param doc
 * @param url
 * @param bgnd
 * @param crossOrigin
 * @param scale
 * @param genMipMaps
 *
 * @returns {*}
 */
x3dom.Cache.prototype.getTexture2D = function ( gl, doc, url, bgnd, crossOrigin, scale, genMipMaps, flipY, tex )
{
    var textureIdentifier = url;

    if ( this.textures[ textureIdentifier ] === undefined )
    {
        this.textures[ textureIdentifier ] = x3dom.Utils.createTexture2D(
            gl, doc, url, bgnd, crossOrigin, scale, genMipMaps, flipY, tex );
    }

    return this.textures[ textureIdentifier ];
};

/**
 * Returns a Texture 2D
 *
 * @param gl
 * @param nameSpace
 * @param def
 *
 * @returns {*}
 */
x3dom.Cache.prototype.getTexture2DByDEF = function ( gl, nameSpace, def )
{
    var textureIdentifier = nameSpace.name + "_" + def;

    if ( this.textures[ textureIdentifier ] === undefined )
    {
        this.textures[ textureIdentifier ] = gl.createTexture();
    }

    return this.textures[ textureIdentifier ];
};

/**
 * Returns a Cube Texture
 *
 * @param gl
 * @param doc
 * @param url
 * @param bgnd
 * @param crossOrigin
 * @param scale
 * @param genMipMaps
 *
 * @returns {*}
 */
x3dom.Cache.prototype.getTextureCube = function ( gl, doc, url, bgnd, crossOrigin, scale, genMipMaps, flipY )
{
    var textureIdentifier = "";

    for ( var i = 0; i < url.length; ++i )
    {
        textureIdentifier += url[ i ] + "|";
    }

    if ( this.textures[ textureIdentifier ] === undefined )
    {
        this.textures[ textureIdentifier ] = x3dom.Utils.createTextureCube(
            gl, doc, url, bgnd, crossOrigin, scale, genMipMaps, flipY );
    }

    return this.textures[ textureIdentifier ];
};

/**
 * Returns one of the default shader programs
 *
 * @param gl
 * @param shaderIdentifier
 *
 * @returns {*}
 */
x3dom.Cache.prototype.getShader = function ( gl, shaderIdentifier )
{
    var program = null;

    // Check if shader is in cache
    if ( this.shaders[ shaderIdentifier ] === undefined )
    {
        // Choose shader based on identifier
        switch ( shaderIdentifier )
        {
            case x3dom.shader.PICKING:
                program = new x3dom.shader.PickingShader( gl );
                break;
            case x3dom.shader.PICKING_24:
                program = new x3dom.shader.Picking24Shader( gl );
                break;
            case x3dom.shader.PICKING_ID:
                program = new x3dom.shader.PickingIdShader( gl );
                break;
            case x3dom.shader.PICKING_COLOR:
                program = new x3dom.shader.PickingColorShader( gl );
                break;
            case x3dom.shader.PICKING_TEXCOORD:
                program = new x3dom.shader.PickingTexcoordShader( gl );
                break;
            case x3dom.shader.FRONTGROUND_TEXTURE:
                program = new x3dom.shader.FrontgroundTextureShader( gl );
                break;
            case x3dom.shader.BACKGROUND_TEXTURE:
                program = new x3dom.shader.BackgroundTextureShader( gl );
                break;
            case x3dom.shader.BACKGROUND_SKYTEXTURE:
                program = new x3dom.shader.BackgroundSkyTextureShader( gl );
                break;
            case x3dom.shader.BACKGROUND_CUBETEXTURE:
                program = new x3dom.shader.BackgroundCubeTextureShader( gl );
                break;
            case x3dom.shader.BACKGROUND_CUBETEXTURE_DDS:
                program = new x3dom.shader.BackgroundCubeTextureDDSShader( gl );
                break;
            case x3dom.shader.SHADOW:
                program = new x3dom.shader.ShadowShader( gl );
                break;
            case x3dom.shader.BLUR:
                program = new x3dom.shader.BlurShader( gl );
                break;
            case x3dom.shader.DEPTH:
                // program = new x3dom.shader.DepthShader(gl);
                break;
            case x3dom.shader.NORMAL:
                program = new x3dom.shader.NormalShader( gl );
                break;
            case x3dom.shader.TEXTURE_REFINEMENT:
                program = new x3dom.shader.TextureRefinementShader( gl );
                break;
            default:
                break;
        }

        if ( program )
        {
            this.shaders[ shaderIdentifier ] = x3dom.Utils.wrapProgram( gl, program, shaderIdentifier );
        }
        else
        {
            x3dom.debug.logError( "Couldn't create shader: " + shaderIdentifier );
        }
    }

    return this.shaders[ shaderIdentifier ];
};

/**
 * Returns a dynamic generated shader program by viewarea and shape
 *
 * @param gl
 * @param viewarea
 * @param shape
 */
x3dom.Cache.prototype.getDynamicShader = function ( gl, viewarea, shape )
{
    // Generate Properties
    var properties = x3dom.Utils.generateProperties( viewarea, shape );

    var shaderID = properties.id;

    if ( this.shaders[ shaderID ] === undefined )
    {
        var program = null;
        if ( properties.CSHADER != -1 )
        {
            program = new x3dom.shader.ComposedShader( gl, shape );
        }
        else
        {
            program = new x3dom.shader.DynamicShader( gl, properties );
        }
        this.shaders[ shaderID ] = x3dom.Utils.wrapProgram( gl, program, shaderID );
    }

    return this.shaders[ shaderID ];
};

/**
 * Returns a dynamic generated shader program by properties
 *
 * @param context
 * @param shape
 * @param properties
 * @param pickMode
 * @param shadows
 */
x3dom.Cache.prototype.getShaderByProperties = function ( context, shape, properties, pickMode, shadows )
{
    // Get shaderID
    var id = properties.id;

    if ( pickMode !== undefined && pickMode !== null )
    {
        shaderID += pickMode;
    }

    if ( shadows !== undefined && shadows !== null )
    {
        shaderID += "S";
    }

    if ( this.passResources[ id ] === undefined )
    {
        var program = null;

        if ( pickMode !== undefined && pickMode !== null )
        {
            program = new x3dom.shader.DynamicShaderPicking( context, properties, pickMode );
        }
        else if ( shadows !== undefined && shadows !== null )
        {
            program = new x3dom.shader.DynamicShadowShader( context, properties );
        }
        else if ( properties.CSHADER != -1 )
        {
            program = new x3dom.shader.ComposedShader( context, shape );
        }
        else if ( properties.KHR_MATERIAL_COMMONS != null && properties.KHR_MATERIAL_COMMONS != 0 )
        {
            program = new x3dom.shader.KHRMaterialCommonsShader( context, properties );
        }
        else if ( properties.EMPTY_SHADER != null && properties.EMPTY_SHADER != 0 )
        {
            return { "shaderID": shaderID };
        }
        else
        {
            //program = new x3dom.shader.DynamicShader( context, properties );
            this.passResources[ id ] = x3dom.shader.DynamicShader( context, properties );
            this.passResources[ id ].id = id;
        }

        //this.shaders[ shaderID ] = x3dom.Utils.wrapProgram( context, program, shaderID );
    }

    //return this.shaders[ shaderID ];
    return this.passResources[ id ];
};

/**
 * Returns the dynamically created shadow rendering shader
 *
 * @param gl
 * @param shadowedLights
 *
 * @returns {*}
 */
x3dom.Cache.prototype.getShadowRenderingShader = function ( gl, shadowedLights, properties )
{
    var ID = "shadow"  + Object.values( properties ).join( "" );
    for ( var i = 0; i < shadowedLights.length; i++ )
    {
        if ( x3dom.isa( shadowedLights[ i ], x3dom.nodeTypes.SpotLight ) )
        {
            ID += "S";
        }
        else if ( x3dom.isa( shadowedLights[ i ], x3dom.nodeTypes.PointLight ) )
        {
            ID += "P";
        }
        else
        {
            ID += "D";
        }
    }

    if ( this.shaders[ ID ] === undefined )
    {
        var program = new x3dom.shader.ShadowRenderingShader( gl, shadowedLights, properties );
        this.shaders[ ID ] = x3dom.Utils.wrapProgram( gl, program, ID );
    }
    return this.shaders[ ID ];
};

/**
 * Release texture and shader resources
 *
 * @param gl
 * @constructor
 */
x3dom.Cache.prototype.Release = function ( gl )
{
    for ( var texture in this.textures )
    {
        gl.deleteTexture( this.textures[ texture ] );
    }
    this.textures = [];

    for ( var shaderId in this.shaders )
    {
        var shader = this.shaders[ shaderId ];
        var glShaders = gl.getAttachedShaders( shader.program );
        for ( var i = 0; i < glShaders.length; ++i )
        {
            gl.detachShader( shader.program, glShaders[ i ] );
            gl.deleteShader( glShaders[ i ] );
        }
        gl.deleteProgram( shader.program );
    }
    this.shaders = [];
};
