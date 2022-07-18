/**
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2020 Andreas Plesch, Waltham, MA
 * Dual licensed under the MIT and GPL
 *
 * Based on code originally provided by
 * Philip Taylor: http://philip.html5.org
 */

/**
 * NodeNameSpace protoInstance
 *
 * called from setupTree to process a ProtoInstance node. creates another dom node in short syntax.
 * This short dom node is then processed back in setupTree. Additionally, it triggers loading an
 * ExternProto declaration if required.
 *
 * @param domNode - the ProtoInstance dom node
 * @param domParent - the parent dom node
 */
x3dom.NodeNameSpace.prototype.protoInstance = function ( domNode, domParent )
{
    if ( !domNode.localName ) {return;}
    if ( domNode._x3dom ) {return;}

    var name = domNode.getAttribute( "name" );
    //console.log( "found ProtoInstance", name, domNode );
    //may be USE without name
    if ( domNode.hasAttribute( "USE" ) )
    {
        var use = domNode.getAttribute( "USE" );
        var defNode = this.defMap[ use ];
        if ( defNode )
        {
            name = defNode.constructor._typeName;
        }
        else // try to find DEF in dom
        {
            name = domParent.getRootNode().querySelector( "[DEF=" + use + "]" ).getAttribute( "name" );
        }
    }
    var protoDeclaration = this.protos.find( function ( proto ) { return proto.name == name; } );
    if ( protoDeclaration == undefined )
    {
        x3dom.debug.logWarning( "ProtoInstance without a ProtoDeclaration " + name );
        return;
    }
    //construct dom node
    var protoInstanceDom = document.createElement( name );

    //DEF/USE
    if ( domNode.hasAttribute( "DEF" ) )
    {
        protoInstanceDom.setAttribute( "DEF", domNode.getAttribute( "DEF" ) );
    }

    else if ( domNode.hasAttribute( "USE" ) )
    {
        protoInstanceDom.setAttribute( "USE", domNode.getAttribute( "USE" ) );
    }

    if ( domNode.hasAttribute( "containerField" ) )
    {
        protoInstanceDom.setAttribute( "containerField", domNode.getAttribute( "containerField" ) );
    }

    //set fields to instance values
    domNode.querySelectorAll( ":scope > fieldValue , :scope > fieldvalue" )
        . forEach( function ( fieldValue )
        {
            var name = fieldValue.getAttribute( "name" );
            var cfValue = fieldValue.querySelectorAll( ":scope > *" );
            //check if Node value
            if ( cfValue.length > 0 )
            {
                cfValue.forEach( function ( val )
                {
                    val.setAttribute( "containerField", name );
                    protoInstanceDom.appendChild( val );
                } );
            }
            else
            {
                var value = fieldValue.getAttribute( "value" );
                if ( value )
                {
                    protoInstanceDom.setAttribute( name, value );
                }
            }
        } );

    if ( protoDeclaration.isExternProto && protoDeclaration.needsLoading )
    {
        this.loadExternProtoAsync( protoDeclaration, protoInstanceDom, domNode, domParent );
        return;
    }
    this.doc.mutationObserver.disconnect(); //avoid doubled processing
    domNode.insertAdjacentElement( "afterend", protoInstanceDom ); // do not use appendChild since scene parent may be already transferred
    var observedDOM = this.doc._x3dElem;
    if ( this.doc._scene )
    {
        observedDOM = this.doc._scene._xmlNode;
    }
    this.doc.mutationObserver.observe( observedDOM, { attributes: true, attributeOldValue: true, childList: true, subtree: true } );
    domNode._x3dom = protoInstanceDom;
};

/**
 * NodeNameSpace loadExternProtoAsync
 *
 * called from protoInstance to load an extern protoDeclaration, and then instance the node.
 *
 * ExternProto declaration if required.
 * @param protoDeclaration - the initial protoDeclaration stub, is replaced after loading
 * @param protoInstanceDom - the short syntax proto instance dom node
 * @param domNode - the regular syntax ProtoInstance dom node
 * @param parentDom - the parent dom node
 * @returns null - if downloading fails
 */
