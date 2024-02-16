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