const args = process.argv.slice( 2 ); // 去除前两个默认参数（node和脚本路径）
//console.log(args[0]); // 第一个参数
var array = args[ 0 ].split( "," );
array.pop();
//console.log(array[0]);
//var dst = array.join( "\n" );
//console.log(dst);
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
dst = dst.substr( 0, dst.length - 1 );
console.log( dst );