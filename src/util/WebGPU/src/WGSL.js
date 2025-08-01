/**
 * @file WGSL.js
 * @author microaaron(github.com/microaaron)
 * @date 2024.03
 */
x3dom.WGSL = {
    //ref: https://www.w3.org/TR/WGSL/#alignment-and-size
    alignOf : function ( hostShareableType )
    {
        var match;
        switch ( true )
        {
            case /^f16$/.test( hostShareableType ):
                return 2;
                break;
            case /^i32$|^u32$|^f32$|^atomic<.*>$/.test( hostShareableType ):
                return 4;
                break;
            case ( match = hostShareableType.match( /^vec(\d+)(.*)$/ ) ) ? true : false:
                var N = Number( match[ 1 ] );//element count of the vector
                var T = match[ 2 ];//<type>
                if ( N == 3 ){N++;}
                switch ( true )
                {
                    case ( match = T.match( /^<(.*)>$/ ) ) ? true : false:
                        return N * x3dom.WGSL.sizeOf( match[ 1 ] );
                        break;
                    case /^i$|^u$|^f$/.test( T ):
                        return N * 4;
                        break;
                    case /^h$/.test( T ):
                        return N * 2;
                        break;
                    default:
                        return 0;
                        break;
                }
            case ( match = hostShareableType.match( /^mat\d+x(\d+)(.*)$/ ) ) ? true : false:
                var R = Number( match[ 1 ] );//rows
                var T = match[ 2 ];//<type>
                return x3dom.WGSL.alignOf( `vec${R}${T}` );
                break;
            case ( match = hostShareableType.match( /^array<(.*),\d+>$/ ) ) ? true : false:
            case ( match = hostShareableType.match( /^array<(.*)(?<!,\d+)>$/ ) ) ? true : false:
                var E = match[ 1 ];//element
                return x3dom.WGSL.alignOf( E );
                break;
            default:
                //Structure size cannot be automatically calculated
                return 0;
                break;
        }
    },
    sizeOf : function ( hostShareableType )
    {
        var match;
        switch ( true )
        {
            case /^f16$/.test( hostShareableType ):
                return 2;
                break;
            case /^i32$|^u32$|^f32$|^atomic<.*>$/.test( hostShareableType ):
                return 4;
                break;
            case ( match = hostShareableType.match( /^vec(\d+)(.*)$/ ) ) ? true : false:
                var N = Number( match[ 1 ] );//element count of the vector
                var T = match[ 2 ];//<type>
                switch ( true )
                {
                    case ( match = T.match( /^<(.*)>$/ ) ) ? true : false:
                        return N * x3dom.WGSL.sizeOf( match[ 1 ] );
                        break;
                    case /^i$|^u$|^f$/.test( T ):
                        return N * 4;
                        break;
                    case /^h$/.test( T ):
                        return N * 2;
                        break;
                    default:
                        return 0;
                        break;
                }
                break;
            case ( match = hostShareableType.match( /^mat(\d+)x(\d+)(.*)$/ ) ) ? true : false:
                var C = Number( match[ 1 ] );//columns
                var R = Number( match[ 2 ] );//rows
                var T = match[ 3 ];//<type>
                return x3dom.WGSL.sizeOf( `array<vec${R}${T},${C}>` );
                break;
            case ( match = hostShareableType.match( /^array<(.*),(\d+)>$/ ) ) ? true : false:
                var E = match[ 1 ];//element
                var N = Number( match[ 2 ] );//element count of the array
                var sizeOfE = x3dom.WGSL.sizeOf( E );
                var alignOfE = x3dom.WGSL.alignOf( E );
                return N * ( Math.ceil( sizeOfE / alignOfE ) * alignOfE );
                break;
            default:
                //Runtime-sized array (array<E>) size cannot be automatically calculated
                //Structure size cannot be automatically calculated
                return 0;
                break;
        }
    }
};