x3dom.NodeNameSpace.prototype.loadExternProtoAsync = function ( protoDeclaration, protoInstanceDom, domNode, parentDom )
{
    //use queue to ensure processing in correct sequence
    protoDeclaration.instanceQueue.push( {
        "protoInstanceDom" : protoInstanceDom,
        "domNode"          : domNode,
        "parentDom"        : parentDom,
        "targetChildIndex" : parentDom._x3domNode._childNodes.length + protoDeclaration.instanceQueue.length //since load is delayed
    } );
    domNode._x3dom = protoInstanceDom;
    var that = this;
    var urlIndex = 0;
    function fetchExternProto ()
    {
        var url = that.getURL( protoDeclaration.url [ urlIndex ] );
        that.doc.incrementDownloads();
        fetch( url )
            .then( function ( response )
            {
                if ( ! response.ok )
                {
                    throw new Error( "Network response was not OK: " + response.status );
                }
                return response.text();
            } )
            .then( function ( text )
            {
                var parser = new DOMParser();
                var doc = parser.parseFromString( text, "application/xml" );
                var scene = doc.querySelector( "X3D" );
                if ( scene == null )
                {
                    doc = parser.parseFromString( text, "text/html" );
                    scene = doc.querySelector( "X3D" );
                }
                //find hash
                var hash = url.includes( "#" ) ? url.split( "#" ).slice( -1 )[ 0 ] : "";
                var selector = hash == "" ? "ProtoDeclare" : "ProtoDeclare[name='" + hash + "']";
                var declareNode = scene.querySelector( selector );
                //transfer name
                declareNode.setAttribute( "name", protoDeclaration.name );

                that.confNameSpace = new x3dom.NodeNameSpace( protoDeclaration.name, that.doc ); // instance name space
                that.confNameSpace.setBaseURL( that.baseURL + protoDeclaration.name );
                //that.addSpace( that.confNameSpace );
                that.confNameSpace.setupTree( scene.querySelector( "Scene" ), scene );

                //transfer proto definitions from other externprotos to namespace if any
                that.confNameSpace.protos.forEach( function ( confProtoDeclaration )
                {
                    that.protos.push( confProtoDeclaration );
                } );

                //remove current placeholder declaration
                var currentIndex = that.protos.findIndex( function ( d )
                {
                    return d == protoDeclaration;
                } );
                that.protos.splice( currentIndex, 1 );
                that.protoDeclare( declareNode ); //add declaration as internal
                //TODO check actual fields against fields in protoDeclaration
                //warn if not matching but proceed ?
                //that.protos[that.protos.length-1].fields ==? protoDeclaration.fields

                //add instance(s) in order
                var instance;
                while ( instance = protoDeclaration.instanceQueue.shift() ) //process in correct sequence
                {
                    var parentDom = instance.parentDom;
                    var parentNode = parentDom._x3domNode;
                    var instanceDom = instance.protoInstanceDom;
                    var targetIndex = instance.targetChildIndex;
                    that.doc.mutationObserver.disconnect();//do not record mutation
                    if ( instance.domNode !== instanceDom ) //check for short syntax
                    {
                        instance.domNode.insertAdjacentElement( "afterend", instanceDom ); // do not use appendChild since scene parent may be already transferred
                    }
                    that.doc.mutationObserver.observe( that.doc._scene._xmlNode, { attributes: true, attributeOldValue: true, childList: true, subtree: true } );
                    that.doc.onNodeAdded( instanceDom, parentDom );
                    var childNodes = parentNode._childNodes;
                    var childIndex = childNodes.length - 1;
                    if ( targetIndex !== childIndex )
                    {
                        //rearrange childNodes
                        var swapper = childNodes[ targetIndex ];
                        var instanceNode = childNodes[ childIndex ];
                        childNodes[ targetIndex ] = instanceNode;
                        childNodes[ childIndex ] = swapper;
                        //also containerfield array
                        var fieldName = parentDom.getAttribute( "containerField" );
                        var children = ( fieldName in parentNode._cf ) && parentNode._cf[ fieldName ];
                        if ( !children )
                        {
                            for ( var fieldName in parentNode._cf )
                            {
                                var field = parentNode._cf[ fieldName ];
                                if ( x3dom.isa( instanceNode, field.type ) )
                                {
                                    children = field;
                                    break;
                                }
                            }
                        }
                        children[ targetIndex ] = instanceNode;
                        children[ childIndex ] = swapper;
                    }

                    that.lateRoutes.forEach( function ( route )
                    {
                        var fromNode = that.defMap[ route.fnDEF ];
                        var toNode = that.defMap[ route.tnDEF ];
                        if ( ( fromNode && toNode ) )
                        {
                            x3dom.debug.logInfo( "fixed ROUTE: from=" + fromNode._DEF + ", to=" + toNode._DEF );
                            fromNode.setupRoute( route.fnAtt, toNode, route.tnAtt );
                            route.route._nodeNameSpace = that;
                        }
                    } );
                    if ( that.superInlineNode && that.superInlineNode._nameSpace )
                    {
                        that.superInlineNode._nameSpace.importNodes( that );
                    }
                };
                protoDeclaration.needsLoading = false;
                that.doc.decrementDownloads();
            } )
            .catch( function ( error )
            {
                x3dom.debug.logWarning( url + ": ExternProto fetch failed: " + error );
                that.doc.decrementDownloads();
                urlIndex++;
                if ( urlIndex < protoDeclaration.url.length )
                {
                    fetchExternProto();
                }
                else
                {
                    x3dom.debug.logError( "ExternProto fetch failed for all urls." );
                    protoDeclaration.needsLoading = false;
                    return null;
                }
            } );
    };
    fetchExternProto();
};

