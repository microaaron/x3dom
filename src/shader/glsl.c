#ifdef GL_FRAGMENT_PRECISION_HIGH
 precision highp float;
#else
 precision mediump float;
#endif

//@insertFragColor
uniform float isVR;
varying float vrOffset;
varying float fragEyeIdx;
uniform float screenWidth;
uniform vec3 cameraPosWS;
uniform float alphaCutoff;
uniform vec3  diffuseColor;
uniform vec3  specularColor;
uniform vec3  emissiveColor;
uniform float shininess;
uniform float transparency;
uniform float ambientIntensity;
uniform float tonemappingOperator;
vec3 tonemapReinhard(vec3 color) { 
    return color / (color + vec3(1.0));
}

vec3 uncharted2Tonemap(vec3 color) { 
    float A = 0.15;
    float B = 0.50;
    float C = 0.10;
    float D = 0.20;
    float E = 0.02;
    float F = 0.30;
    return ((color*(A*color+C*B)+D*E)/(color*(A*color+B)+D*F))-E/F;
}

vec3 tonemapUncharted2(vec3 color) { 
    float W = 11.2;
   float exposureBias = 2.0;
    vec3 curr = uncharted2Tonemap(exposureBias * color);
    vec3 whiteScale = 1.0 / uncharted2Tonemap(vec3(W));
    return curr * whiteScale;
}

vec3 tonemapeFilmic(vec3 color) { 
    const float a = 2.51;
    const float b = 0.03;
    const float c = 2.43;
    const float d = 0.59;
    const float e = 0.14;
    return clamp((color * (a * color + b)) / (color * (c * color + d ) + e), 0.0, 1.0);
}

vec3 tonemap(vec3 color) { 
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
}

varying vec4 fragPosition;
varying vec4 fragPositionWS;
uniform float isOrthoView;
varying vec3 fragNormal;
uniform float light0_On;
uniform float light0_Type;
uniform vec3  light0_Location;
uniform vec3  light0_Direction;
uniform vec3  light0_Color;
uniform vec3  light0_Attenuation;
uniform float light0_Radius;
uniform float light0_Intensity;
uniform float light0_AmbientIntensity;
uniform float light0_BeamWidth;
uniform float light0_CutOffAngle;
uniform float light0_ShadowIntensity;
void lighting(in float lType, in vec3 lLocation, in vec3 lDirection, in vec3 lColor, in vec3 lAttenuation, in float lRadius, in float lIntensity, in float lAmbientIntensity, in float lBeamWidth, in float lCutOffAngle, in vec3 positionVS, in vec3 N, in vec3 V, float shin, float ambIntensity, vec3 reflectivity, inout vec3 ambient, inout vec3 diffuse, inout vec3 specular)
{
   vec3 L;
   float spot = 1.0, attentuation = 0.0;
   if(lType == 0.0) {
       L = -normalize(lDirection);
        V = normalize(V);
        attentuation = 1.0;
   } else{
       L = (lLocation - (-V));
       float d = length(L);
        L = normalize(L);
        V = normalize(V);
       if(lRadius == 0.0 || d <= lRadius) {
           attentuation = 1.0 / max(lAttenuation.x + lAttenuation.y * d + lAttenuation.z * (d * d), 1.0);
        }
       if(lType == 2.0) {
           float spotAngle = acos(max(0.0, dot(-L, normalize(lDirection))));
           if(spotAngle >= lCutOffAngle) spot = 0.0;
           else if(spotAngle <= lBeamWidth) spot = 1.0;
           else spot = (spotAngle - lCutOffAngle ) / (lBeamWidth - lCutOffAngle);
       }
   }
   vec3  H = normalize( L + V );
   float NdotL = clamp(dot(L, N), 0.0, 1.0);
   float NdotH = clamp(dot(H, N), 0.0, 1.0);
   float ambientFactor  = lAmbientIntensity * ambIntensity;
   float diffuseFactor  = lIntensity * NdotL;
   float specularFactor = lIntensity * pow(NdotH, shin*128.0);
   ambient  += lColor * ambientFactor * attentuation * spot;
   diffuse  += lColor * diffuseFactor * attentuation * spot;
   specular += lColor * specularFactor * attentuation * spot;
}
const vec4 gammaEncode4Vector = vec4(0.4545454545454545, 0.4545454545454545, 0.4545454545454545, 1.0);
const vec4 gammaDecode4Vector = vec4(2.2, 2.2, 2.2, 1.0);
vec4 gammaEncode(vec4 color){
    return pow(abs(color), gammaEncode4Vector);
}
vec4 gammaDecode(vec4 color){
    return pow(abs(color), gammaDecode4Vector);
}
const vec3 gammaEncode3Vector = vec3(0.4545454545454545, 0.4545454545454545, 0.4545454545454545);
const vec3 gammaDecode3Vector = vec3(2.2, 2.2, 2.2);
vec3 gammaEncode(vec3 color){
    return pow(abs(color), gammaEncode3Vector);
}
vec3 gammaDecode(vec3 color){
    return pow(abs(color), gammaDecode3Vector);
}
void main(void) {
if(fragEyeIdx == 1.0){
}
if ( isVR == 1.0) {
    if ( ( step( 0.5, gl_FragCoord.x / screenWidth ) - 0.5 ) * vrOffset < 0.0 ) discard;
}
vec4 color;
vec4 texColor;
color.rgb = diffuseColor;
color.a = 1.0 - transparency;
vec3 _emissiveColor     = emissiveColor;
float _shininess        = shininess;
vec3 _specularColor     = specularColor;
float _ambientIntensity = ambientIntensity;
float _transparency     = transparency;
float _occlusion        = 1.0;
vec3 ambient   = vec3(0.0, 0.0, 0.0);
vec3 diffuse   = vec3(0.0, 0.0, 0.0);
vec3 specular  = vec3(0.0, 0.0, 0.0);
vec3 eye;
vec3 positionVS = fragPosition.rgb;
if ( isOrthoView > 0.0 ) {
    eye = vec3(0.0, 0.0, 1.0);
} else {
    eye = -fragPosition.xyz;
}
vec3 normal = normalize(fragNormal);
 lighting(light0_Type, light0_Location, light0_Direction, light0_Color, light0_Attenuation, light0_Radius, light0_Intensity, light0_AmbientIntensity, light0_BeamWidth, light0_CutOffAngle, positionVS, normal, eye, _shininess, _ambientIntensity, _specularColor, ambient, diffuse, specular);
ambient = max(ambient, 0.0);
diffuse = max(diffuse, 0.0);
specular = max(specular, 0.0);
color.rgb = _emissiveColor + ((ambient + diffuse) * color.rgb + specular * _specularColor) * _occlusion;
if (color.a <= alphaCutoff) discard;
if(tonemappingOperator == 1.0) {
       color.rgb = tonemapReinhard(color.rgb);
    }
    if(tonemappingOperator == 2.0) {
       color.rgb = tonemapUncharted2(color.rgb);
    }
    if(tonemappingOperator == 3.0) {
       color.rgb = tonemapeFilmic(color.rgb);
    }
color = gammaEncode (color);
gl_FragColor = color;
}