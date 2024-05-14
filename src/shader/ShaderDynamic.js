x3dom.shader.DynamicShader = function ( context, properties )
{
    var bindingListArray = new easygpu.BindingListArray();
    var vertexListArray = new easygpu.VertexListArray();

    var vertexOutputList = new easygpu.ShaderModuleInputOutputList();
    var fragmentOutputList = new easygpu.ShaderModuleInputOutputList();

    var bindingParamsList0 = bindingListArray.newBindingParamsList()
        .addBindingParams( `modelMatrix`, `mat4x4<f32>`, GPUShaderStage.VERTEX, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) )
        .addBindingParams( `modelViewMatrix`, `mat4x4<f32>`, GPUShaderStage.VERTEX, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) )
        .addBindingParams( `modelViewProjectionMatrix`, `mat4x4<f32>`, GPUShaderStage.VERTEX, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) )
        .addBindingParams( `modelViewMatrix2`, `mat4x4<f32>`, GPUShaderStage.VERTEX, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) )
        .addBindingParams( `modelViewProjectionMatrix2`, `mat4x4<f32>`, GPUShaderStage.VERTEX, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) )
        //.addBindingParams( `isVR`, `u32`, GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) )
        //.addBindingParams( `screenWidth`, `f32`, GPUShaderStage.FRAGMENT, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) )
        //.addBindingParams( `cameraPosWS`, `vec3<f32>`, GPUShaderStage.FRAGMENT, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) )
        .addBindingParams( `alphaCutoff`, `f32`, GPUShaderStage.FRAGMENT, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) )

        .addBindingParams( `diffuseColor`, `vec3<f32>`, GPUShaderStage.FRAGMENT, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) )
        .addBindingParams( `specularColor`, `vec3<f32>`, GPUShaderStage.FRAGMENT, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) )
        .addBindingParams( `emissiveColor`, `vec3<f32>`, GPUShaderStage.FRAGMENT, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) )
        .addBindingParams( `shininess`, `f32`, GPUShaderStage.FRAGMENT, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) )
        .addBindingParams( `transparency`, `f32`, GPUShaderStage.FRAGMENT, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) )
        .addBindingParams( `ambientIntensity`, `f32`, GPUShaderStage.FRAGMENT, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) );
        //.addBindingParams( `numberOfLights`, `u32`, GPUShaderStage.FRAGMENT, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) );

    var bindingParamsList1 = bindingListArray.newBindingParamsList()
        .addBindingParams( `screenWidth`, `f32`, GPUShaderStage.FRAGMENT, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) )
        .addBindingParams( `cameraPosWS`, `vec3<f32>`, GPUShaderStage.FRAGMENT, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) );
        //.addBindingParams( `numberOfLights`, `u32`, GPUShaderStage.FRAGMENT, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) );
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
            bindingParamsList0.addBindingParams( `normalMatrix`, `mat4x4<f32>`, GPUShaderStage.VERTEX, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) )
                .addBindingParams( `normalMatrix2`, `mat4x4<f32>`, GPUShaderStage.VERTEX, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) );

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
    if ( properties.TEXTURED )
    {
        vertexOutputList.add( `fragTexcoord`, `vec2<f32>` );
        bindingParamsList0.addBindingParams( `diffuseMap`, `sampler`, GPUShaderStage.FRAGMENT, new easygpu.webgpu.GPUSamplerBindingLayout( `filtering` ) )
            .addBindingParams( `texture`, `texture_2d<f32>`, GPUShaderStage.FRAGMENT, new easygpu.webgpu.GPUTextureBindingLayout( `float`, `2d` ) );

        if ( !properties.SPHEREMAPPING )
        {
            if ( !properties.IS_PARTICLE )
            {
                vertexListArray.addVertexList( vertexListArray.newVertexParamsList().addVertexParams( `texcoord`, `vec2<f32>`, `float32x2` ).createVertexList() );
            }
        }
    }
    //Lights & Fog
    if ( properties.LIGHTS || properties.FOG || properties.CLIPPLANES || properties.POINTPROPERTIES )
    {
        bindingParamsList1.addBindingParams( `eyePosition`, `vec3<f32>`, GPUShaderStage.VERTEX, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) )
            .addBindingParams( `isOrthoView`, `u32`, GPUShaderStage.FRAGMENT, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) );
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
    bindingParamsList0.addBindingParams( `tonemappingOperator`, `f32`, GPUShaderStage.FRAGMENT, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) );
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
}
`;
    //Colors
    //VertexID
    //Textures

    // same as vertex shader but with fragPositionWS for fogNoise (w/ or w/out lights)
    /*if ( properties.LIGHTS || properties.FOG || properties.CLIPPLANES )
    {
        bindingParamsList0.addBindingParams( `isOrthoView`, `f32`, GPUShaderStage.VERTEX, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) );
    }*/

    //Lights
    fragmentShaderModuleDeclarationCode +=
`struct Light {
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
struct Lights {
  number : u32,
  lightArray : array<Light>,
}
`;

    bindingParamsList1.addBindingParams( `lights`, `Lights`, GPUShaderStage.FRAGMENT, new easygpu.webgpu.GPUBufferBindingLayout( `read-only-storage` ) );

    if ( properties.LIGHTS )
    {
        /*for ( var l = 0; l < properties.LIGHTS; l++ )
        {
            bindingParamsList0.addBindingParams( `light${l}_On`, `f32`, GPUShaderStage.FRAGMENT, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) )
                .addBindingParams( `light${l}_Type`, `f32`, GPUShaderStage.FRAGMENT, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) )
                .addBindingParams( `light${l}_Location`, `vec3<f32>`, GPUShaderStage.FRAGMENT, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) )
                .addBindingParams( `light${l}_Direction`, `vec3<f32>`, GPUShaderStage.FRAGMENT, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) )
                .addBindingParams( `light${l}_Color`, `vec3<f32>`, GPUShaderStage.FRAGMENT, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) )
                .addBindingParams( `light${l}_Attenuation`, `vec3<f32>`, GPUShaderStage.FRAGMENT, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) )
                .addBindingParams( `light${l}_Radius`, `f32`, GPUShaderStage.FRAGMENT, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) )
                .addBindingParams( `light${l}_Intensity`, `f32`, GPUShaderStage.FRAGMENT, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) )
                .addBindingParams( `light${l}_AmbientIntensity`, `f32`, GPUShaderStage.FRAGMENT, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) )
                .addBindingParams( `light${l}_BeamWidth`, `f32`, GPUShaderStage.FRAGMENT, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) )
                .addBindingParams( `light${l}_CutOffAngle`, `f32`, GPUShaderStage.FRAGMENT, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) )
                .addBindingParams( `light${l}_ShadowIntensity`, `f32`, GPUShaderStage.FRAGMENT, new easygpu.webgpu.GPUBufferBindingLayout( `uniform` ) );
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
};
`;
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

    bindingListArray.addBindingList( bindingParamsList0.createBindingList() ).addBindingList( bindingParamsList1.createBindingList() );
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
                vs_mainFunctionBodyCode += `var vertNormal:vec3<f32> = normal;\n`;
                if ( properties.REQUIREBBOXNOR )
                {
                    //vs_mainFunctionBodyCode += "vertNormal = vertNormal / bgPrecisionNorMax;\n";
                }
                if ( properties.POPGEOMETRY )
                {
                    vs_mainFunctionBodyCode += `vertNormal = 2.0*vertNormal - 1.0;\n`;
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
    //TexCoords
    if ( ( properties.TEXTURED ) && !properties.SPHEREMAPPING )
    {
        if ( properties.IS_PARTICLE || properties.POINTPROPERTIES )
        {
            vs_mainFunctionBodyCode += `var vertTexCoord:vec2<f32> = vec2<f32>(0.0,0.0);\n`;
        }
        else
        {
            vs_mainFunctionBodyCode += `var vertTexCoord:vec2<f32> = texcoord;\n`;
        }
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
    if ( properties.TEXTURED )
    {
        if ( properties.SPHEREMAPPING )
        {
        }
        else if ( properties.TEXTRAFO )
        {
        }
        else
        {
            vs_mainFunctionBodyCode += "vertexOutput.fragTexcoord = vertTexCoord;\n";
        }
    }
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
var _occlusion: f32 = 1.0;
`;

    if ( properties.ALPHAMODE == "OPAQUE" )
    {
        fs_mainFunctionBodyCode += "color.a = 1.0;\n";
    }

    if ( properties.IS_PARTICLE || properties.POINTPROPERTIES )
    {
    }
    else if ( properties.TEXTURED )
    {
        //fs_mainFunctionBodyCode += "var texcoord:vec2<f32> = fragTexcoord;\n";
    }
    if ( properties.UNLIT )
    {

    }
    else if ( properties.LIGHTS )
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
}
`;
        }

        //Calculate lights
        fs_mainFunctionBodyCode +=
`for(var i: u32 = 0; i < lights.number; i++){
  lighting(lights.lightArray[i]._type,
  lights.lightArray[i].location,
  lights.lightArray[i].direction,
  lights.lightArray[i].color,
  lights.lightArray[i].attenuation,
  lights.lightArray[i].radius,
  lights.lightArray[i].intensity,
  lights.lightArray[i].ambientIntensity,
  lights.lightArray[i].beamWidth,
  lights.lightArray[i].cutOffAngle,
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
    else
    {
        if ( properties.TEXTURED && ( properties.DIFFUSEMAP || properties.DIFFPLACEMENTMAP || properties.TEXT ) )
        {
            if ( properties.PIXELTEX )
            {
            }
            else
            {
                if ( properties.IS_PARTICLE || properties.POINTPROPERTIES )
                {
                }
                else
                {
                    fs_mainFunctionBodyCode += "var texCoord:vec2<f32> = fragTexcoord;\n";
                }
            }
            fs_mainFunctionBodyCode += `texColor = gammaDecodeVec4 (textureSample(texture, diffuseMap, vec2<f32>(texCoord.x,1-texCoord.y)));\n`;
            //fs_mainFunctionBodyCode += "color.a = texColor.a;\n";
            if ( properties.BLENDING || properties.IS_PARTICLE || properties.POINTPROPERTIES )
            {
            }
            else
            {
                fs_mainFunctionBodyCode += "color = texColor;\n";
            }
        }
    }

    //Kill pixel
    if ( properties.TEXT )
    {
    }
    else if ( properties.ALPHAMASK )
    {
    }
    else if ( +properties.ALPHATHRESHOLD > 0 )
    {
        fs_mainFunctionBodyCode += "if (color.a <= alphaCutoff) {discard;}\n";
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
    //fs_mainFunctionBodyCode += `fragmentOutput.fragColor0 = vec4<f32>(lights[0].intensity,lights[0].intensity,lights[0].intensity,1.0);\n`;
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

    var renderPassResource = new easygpu.RenderPassResource( context.device );
    renderPassResource.bindingListArray = bindingListArray;
    renderPassResource.vertexListArray = vertexListArray;
    renderPassResource.assets.Lights = class Lights extends DataView
    {
        stride = 7 * 16;

        constructor ( number )
        {
            super( new ArrayBuffer( 16 + number * 7 * 16 ) );
            this.setNumber( number );
        }

        setNumber = function ( value )
        {
            this.setUint32( 0, value, true );
        };

        setOn = function ( index, value )
        {
            this.setUint32( 16 + index * this.stride, value, true );
        };

        setType = function ( index, value )
        {
            this.setUint32( 16 + index * this.stride + 4, value, true );
        };

        setLocation = function ( index, value )
        {
            this.setFloat32( 16 + index * this.stride + 16, value[ 0 ], true );
            this.setFloat32( 16 + index * this.stride + 16 + 4, value[ 1 ], true );
            this.setFloat32( 16 + index * this.stride + 16 + 8, value[ 2 ], true );
        };

        setDirection = function ( index, value )
        {
            this.setFloat32( 16 + index * this.stride + 32, value[ 0 ], true );
            this.setFloat32( 16 + index * this.stride + 32 + 4, value[ 1 ], true );
            this.setFloat32( 16 + index * this.stride + 32 + 8, value[ 2 ], true );
        };

        setColor = function ( index, value )
        {
            this.setFloat32( 16 + index * this.stride + 48, value[ 0 ], true );
            this.setFloat32( 16 + index * this.stride + 48 + 4, value[ 1 ], true );
            this.setFloat32( 16 + index * this.stride + 48 + 8, value[ 2 ], true );
        };

        setAttenuation = function ( index, value )
        {
            this.setFloat32( 16 + index * this.stride + 64, value[ 0 ], true );
            this.setFloat32( 16 + index * this.stride + 64 + 4, value[ 1 ], true );
            this.setFloat32( 16 + index * this.stride + 64 + 8, value[ 2 ], true );
        };

        setRadius = function ( index, value )
        {
            this.setFloat32( 16 + index * this.stride + 76, value, true );
        };

        setIntensity = function ( index, value )
        {
            this.setFloat32( 16 + index * this.stride + 80, value, true );
        };

        setAmbientIntensity = function ( index, value )
        {
            this.setFloat32( 16 + index * this.stride + 84, value, true );
        };

        setBeamWidth = function ( index, value )
        {
            this.setFloat32( 16 + index * this.stride + 88, value, true );
        };

        setCutOffAngle = function ( index, value )
        {
            this.setFloat32( 16 + index * this.stride + 92, value, true );
        };

        setShadowIntensity = function ( index, value )
        {
            this.setFloat32( 16 + index * this.stride + 96, value, true );
        };
    };

    renderPassResource.assets.Positions = class Positions extends Float32Array
    {
        constructor ( arg )
        {
            switch ( true )
            {
                case typeof arg === `number` || arg instanceof Number:
                    super( arg * 3 );
                    break;
                case arg instanceof Array:
                    super( arg );
                    break;
                default:
                    super( arg );
                    break;
            }
        }

        setPosition = function ( index, value )
        {
            switch ( true )
            {
                case value instanceof Array:
                    this[ index * 3 ] = value[ 0 ];
                    this[ index * 3 + 1 ] = value[ 1 ];
                    this[ index * 3 + 2 ] = value[ 2 ];
                    break;
                case typeof value === `number` || value instanceof Number:
                    this[ index * 3 ] = arguments[ 1 ];
                    this[ index * 3 + 1 ] = arguments[ 2 ];
                    this[ index * 3 + 2 ] = arguments[ 3 ];
                    break;
            }
        };
    };
    renderPassResource.assets.Normals = class Normals extends Float32Array
    {
        constructor ( arg )
        {
            switch ( true )
            {
                case typeof arg === `number` || arg instanceof Number:
                    super( arg * 3 );
                    break;
                case arg instanceof Array:
                    super( arg );
                    break;
                default:
                    super( arg );
                    break;
            }
        }

        setNormal = function ( index, value )
        {
            switch ( true )
            {
                case value instanceof Array:
                    this[ index * 3 ] = value[ 0 ];
                    this[ index * 3 + 1 ] = value[ 1 ];
                    this[ index * 3 + 2 ] = value[ 2 ];
                    break;
                case typeof value === `number` || value instanceof Number:
                    this[ index * 3 ] = arguments[ 1 ];
                    this[ index * 3 + 1 ] = arguments[ 2 ];
                    this[ index * 3 + 2 ] = arguments[ 3 ];
                    break;
            }
        };
    };
    renderPassResource.assets.Texcoords = class Texcoords extends Float32Array
    {
        constructor ( arg )
        {
            switch ( true )
            {
                case typeof arg === `number` || arg instanceof Number:
                    super( arg * 2 );
                    break;
                case arg instanceof Array:
                    super( arg );
                    break;
                default:
                    super( arg );
                    break;
            }
        }

        setNormal = function ( index, value )
        {
            switch ( true )
            {
                case value instanceof Array:
                    this[ index * 2 ] = value[ 0 ];
                    this[ index * 2 + 1 ] = value[ 1 ];
                    break;
                case typeof value === `number` || value instanceof Number:
                    this[ index * 2 ] = arguments[ 1 ];
                    this[ index * 2 + 1 ] = arguments[ 2 ];
                    break;
            }
        };
    };

    renderPassResource.initBindGroups( [ , bindingListArray[ 1 ] ] );

    renderPassResource.new = ()=>
    {
        var newRenderPassResource = renderPassResource.copy( {
            bindGroupDescriptors : [ , renderPassResource.bindGroupDescriptors[ 1 ] ],
            bindGroupResources   : Object.defineProperties( {}, Object.getOwnPropertyDescriptors( renderPassResource.bindGroupResources ) ),
            bindGroups           : Object.defineProperty( [], 1, Object.getOwnPropertyDescriptor( renderPassResource.bindGroups, 1 ) ),
            vertexBuffers        : [],
            vertices             : {}
        } );
        //layout: GPUPipelineLayout
        {
            const bindGroupLayouts = bindingListArray.getBindGroupLayouts( context.device );
            var layout = context.device.createPipelineLayout( new easygpu.webgpu.GPUPipelineLayoutDescriptor( bindGroupLayouts ) );
        }
        //vertex: GPUVertexState
        {
            const module = context.device.createShaderModule( new easygpu.webgpu.GPUShaderModuleDescriptor( vertexShaderModuleCode ) );
            const entryPoint = vertexShaderModuleEntryPoint;
            const constants = undefined;
            const buffers = vertexListArray.vertexBufferLayouts;
            var vertex = new easygpu.webgpu.GPUVertexState( module, entryPoint, constants, buffers );
        }
        //fragment: GPUFragmentState
        {
            const module = context.device.createShaderModule( new easygpu.webgpu.GPUShaderModuleDescriptor( fragmentShaderModuleCode ) );
            const entryPoint = fragmentShaderModuleEntryPoint;
            const constants = undefined;
            const targets = [ easygpu.webgpu.GPUFragmentState.newTarget( navigator.gpu.getPreferredCanvasFormat()/*, blend, writeMask*/ ) ];
            var fragment = new easygpu.webgpu.GPUFragmentState( module, entryPoint, constants, targets );
        }
        //primitive: GPUPrimitiveState
        {
            const stripIndexFormat = undefined;
            const frontFace = "ccw";
            const cullMode = "back";
            var primitive = new easygpu.webgpu.GPUPrimitiveState( "triangle-list", stripIndexFormat, frontFace, cullMode/*, unclippedDepth*/ );
        }
        //depthStencil: GPUDepthStencilState
        {
            const format = "depth32float-stencil8";
            const depthWriteEnabled = true;
            const depthCompare = "less";
            var depthStencil = new easygpu.webgpu.GPUDepthStencilState( format, depthWriteEnabled, depthCompare/*, stencilFront, stencilBack, stencilReadMask, stencilWriteMask, depthBias, depthBiasSlopeScale, depthBiasClamp*/ );
        }
        //multisample: GPUMultisampleState
        {
            const count = 1;
            var multisample = new easygpu.webgpu.GPUMultisampleState( count/*, mask, alphaToCoverageEnabled*/ );
        }
        newRenderPassResource.initRenderPipeline( new easygpu.webgpu.GPURenderPipelineDescriptor( layout, vertex, fragment, primitive, depthStencil, multisample/*, label*/ ) );
        newRenderPassResource.initBindGroups( [ bindingListArray[ 0 ] ] );
        newRenderPassResource.initVertexBuffers();
        newRenderPassResource.initIndexBuffer();
        return newRenderPassResource;
    };
    return renderPassResource;
};