/**
 * NodeNameSpace externProtoDeclare
 *
 * adds initial proto declaration to available prototype array
 *
 * @param domNode - the regular syntax ProtoInstance dom node
 */
x3dom.NodeNameSpace.prototype.externProtoDeclare = function ( domNode )
{
    var name = domNode.getAttribute( "name" );
    var url = x3dom.fields.MFString.parse( domNode.getAttribute( "url" ) );
    //TODO parse fields to check later against actual fields in file
    var fields = null;
    var protoDeclaration = new x3dom.ProtoDeclaration( this, name, null, fields, true, url );
    this.protos.push( protoDeclaration );
    //protoinstance checks for name and triggers loading
};

/**
 * NodeNameSpace protoDeclare
 *
 * processes ProtoDeclare node, called from setupTree.
 * generates a new protoDeclaration, and then uses it to register the new node to x3dom
 *
 * @param domNode - the ProtoDeclaration dom node
 */
x3dom.NodeNameSpace.prototype.protoDeclare = function ( domNode )
{
    var name = domNode.getAttribute( "name" );

    var protoInterface = domNode.querySelector( "ProtoInterface" );

    var fields = [];
    if ( protoInterface )
    {
        var domFields = protoInterface.querySelectorAll( "field" );
        domFields.forEach( function ( node )
        {
            fields.push( {
                "name"       : node.getAttribute( "name" ),
                "accessType" : node.getAttribute( "accessType" ),
                "dataType"   : node.getAttribute( "type" ),
                "value"      : node.getAttribute( "value" ),
                "cfValue"    : node.querySelectorAll( ":scope > *" )
            } );
        } );
    }

    var protoBody = domNode.querySelector( "ProtoBody" );

    if ( protoBody )
    {
        //find IS and make internal route template
        protoBody._ISRoutes = {};

        protoBody.querySelectorAll( "IS" ).forEach( function ( ISnode )
        {
            //check if inside another nested ProtoDeclare protobody
            var parentBody = ISnode.parentElement;
            while ( parentBody.localName.toLowerCase() !== "protobody" )
            {
                parentBody = parentBody.parentElement;
            }
            if ( parentBody !== protoBody ) {return;} // skip

            ISnode.querySelectorAll( "connect" ).forEach( function ( connect )
            {
                var ISparent = ISnode.parentElement;
                //assign unique DEF to parent if needed
                if ( ISparent.hasAttribute( "DEF" ) == false )
                {
                    var defname = "_proto_" +
                        ISparent.tagName + "_"
                        + x3dom.protoISDEFuid++ ;
                    ISparent.setAttribute( "DEF", defname );
                    //add to defmap if protoinstance which has been already parsed
                    if ( ISparent.localName.toLowerCase() == "protoinstance" )
                    {
                        if ( ISparent._x3domNode )
                        {
                            ISparent._x3domNode._DEF = defname ;
                            ISparent._x3domNode.typeNode._nameSpace.defMap[ defname ] = ISparent._x3domNode ;
                        }
                    }
                }
                var protoField = connect.getAttribute( "protoField" );
                var nodeDEF =  ISparent.getAttribute( "DEF" );
                var nodeField = connect.getAttribute( "nodeField" );
                if ( !protoBody._ISRoutes[ protoField ] )
                {
                    protoBody._ISRoutes[ protoField ] = [];
                }
                protoBody._ISRoutes[ protoField ].push( {
                    "nodeDEF"   : nodeDEF,
                    "nodeField" : nodeField
                } );
            } );
        } );

        var protoDeclaration = new x3dom.ProtoDeclaration( this, name, protoBody, fields );
        protoDeclaration.registerNode();
        this.protos.push( protoDeclaration );
    }
    else
    {
        x3dom.debug.logWarning( "ProtoDeclare without a ProtoBody definition: " + domNode.name );
    }
    return "ProtoDeclare";
};

// uid for generated proto defs
x3dom.protoISDEFuid = 0;
