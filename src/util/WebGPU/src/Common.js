x3dom.WebGPU = {};

var array = [];

var sets = [];
var news = [];
var getAvailables = [];

var dst;

var array = [];
dst = "";
for ( var str of array )
{
    var str2 = str.replaceAll( "-", "_" );
    dst += ( str2 + "=\"" + str + "\"\;\n" );
    console.log( str2 + "=\"" + str + "\"\;" );
}
prompt( dst, dst );

//this
var src = "";
dst = "";
array = src.split( "," );
for ( var str of array )
{
    str = str.trim();
    dst += ( "this." + str + "=" + str + "\;\n" );
}
console.log( dst );
prompt( dst, dst );

//set
var src = "";
dst = "";
array = src.split( "," );
for ( var str of array )
{
    str = str.trim();
    var str2 = str.substr( 0, 1 ).toUpperCase() + str.substr( 1 );
    dst += ( "set" + str2 + "\(" + str + "\)\{this." + str + "=" + str + "\;\}\n" );
}
console.log( dst );
prompt( dst, dst );

//new
var src = "";
dst = "";
array = src.split( "," );
for ( var str of array )
{
    str = str.trim();
    var str2 = str.substr( 0, 1 ).toUpperCase() + str.substr( 1 );
    dst += ( "new" + str2 + "\(XXX\)\{return new x3dom.WebGPU.XXX\(XXX\)\;\}\n" );
}
console.log( dst );
prompt( dst, dst );

//getAvailable
var src = "";
dst = "";
array = src.split( "," );
for ( var str of array )
{
    str = str.trim();
    var str2 = str.substr( 0, 1 ).toUpperCase() + str.substr( 1 );
    dst += ( "getAvailable" + str2 + "s\(\)\{return new x3dom.WebGPU.XXX\(\)\;\}\n" );
}
console.log( dst );
prompt( dst, dst );

array = [];
array.sort( function ( a, b )
{
    var a0 = a.split( "-" )[ 0 ].split( "." );
    var b0 = b.split( "-" )[ 0 ].split( "." );
    for ( var i = 0; i < a0.length && i < b0.length; i++ )
    {
        if ( a0[ i ] != b0[ i ] )
        {
            return a0[ i ] - b0[ i ];
        }
    }
    if ( a0.length != b0.length )
    {
        return a0.length - b0.length;
    }
    var a1  = a.split( "-" )[ 1 ].split( " " );
    var b1 = b.split( "-" )[ 1 ].split( " " );
    if ( a1[ 0 ] != b1[ 0 ] )
    {
        return a1[ 0 ] - b1[ 0 ];
    }
} );
for ( var i = 0; i < array.length; i++ )
{
    array[ i ] = "            \"" + array[ i ].split( " " )[ 1 ] + "\",";
}
dst = array.join( "\n" );
prompt( dst, dst );

r = new x3dom.WebGPU.GPURenderPipelineDescriptor();
r.depthStencil = r.newDepthStencil();
r.depthStencil.getAvailableFormats();
r.depthStencil.getAvailableDepthCompares();
r.depthStencil.setStencilFront( r.depthStencil.newStencilFront() );
r.depthStencil.setStencilBack( r.depthStencil.newStencilBack() );
r.depthStencil.stencilFront.getAvailableCompares();
r.depthStencil.stencilFront.getAvailableFailOps();
r.depthStencil.stencilFront.getAvailableDepthFailOps();
r.depthStencil.stencilFront.getAvailablePassOps();

r.fragment = r.newFragment();
r.fragment.targets.push( r.fragment.newTarget() );
r.fragment.targets[ 0 ].blend = r.fragment.targets[ 0 ].newBlend();
r.fragment.targets[ 0 ].blend.alpha.getAvailableOperations();
r.fragment.targets[ 0 ].blend.alpha.getAvailableSrcFactors();
r.fragment.targets[ 0 ].blend.alpha.getAvailableDstFactors();
r.fragment.targets[ 0 ].blend.color.getAvailableOperations();
r.fragment.targets[ 0 ].blend.color.getAvailableSrcFactors();
r.fragment.targets[ 0 ].blend.color.getAvailableDstFactors();

