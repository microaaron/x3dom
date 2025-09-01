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

/*******************************************************************************
* Material
********************************************************************************/
x3dom.shader.material = function ()
{
    var shaderPart = "uniform vec3  diffuseColor;\n" +
                     "uniform vec3  specularColor;\n" +
                     "uniform vec3  emissiveColor;\n" +
                     "uniform float shininess;\n" +
                     "uniform float transparency;\n" +
                     "uniform float ambientIntensity;\n";

    return shaderPart;
};

/*******************************************************************************
* Material
********************************************************************************/
x3dom.shader.physicalMaterial = function ()
{
    var shaderPart = "uniform vec3  baseColorFacor;\n" +
                     "uniform vec3  emissiveFactor;\n" +
                     "uniform float metallicFactor;\n" +
                     "uniform float roughnessFactor;\n";

    return shaderPart;
};

/*******************************************************************************
 * TwoSidedMaterial
 ********************************************************************************/
x3dom.shader.twoSidedMaterial = function ()
{
    var shaderPart = "uniform vec3  backDiffuseColor;\n" +
                     "uniform vec3  backSpecularColor;\n" +
                     "uniform vec3  backEmissiveColor;\n" +
                     "uniform float backShininess;\n" +
                     "uniform float backTransparency;\n" +
                     "uniform float backAmbientIntensity;\n";

    return shaderPart;
};

/*******************************************************************************
* Fog
********************************************************************************/
x3dom.shader.fog = function ()
{
    var shaderPart = "uniform vec3  fogColor;\n" +
                    "uniform float fogType;\n" +
                    "uniform float fogRange;\n" +
                    "varying vec3 fragEyePosition;\n" +

                    "float calcFog(in vec3 eye) {\n" +
                    "   float f0 = 0.0;\n" +
                    "   if(fogType == 0.0) {\n" +
                    "       if(length(eye) < fogRange){\n" +
                    "           f0 = (fogRange-length(eye)) / fogRange;\n" +
                    "       }\n" +
                    "   }else{\n" +
                    "       if(length(eye) < fogRange){\n" +
                    "           f0 = exp(-length(eye) / (fogRange-length(eye) ) );\n" +
                    "       }\n" +
                    "   }\n" +
                    "   f0 = clamp(f0, 0.0, 1.0);\n" +
                    "   return f0;\n" +
                    "}\n";
    return shaderPart;
};

/*******************************************************************************
 * Clipplane
 ********************************************************************************/
x3dom.shader.clipPlanes = function ( numClipPlanes )
{
    var shaderPart = "",
        c;

    for ( c = 0; c < numClipPlanes; c++ )
    {
        shaderPart +=     "uniform vec4 clipPlane" + c + "_Plane;\n";
        shaderPart +=     "uniform float clipPlane" + c + "_CappingStrength;\n";
        shaderPart +=     "uniform vec3 clipPlane" + c + "_CappingColor;\n";
    }

    shaderPart += "vec3 calculateClipPlanes() {\n";

    for ( c = 0; c < numClipPlanes; c++ )
    {
        shaderPart += "vec4 clipPlane" + c + ";\n";
        shaderPart += "if(fragEyeIdx == 1.0){\n";
        shaderPart += "    clipPlane" + c + " = clipPlane" + c + "_Plane * viewMatrixInverse2;\n";
        shaderPart += "}else{\n";
        shaderPart += "    clipPlane" + c + " = clipPlane" + c + "_Plane * viewMatrixInverse;\n";
        shaderPart += "}\n";
        shaderPart += "float dist" + c + " = dot(fragPosition, clipPlane" + c + ");\n";
    }

    shaderPart += "    if( ";

    for ( c = 0; c < numClipPlanes; c++ )
    {
        if ( c != 0 )
        {
            shaderPart += " || ";
        }
        shaderPart += "dist" + c + " < 0.0" ;
    }

    shaderPart += " ) ";
    shaderPart += "{ discard; }\n";

    for ( c = 0; c < numClipPlanes; c++ )
    {
        shaderPart += "    if( abs(dist" + c + ") < clipPlane" + c + "_CappingStrength ) ";
        shaderPart += "{ return clipPlane" + c + "_CappingColor; }\n";
    }

    shaderPart += "    return vec3(-1.0, -1.0, -1.0);\n";

    shaderPart += "}\n";

    return shaderPart;
};

