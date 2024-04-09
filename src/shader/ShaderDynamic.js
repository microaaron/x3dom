/*
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
 * Generate the final Shader program
 */
/*x3dom.shader.DynamicShader = function ( ctx3d, properties )
{
    this.program = ctx3d.createProgram();

    var vertexShader     = this.generateVertexShader( ctx3d, properties, x3dom.caps.WEBGL_VERSION );
    var fragmentShader   = this.generateFragmentShader( ctx3d, properties, x3dom.caps.WEBGL_VERSION );

    ctx3d.attachShader( this.program, vertexShader );
    ctx3d.attachShader( this.program, fragmentShader );

    // optional, but position should be at location 0 for performance reasons
    ctx3d.bindAttribLocation( this.program, 0, `position` );

    ctx3d.linkProgram( this.program );

    return this.program;
};*/

var BindingListArray = class BindingListArray extends Array
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
                /*if ( !bindingList.bindGroupLayout )
              {
                  bindingList.createBindGroupLayout( device );
              }*/
                //this.bindGroupLayouts.push( bindingList.bindGroupLayout );
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
        addBindingParams ( name, wgslType, visibility, resourceLayoutObject, size )
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
BindingListArray.prototype.newBindingParamsList = BindingListArray.newBindingParamsList;

var VertexListArray = class VertexListArray extends Array
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
VertexListArray.prototype.newVertexParamsList = VertexListArray.newVertexParamsList;

var shaderModuleInputOutputList = class ShaderModuleInputOutputList extends Array
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