r.fragment.targets[ 0 ].getAvailableFormats();
r.fragment.targets[ 0 ].getAvailableWriteMasks();

r.fragment.constants = r.fragment.newConstants();

r.setMultisample( r.newMultisample() );

r.setPrimitive( r.newPrimitive() );
r.primitive.getAvailableTopologys();
r.primitive.getAvailableStripIndexFormats();
r.primitive.getAvailableFrontFaces();
r.primitive.getAvailableCullModes();

r.vertex.setBuffers( [ r.vertex.newBuffer() ] );
r.vertex.buffers[ 0 ].setAttributes( [ r.vertex.buffers[ 0 ].newAttribute() ] );
r.vertex.buffers[ 0 ].attributes[ 0 ].getAvailableFormats();

r.vertex.buffers[ 0 ].getAvailableStepModes();

r.vertex.constants = r.vertex.newConstants();

/*
@group(0) @binding(5) var<uniform> isVR: u32;
@group(0) @binding(6) var<uniform> screenWidth: f32;
@group(0) @binding(7) var<uniform> cameraPosWS: vec3<f32>;
@group(0) @binding(8) var<uniform> alphaCutoff: f32;
@group(0) @binding(9) var<uniform> diffuseColor: vec3<f32>;
@group(0) @binding(10) var<uniform> specularColor: vec3<f32>;
@group(0) @binding(11) var<uniform> emissiveColor: vec3<f32>;
@group(0) @binding(12) var<uniform> shininess: f32;
@group(0) @binding(13) var<uniform> transparency: f32;
@group(0) @binding(14) var<uniform> ambientIntensity: f32;
@group(0) @binding(18) var<uniform> isOrthoView: u32;
@group(0) @binding(21) var<uniform> light0_On: f32;
@group(0) @binding(22) var<uniform> light0_On: f32;
@group(0) @binding(23) var<uniform> light0_Type: f32;
@group(0) @binding(24) var<uniform> light0_Location: vec3<f32>;
@group(0) @binding(25) var<uniform> light0_Direction: vec3<f32>;
@group(0) @binding(26) var<uniform> light0_Color: vec3<f32>;
@group(0) @binding(27) var<uniform> light0_Attenuation: vec3<f32>;
@group(0) @binding(28) var<uniform> light0_Radius: f32;
@group(0) @binding(29) var<uniform> light0_Intensity: f32;
@group(0) @binding(30) var<uniform> light0_AmbientIntensity: f32;
@group(0) @binding(31) var<uniform> light0_BeamWidth: f32;
@group(0) @binding(32) var<uniform> light0_CutOffAngle: f32;
@group(0) @binding(33) var<uniform> light0_ShadowIntensity: f32;

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
}fn lighting(lType: f32,
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
}var<private> gammaEncode4Vector: vec4<f32> = vec4<f32>(0.4545454545454545, 0.4545454545454545, 0.4545454545454545, 1.0);
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
  var fragmentOutput: FragmentOutput ;var color: vec4<f32>;
var texColor: vec4<f32>;
color.rgb = diffuseColor;
color.a = 1.0 - transparency;
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
lighting(light0_Type,
light0_Location,
light0_Direction,
light0_Color,
light0_Attenuation,
light0_Radius,
light0_Intensity,
light0_AmbientIntensity,
light0_BeamWidth,
light0_CutOffAngle,
positionVS, normal, eye, _shininess, _ambientIntensity, _specularColor, &ambient, &diffuse, &specular);
ambient = max(ambient, 0.0);
diffuse = max(diffuse, 0.0);
specular = max(specular, 0.0);
color.rgb = _emissiveColor + ((ambient + diffuse) * color.rgb + specular * _specularColor) * _occlusion;
if(tonemappingOperator == 1.0) {
  color.rgb = tonemapReinhard(color.rgb);
}
if(tonemappingOperator == 2.0) {
  color.rgb = tonemapUncharted2(color.rgb);
}
if(tonemappingOperator == 3.0) {
  color.rgb = tonemapeFilmic(color.rgb);
}
color = gammaEncodeVec4(color)fragmentOutput.fragColor0 = color;
return fragmentOutput;
}
*/