/*******************************************************************************
* Gamma correction support: initial declaration
********************************************************************************/
x3dom.shader.gammaCorrectionDecl = function ( properties )
{
    var shaderPart = "";
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
        shaderPart += "vec4 gammaEncode(vec4 color){\n" +
                      "  vec4 tmp = sqrt(color);\n" +
                      "  return vec4(tmp.rgb, color.a);\n" +
                      "}\n";

        shaderPart += "vec4 gammaDecode(vec4 color){\n" +
                      "  vec4 tmp = color * color;\n" +
                      "  return vec4(tmp.rgb, color.a);\n" +
                      "}\n";

        shaderPart += "vec3 gammaEncode(vec3 color){\n" +
                      "  return sqrt(color);\n" +
                      "}\n";

        shaderPart += "vec3 gammaDecode(vec3 color){\n" +
                      "  return (color * color);\n" +
                      "}\n";
    }
    else
    {
        // The preferred implementation compensating for a gamma of 2.2, which closely
        // follows sRGB; alpha remains linear
        // minor opt: 1.0 / 2.2 = 0.4545454545454545
        shaderPart += "const vec4 gammaEncode4Vector = vec4(0.4545454545454545, 0.4545454545454545, 0.4545454545454545, 1.0);\n";
        shaderPart += "const vec4 gammaDecode4Vector = vec4(2.2, 2.2, 2.2, 1.0);\n";

        shaderPart += "vec4 gammaEncode(vec4 color){\n" +
                      "    return pow(abs(color), gammaEncode4Vector);\n" +
                      "}\n";

        shaderPart += "vec4 gammaDecode(vec4 color){\n" +
                      "    return pow(abs(color), gammaDecode4Vector);\n" +
                      "}\n";

        // RGB; minor opt: 1.0 / 2.2 = 0.4545454545454545
        shaderPart += "const vec3 gammaEncode3Vector = vec3(0.4545454545454545, 0.4545454545454545, 0.4545454545454545);\n";
        shaderPart += "const vec3 gammaDecode3Vector = vec3(2.2, 2.2, 2.2);\n";

        shaderPart += "vec3 gammaEncode(vec3 color){\n" +
                      "    return pow(abs(color), gammaEncode3Vector);\n" +
                      "}\n";

        shaderPart += "vec3 gammaDecode(vec3 color){\n" +
                      "    return pow(abs(color), gammaDecode3Vector);\n" +
                      "}\n";
    }
    return shaderPart;
};

/*******************************************************************************
* Gamma correction support: encoding and decoding of given expressions
*
* Unlike other shader parts these javascript functions wrap the same-named gamma
* correction shader functions (if applicable). When gamma correction is  not used,
* the expression will be returned verbatim. Consequently, any terminating semicolon
* is to be issued by the caller.
********************************************************************************/
x3dom.shader.encodeGamma = function ( properties, expr )
{
    if ( properties.GAMMACORRECTION === "none" )
    {
        // Naive implementation: no-op, return verbatim
        return expr;
    }
    else
    {
        // The 2.0 and 2.2 cases are transparent at the call site
        return "gammaEncode (" + expr + ")";
    }
};

x3dom.shader.decodeGamma = function ( properties, expr )
{
    if ( properties.GAMMACORRECTION === "none" )
    {
        // Naive implementation: no-op, return verbatim
        return expr;
    }
    else
    {
        // The 2.0 and 2.2 cases are transparent at the call site
        return "gammaDecode (" + expr + ")";
    }
};

/*******************************************************************************
* Shadow
********************************************************************************/
x3dom.shader.rgbaPacking = function ()
{
    var shaderPart = "";
    shaderPart +=
                    "vec4 packDepth(float depth){\n" +
                    "    depth = (depth + 1.0)*0.5;\n" +
                    "    vec4 outVal = vec4(1.0, 255.0, 65025.0, 160581375.0) * depth;\n" +
                    "    outVal = fract(outVal);\n" +
                    "      outVal -= outVal.yzww * vec4(1.0/255.0, 1.0/255.0, 1.0/255.0, 0.0);\n" +
                    "      return outVal;\n" +
                    "}\n";

    shaderPart +=
                    "float unpackDepth(vec4 color){\n" +
                    "    float depth = dot(color, vec4(1.0, 1.0/255.0, 1.0/65025.0, 1.0/160581375.0));\n" +
                    "    return (2.0*depth - 1.0);\n" +
                    "}\n";
    return shaderPart;
};

