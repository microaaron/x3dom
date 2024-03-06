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

var BindingListArray = class
{
    constructor ()
    {
        var bindingListArray = [];
        bindingListArray.newBindingParamsList = BindingListArray.newBindingParamsList;
        bindingListArray.addBindingList = function ( bindingList )
        {
            this.push( bindingList );
            return this;
        };
        bindingListArray.createShaderModuleBindingCodes = function ()
        {
            var vertexBindingCode = ``;
            var fragmentBindingCode = ``;
            var computeBindingCode = ``;
            for ( var bindingList of this )
            {
                var groupId = this.indexOf( bindingList );
                for ( var binding of bindingList )
                {
                    var bindingId = binding.entry.binding;
                    var declaration = `var`;
                    if ( binding.entry.buffer )
                    {
                        var bufferType = binding.entry.buffer.type;
                        var addressSpace = bufferType ? bufferType : `uniform`;
                        var accessMode = undefined;
                        switch ( addressSpace )
                        {
                            case `storage`:
                                accessMode = `read_write`;
                                break;
                            case `read-only-storage`:
                                accessMode = `read`;
                                break;
                        }
                        declaration += `<${addressSpace}${accessMode ? `,${accessMode}` : ``}>`;
                    }
                    var code = `@group(${groupId}) @binding(${bindingId}) ${declaration} ${binding.name}: ${binding.wgslType};\n`;
                    var visibility = binding.entry.visibility;
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
        };
        bindingListArray.getBindGroupLayouts=function(device){
          var bindGroupLayouts = [];
          for(var bindingList of this){
            if(!bindingList.bindGroupLayout){
              bindingList.bindGroupLayout = device.createBindGroupLayout(bindingList.bindGroupLayoutDescriptor);
            }
            bindGroupLayouts.push(bindingList.bindGroupLayout);
          }
          return bindGroupLayouts;
        }
        return bindingListArray;
    }

    static newBindingParamsList ()
    {
        return new BindingListArray.BindingParamsList();
    }

    static BindingParamsList = class
    {
        constructor ()
        {
            var bindingParamsList = [];
            bindingParamsList.addBindingParams = function ( name, wgslType, visibility, resourceLayoutObject )
            {
                this.push( {
                    name                 : name,
                    wgslType             : wgslType,
                    visibility           : visibility,
                    resourceLayoutObject : resourceLayoutObject
                } );
                return this;
            };
            bindingParamsList.createBindingList = function ()
            {
                var bindingList = [];
                var bindGroupLayoutDescriptor = new x3dom.WebGPU.GPUBindGroupLayoutDescriptor();

                for ( var bindingParams of this )
                {
                    var entry = bindGroupLayoutDescriptor.newEntry( bindGroupLayoutDescriptor.entries.length, bindingParams.visibility, bindingParams.resourceLayoutObject );
                    bindGroupLayoutDescriptor.entries.push( entry );
                    bindingList.push( {
                        name     : bindingParams.name,
                        wgslType : bindingParams.wgslType,
                        entry    : entry
                    } );
                }

                bindingList.bindGroupLayoutDescriptor = bindGroupLayoutDescriptor;
                return bindingList;
            };
            return bindingParamsList;
        }
    };
};

var VertexListArray = class
{
    constructor ()
    {
        var vertexListArray = [];
        vertexListArray.newVertexParamsList = VertexListArray.newVertexParamsList;
        vertexListArray.addVertexList = function ( vertexList )
        {
            this.push( vertexList );
            return this;
        };
        vertexListArray.createVertexBufferLayouts = function ()
        {
            this.vertexBufferLayouts = [];
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
        };
        vertexListArray.createShaderModuleVertexInputCode = function ()
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
        };
        return vertexListArray;
    }

    static newVertexParamsList ()
    {
        return new VertexListArray.VertexParamsList();
    }

    static VertexParamsList = class
    {
        constructor ()
        {
            var vertexParamsList = [];
            vertexParamsList.addVertexParams = function ( name, wgslType, format, offset/*(Optional)*/ )
            {
                this.push( {
                    name     : name,
                    wgslType : wgslType,
                    format   : format,
                    offset   : offset
                } );
                return this;
            };
            vertexParamsList.createVertexList = function ( arrayStride/*(Optional)*/, stepMode/*(Optional)*/ )
            {
                var vertexList = [];
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
                        vertexList.push( {
                            name            : vertexParams.name,
                            wgslType        : vertexParams.wgslType,
                            vertexAttribute : vertexAttribute
                        } );
                        autoArrayStride += byteSize;
                    }
                }
                vertexBufferLayout.setArrayStride( Number.isInteger( arrayStride ) ? ( arrayStride ? arrayStride : autoArrayStride ) : autoArrayStride );
                vertexList.vertexBufferLayout = vertexBufferLayout;
                return vertexList;
            };
            return vertexParamsList;
        }
    };
};

