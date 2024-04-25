@group(0) @binding(5) var<uniform> alphaCutoff: f32;
@group(0) @binding(6) var<uniform> diffuseColor: vec3<f32>;
@group(0) @binding(7) var<uniform> specularColor: vec3<f32>;
@group(0) @binding(8) var<uniform> emissiveColor: vec3<f32>;
@group(0) @binding(9) var<uniform> shininess: f32;
@group(0) @binding(10) var<uniform> transparency: f32;
@group(0) @binding(11) var<uniform> ambientIntensity: f32;
@group(0) @binding(14) var<uniform> tonemappingOperator: f32;
@group(1) @binding(0) var<uniform> screenWidth: f32;
@group(1) @binding(1) var<uniform> cameraPosWS: vec3<f32>;
@group(1) @binding(2) var<uniform> numberOfLights: u32;
@group(1) @binding(4) var<uniform> isOrthoView: u32;
@group(1) @binding(5) var<storage> lights: array<light>;

fn tonemapReinhard(color: vec3<f32>)->vec3<f32>{
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
struct light {
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
var<private> gammaEncode4Vector: vec4<f32> = vec4<f32>(0.4545454545454545, 0.4545454545454545, 0.4545454545454545, 1.0);
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
};
struct FragmentOutput {
  //@builtin(frag_depth) depth: f32,
  //@builtin(sample_mask) mask_out: u32,
  @location(0) fragColor0: vec4<f32>
}
@fragment
fn fs_main(
  //@builtin(front_facing) is_front: bool,
  //@builtin(position) coord: vec4<f32>,
  //@builtin(sample_index) my_sample_index: u32,
  //@builtin(sample_mask) mask_in: u32,
  @location(0) fragNormal: vec3<f32>,@location(1) fragPosition: vec4<f32>,@location(2) fragPositionWS: vec4<f32>
) -> FragmentOutput {
  var fragmentOutput: FragmentOutput;
var color: vec4<f32>;
var texColor: vec4<f32>;
color = vec4<f32>(diffuseColor,1.0 - transparency);
var _emissiveColor: vec3<f32> = emissiveColor;
var _shininess: f32 = shininess;
var _specularColor: vec3<f32> = specularColor;
var _ambientIntensity: f32 = ambientIntensity;
var _transparency: f32 = transparency;
var _occlusion: f32 = 1.0;var ambient: vec3<f32> = vec3(0.0, 0.0, 0.0);
var diffuse: vec3<f32> = vec3(0.0, 0.0, 0.0);
var specular: vec3<f32> = vec3(0.0, 0.0, 0.0);
var eye: vec3<f32>;
var positionVS: vec3<f32> = fragPosition.rgb;
if ( isOrthoView > 0 ) {
  eye = vec3<f32>(0.0, 0.0, 1.0);
}else{
  eye = -fragPosition.xyz;
}
var normal: vec3<f32> = normalize(fragNormal);
for(var i: u32 = 0; i < numberOfLights; i++){
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
color = vec4<f32>(_emissiveColor + ((ambient + diffuse) * color.rgb + specular * _specularColor) * _occlusion,color.a);
if(tonemappingOperator == 1.0) {
  color = vec4<f32>(tonemapReinhard(color.rgb),color.a);
}
if(tonemappingOperator == 2.0) {
  color = vec4<f32>(tonemapUncharted2(color.rgb),color.a);
}
if(tonemappingOperator == 3.0) {
  color = vec4<f32>(tonemapeFilmic(color.rgb),color.a);
}
color = gammaEncodeVec4(color);
fragmentOutput.fragColor0 = color;
return fragmentOutput;
}