x3dom.shader.calcMipLevel = function ()
{
    var shaderPart = "";

    shaderPart +=
                "vec2 dirToCubeUV( vec3 dir ) {\n" +
                "    vec2 uv = vec2(0.0);\n" +
                "    vec3 absDir = abs(dir);\n" +
                "    if( absDir.x >= absDir.y && absDir.x >= absDir.z) {\n" +
                "        if(dir.x < 0.0) {\n" +
                "           uv.x = 1.0 - (((dir.z/absDir.x) + 1.0) * 0.5);\n" +
                "           uv.y = 1.0 - (((-dir.y/absDir.x) + 1.0) * 0.5);\n" +
                "       } else {\n" +
                "           uv.x = 1.0 - (((-dir.z/absDir.x) + 1.0) * 0.5);\n" +
                "           uv.y = 1.0 - (((-dir.y/absDir.x) + 1.0) * 0.5);\n" +
                "       }\n" +
                "   } else if( absDir.y >= absDir.x && absDir.y >= absDir.z) {\n" +
                "       if(dir.y < 0.0) {\n" +
                "              uv.x = ((dir.x/absDir.y) + 1.0) * 0.5;\n" +
                "           uv.y = ((-dir.z/absDir.y) + 1.0) * 0.5;\n" +
                "       } else {\n" +
                "           uv.x = ((dir.x/absDir.y) + 1.0) * 0.5;\n" +
                "           uv.y = ((dir.z/absDir.y) + 1.0) * 0.5;\n" +
                "if(uv.y == 0.0) { uv.x = 1.0; uv.y = 0.0; }\n" +
                "       }\n" +
                "   } else if( absDir.z >= absDir.x && absDir.z >= absDir.y) {\n" +
                "       if(dir.z < 0.0) {\n" +
                "           uv.x = (((-dir.x/absDir.z) + 1.0) * 0.5);\n" +
                "           uv.y = 1.0 - (((-dir.y/absDir.z) + 1.0) * 0.5);\n" +
                "       } else {\n" +
                "           uv.x = ((dir.x/absDir.z) + 1.0) * 0.5;\n" +
                "           uv.y = 1.0 - (((-dir.y/absDir.z) + 1.0) * 0.5);\n" +
                "       }\n" +
                "   }\n" +

                "   float a = pow(64.0,2.0) / pow(64.0,3.0);\n" +
                "    uv.x = a * pow(uv.x, 3.0) + uv.x;\n" +
                "    uv.y = a * pow(uv.y, 3.0) + uv.y;\n" +
                "   return uv;\n" +
                "}\n";

    shaderPart +=
                "float calcMipLevel( vec2 uv ) {\n" +
                "    vec2  dx_vtc        = dFdx(uv) * 64.0;\n" +
                "    vec2  dy_vtc        = dFdy(uv) * 64.0;\n" +
                "    float delta_max_sqr = max(dot(dx_vtc, dx_vtc), dot(dy_vtc, dy_vtc));\n" +
                "    return 0.5 * log2(delta_max_sqr);\n" +
                "}\n";

    shaderPart +=
                "vec3 fixSeams(vec3 vec, float mipmapIndex) {\n" +
                "    float scale = 1.0 - exp2(mipmapIndex) / 64.0;\n" +
                "    float M = max(max(abs(vec.x), abs(vec.y)), abs(vec.z));\n" +
                "    if (abs(vec.x) != M) vec.x *= scale;\n" +
                "    if (abs(vec.y) != M) vec.y *= scale;\n" +
                "    if (abs(vec.z) != M) vec.z *= scale;\n" +
                "    return vec;\n" +
                "}";

    return shaderPart;
};

