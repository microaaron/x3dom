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
    dst += ( "new" + str2 + "\(\)\{return new x3dom.WebGPU.XXX\(\)\;\}\n" );
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
    var a = a.split( "-" )[ 0 ].split( "." );
    var b = b.split( "-" )[ 0 ].split( "." );
    for ( var i = 0; i < a.length && i < b.length; i++ )
    {
        if ( a[ i ] != b[ i ] )
        {return a[ i ] - b[ i ];}
    }
} );
for ( var i = 0; i < array.length; i++ )
{
    array[ i ] = "            \"" + array[ i ].split( " " )[ 1 ] + "\",";
}
dst = array.join( "\n" );
prompt( dst, dst );