var shaderModuleInputOutputList = class
{
    constructor ()
    {
        var inputOutputList = [];
        inputOutputList.add = function ( name, wgslType )
        {
            this.push( {
                name     : name,
                wgslType : wgslType
            } );
            return this;
        };
        inputOutputList.createShaderModuleCode = function ()
        {
            var location = 0;
            var inputOutputCodes = [];
            for ( var inputOutput of this )
            {
                inputOutputCodes.push( `@location(${location}) ${inputOutput.name}: ${inputOutput.wgslType}` );
                location++;
            }
            return inputOutputCodes.join();
        };
        return inputOutputList;
    }
};

x3dom.shader.DynamicShader = function ( ctx3d, properties )
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
        .addBindingParams( `isVR`, `u32`, GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
        .addBindingParams( `screenWidth`, `f32`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
        .addBindingParams( `cameraPosWS`, `vec3<f32>`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
        .addBindingParams( `alphaCutoff`, `f32`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )

        .addBindingParams( `diffuseColor`, `vec3<f32>`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
        .addBindingParams( `specularColor`, `vec3<f32>`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
        .addBindingParams( `emissiveColor`, `vec3<f32>`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
        .addBindingParams( `shininess`, `f32`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
        .addBindingParams( `transparency`, `f32`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
        .addBindingParams( `ambientIntensity`, `f32`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) );

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
    bindingParamsList0.addBindingParams( `tonemappingOperator`, `f32`, GPUShaderStage.VERTEX, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) );
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
  return clamp((color * (a * color + b)) / (color * (c * color + d ) + e), 0.0, 1.0);
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
}`;
    //Colors
    //VertexID
    //Textures

    // same as vertex shader but with fragPositionWS for fogNoise (w/ or w/out lights)
    if ( properties.LIGHTS || properties.FOG || properties.CLIPPLANES )
    {
        bindingParamsList0.addBindingParams( `isOrthoView`, `f32`, GPUShaderStage.VERTEX, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) );
    }

    //Lights
    if ( properties.LIGHTS )
    {
        for ( var l = 0; l < properties.LIGHTS; l++ )
        {
            bindingParamsList0.addBindingParams( `light${l}_On`, `f32`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
                .addBindingParams( `light${l}_On`, `f32`, GPUShaderStage.FRAGMENT, new x3dom.WebGPU.GPUBufferBindingLayout( `uniform` ) )
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
        }
        var lighting =
`fn lighting(lType: f32,
lLocation: vec3<f32>,
lDirection: vec3<f32>,
lColor: vec3<f32>,
lAttenuation: vec3<f32>,
lRadius: f32,
lIntensity f32,
lAmbientIntensity f32,
lBeamWidth f32,
lCutOffAngle f32,
positionVS vec3<f32>,
N vec3<f32>,
V vec3<f32>,
shin f32,
ambIntensity f32,
reflectivity vec3<f32>,
ambient: ptr<function, vec3<f32>>,
diffuse: ptr<function, vec3<f32>>,
specular: ptr<function, vec3<f32>>){
  var L: vec3<f32>;
  var spot: f32 = 1.0;
  var attentuation: f32 = 0.0;
  if(lType == 0.0) {
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
    if(lType == 2.0){
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
    var vertexOutputCode = vertexOutputList.createCode();

    var vertexShaderModuleEntryPoint = `vs_main`;

    var vs_mainFunctionBodyCode = ``;
    //Positions
    vs_mainFunctionBodyCode += `var vertexOutput: VertexOutput ;
var mat_mvp: mat4x4<f32> = modelViewProjectionMatrix;
var mat_mv: mat4x4<f32> = modelViewMatrix;`;
    if ( properties.CUBEMAP || properties.PBR_MATERIAL )
    {
        vs_mainFunctionBodyCode += `var mat_v: mat4x4<f32> = viewMatrix;`;
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
    vs_mainFunctionBodyCode += `builtinPosition = mat_mvp * vec4(vertPosition, 1.0);\n`;
    //Set point size
    vs_mainFunctionBodyCode += `return vertexOutput;\n`;
    //END OF SHADER

    var fragmentInputCode = vertexOutputCode;
    fragmentOutputList.add( `fragColor0`, `vec4<f32>` );
    var fragmentOutputCode = fragmentOutputList.createCode();

    var fragmentShaderModuleEntryPoint = `fs_main`;

    var fs_mainFunctionBodyCode = `var fragmentOutput: FragmentOutput ;`;

    if ( properties.NORMALSPACE == "OBJECT" )
    {
        fs_mainFunctionBodyCode += `mat4 mat_n = normalMatrix;\n`;
    }
    fs_mainFunctionBodyCode +=
`var color: vec4<f32>;
var texColor: vec4<f32>;
color.rgb = diffuseColor;
color.a = 1.0 - transparency;
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
        if ( properties.LIGHTS )
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
ambient = max(ambient, 0.0);
diffuse = max(diffuse, 0.0);
specular = max(specular, 0.0);
`;
            }
        }

        fs_mainFunctionBodyCode += "color.rgb = _emissiveColor + ((ambient + diffuse) * color.rgb + specular * _specularColor) * _occlusion;\n";
    }

    //Output the gamma encoded result.
    fs_mainFunctionBodyCode +=
`if(tonemappingOperator == 1.0) {
  color.rgb = tonemapReinhard(color.rgb);
}
if(tonemappingOperator == 2.0) {
  color.rgb = tonemapUncharted2(color.rgb);
}
if(tonemappingOperator == 3.0) {
  color.rgb = tonemapeFilmic(color.rgb);
}
`;
    if ( properties.GAMMACORRECTION !== "none" )
    {
        fs_mainFunctionBodyCode += `color = gammaEncodeVec4(color)`;
    }
    fs_mainFunctionBodyCode += `fragmentOutput.fragColor0 = color;\n`;
    fs_mainFunctionBodyCode += `return fragmentOutput;\n`;
    //End Of Shader

    var vertexShaderModuleCode =
`${bindingCodes.vertexBindingCode}
struct vertexOutput {
  //@builtin(position) builtinPosition: vec4<f32>
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

    return {
        bindingListArray               : bindingListArray,
        vertexListArray                : vertexListArray,
        fragmentOutputList             : fragmentOutputList,
        vertexShaderModuleEntryPoint   : vertexShaderModuleEntryPoint,
        vertexShaderModuleCode         : vertexShaderModuleCode,
        fragmentShaderModuleEntryPoint : fragmentShaderModuleEntryPoint,
        fragmentShaderModuleCode       : fragmentShaderModuleCode
    };
};

function setRenderPipeline(){
  var BindGroupLayout= device.createBindGroupLayout
  var renderPipelineDescriptor=new x3dom.WebGPU.GPURenderPipelineDescriptor( layout, vertex, fragment, primitive, depthStencil, multisample, label );
}