x3dom.shader.shadowRendering = function ()
{
    //determine if and how much a given position is influenced by given light
    var shaderPart = "";
    shaderPart +=
                "float getLightInfluence(float lType, float lShadowIntensity, float lOn, vec3 lLocation, vec3 lDirection, " +
                "float lCutOffAngle, float lBeamWidth, vec3 lAttenuation, float lRadius, vec3 eyeCoords) {\n" +
                "    if (lOn == 0.0 || lShadowIntensity == 0.0){ return 0.0;\n" +
                "    } else if (lType == 0.0) {\n" +
                "        return 1.0;\n" +
                "    } else {\n" +
                "       float attenuation = 0.0;\n" +
                "       vec3 lightVec = (lLocation - (eyeCoords));\n" +
                "       float distance = length(lightVec);\n" +
                "        lightVec = normalize(lightVec);\n" +
                "        eyeCoords = normalize(-eyeCoords);\n" +
                "       if(lRadius == 0.0 || distance <= lRadius) {\n" +
                "           attenuation = 1.0 / max(lAttenuation.x + lAttenuation.y * distance + lAttenuation.z * (distance * distance), 1.0);\n" +
                "        }\n" +
                "         if (lType == 1.0) return attenuation;\n" +
                "       float spotAngle = acos(max(0.0, dot(-lightVec, normalize(lDirection))));\n" +
                "       if(spotAngle >= lCutOffAngle) return 0.0;\n" +
                "       else if(spotAngle <= lBeamWidth) return attenuation;\n" +
                "       else return attenuation * (spotAngle - lCutOffAngle) / (lBeamWidth - lCutOffAngle);\n" +
                "    }\n" +
                "}\n";

    // get light space depth of view sample and all entries of the shadow map
    shaderPart +=
                "void getShadowValues(inout vec4 shadowMapValues, inout float viewSampleDepth, in mat4 lightMatrix, in vec4 worldCoords, in sampler2D shadowMap){\n" +
                "    vec4 lightSpaceCoords = lightMatrix*worldCoords;\n" +
                "    vec3 lightSpaceCoordsCart = lightSpaceCoords.xyz / lightSpaceCoords.w;\n" +
                "    vec2 textureCoords = (lightSpaceCoordsCart.xy + 1.0)*0.5;\n" +
                "    viewSampleDepth = lightSpaceCoordsCart.z;\n" +
                "    shadowMapValues = texture2D(shadowMap, textureCoords);\n";
    if ( !x3dom.caps.FP_TEXTURES )
    {shaderPart +=    "    shadowMapValues = vec4(1.0,1.0,unpackDepth(shadowMapValues),1.0);\n";}
    shaderPart += "}\n";

    // get light space depth of view sample and all entries of the shadow map for point lights
    shaderPart +=
                "void getShadowValuesPointLight(inout vec4 shadowMapValues, inout float viewSampleDepth, in vec3 lLocation, in vec4 worldCoords, in mat4 lightViewMatrix," +
                "in mat4 lMatrix_0, in mat4 lMatrix_1, in mat4 lMatrix_2, in mat4 lMatrix_3, in mat4 lMatrix_4, in mat4 lMatrix_5," +
                "in sampler2D shadowMap_0, in sampler2D shadowMap_1, in sampler2D shadowMap_2, in sampler2D shadowMap_3," +
                "in sampler2D shadowMap_4, in sampler2D shadowMap_5){\n" +
                "    vec4 transformed = lightViewMatrix * worldCoords;\n" +
                "    vec3 lightVec = normalize(transformed.xyz/transformed.w);\n" +
                "    vec3 lightVecAbs = abs(lightVec);\n" +
                "    float maximum = max(max(lightVecAbs.x, lightVecAbs.y),lightVecAbs.z);\n" +
                "    if (lightVecAbs.x == maximum) {\n" +
                "        if (lightVec.x < 0.0) getShadowValues(shadowMapValues, viewSampleDepth, lMatrix_3,worldCoords,shadowMap_3);\n" +        //right
                "        else getShadowValues(shadowMapValues, viewSampleDepth, lMatrix_1,worldCoords,shadowMap_1);\n" +                        //left
                "    }\n" +
                "    else if (lightVecAbs.y == maximum) {\n" +
                "        if (lightVec.y < 0.0) getShadowValues(shadowMapValues, viewSampleDepth, lMatrix_4,worldCoords,shadowMap_4);\n" +        //front
                "        else getShadowValues(shadowMapValues, viewSampleDepth, lMatrix_5,worldCoords,shadowMap_5);\n" +                        //back
                "    }\n" +
                "    else if (lightVec.z < 0.0) getShadowValues(shadowMapValues, viewSampleDepth, lMatrix_0,worldCoords,shadowMap_0);\n" +    //bottom
                "    else getShadowValues(shadowMapValues, viewSampleDepth, lMatrix_2,worldCoords,shadowMap_2);\n" +                            //top
                "}\n";

    // get light space depth of view sample and all entries of the shadow map
    shaderPart +=
                "void getShadowValuesCascaded(inout vec4 shadowMapValues, inout float viewSampleDepth, in vec4 worldCoords, in float eyeDepth, in mat4 lMatrix_0, in mat4 lMatrix_1, in mat4 lMatrix_2," +
                "in mat4 lMatrix_3, in mat4 lMatrix_4, in mat4 lMatrix_5, in sampler2D shadowMap_0, in sampler2D shadowMap_1, in sampler2D shadowMap_2," +
                "in sampler2D shadowMap_3, in sampler2D shadowMap_4, in sampler2D shadowMap_5, in float split_0, in float split_1, in float split_2, in float split_3, in float split_4){\n" +
                "    if (eyeDepth < split_0) getShadowValues(shadowMapValues, viewSampleDepth, lMatrix_0, worldCoords, shadowMap_0);\n" +
                "    else if (eyeDepth < split_1) getShadowValues(shadowMapValues, viewSampleDepth, lMatrix_1, worldCoords, shadowMap_1);\n" +
                "    else if (eyeDepth < split_2) getShadowValues(shadowMapValues, viewSampleDepth, lMatrix_2, worldCoords, shadowMap_2);\n" +
                "    else if (eyeDepth < split_3) getShadowValues(shadowMapValues, viewSampleDepth, lMatrix_3, worldCoords, shadowMap_3);\n" +
                "    else if (eyeDepth < split_4) getShadowValues(shadowMapValues, viewSampleDepth, lMatrix_4, worldCoords, shadowMap_4);\n" +
                "    else getShadowValues(shadowMapValues, viewSampleDepth, lMatrix_5, worldCoords, shadowMap_5);\n" +
                "}\n";

    shaderPart +=
                "float ESM(float shadowMapDepth, float viewSampleDepth, float offset){\n";
    if ( !x3dom.caps.FP_TEXTURES )
    {
        shaderPart +=
        "    float d = viewSampleDepth - shadowMapDepth;\n" +
        "    d = step( 0.002, abs(d) ) * d;\n" +
        "    return exp(-80.0*(1.0-offset)*d);\n";
    }
    else     {shaderPart +=     "    return shadowMapDepth * exp(-80.0*(1.0-offset)*viewSampleDepth);\n";}
    shaderPart += "}\n";

    shaderPart +=
                "float VSM(vec2 moments, float viewSampleDepth, float offset){\n" +
                "    viewSampleDepth = (viewSampleDepth + 1.0) * 0.5;\n" +
                "    if (viewSampleDepth <= moments.x) return 1.0;\n" +
                "    float variance = moments.y - moments.x * moments.x;\n" +
                "    variance = max(variance, 0.00002 + offset*0.01);\n" +
                "    float d = viewSampleDepth - moments.x;\n" +
                "    return variance/(variance + d*d);\n" +
                "}\n";

    return shaderPart;
};