x3dom.shader.DynamicShader = function ( context, properties )
{
    var bindingListArray = new BindingListArray();
    var vertexListArray = new VertexListArray();

    var vertexOutputList = new shaderModuleInputOutputList();
    var fragmentOutputList = new shaderModuleInputOutputList();

    var bindingParamsList0 = bindingListArray.newBindingParamsList()
        .addBindingParams( `modelMatrix`, `mat4x4<f32>`, GPUShaderStage.VERTEX, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
        .addBindingParams( `modelViewMatrix`, `mat4x4<f32>`, GPUShaderStage.VERTEX, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
        .addBindingParams( `modelViewProjectionMatrix`, `mat4x4<f32>`, GPUShaderStage.VERTEX, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
        .addBindingParams( `modelViewMatrix2`, `mat4x4<f32>`, GPUShaderStage.VERTEX, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
        .addBindingParams( `modelViewProjectionMatrix2`, `mat4x4<f32>`, GPUShaderStage.VERTEX, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
        //.addBindingParams( `isVR`, `u32`, GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
        .addBindingParams( `screenWidth`, `f32`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
        .addBindingParams( `cameraPosWS`, `vec3<f32>`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
        .addBindingParams( `alphaCutoff`, `f32`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )

        .addBindingParams( `diffuseColor`, `vec3<f32>`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
        .addBindingParams( `specularColor`, `vec3<f32>`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
        .addBindingParams( `emissiveColor`, `vec3<f32>`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
        .addBindingParams( `shininess`, `f32`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
        .addBindingParams( `transparency`, `f32`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
        .addBindingParams( `ambientIntensity`, `f32`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
        .addBindingParams( `numberOfLights`, `u32`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) );

    //Positions
    //var vertexParamsList0 = vertexListArray.newVertexParamsList();
    if ( properties.POSCOMPONENTS == 3 )
    {
        vertexListArray.addVertexList( vertexListArray.newVertexParamsList().addVertexParams( `position`, `vec3<f32>`, `float32x3` ).createVertexList() );
    }
    else if ( properties.POSCOMPONENTS == 4 )
    {
        vertexListArray.addVertexList( vertexListArray.newVertexParamsList().addVertexParams( `position`, `vec4<f32>`, `float32x4` ).createVertexList() );
    }
    //PG stuff

    //Normals
    if ( properties.LIGHTS || properties.PBR_MATERIAL )
    {
        if ( properties.NORMALMAP && properties.NORMALSPACE == "OBJECT" )
        {
        //do nothing
        }
        else
        {
            vertexOutputList.add( `fragNormal`, `vec3<f32>` );
            bindingParamsList0.addBindingParams( `normalMatrix`, `mat4x4<f32>`, GPUShaderStage.VERTEX, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
                .addBindingParams( `normalMatrix2`, `mat4x4<f32>`, GPUShaderStage.VERTEX, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) );

            if ( properties.NORCOMPONENTS == 2 )
            {
                if ( properties.POSCOMPONENTS != 4 )
                {
                    vertexListArray.addVertexList( vertexListArray.newVertexParamsList().addVertexParams( `normal`, `vec2<f32>`, `float32x2` ).createVertexList() );
                }
            }
            else if ( properties.NORCOMPONENTS == 3 )
            {
                vertexListArray.addVertexList( vertexListArray.newVertexParamsList().addVertexParams( `normal`, `vec3<f32>`, `float32x3` ).createVertexList() );
            }
        }
    }

    //Init Colors. In the vertex shader we do not compute any color so
    //is is safe to ignore gamma here.
    if ( properties.VERTEXCOLOR )
    {
        if ( properties.COLCOMPONENTS == 3 )
        {
            vertexListArray.addVertexList( vertexListArray.newVertexParamsList().addVertexParams( `color`, `vec3<f32>`, `float32x3` ).createVertexList() );
            vertexOutputList.add( `fragColor`, `vec3<f32>` );
        }
        else if ( properties.COLCOMPONENTS == 4 )
        {
            vertexListArray.addVertexList( vertexListArray.newVertexParamsList().addVertexParams( `color`, `vec4<f32>`, `float32x4` ).createVertexList() );
            vertexOutputList.add( `fragColor`, `vec4<f32>` );
        }
    }

    //Textures

    //Lights & Fog
    if ( properties.LIGHTS || properties.FOG || properties.CLIPPLANES || properties.POINTPROPERTIES )
    {
        bindingParamsList0.addBindingParams( `eyePosition`, `vec3<f32>`, GPUShaderStage.VERTEX, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
            .addBindingParams( `isOrthoView`, `u32`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) );
        vertexOutputList.add( `fragPosition`, `vec4<f32>` );
        vertexOutputList.add( `fragPositionWS`, `vec4<f32>` );
        if ( properties.FOG )
        {
            vertexOutputList.add( `fragEyePosition`, `vec3<f32>` );
        }
    }

    //Bounding Boxes

    fragmentShaderModuleDeclarationCode = ``;

    //Material
    bindingParamsList0.addBindingParams( `tonemappingOperator`, `f32`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) );
    fragmentShaderModuleDeclarationCode +=
`fn tonemapReinhard(color: vec3<f32>)->vec3<f32>{
  return color / (color + vec3(1.0));
}
fn uncharted2Tonemap(color: vec3<f32>)->vec3<f32>{
  var A: f32 = 0.15;
  var B: f32 = 0.50;
  var C: f32 = 0.10;
  var D: f32 = 0.20;
  var E: f32 = 0.02;
  var F: f32 = 0.30;
  return ((color*(A*color+C*B)+D*E)/(color*(A*color+B)+D*F))-E/F;
}
fn tonemapUncharted2(color: vec3<f32>)->vec3<f32>{
  var W: f32 = 11.2;
  var exposureBias: f32 = 2.0;
  var curr: vec3<f32> = uncharted2Tonemap(exposureBias * color);
  var whiteScale: vec3<f32> = 1.0 / uncharted2Tonemap(vec3<f32>(W));
  return curr * whiteScale;
}
fn tonemapeFilmic(color: vec3<f32>)->vec3<f32>{
  var a: f32 = 2.51;
  var b: f32 = 0.03;
  var c: f32 = 2.43;
  var d: f32 = 0.59;
  var e: f32 = 0.14;
  return clamp((color * (a * color + b)) / (color * (c * color + d ) + e), vec3(0.0,0.0,0.0), vec3(1.0,1.0,1.0));
}
fn tonemap(color: vec3<f32>)->vec3<f32>{
  if(tonemappingOperator == 0.0) {
    return color;
  }
  if(tonemappingOperator == 1.0) {
    return tonemapReinhard(color);
  }
  if(tonemappingOperator == 2.0) {
    return tonemapUncharted2(color);
  }
  if(tonemappingOperator == 3.0) {
    return tonemapeFilmic(color);
  }
  return color;
}`;
    //Colors
    //VertexID
    //Textures

    // same as vertex shader but with fragPositionWS for fogNoise (w/ or w/out lights)
    /*if ( properties.LIGHTS || properties.FOG || properties.CLIPPLANES )
    {
        bindingParamsList0.addBindingParams( `isOrthoView`, `f32`, GPUShaderStage.VERTEX, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) );
    }*/

    //Lights
    fragmentShaderModuleDeclarationCode +=
`struct light {
  on : u32,
  _type : u32,
  location : vec3<f32>,
  direction : vec3<f32>,
  color : vec3<f32>,
  attenuation : vec3<f32>,
  radius : f32,
  intensity : f32,
  ambientIntensity : f32,
  beamWidth : f32,
  cutOffAngle : f32,
  shadowIntensity : f32,
}
`;

    bindingParamsList0.addBindingParams( `lights`, `array<light>`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `read-only-storage` ) );

    if ( properties.LIGHTS )
    {
        /*for ( var l = 0; l < properties.LIGHTS; l++ )
        {
            bindingParamsList0.addBindingParams( `light${l}_On`, `f32`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
                .addBindingParams( `light${l}_Type`, `f32`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
                .addBindingParams( `light${l}_Location`, `vec3<f32>`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
                .addBindingParams( `light${l}_Direction`, `vec3<f32>`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
                .addBindingParams( `light${l}_Color`, `vec3<f32>`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
                .addBindingParams( `light${l}_Attenuation`, `vec3<f32>`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
                .addBindingParams( `light${l}_Radius`, `f32`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
                .addBindingParams( `light${l}_Intensity`, `f32`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
                .addBindingParams( `light${l}_AmbientIntensity`, `f32`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
                .addBindingParams( `light${l}_BeamWidth`, `f32`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
                .addBindingParams( `light${l}_CutOffAngle`, `f32`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
                .addBindingParams( `light${l}_ShadowIntensity`, `f32`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) );
        }*/
        var lighting =
`fn lighting(lType: u32,
lLocation: vec3<f32>,
lDirection: vec3<f32>,
lColor: vec3<f32>,
lAttenuation: vec3<f32>,
lRadius: f32,
lIntensity: f32,
lAmbientIntensity: f32,
lBeamWidth: f32,
lCutOffAngle: f32,
positionVS: vec3<f32>,
N: vec3<f32>,
V1: vec3<f32>,
shin: f32,
ambIntensity: f32,
reflectivity: vec3<f32>,
ambient: ptr<function, vec3<f32>>,
diffuse: ptr<function, vec3<f32>>,
specular: ptr<function, vec3<f32>>){
  var V: vec3<f32> = V1;
  var L: vec3<f32>;
  var spot: f32 = 1.0;
  var attentuation: f32 = 0.0;
  if(lType == 0) {
    L = -normalize(lDirection);
    V = normalize(V);
    attentuation = 1.0;
  }else{
    L = (lLocation - (-V));
    var d: f32 = length(L);
    L = normalize(L);
    V = normalize(V);
    if(lRadius == 0.0 || d <= lRadius){
      attentuation = 1.0 / max(lAttenuation.x + lAttenuation.y * d + lAttenuation.z * (d * d), 1.0);
    }
    if(lType == 2){
      var spotAngle: f32 = acos(max(0.0, dot(-L, normalize(lDirection))));
      if(spotAngle >= lCutOffAngle){spot = 0.0;}
      else if(spotAngle <= lBeamWidth){spot = 1.0;}
      else {spot = (spotAngle - lCutOffAngle ) / (lBeamWidth - lCutOffAngle);}
    }
  }
  var H: vec3<f32> = normalize( L + V );
  var NdotL: f32 = clamp(dot(L, N), 0.0, 1.0);
  var NdotH: f32 = clamp(dot(H, N), 0.0, 1.0);
  var ambientFactor: f32 = lAmbientIntensity * ambIntensity;
  var diffuseFactor: f32 = lIntensity * NdotL;
  var specularFactor: f32 = lIntensity * pow(NdotH, shin*128.0);
  *ambient  += lColor * ambientFactor * attentuation * spot;
  *diffuse  += lColor * diffuseFactor * attentuation * spot;
  *specular += lColor * specularFactor * attentuation * spot;
}`;
        fragmentShaderModuleDeclarationCode += lighting;
    }

    if ( properties.GAMMACORRECTION === "none" )
    {
    // do not emit any declaration. 1.0 shall behave 'as without gamma'.
    }
    else if ( properties.GAMMACORRECTION === "fastlinear" )
    {
    // This is a slightly optimized gamma correction
    // which uses a gamma of 2.0 instead of 2.2. Gamma 2.0 is less costly
    // to encode in terms of cycles as sqrt() is usually optimized
    // in hardware.
        fragmentShaderModuleDeclarationCode +=
`fn gammaEncodeVec4(color: vec4<f32>)->vec4<f32>{
  var tmp: vec4<f32> = sqrt(color);
  return vec4<f32>(tmp.rgb, color.a);
};
fn gammaDecodeVec4(color: vec4<f32>)->vec4<f32>{
  var tmp: vec4<f32> = color * color;
  return vec4<f32>(tmp.rgb, color.a);
};
fn gammaEncodeVec3(color: vec3<f32>)->vec3<f32>{
  return sqrt(color);
};
fn gammaDecodeVec3(color: vec3<f32>)->vec3<f32>{
  return (color * color);
};`;
    }
    else
    {
    // The preferred implementation compensating for a gamma of 2.2, which closely
    // follows sRGB; alpha remains linear
    // minor opt: 1.0 / 2.2 = 0.4545454545454545
        fragmentShaderModuleDeclarationCode +=
`var<private> gammaEncode4Vector: vec4<f32> = vec4<f32>(0.4545454545454545, 0.4545454545454545, 0.4545454545454545, 1.0);
var<private> gammaDecode4Vector: vec4<f32> = vec4<f32>(2.2, 2.2, 2.2, 1.0);
fn gammaEncodeVec4(color: vec4<f32>)->vec4<f32>{
  return pow(abs(color), gammaEncode4Vector);
};
fn gammaDecodeVec4(color: vec4<f32>)->vec4<f32>{
  return pow(abs(color), gammaDecode4Vector);
};
var<private> gammaEncode3Vector: vec3<f32> = vec3<f32>(0.4545454545454545, 0.4545454545454545, 0.4545454545454545);
var<private> gammaDecode3Vector: vec3<f32> = vec3<f32>(2.2, 2.2, 2.2);
fn gammaEncodeVec3(color: vec3<f32>)->vec3<f32>{
  return pow(abs(color), gammaEncode3Vector);
};
fn gammaDecodeVec3(color: vec3<f32>)->vec3<f32>{
  return pow(abs(color), gammaDecode3Vector);
};`;
    }

    bindingListArray.addBindingList( bindingParamsList0.createBindingList() );
    var bindingCodes = bindingListArray.createShaderModuleBindingCodes();
    var vertexInputCode = vertexListArray.createShaderModuleVertexInputCode();
    var vertexOutputCode = vertexOutputList.createShaderModuleInputOutputCode();

    var vertexShaderModuleEntryPoint = `vs_main`;

    var vs_mainFunctionBodyCode = ``;
    //Positions
    vs_mainFunctionBodyCode += `var vertexOutput: VertexOutput ;
var mat_mvp: mat4x4<f32> = modelViewProjectionMatrix;
var mat_mv: mat4x4<f32> = modelViewMatrix;
`;
    if ( properties.CUBEMAP || properties.PBR_MATERIAL )
    {
        vs_mainFunctionBodyCode += `var mat_v: mat4x4<f32> = viewMatrix;\n`;
    }
    if ( properties.LIGHTS || properties.PBR_MATERIAL )
    {
        if ( properties.NORMALMAP && properties.NORMALSPACE == "OBJECT" )
        {
        //do nothing
        }
        else
        {
            vs_mainFunctionBodyCode += `var mat_n: mat4x4<f32> = normalMatrix;\n`;
        }
    }
    //Positions
    vs_mainFunctionBodyCode += `var vertPosition:vec3<f32> = position.xyz;\n`;

    //Normals
    if ( properties.LIGHTS )
    {
        if ( properties.NORCOMPONENTS == 2 )
        {
            if ( properties.POSCOMPONENTS == 4 )
            {
                // (theta, phi) encoded in low/high byte of position.w
                vs_mainFunctionBodyCode += "var vertNormal:vec3<f32> = vec3<f32>(position.w / 256.0); \n";
                vs_mainFunctionBodyCode += "vertNormal.x = floor(vertNormal.x) / 255.0; \n";
                vs_mainFunctionBodyCode += "vertNormal.y = fract(vertNormal.y) * 1.00392156862745; \n"; //256.0 / 255.0
            }
            else if ( properties.REQUIREBBOXNOR )
            {
                //vs_mainFunctionBodyCode += "var vertNormal:vec3<f32> = vec3(normal.xy, 0.0) / bgPrecisionNorMax;\n";
            }

            vs_mainFunctionBodyCode += "var thetaPhi:vec2<f32> = 3.14159265358979 * vec2<f32>(vertNormal.x, vertNormal.y*2.0-1.0); \n";
            vs_mainFunctionBodyCode += "var sinCosThetaPhi:vec4<f32> = sin( vec4<f32>(thetaPhi, thetaPhi + 1.5707963267949) ); \n";

            vs_mainFunctionBodyCode += "vertNormal.x = sinCosThetaPhi.x * sinCosThetaPhi.w; \n";
            vs_mainFunctionBodyCode += "vertNormal.y = sinCosThetaPhi.x * sinCosThetaPhi.y; \n";
            vs_mainFunctionBodyCode += "vertNormal.z = sinCosThetaPhi.z; \n";
        }
        else
        {
            if ( properties.NORMALMAP && properties.NORMALSPACE == "OBJECT" )
            {
                //Nothing to do
            }
            else
            {
                vs_mainFunctionBodyCode += "var vertNormal:vec3<f32> = normal;\n";
                if ( properties.REQUIREBBOXNOR )
                {
                    //vs_mainFunctionBodyCode += "vertNormal = vertNormal / bgPrecisionNorMax;\n";
                }
                if ( properties.POPGEOMETRY )
                {
                    vs_mainFunctionBodyCode += "vertNormal = 2.0*vertNormal - 1.0;\n";
                }
            }
        }
    }

    //Colors
    if ( properties.VERTEXCOLOR )
    {
        var vs_mainFunctionBodyCode = `vertexOutput.fragColor = color;\n`;

    /*if ( properties.REQUIREBBOXCOL )
      {
        vs_mainFunctionBodyCode += `fragColor = fragColor / bgPrecisionColMax;\n`;
      }*/
    }
    /*******************************************************************************
* End of special Geometry switch
********************************************************************************/
    //Normals
    if ( properties.LIGHTS )
    {
        vs_mainFunctionBodyCode += `vertexOutput.fragNormal = (mat_n * vec4(vertNormal, 0.0)).xyz;\n`;
    }
    //Textures
    //Lights & Fog
    if ( properties.LIGHTS || properties.FOG || properties.CLIPPLANES || properties.POINTPROPERTIES )
    {
        vs_mainFunctionBodyCode += `vertexOutput.fragPosition = (mat_mv * vec4(vertPosition, 1.0));
vertexOutput.fragPositionWS = (modelMatrix * vec4(vertPosition, 1.0));\n`;
        if ( properties.FOG )
        {
            vs_mainFunctionBodyCode += `vertexOutput.fragEyePosition = eyePosition - fragPosition.xyz;\n`;
        }
    }
    //Displacement
    //Positions
    vs_mainFunctionBodyCode += `vertexOutput.builtinPosition = mat_mvp * vec4(vertPosition, 1.0);\n`;
    //Set point size
    vs_mainFunctionBodyCode += `return vertexOutput;`;
    //END OF SHADER

    var fragmentInputCode = vertexOutputCode;
    fragmentOutputList.add( `fragColor0`, `vec4<f32>` );
    var fragmentOutputCode = fragmentOutputList.createShaderModuleInputOutputCode();

    var fragmentShaderModuleEntryPoint = `fs_main`;

    var fs_mainFunctionBodyCode = `var fragmentOutput: FragmentOutput;\n`;

    if ( properties.NORMALSPACE == "OBJECT" )
    {
        fs_mainFunctionBodyCode += `mat4 mat_n = normalMatrix;\n`;
    }
    fs_mainFunctionBodyCode +=
`var color: vec4<f32>;
var texColor: vec4<f32>;
color = vec4<f32>(diffuseColor,1.0 - transparency);
var _emissiveColor: vec3<f32> = emissiveColor;
var _shininess: f32 = shininess;
var _specularColor: vec3<f32> = specularColor;
var _ambientIntensity: f32 = ambientIntensity;
var _transparency: f32 = transparency;
var _occlusion: f32 = 1.0;`;

    if ( properties.ALPHAMODE == "OPAQUE" )
    {
        fs_mainFunctionBodyCode += "color.a = 1.0;\n";
    }

    if ( properties.LIGHTS )
    {
        fs_mainFunctionBodyCode +=
`var ambient: vec3<f32> = vec3(0.0, 0.0, 0.0);
var diffuse: vec3<f32> = vec3(0.0, 0.0, 0.0);
var specular: vec3<f32> = vec3(0.0, 0.0, 0.0);
var eye: vec3<f32>;
var positionVS: vec3<f32> = fragPosition.rgb;
if ( isOrthoView > 0 ) {
  eye = vec3<f32>(0.0, 0.0, 1.0);
}else{
  eye = -fragPosition.xyz;
}
`;
        if ( properties.NORMALMAP && properties.NORMALSPACE == "OBJECT" )
        {
            fs_mainFunctionBodyCode += "var normal: vec3<f32> = vec3<f32>(0.0, 0.0, 0.0);\n";
        }
        else
        {
            fs_mainFunctionBodyCode += "var normal: vec3<f32> = normalize(fragNormal);\n";
        }
        if ( !properties.SOLID || properties.TWOSIDEDMAT )
        {
            fs_mainFunctionBodyCode +=
`if (dot(normalize(fragNormal), eye) < 0.0) {
  normal *= -1.0;
}`;
        }

        //Calculate lights
        fs_mainFunctionBodyCode +=
`for(var i: u32 = 0; i < numberOfLights; i++){
  lighting(lights[i]._type,
  lights[i].location,
  lights[i].direction,
  lights[i].color,
  lights[i].attenuation,
  lights[i].radius,
  lights[i].intensity,
  lights[i].ambientIntensity,
  lights[i].beamWidth,
  lights[i].cutOffAngle,
  positionVS, normal, eye, _shininess, _ambientIntensity, _specularColor, &ambient, &diffuse, &specular);
  ambient = max(ambient, vec3(0.0, 0.0, 0.0));
  diffuse = max(diffuse, vec3(0.0, 0.0, 0.0));
  specular = max(specular, vec3(0.0, 0.0, 0.0));
}
`;
        /*if ( properties.LIGHTS )
        {
            for ( var l = 0; l < properties.LIGHTS; l++ )
            {
                fs_mainFunctionBodyCode +=
`lighting(light${l}_Type,
light${l}_Location,
light${l}_Direction,
light${l}_Color,
light${l}_Attenuation,
light${l}_Radius,
light${l}_Intensity,
light${l}_AmbientIntensity,
light${l}_BeamWidth,
light${l}_CutOffAngle,
positionVS, normal, eye, _shininess, _ambientIntensity, _specularColor, &ambient, &diffuse, &specular);
ambient = max(ambient, vec3(0.0, 0.0, 0.0));
diffuse = max(diffuse, vec3(0.0, 0.0, 0.0));
specular = max(specular, vec3(0.0, 0.0, 0.0));
`;
            }
        }*/

        fs_mainFunctionBodyCode += "color = vec4<f32>(_emissiveColor + ((ambient + diffuse) * color.rgb + specular * _specularColor) * _occlusion,color.a);\n";
    }

    //Output the gamma encoded result.
    fs_mainFunctionBodyCode +=
`if(tonemappingOperator == 1.0) {
  color = vec4<f32>(tonemapReinhard(color.rgb),color.a);
}
if(tonemappingOperator == 2.0) {
  color = vec4<f32>(tonemapUncharted2(color.rgb),color.a);
}
if(tonemappingOperator == 3.0) {
  color = vec4<f32>(tonemapeFilmic(color.rgb),color.a);
}
`;
    if ( properties.GAMMACORRECTION !== "none" )
    {
        fs_mainFunctionBodyCode += `color = gammaEncodeVec4(color);\n`;
    }
    fs_mainFunctionBodyCode += `fragmentOutput.fragColor0 = color;\n`;
    fs_mainFunctionBodyCode += `return fragmentOutput;`;
    //End Of Shader

    var vertexShaderModuleCode =
`${bindingCodes.vertexBindingCode}
struct VertexOutput {
  @builtin(position) builtinPosition: vec4<f32>,
  ${vertexOutputCode}
}
@vertex
fn ${vertexShaderModuleEntryPoint}(
  //@builtin(vertex_index) my_index: u32,
  //@builtin(instance_index) my_inst_index: u32,
  ${vertexInputCode}
) -> VertexOutput {
  ${vs_mainFunctionBodyCode}
}`;

    var fragmentShaderModuleCode =
`${bindingCodes.fragmentBindingCode}
${fragmentShaderModuleDeclarationCode}
struct FragmentOutput {
  //@builtin(frag_depth) depth: f32,
  //@builtin(sample_mask) mask_out: u32,
  ${fragmentOutputCode}
}
@fragment
fn ${fragmentShaderModuleEntryPoint}(
  //@builtin(front_facing) is_front: bool,
  //@builtin(position) coord: vec4<f32>,
  //@builtin(sample_index) my_sample_index: u32,
  //@builtin(sample_mask) mask_in: u32,
  ${fragmentInputCode}
) -> FragmentOutput {
  ${fs_mainFunctionBodyCode}
}`;

    //layout: GPUPipelineLayout
    {
        const bindGroupLayouts = bindingListArray.getBindGroupLayouts( context.device );
        var layout = context.device.createPipelineLayout( new x3dom.WebGPU.GPUPipelineLayoutDescriptor( bindGroupLayouts ) );
    }
    //vertex: GPUVertexState
    {
        const module = context.device.createShaderModule( new x3dom.WebGPU.GPUShaderModuleDescriptor( vertexShaderModuleCode ) );
        const entryPoint = vertexShaderModuleEntryPoint;
        const constants = undefined;
        const buffers = vertexListArray.vertexBufferLayouts;
        var vertex = new x3dom.WebGPU.GPUVertexState( module, entryPoint, constants, buffers );
    }
    //fragment: GPUFragmentState
    {
        const module = context.device.createShaderModule( new x3dom.WebGPU.GPUShaderModuleDescriptor( fragmentShaderModuleCode ) );
        const entryPoint = fragmentShaderModuleEntryPoint;
        const constants = undefined;
        const targets = [ x3dom.WebGPU.GPUFragmentState.newTarget( navigator.gpu.getPreferredCanvasFormat()/*, blend, writeMask*/ ) ];
        var fragment = new x3dom.WebGPU.GPUFragmentState( module, entryPoint, constants, targets );
    }
    //primitive: GPUPrimitiveState
    {
        const stripIndexFormat = undefined;
        const frontFace = "ccw";
        const cullMode = "back";
        var primitive = new x3dom.WebGPU.GPUPrimitiveState( "triangle-list", stripIndexFormat, frontFace, cullMode/*, unclippedDepth*/ );
    }
    //depthStencil: GPUDepthStencilState
    {
        const format = "depth24plus-stencil8";
        const depthWriteEnabled = true;
        const depthCompare = "less";
        var depthStencil = new x3dom.WebGPU.GPUDepthStencilState( format, depthWriteEnabled, depthCompare/*, stencilFront, stencilBack, stencilReadMask, stencilWriteMask, depthBias, depthBiasSlopeScale, depthBiasClamp*/ );
    }
    //multisample: GPUMultisampleState
    {
        const count = 1;
        var multisample = new x3dom.WebGPU.GPUMultisampleState( count/*, mask, alphaToCoverageEnabled*/ );
    }
    var renderPipelineDescriptor = new x3dom.WebGPU.GPURenderPipelineDescriptor( layout, vertex, fragment, primitive, depthStencil, multisample/*, label*/ );
    var renderPipeline = context.device.createRenderPipeline( renderPipelineDescriptor );

    var shader = {};
    //shader.buffers = {};
    shader.uniformStorage = {};
    shader.renderPipeline = renderPipeline;
    //shader.bindGroupDescriptors = [];
    shader.bindGroups = [];

    /*
    var resource = new x3dom.WebGPU.GPUBufferBinding( buffer, offset, size );
    var resource = sampler;
    var resource = textureView;
    var resource = externalTexture;
    */

    var createBindGroupDescriptor = function ( context, shader, bindingList, resources = {} )
    {
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
                    //if ( size )
                    //{
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
                    const buffer = context.device.createBuffer( bufferDescriptor );
                    const offset = undefined;
                    size = undefined;
                    resource = new x3dom.WebGPU.GPUBufferBinding( buffer, offset, size );
                    //}
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
                //const buffer = resource.buffer;
                //shader.buffers[ bindingData.name ] = buffer;
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
                    //const typedArray = getTypedArray( bindingData.wgslType );
                    Object.defineProperty( shader.uniformStorage, bindingData.name, {
                        get:function(){
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
                                resource.setBuffer( context.device.createBuffer( new x3dom.WebGPU.GPUBufferDescriptor( view.byteLength, resource.buffer.usage, false, resource.buffer.label ) ) );
                                //resource.setOffset(0);
                                //resource.setSize(view.byteLength);
                                updated = true;
                            }
                            context.device.queue.writeBuffer( resource.buffer, 0, view.buffer, view.byteOffset, view.byteLength );

                        //context.device.queue.writeBuffer( buffer, 0, view.buffer, view.byteOffset, view.byteLength > buffer.size ? buffer.size : view.byteLength );
                        
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
                    bindGroup = context.device.createBindGroup( this );
                    updated = false;
                }
                return bindGroup;
            }
        }( layout, entries, label );
        //return bindGroupDescriptor;
        //return context.device.createBindGroup( bindGroupDescriptor );
    };

    //var bindGroups=[];
    for ( const bindingList of bindingListArray )
    {
        const bindGroupDescriptor = createBindGroupDescriptor( context, shader, bindingList );
        //shader.bindGroupDescriptors.push( bindGroupDescriptor );
        //shader.bindGroups.push( context.device.createBindGroup( bindGroupDescriptor ) );
        Object.defineProperty( shader.bindGroups, bindingListArray.indexOf( bindingList ), {
            get : function ()
            {
                return bindGroupDescriptor.getBindGroup();
            }
        } );
    }

    /*
struct light {
  on : u32,
  type : u32,
  location : vec3<f32>,
  direction : vec3<f32>,
  color : vec3<f32>,
  attenuation : vec3<f32>,
  radius : f32,
  intensity : f32,
  ambientIntensity : f32,
  beamWidth : f32,
  cutOffAngle : f32,
  shadowIntensity : f32,
}*/
    /*
    var lights = new class lights{
      stride = 7*16;
      dataView = new DataView(new ArrayBuffer(stride*2) );
      setOn = function(index,value){
        this.dataView.setUint32(index*stride,value,true);
      }
      setType = function(index,value){
        this.dataView.setUint32(index*stride+4,value,true);
      }
      setLocation = function(index,value){
        this.dataView.setFloat32(index*stride+16,value[0],true);
        this.dataView.setFloat32(index*stride+16+4,value[1],true);
        this.dataView.setFloat32(index*stride+16+8,value[2],true);
      }
      setDirection = function(index,value){
        this.dataView.setFloat32(index*stride+32,value[0],true);
        this.dataView.setFloat32(index*stride+32+4,value[1],true);
        this.dataView.setFloat32(index*stride+32+8,value[2],true);
      }
      setColor = function(index,value){
        this.dataView.setFloat32(index*stride+48,value[0],true);
        this.dataView.setFloat32(index*stride+48+4,value[1],true);
        this.dataView.setFloat32(index*stride+48+8,value[2],true);
      }
      setAttenuation = function(index,value){
        this.dataView.setFloat32(index*stride+64,value[0],true);
        this.dataView.setFloat32(index*stride+64+4,value[1],true);
        this.dataView.setFloat32(index*stride+64+8,value[2],true);
      }
      setRadius = function(index,value){
        this.dataView.setFloat32(index*stride+80,value,true);
      }
      setIntensity = function(index,value){
        this.dataView.setFloat32(index*stride+84,value,true);
      }
      setAmbientIntensity = function(index,value){
        this.dataView.setFloat32(index*stride+88,value,true);
      }
      setBeamWidth = function(index,value){
        this.dataView.setFloat32(index*stride+92,value,true);
      }
      setCutOffAngle = function(index,value){
        this.dataView.setFloat32(index*stride+96,value,true);
      }
      setShadowIntensity = function(index,value){
        this.dataView.setFloat32(index*stride+100,value,true);
      }
    }*/

    var lights = class lights extends DataView
    {
        stride = 7 * 16;

        constructor ( number )
        {
            super( new ArrayBuffer( number * 7 * 16 ) );
        }

        setOn = function ( index, value )
        {
            this.setUint32( index * this.stride, value, true );
        };

        setType = function ( index, value )
        {
            this.setUint32( index * this.stride + 4, value, true );
        };

        setLocation = function ( index, value )
        {
            this.setFloat32( index * this.stride + 16, value[ 0 ], true );
            this.setFloat32( index * this.stride + 16 + 4, value[ 1 ], true );
            this.setFloat32( index * this.stride + 16 + 8, value[ 2 ], true );
        };

        setDirection = function ( index, value )
        {
            this.setFloat32( index * this.stride + 32, value[ 0 ], true );
            this.setFloat32( index * this.stride + 32 + 4, value[ 1 ], true );
            this.setFloat32( index * this.stride + 32 + 8, value[ 2 ], true );
        };

        setColor = function ( index, value )
        {
            this.setFloat32( index * this.stride + 48, value[ 0 ], true );
            this.setFloat32( index * this.stride + 48 + 4, value[ 1 ], true );
            this.setFloat32( index * this.stride + 48 + 8, value[ 2 ], true );
        };

        setAttenuation = function ( index, value )
        {
            this.setFloat32( index * this.stride + 64, value[ 0 ], true );
            this.setFloat32( index * this.stride + 64 + 4, value[ 1 ], true );
            this.setFloat32( index * this.stride + 64 + 8, value[ 2 ], true );
        };

        setRadius = function ( index, value )
        {
            this.setFloat32( index * this.stride + 80, value, true );
        };

        setIntensity = function ( index, value )
        {
            this.setFloat32( index * this.stride + 84, value, true );
        };

        setAmbientIntensity = function ( index, value )
        {
            this.setFloat32( index * this.stride + 88, value, true );
        };

        setBeamWidth = function ( index, value )
        {
            this.setFloat32( index * this.stride + 92, value, true );
        };

        setCutOffAngle = function ( index, value )
        {
            this.setFloat32( index * this.stride + 96, value, true );
        };

        setShadowIntensity = function ( index, value )
        {
            this.setFloat32( index * this.stride + 100, value, true );
        };
    };

    //var lights = new DataView(new ArrayBuffer(stride*2) );

    shader.uniformStorage.lights = new lights( 2 );

    /*for ( var bindGroupDescriptor of shader.bindGroupDescriptors )
    {
      if(bindGroupDescriptor.needToUpdateBindGroup){
        shader.bindGroups[shader.bindGroupDescriptors.indexOf(bindGroupDescriptor)]=context.device.createBindGroup( bindGroupDescriptor );
      }
    }*/

    /*
var buffers={};
var uniformStorage={};
var bindGroups=[];
*/

    var vertexBuffers = [];
    var vertices = {};
    for ( const vertexList of vertexListArray )
    {
        /*let size = 1000*vertexList.vertexBufferLayout.arrayStride;
      let usage= GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST;
      let mappedAtCreation = false;
      let vertexNames=[];
      for(var vertexData of vertexList){
        vertexNames.push(vertexData.name);
      }
      let label=vertexNames.join(`_`);
      let bufferDescriptor = new x3dom.WebGPU.GPUBufferDescriptor( size, usage, mappedAtCreation, label );
      vertexBuffers.push(context.device.createBuffer(bufferDescriptor));*/
        const vertexNames = [];
        for ( let vertexData of vertexList )
        {
            vertexNames.push( vertexData.name );
        }
        const vertexBufferName = vertexNames.join( `_` );
        const vertexBufferIndex = vertexListArray.indexOf( vertexList );
        Object.defineProperty( vertices, vertexBufferName, {
            get:function(){
              return vertexBuffers[ vertexBufferIndex ];
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
                else
                {
                    return;//unknow type;
                }
                switch ( true )
                {
                    case vertexBuffers[ vertexBufferIndex ] instanceof GPUBuffer && view.byteLength != vertexBuffers[ vertexBufferIndex ].size:
                        vertexBuffers[ vertexBufferIndex ].destroy();
                    case !( vertexBuffers[ vertexBufferIndex ] instanceof GPUBuffer ):
                        const size = view.byteLength;
                        const usage = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST;
                        const mappedAtCreation = false;
                        const label = vertexBufferName;
                        const bufferDescriptor = new x3dom.WebGPU.GPUBufferDescriptor( size, usage, mappedAtCreation, label );
                        vertexBuffers[ vertexBufferIndex ] = context.device.createBuffer( bufferDescriptor );
                    default:
                        context.device.queue.writeBuffer( vertexBuffers[ vertexBufferIndex ], 0, view.buffer, view.byteOffset, view.byteLength );
                        break;
                }
            }
        } );
    }

    vertices.position = new Float32Array( 1000 );
    vertices.normal = new Float32Array( 1000 );

    {
        const size = 48;
        const usage = GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST;
        const mappedAtCreation = false;
        const label = `indexBuffer`;
        const bufferDescriptor = new x3dom.WebGPU.GPUBufferDescriptor( size, usage, mappedAtCreation, label );
        var indexBuffer = context.device.createBuffer( bufferDescriptor );

        context.device.queue.writeBuffer( indexBuffer, 0, new Uint32Array( [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ] ), 0, 9 );
    }

    {
        const colorFormats = [ context.ctx3d.getCurrentTexture().format/*navigator.gpu.getPreferredCanvasFormat()*/ ];
        const depthStencilFormat = "depth24plus-stencil8";
        const sampleCount = 1;
        var renderBundleEncoderDescriptor = new x3dom.WebGPU.GPURenderBundleEncoderDescriptor( colorFormats, depthStencilFormat, sampleCount/*, depthReadOnly, stencilReadOnly, label*/ );
        var renderBundleEncoder = context.device.createRenderBundleEncoder( renderBundleEncoderDescriptor );
        renderBundleEncoder.setPipeline( renderPipeline );
        for ( var bindGroup of shader.bindGroups )
        {
            renderBundleEncoder.setBindGroup( shader.bindGroups.indexOf( bindGroup ), bindGroup );
        }
        for ( var vertexBuffer of vertexBuffers )
        {
            renderBundleEncoder.setVertexBuffer( vertexBuffers.indexOf( vertexBuffer ), vertexBuffer );
        }
        renderBundleEncoder.setIndexBuffer( indexBuffer, "uint32" );
        renderBundleEncoder.drawIndexed( 12 );

        //renderBundleEncoder .draw(cubeVertexCount, 1, 0, 0);
        var renderBundle = renderBundleEncoder.finish();
    }

    {
        const size = new x3dom.WebGPU.GPUExtent3DDict( context.canvas.width, context.canvas.height );
        let mipLevelCount;
        let sampleCount;
        let dimension;
        const format = "depth24plus-stencil8";
        const usage = GPUTextureUsage.RENDER_ATTACHMENT;
        let viewFormats;
        let label;

        var textureDescriptor = new x3dom.WebGPU.GPUTextureDescriptor( size, mipLevelCount, sampleCount, dimension, format, usage, viewFormats, label );
        var depthTexture = context.device.createTexture( textureDescriptor );
    }

    {
        const view = context.ctx3d.getCurrentTexture().createView();
        let depthSlice;
        let resolveTarget;
        const clearValue = new x3dom.WebGPU.GPUColorDict( 0.5, 0.5, 0.5, 1.0 );
        const loadOp = "clear";
        const storeOp = "store";

        var colorAttachments = [ new x3dom.WebGPU.GPURenderPassColorAttachment( view, depthSlice, resolveTarget, clearValue, loadOp, storeOp ) ];
    }

    {
        const view = depthTexture.createView();
        const depthClearValue = 1.0;
        const depthLoadOp = "clear";
        const depthStoreOp = "store";
        let depthReadOnly;
        const stencilClearValue = 0;
        const stencilLoadOp = "clear";
        const stencilStoreOp = "store";
        let stencilReadOnly;

        var depthStencilAttachment = new x3dom.WebGPU.GPURenderPassDepthStencilAttachment( view, depthClearValue, depthLoadOp, depthStoreOp, depthReadOnly, stencilClearValue, stencilLoadOp, stencilStoreOp, stencilReadOnly );

        let occlusionQuerySet;
        let timestampWrites;
        let maxDrawCount;
        let label;

        var renderPassDescriptor = new x3dom.WebGPU.GPURenderPassDescriptor( colorAttachments, depthStencilAttachment, occlusionQuerySet, timestampWrites, maxDrawCount, label );
    }

    var commandEncoder = context.device.createCommandEncoder();

    var renderPassEncoder = commandEncoder.beginRenderPass( renderPassDescriptor );
    renderPassEncoder.executeBundles( [ renderBundle ] );
    renderPassEncoder.end();
    context.device.queue.submit( [ commandEncoder.finish() ] );
};

function setRenderPipeline ( device )
{
    //layout: GPUPipelineLayout
    {
        const bindGroupLayouts = bindingListArray.getBindGroupLayouts( context.device );
        var layout = context.device.createPipelineLayout( new x3dom.WebGPU.GPUPipelineLayoutDescriptor( bindGroupLayouts ) );
    }
    //vertex: GPUVertexState
    {
        const module = context.device.createShaderModule( new x3dom.WebGPU.GPUShaderModuleDescriptor( vertexShaderModuleCode ) );
        const entryPoint = vertexShaderModuleEntryPoint;
        const constants = undefined;
        const buffers = vertexListArray.vertexBufferLayouts;
        var vertex = new x3dom.WebGPU.GPUVertexState( module, entryPoint, constants, buffers );
    }
    //fragment: GPUFragmentState
    {
        const module = context.device.createShaderModule( new x3dom.WebGPU.GPUShaderModuleDescriptor( fragmentShaderModuleCode ) );
        const entryPoint = fragmentShaderModuleEntryPoint;
        const constants = undefined;
        const targets = [ x3dom.WebGPU.GPUFragmentState.newTarget( navigator.gpu.getPreferredCanvasFormat()/*, blend, writeMask*/ ) ];
        var fragment = new x3dom.WebGPU.GPUFragmentState( module, entryPoint, constants, targets );
    }
    //primitive: GPUPrimitiveState
    {
        const stripIndexFormat = undefined;
        const frontFace = "ccw";
        const cullMode = "back";
        var primitive = new x3dom.WebGPU.GPUPrimitiveState( "triangle-list", stripIndexFormat, frontFace, cullMode/*, unclippedDepth*/ );
    }
    //depthStencil: GPUDepthStencilState
    {
        const format = "depth24plus-stencil8";
        const depthWriteEnabled = true;
        const depthCompare = "less";
        var depthStencil = new x3dom.WebGPU.GPUDepthStencilState( format, depthWriteEnabled, depthCompare/*, stencilFront, stencilBack, stencilReadMask, stencilWriteMask, depthBias, depthBiasSlopeScale, depthBiasClamp*/ );
    }
    //multisample: GPUMultisampleState
    {
        const count = 1;
        var multisample = new x3dom.WebGPU.GPUMultisampleState( count/*, mask, alphaToCoverageEnabled*/ );
    }
    var renderPipelineDescriptor = new x3dom.WebGPU.GPURenderPipelineDescriptor( layout, vertex, fragment, primitive, depthStencil, multisample/*, label*/ );
}