/*******************************************************************************
* Light
********************************************************************************/
/*x3dom.shader.light = function ( numLights )
{
    var shaderPart = "";

    for ( var l = 0; l < numLights; l++ )
    {
        shaderPart +=     "uniform float light" + l + "_On;\n" +
                        "uniform float light" + l + "_Type;\n" +
                        "uniform vec3  light" + l + "_Location;\n" +
                        "uniform vec3  light" + l + "_Direction;\n" +
                        "uniform vec3  light" + l + "_Color;\n" +
                        "uniform vec3  light" + l + "_Attenuation;\n" +
                        "uniform float light" + l + "_Radius;\n" +
                        "uniform float light" + l + "_Intensity;\n" +
                        "uniform float light" + l + "_AmbientIntensity;\n" +
                        "uniform float light" + l + "_BeamWidth;\n" +
                        "uniform float light" + l + "_CutOffAngle;\n" +
                        "uniform float light" + l + "_ShadowIntensity;\n";
    }

    shaderPart +=     "void lighting(in float lType, in vec3 lLocation, in vec3 lDirection, in vec3 lColor, in vec3 lAttenuation, " +
                    "in float lRadius, in float lIntensity, in float lAmbientIntensity, in float lBeamWidth, " +
                    "in float lCutOffAngle, in vec3 positionVS, in vec3 N, in vec3 V, float shin, float ambIntensity, vec3 reflectivity, " +
                    "inout vec3 ambient, inout vec3 diffuse, inout vec3 specular)\n" +
                    "{\n" +
                    "   vec3 L;\n" +
                    "   float spot = 1.0, attentuation = 0.0;\n" +
                    "   if(lType == 0.0) {\n" +
                    "       L = -normalize(lDirection);\n" +
                    "        V = normalize(V);\n" +
                    "        attentuation = 1.0;\n" +
                    "   } else{\n" +
                    "       L = (lLocation - (-V));\n" +
                    "       float d = length(L);\n" +
                    "        L = normalize(L);\n" +
                    "        V = normalize(V);\n" +
                    "       if(lRadius == 0.0 || d <= lRadius) {\n" +
                    "           attentuation = 1.0 / max(lAttenuation.x + lAttenuation.y * d + lAttenuation.z * (d * d), 1.0);\n" +
                    "        }\n" +
                    "       if(lType == 2.0) {\n" +
                    "           float spotAngle = acos(max(0.0, dot(-L, normalize(lDirection))));\n" +
                    "           if(spotAngle >= lCutOffAngle) spot = 0.0;\n" +
                    "           else if(spotAngle <= lBeamWidth) spot = 1.0;\n" +
                    "           else spot = (spotAngle - lCutOffAngle ) / (lBeamWidth - lCutOffAngle);\n" +
                    "       }\n" +
                    "   }\n" +

                    "   vec3  H = normalize( L + V );\n" +
                    "   float NdotL = clamp(dot(L, N), 0.0, 1.0);\n" +
                    "   float NdotH = clamp(dot(H, N), 0.0, 1.0);\n" +

                    "   float ambientFactor  = lAmbientIntensity * ambIntensity;\n" +
                    "   float diffuseFactor  = lIntensity * NdotL;\n" +
                    "   float specularFactor = lIntensity * pow(NdotH, shin*128.0);\n" +
                    "   ambient  += lColor * ambientFactor * attentuation * spot;\n" +
                    "   diffuse  += lColor * diffuseFactor * attentuation * spot;\n" +
                    "   specular += lColor * specularFactor * attentuation * spot;\n" +
                    "}\n";

    return shaderPart;
};*/

x3dom.shader.light =
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

fn lighting(
  light: ptr<storage, Light>,
  N: ptr<function, vec3<f32>>,
  eye: ptr<function, vec3<f32>>,
  shin: ptr<function, f32>,
  ambIntensity: ptr<function, f32>,
  ambient: ptr<function, vec3<f32>>,
  diffuse: ptr<function, vec3<f32>>,
  specular: ptr<function, vec3<f32>>
){
  let lType: ptr<storage, u32> = &(*light)._type;
  let lLocation: ptr<storage, vec3<f32>> = &(*light).location;
  let lDirection: ptr<storage, vec3<f32>> = &(*light).direction;
  let lColor: ptr<storage, vec3<f32>> = &(*light).color;
  let lAttenuation: ptr<storage, vec3<f32>> = &(*light).attenuation;
  let lRadius: ptr<storage, f32> = &(*light).radius;
  let lIntensity: ptr<storage, f32> = &(*light).intensity;
  let lAmbientIntensity: ptr<storage, f32> = &(*light).ambientIntensity;
  let lBeamWidth: ptr<storage, f32> = &(*light).beamWidth;
  let lCutOffAngle: ptr<storage, f32> = &(*light).cutOffAngle;

  var L: vec3<f32>;
  var V: vec3<f32>;
  var spot: f32 = 1.0;
  var attentuation: f32 = 0.0;
  if(*lType == 0) {
    L = -normalize(*lDirection);
    V = normalize(*eye);
    attentuation = 1.0;
  }else{
    L = (*lLocation - (-V));
    var d: f32 = length(L);
    L = normalize(L);
    V = normalize(V);
    if(*lRadius == 0.0 || d <= *lRadius){
      attentuation = 1.0 / max((*lAttenuation).x + (*lAttenuation).y * d + (*lAttenuation).z * (d * d), 1.0);
    }
    if(*lType == 2){
      var spotAngle: f32 = acos(max(0.0, dot(-L, normalize(*lDirection))));
      if(spotAngle >= *lCutOffAngle){spot = 0.0;}
      else if(spotAngle <= *lBeamWidth){spot = 1.0;}
      else {spot = (spotAngle - *lCutOffAngle ) / (*lBeamWidth - *lCutOffAngle);}
    }
  }
  var H: vec3<f32> = normalize( L + V );
  var NdotL: f32 = clamp(dot(L, *N), 0.0, 1.0);
  var NdotH: f32 = clamp(dot(H, *N), 0.0, 1.0);
  var ambientFactor: f32 = *lAmbientIntensity * *ambIntensity;
  var diffuseFactor: f32 = *lIntensity * NdotL;
  var specularFactor: f32 = *lIntensity * pow(NdotH, *shin*128.0);
  *ambient  += *lColor * ambientFactor * attentuation * spot;
  *diffuse  += *lColor * diffuseFactor * attentuation * spot;
  *specular += *lColor * specularFactor * attentuation * spot;

  *ambient = max(*ambient, vec3(0.0, 0.0, 0.0));
  *diffuse = max(*diffuse, vec3(0.0, 0.0, 0.0));
  *specular = max(*specular, vec3(0.0, 0.0, 0.0));
}
`;

/*
`fn lighting(lights: ptr<storage, Lights>,
N: ptr<function, vec3<f32>>,
eye: ptr<function, vec3<f32>>,
shin: ptr<function, f32>,
ambIntensity: ptr<function, f32>,
ambient: ptr<function, vec3<f32>>,
diffuse: ptr<function, vec3<f32>>,
specular: ptr<function, vec3<f32>>
){
  var lType: u32 = (*lights).lightArray[0]._type;
  for(var i: u32 = 0; i < (*lights).number; i++){
    let light: ptr<storage, Light> = &(*lights).lightArray[i];
    let lType: ptr<storage, u32> = &(*light)._type;
    let lLocation: ptr<storage, vec3<f32>> = &(*light).location;
    let lDirection: ptr<storage, vec3<f32>> = &(*light).direction;
    let lColor: ptr<storage, vec3<f32>> = &(*light).color;
    let lAttenuation: ptr<storage, vec3<f32>> = &(*light).attenuation;
    let lRadius: ptr<storage, f32> = &(*light).radius;
    let lIntensity: ptr<storage, f32> = &(*light).intensity;
    let lAmbientIntensity: ptr<storage, f32> = &(*light).ambientIntensity;
    let lBeamWidth: ptr<storage, f32> = &(*light).beamWidth;
    let lCutOffAngle: ptr<storage, f32> = &(*light).cutOffAngle;
    
    var L: vec3<f32>;
    var V: vec3<f32>;
    var spot: f32 = 1.0;
    var attentuation: f32 = 0.0;
    if(*lType == 0) {
      L = -normalize(*lDirection);
      V = normalize(*eye);
      attentuation = 1.0;
    }else{
      L = (*lLocation - (-V));
      var d: f32 = length(L);
      L = normalize(L);
      V = normalize(V);
      if(*lRadius == 0.0 || d <= *lRadius){
        attentuation = 1.0 / max((*lAttenuation).x + (*lAttenuation).y * d + (*lAttenuation).z * (d * d), 1.0);
      }
      if(*lType == 2){
        var spotAngle: f32 = acos(max(0.0, dot(-L, normalize(*lDirection))));
        if(spotAngle >= *lCutOffAngle){spot = 0.0;}
        else if(spotAngle <= *lBeamWidth){spot = 1.0;}
        else {spot = (spotAngle - *lCutOffAngle ) / (*lBeamWidth - *lCutOffAngle);}
      }
    }
    var H: vec3<f32> = normalize( L + V );
    var NdotL: f32 = clamp(dot(L, *N), 0.0, 1.0);
    var NdotH: f32 = clamp(dot(H, *N), 0.0, 1.0);
    var ambientFactor: f32 = *lAmbientIntensity * *ambIntensity;
    var diffuseFactor: f32 = *lIntensity * NdotL;
    var specularFactor: f32 = *lIntensity * pow(NdotH, *shin*128.0);
    *ambient  += *lColor * ambientFactor * attentuation * spot;
    *diffuse  += *lColor * diffuseFactor * attentuation * spot;
    *specular += *lColor * specularFactor * attentuation * spot;
    
    *ambient = max(*ambient, vec3(0.0, 0.0, 0.0));
    *diffuse = max(*diffuse, vec3(0.0, 0.0, 0.0));
    *specular = max(*specular, vec3(0.0, 0.0, 0.0));
  }
}
`
*/

/*
for(var i: u32 = 0; i < lights.number; i++){
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

fn lighting(lType: u32,
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
}

*/


/*******************************************************************************
* Light
********************************************************************************/
x3dom.shader.lightPBR = function ( numLights )
{
    var shaderPart = "";

    for ( var l = 0; l < numLights; l++ )
    {
        shaderPart +=     "uniform float light" + l + "_On;\n" +
                        "uniform float light" + l + "_Type;\n" +
                        "uniform vec3  light" + l + "_Location;\n" +
                        "uniform vec3  light" + l + "_Direction;\n" +
                        "uniform vec3  light" + l + "_Color;\n" +
                        "uniform vec3  light" + l + "_Attenuation;\n" +
                        "uniform float light" + l + "_Radius;\n" +
                        "uniform float light" + l + "_Intensity;\n" +
                        "uniform float light" + l + "_AmbientIntensity;\n" +
                        "uniform float light" + l + "_BeamWidth;\n" +
                        "uniform float light" + l + "_CutOffAngle;\n" +
                        "uniform float light" + l + "_ShadowIntensity;\n";
    }

    shaderPart +=     "void lighting(in float lType, in vec3 lLocation, in vec3 lDirection, in vec3 lColor, in vec3 lAttenuation, " +
                    "in float lRadius, in float lIntensity, in float lAmbientIntensity, in float lBeamWidth, " +
                    "in float lCutOffAngle, in vec3 positionVS, in vec3 N, in vec3 V, float shin, float ambIntensity, vec3 reflectivity, " +
                    "inout vec3 ambient, inout vec3 diffuse, inout vec3 specular)\n" +
                    "{\n" +
    // Calculate some Dot-Products

                    "   vec3 L;\n" +
                    "   float spot = 1.0, attentuation = 0.0;\n" +
                    "   if(lType == 0.0) {\n" +
                    "       L = -normalize(lDirection);\n" +
                    "        V = normalize(V);\n" +
                    "        attentuation = 1.0;\n" +
                    "   } else{\n" +
                    "       L = (lLocation - (-V));\n" +
                    "       float d = length(L);\n" +
                    "        L = normalize(L);\n" +
                    "        V = normalize(V);\n" +
                    "       if(lRadius == 0.0 || d <= lRadius) {\n" +
                    "           attentuation = 1.0 / max(lAttenuation.x + lAttenuation.y * d + lAttenuation.z * (d * d), 1.0);\n" +
                    "        }\n" +
                    "       if(lType == 2.0) {\n" +
                    //"           float spotAngle = acos(max(0.0, dot(-L, normalize(lDirection))));\n" +
                    //"           if(spotAngle >= lCutOffAngle) spot = 0.0;\n" + // see clamp
                    //"           else if(spotAngle <= lBeamWidth) spot = 1.0;\n" +
                    //"           else spot = (spotAngle - lCutOffAngle ) / (lBeamWidth - lCutOffAngle);\n" +
                    //"           else{\n" + // use glTF attenuation
                    "           float cosSpotAngle = max(0.0, dot(-L, normalize(lDirection)));\n" +
                    "           spot = (cosSpotAngle - cos(lCutOffAngle) ) / max(0.0001, cos(lBeamWidth) - cos(lCutOffAngle));\n" +
                    "           spot = clamp(spot, 0.0, 1.0);\n" + //not needed?
                    "           spot *= spot;\n" +
                    "       }\n" +
                    "   }\n" +

                    "   vec3  fresnel = vec3(1.0, 1.0, 1.0);\n" +
                    "   vec3  H = normalize( L + V );\n" +
                    "   float NoL = clamp( dot( N, L ), 0.0, 1.0 );\n" +
                    "   float NoH = clamp( dot( N, H ), 0.0, 1.0 );\n" +
                    "   float NoV = clamp( dot( N, V ), 0.0, 1.0 );\n" +
                    "   float VoH = clamp( dot( V, H ), 0.0, 1.0 );\n" +

                    "   float ambientFactor  = lAmbientIntensity * ambIntensity * 0.3183098861837907;\n" +
                    "   float diffuseFactor  = lIntensity * NoL * 0.3183098861837907;\n" + // 1/PI for Lambert
                    "   float spec  = lIntensity * NoL;\n" +
                    "   float roughness = 1.0 - shin;\n" +
                    "   float a = max( roughness * roughness, 5e-4 );\n" +

                    // Distribution Function"
                    "   float a2 = a * a;\n" +
                    "   float denom = NoH * NoH * ( a2 - 1.0 ) + 1.0;\n" +
                    "   float D = a2 / ( 3.141592653589793 * denom * denom );\n" +

                    // Geometric Shadowing Term
                    "   float k = a / 2.0;\n" +
                    "   float G_V = ( NoV * ( 1.0 - k ) + k );\n" +
                    "   float G_L = ( NoL * ( 1.0 - k ) + k );\n" +
                    "   float G = 0.25 / ( G_V * G_L );\n" +

                    // Fresnel
                    "   vec3 F = reflectivity + (fresnel - fresnel*reflectivity) * exp2( (-5.55473 * VoH - 6.98316) * VoH );\n" +

                    "   vec3 specularFactor = (D * G) * (F * spec);\n" +

                    "   ambient  += lColor * ambientFactor * attentuation * spot;\n" +
                    "   diffuse  += lColor * (1.0 - F) * diffuseFactor * attentuation * spot;\n" + //1-F for energy total
                    "   specular += lColor * specularFactor * attentuation * spot;\n" +
                    "}\n";

    return shaderPart;
};

/*******************************************************************************
 * cotangent_frame
 ********************************************************************************/
x3dom.shader.TBNCalculation = function ()
{
    var shaderPart = "";

    shaderPart += "mat3 cotangent_frame(vec3 N, vec3 p, vec2 uv)\n" +
        "{\n" +
        "    // get edge vectors of the pixel triangle\n" +
        "    vec3 dp1 = dFdx( p );\n" +
        "    vec3 dp2 = dFdy( p );\n" +
        "    vec2 duv1 = dFdx( uv );\n" +
        "    vec2 duv2 = dFdy( uv );\n" +
        "\n" +
        "    // solve the linear system\n" +
        "    vec3 dp2perp = cross( dp2, N );\n" +
        "    vec3 dp1perp = cross( N, dp1 );\n" +
        "    vec3 T = dp2perp * duv1.x + dp1perp * duv2.x;\n" +
        "    vec3 B = dp2perp * duv1.y + dp1perp * duv2.y;\n" +
        "\n" +
        "    // construct a scale-invariant frame\n" +
        "    float invmax = inversesqrt( max( dot(T,T), dot(B,B) ) );\n" +
        "    return mat3( T * invmax, B * invmax, N );\n" +
        "}\n\n";

    shaderPart += "vec3 perturb_normal( vec3 N, vec3 V, vec2 texcoord, vec3 bias )\n" +
        "{\n" +
        "    // assume N, the interpolated vertex normal and\n" +
        "    // V, the view vector (vertex to eye)\n" +
        "    vec3 map = texture2D(normalMap, texcoord ).xyz;\n" +
        "    map = 2.0 * map - 1.0;\n" +
        "    map = map * bias;\n" +
        "    mat3 TBN = cotangent_frame(N, -V, texcoord);\n" +
        "    return normalize(TBN * map);\n" +
        "}\n\n";

    return shaderPart;
};

/*******************************************************************************
 * tonemapping
 ********************************************************************************/
/*
x3dom.shader.toneMapping = function ()
{
    var shaderPart = "";

    shaderPart += "uniform float tonemappingOperator;\n";

    shaderPart += "vec3 tonemapReinhard(vec3 color) { \n" +
    "    return color / (color + vec3(1.0));\n" +
    "}\n\n";

    shaderPart += "vec3 uncharted2Tonemap(vec3 color) { \n" +
    "    float A = 0.15;\n" +
    "    float B = 0.50;\n" +
    "    float C = 0.10;\n" +
    "    float D = 0.20;\n" +
    "    float E = 0.02;\n" +
    "    float F = 0.30;\n" +

    "    return ((color*(A*color+C*B)+D*E)/(color*(A*color+B)+D*F))-E/F;\n" +
    "}\n\n";

    shaderPart += "vec3 tonemapUncharted2(vec3 color) { \n" +
    "    float W = 11.2;\n" +
    "   float exposureBias = 2.0;\n" +
    "    vec3 curr = uncharted2Tonemap(exposureBias * color);\n" +
    "    vec3 whiteScale = 1.0 / uncharted2Tonemap(vec3(W));\n" +
    "    return curr * whiteScale;\n" +
    "}\n\n";

    shaderPart += "vec3 tonemapeFilmic(vec3 color) { \n" +
    "    const float a = 2.51;\n" +
    "    const float b = 0.03;\n" +
    "    const float c = 2.43;\n" +
    "    const float d = 0.59;\n" +
    "    const float e = 0.14;\n" +
    "    return clamp((color * (a * color + b)) / (color * (c * color + d ) + e), 0.0, 1.0);\n" +
    "}\n\n";

    shaderPart += "vec3 tonemap(vec3 color) { \n" +
    "    if(tonemappingOperator == 0.0) {\n" +
    "       return color;\n" +
    "    }\n" +
    "    if(tonemappingOperator == 1.0) {\n" +
    "       return tonemapReinhard(color);\n" +
    "    }\n" +
    "    if(tonemappingOperator == 2.0) {\n" +
    "       return tonemapUncharted2(color);\n" +
    "    }\n" +
    "    if(tonemappingOperator == 3.0) {\n" +
    "       return tonemapeFilmic(color);\n" +
    "    }\n" +
    "}\n\n";

    return shaderPart;
};
*/

x3dom.shader.toneMapping = 
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
