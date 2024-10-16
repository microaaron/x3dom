/**
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * Dual licensed under the MIT and GPL
 *
 * Based on code originally provided by
 * Philip Taylor: http://philip.html5.org
 */

/**
 * Namespace container for Runtime module
 * @namespace x3dom.runtime
 */
x3dom.runtime = {};

/**
 * Runtime
 *
 * Runtime proxy object to get and set runtime parameters. This object
 * is attached to each X3D element and can be used in the following manner:
 *
 * > var e = document.getElementById('the_x3delement');
 * > e.runtime.showAll();
 * > e.runtime.resetView();
 * > ...
 *
 * @param doc
 * @param canvas
 * @constructor
 */
x3dom.Runtime = function ( doc, canvas )
{
    this.doc = doc;
    this.canvas = canvas;
    this.config = {};
    this.isReady = false;
    this.fps = 0;

    this.VRMode = false;

    this.states = { measurements: [], infos: [] };
};

/**
 * Add Measurement
 *
 * @param title
 * @param value
 */
x3dom.Runtime.prototype.addMeasurement = function ( title, value )
{
    this.states.measurements[ title ] = value;
};

/**
 * Remove Measurement
 *
 * @param title
 */
x3dom.Runtime.prototype.removeMeasurement = function ( title )
{
    if ( this.states.measurements[ title ] )
    {
        delete this.states.measurements[ title ];
    }
};

/**
 * Add Info
 *
 * @param title
 * @param value
 */
x3dom.Runtime.prototype.addInfo = function ( title, value )
{
    this.states.infos[ title ] = value;
};

/**
 * Remove Info
 *
 * @param title
 */
x3dom.Runtime.prototype.removeInfo = function ( title )
{
    delete this.states.infos[ title ];
};

/**
 * Initialize
 *
 * @param doc
 * @param canvas
 */
x3dom.Runtime.prototype.initialize = function ( doc, canvas )
{
    this.doc = doc;
    this.canvas = canvas;

    // place to hold configuration data, i.e. flash backend path, etc.
    // format and structure needs to be decided.
    this.config = {};
    this.isReady = false;

    this.fps = 0;
};

/**
 * APIFunction: noBackendFound
 *
 * This method is called once the system initialized and is not ready to
 * render the first time because there is no backend found. By default this
 * method noop. You can however override it with your own implementation.
 *
 * > x3dom.runtime.noBackendFound = function() {
 * >    alert("Dingel Dingel Ding Dong...");
 * > }
 *
 * It is important to create this override before the document onLoad event has
 * fired. Therefore putting it directly under the inclusion of x3dom.js is the
 * preferred way to ensure overloading of this function.
 */
x3dom.Runtime.prototype.noBackendFound = function ()
{
    x3dom.debug.logInfo( "No backend found. Unable to render." );
};

/**
 * APIFunction: ready
 *
 * This method is called once the system initialized and is ready to render
 * the first time. It is therefore possible to execute custom
 * action by overriding this method in your code:
 *
 * > x3dom.runtime.ready = function() {
 * >    alert("About to render something the first time");
 * > }
 *
 * It is important to create this override before the document onLoad event has fired.
 * Therefore putting it directly under the inclusion of x3dom.js is the preferred
 * way to ensure overloading of this function.
 *
 * Parameters:
 *         element - The x3d element this handler is acting upon
 */
x3dom.Runtime.prototype.ready = function ()
{
    x3dom.debug.logInfo( "System ready." );
};

/**
 * APIFunction: enterFrame
 *
 * This method is called just before the next frame is
 * rendered. It is therefore possible to execute custom
 * action by overriding this method in your code:
 *
 * > var element = document.getElementById('my_element');
 * > element.runtime.enterFrame = function() {
 *     alert('hello custom enter frame');
 * };
 *
 * If you have more than one X3D element in your HTML
 * During initialization, just after ready() executed and before the very first frame
 * is rendered, only the global override of this method works. If you need to execute
 * code before the first frame renders, it is therefore best to use the ready()
 * function instead.
 *
 * Parameters:
 *         element - The x3d element this handler is acting upon
 */
x3dom.Runtime.prototype.enterFrame = function ()
{
    //x3dom.debug.logInfo('Render frame imminent');
    // to be overwritten by user
};

/**
 * APIFunction: exitFrame
 *
 * This method is called just after the current frame was
 * rendered. It is therefore possible to execute custom
 * action by overriding this method in your code:
 *
 * > var element = document.getElementById('my_element');
 * > element.runtime.exitFrame = function() {
 *     alert('hello custom exit frame');
 * };
 *
 * Parameters:
 *         element - The x3d element this handler is acting upon
 */
x3dom.Runtime.prototype.exitFrame = function ()
{
    //x3dom.debug.logInfo('Render frame finished');
    // to be overwritten by user
};

/**
 * APIFunction: triggerRedraw
 *
 * Triggers a redraw of the scene.
 */
x3dom.Runtime.prototype.triggerRedraw = function ()
{
    this.canvas.doc.needRender = true;
};

/**
 * APIFunction: getActiveBindable
 *
 * Returns the currently active bindable DOM element of the given type.
 * typeName must be a valid Bindable node (e.g. Viewpoint, Background, etc.).
 *
 * For example:
 *
 *   > var element, bindable;
 *   > element = document.getElementById('the_x3delement');
 *   > bindable = element.runtime.getActiveBindable('background');
 *   > bindable.setAttribute('bind', 'false');
 *
 * @param typeName - Bindable type name
 *
 * @returns The active DOM element
 */
x3dom.Runtime.prototype.getActiveBindable = function ( typeName )
{
    var stacks,
        i,
        current,
        result,
        type;

    stacks = this.canvas.doc._bindableBag._stacks;
    result = [];

    type = x3dom.nodeTypesLC[ typeName.toLowerCase() ];

    if ( !type )
    {
        x3dom.debug.logError( "No node of type \"" + typeName + "\" found." );
        return null;
    }

    for ( i = 0; i < stacks.length; i++ )
    {
        current = stacks[ i ].getActive();
        if ( current._xmlNode !== undefined && x3dom.isa( current, type ) )
        {
            result.push( current );
        }
    }
    return result[ 0 ] ? result[ 0 ]._xmlNode : null;
};

/**
 * APIFunction: nextView
 *
 * Navigates to the next viewpoint.
 */
x3dom.Runtime.prototype.nextView = function ()
{
    var stack = this.canvas.doc._scene.getViewpoint()._stack;
    if ( stack )
    {
        stack.switchTo( "next" );
    }
    else
    {
        x3dom.debug.logError( "No valid ViewBindable stack." );
    }
};

/**
 * APIFunction: prevView
 *
 * Navigates tho the previous viewpoint.
 */
x3dom.Runtime.prototype.prevView = function ()
{
    var stack = this.canvas.doc._scene.getViewpoint()._stack;
    if ( stack )
    {
        stack.switchTo( "prev" );
    }
    else
    {
        x3dom.debug.logError( "No valid ViewBindable stack." );
    }
};

/**
 * Function: viewpoint
 *
 * Returns the current viewpoint.
 *
 * @returns The viewpoint
 */
x3dom.Runtime.prototype.viewpoint = function ()
{
    return this.canvas.doc._scene.getViewpoint();
};

/**
 * Function: viewMatrix
 *
 * Returns the current view matrix.
 *
 * @returns Matrix object
 */
x3dom.Runtime.prototype.viewMatrix = function ()
{
    return this.canvas.doc._viewarea.getViewMatrix();
};

/**
 * Function: projectionMatrix
 *
 * Returns the current projection matrix.
 *
 * Returns:
 *         Matrix object
 */
x3dom.Runtime.prototype.projectionMatrix = function ()
{
    return this.canvas.doc._viewarea.getProjectionMatrix();
};

/**
 * Function: getWorldToCameraCoordinatesMatrix
 *
 * Returns the current world to camera coordinates matrix.
 *
 * @returns Matrix object
 */
x3dom.Runtime.prototype.getWorldToCameraCoordinatesMatrix = function ()
{
    return this.canvas.doc._viewarea.getWCtoCCMatrix();
};

/**
 * Function: getCameraToWorldCoordinatesMatrix
 *
 * Returns the current camera to world coordinates matrix.
 *
 * @returns Matrix object
 */
x3dom.Runtime.prototype.getCameraToWorldCoordinatesMatrix = function ()
{
    return this.canvas.doc._viewarea.getCCtoWCMatrix();
};

/**
 * Function: getViewingRay
 *
 * Returns the viewing ray for a given (x, y) position.
 *
 * @returns Ray object
 */
x3dom.Runtime.prototype.getViewingRay = function ( x, y )
{
    return this.canvas.doc._viewarea.calcViewRay( x, y );
};

/**
 * Function: shootRay
 *
 * Returns pickPosition, pickNormal, and pickObject for a given (x, y) position.
 *
 * @param x
 * @param y
 *
 * @returns {{pickPosition: *, pickNormal: *, pickObject: null}}
 */
x3dom.Runtime.prototype.shootRay = function ( x, y )
{
    var doc = this.canvas.doc;
    var info = doc._viewarea._pickingInfo;

    doc.onPick( this.canvas.gl, x, y );

    return {
        pickPosition : info.pickObj ? info.pickPos : null,
        pickNormal   : info.pickObj ? info.pickNorm : null,
        pickObject   : info.pickObj ? info.pickObj._xmlNode : null
    };
};

/**
 * Function: getWidth
 *
 * @returns the width of the canvas element.
 */
x3dom.Runtime.prototype.getWidth = function ()
{
    return this.canvas.doc._viewarea._width;
};

/**
 * Function: getHeight
 *
 * Returns the width of the canvas element.
 */
x3dom.Runtime.prototype.getHeight = function ()
{
    return this.canvas.doc._viewarea._height;
};

/**
 * Function: mousePosition
 *
 * Returns the 2d canvas layer position [x, y] for a given mouse event, i.e.,
 * the mouse cursor's x and y positions relative to the canvas (x3d) element.
 */
x3dom.Runtime.prototype.mousePosition = function ( event )
{
    var pos = this.canvas.mousePosition( event );

    return [ pos.x, pos.y ];
};

/**
 * Function: calcCanvasPos, calcPagePos
 *
 * Returns the 2d screen position [cx, cy] for a given point [wx, wy, wz] in world coordinates.
 *
 * @param wx
 * @param wy
 * @param wz
 */
x3dom.Runtime.prototype.calcCanvasPos = function ( wx, wy, wz )
{
    var DPR = window.devicePixelRatio || 1;

    var pnt = new x3dom.fields.SFVec3f( wx, wy, wz );

    var mat = this.canvas.doc._viewarea.getWCtoCCMatrix();
    var pos = mat.multFullMatrixPnt( pnt );

    var w = this.canvas.doc._viewarea._width / DPR;
    var h = this.canvas.doc._viewarea._height / DPR;

    var x = Math.round( ( pos.x + 1 ) * ( w - 1 ) / 2 );
    var y = Math.round( ( h - 1 ) * ( 1 - pos.y ) / 2 );

    return [ x, y ];
};

x3dom.Runtime.prototype.calcPagePos = x3dom.Runtime.prototype.calcCanvasPos;

/**
 * Function: getBBoxPoints
 *
 * @returns The eight point of the scene bounding box
 */
x3dom.Runtime.prototype.getBBoxPoints = function ()
{
    var scene = this.canvas.doc._scene;
    scene.updateVolume();

    return [
        { x: scene._lastMin.x, y: scene._lastMin.y, z: scene._lastMin.z },
        { x: scene._lastMax.x, y: scene._lastMin.y, z: scene._lastMin.z },
        { x: scene._lastMin.x, y: scene._lastMax.y, z: scene._lastMin.z },
        { x: scene._lastMax.x, y: scene._lastMax.y, z: scene._lastMin.z },
        { x: scene._lastMin.x, y: scene._lastMin.y, z: scene._lastMax.z },
        { x: scene._lastMax.x, y: scene._lastMin.y, z: scene._lastMax.z },
        { x: scene._lastMin.x, y: scene._lastMax.y, z: scene._lastMax.z },
        { x: scene._lastMax.x, y: scene._lastMax.y, z: scene._lastMax.z }
    ];
};

/**
 * Function: getSceneBRect
 *
 * @returns The 2d rect of the scene volume
 */
x3dom.Runtime.prototype.getSceneBRect = function ()
{
    var min = { x: Number.MAX_VALUE, y: Number.MAX_VALUE };
    var max = { x: Number.MIN_VALUE, y: Number.MIN_VALUE };

    var points = this.getBBoxPoints();

    for ( var i = 0; i < points.length; i++ )
    {
        var pos2D = this.calcCanvasPos( points[ i ].x, points[ i ].y, points[ i ].z );

        min.x = ( pos2D[ 0 ] < min.x ) ? pos2D[ 0 ] : min.x;
        min.y = ( pos2D[ 1 ] < min.y ) ? pos2D[ 1 ] : min.y;

        max.x = ( pos2D[ 0 ] > max.x ) ? pos2D[ 0 ] : max.x;
        max.y = ( pos2D[ 1 ] > max.y ) ? pos2D[ 1 ] : max.y;
    }

    var rect = {
        x      : min.x,
        y      : min.y,
        width  : max.x - min.x,
        height : max.y - min.y
    };

    return rect;
};

/**
 * Function: calcClientPos
 *
 * Returns the 2d client (returns the mouse coordinates relative to the window) position [cx, cy]
 * for a given point [wx, wy, wz] in world coordinates.
 *
 * @param wx
 * @param wy
 * @param wz
 * @returns {*}
 */
x3dom.Runtime.prototype.calcClientPos = function ( wx, wy, wz )
{
    var elem = this.canvas.canvas.offsetParent;

    if ( !elem )
    {
        x3dom.debug.logError( "Can't calc client pos without offsetParent." );
        return [ 0, 0 ];
    }

    var canvasPos = elem.getBoundingClientRect();
    var mousePos = this.calcCanvasPos( wx, wy, wz );

    var compStyle = document.defaultView.getComputedStyle( elem, null );

    var paddingLeft = parseFloat( compStyle.getPropertyValue( "padding-left" ) );
    var borderLeftWidth = parseFloat( compStyle.getPropertyValue( "border-left-width" ) );

    var paddingTop = parseFloat( compStyle.getPropertyValue( "padding-top" ) );
    var borderTopWidth = parseFloat( compStyle.getPropertyValue( "border-top-width" ) );

    var x = canvasPos.left + paddingLeft + borderLeftWidth + mousePos[ 0 ];
    var y = canvasPos.top + paddingTop + borderTopWidth + mousePos[ 1 ];

    return [ x, y ];
};

/**
 * Function: getScreenshot
 *
 * Returns a Base64 encoded png image consisting of the current rendering.
 *
 * @eturns The Base64 encoded PNG image string
 */
x3dom.Runtime.prototype.getScreenshot = function ()
{
    var url = "";
    var backend = this.canvas.backend;
    var canvas = this.canvas.canvas;

    if ( canvas )
    {
        if ( backend == "flash" )
        {
            url = canvas.getScreenshot();
        }
        else
        {
            // first flip along y axis
            var canvas2d = document.createElement( "canvas" );
            canvas2d.width = canvas.width;
            canvas2d.height = canvas.height;

            var ctx = canvas2d.getContext( "2d" );
            ctx.drawImage( canvas, 0, 0, canvas.width, canvas.height );
            ctx.scale( 1, -1 );
            ctx.translate( 0, -canvas.height );

            url = canvas2d.toDataURL();
        }
    }

    return url;
};

/**
 * Function: getCanvas
 *
 * Returns the internal canvas element (only valid for WebGL backend)
 *
 * @returns The internal canvas element
 */
x3dom.Runtime.prototype.getCanvas = function ()
{
    return this.canvas.canvas;
};

/**
 * Function: lightMatrix
 *
 * Returns the current light matrix.
 *
 * @returns The light matrix
 */
x3dom.Runtime.prototype.lightMatrix = function ()
{
    this.canvas.doc._viewarea.getLightMatrix();
};

/**
 * APIFunction: resetView
 *
 * Resets the view to initial.
 */
x3dom.Runtime.prototype.resetView = function ()
{
    this.canvas.doc._viewarea.resetView();
};

/**
 * Function: lightView
 *
 * Navigates to the first light, if any.
 *
 * @returns True if navigation was possible, false otherwise.
 */
x3dom.Runtime.prototype.lightView = function ()
{
    if ( this.canvas.doc._nodeBag.lights.length > 0 )
    {
        this.canvas.doc._viewarea.animateTo( this.canvas.doc._viewarea.getLightMatrix()[ 0 ],
            this.canvas.doc._scene.getViewpoint() );
        return true;
    }
    else
    {
        x3dom.debug.logInfo( "No lights to navigate to." );
        return false;
    }
};

/**
 * APIFunction: uprightView
 *
 * Navigates to upright view
 */
x3dom.Runtime.prototype.uprightView = function ()
{
    this.canvas.doc._viewarea.uprightView();
};

/**
 * APIFunction: fitAll
 *
 * Zooms so that all objects are fully visible. Without change the actual Viewpoint orientation
 *
 * @param updateCenterOfRotation - a boolean value that specifies if the new center of rotation is set.
 */
x3dom.Runtime.prototype.fitAll = function ( updateCenterOfRotation )
{
    if ( updateCenterOfRotation === undefined )
    {
        updateCenterOfRotation = true;
    }

    var scene = this.canvas.doc._scene;
    scene.updateVolume();

    this.canvas.doc._viewarea.fit( scene._lastMin, scene._lastMax, updateCenterOfRotation );
};

/**
 * APIFunction: fitObject
 *
 * Zooms so that a given object are fully visible. Without change the actual Viewpoint orientation
 *
 * @param obj
 * @param updateCenterOfRotation - a boolean value that specifies if the new center of rotation is set
 */
x3dom.Runtime.prototype.fitObject = function ( obj, updateCenterOfRotation )
{
    if ( obj && obj._x3domNode )
    {
        if ( updateCenterOfRotation === undefined )
        {
            updateCenterOfRotation = true;
        }

        var min = x3dom.fields.SFVec3f.MAX();
        var max = x3dom.fields.SFVec3f.MIN();

        var vol = obj._x3domNode.getVolume();
        vol.getBounds( min, max );

        var mat = obj._x3domNode.getCurrentTransform();

        min = mat.multMatrixPnt( min );
        max = mat.multMatrixPnt( max );

        // TODO: revise separation of "getVolume" and "getCurrentTransform"
        //      for the transform nodes - currently, both "overlap" because
        //      both include the transform's own matrix
        //      but which is what you usually expect from both methods...
        if ( x3dom.isa( obj._x3domNode, x3dom.nodeTypes.X3DTransformNode ) )
        {
            var invMat = obj._x3domNode._trafo.inverse();
            min = invMat.multMatrixPnt( min );
            max = invMat.multMatrixPnt( max );
        }

        this.canvas.doc._viewarea.fit( min, max, updateCenterOfRotation );
    }
};

/**
 * APIFunction: showAll
 *
 * Zooms so that all objects are fully visible.
 *
 * @param axis - the axis as string: posX, negX, posY, negY, posZ, negZ
 * @param updateCenterOfRotation - sets the center of rotation to the center of the scene volume
 */
x3dom.Runtime.prototype.showAll = function ( axis, updateCenterOfRotation )
{
    this.canvas.doc._viewarea.showAll( axis, updateCenterOfRotation );
};

/**
 * APIFunction: showObject
 *
 * Zooms so that a given object is fully visible in the middle of the screen.
 *
 * @param obj  - the scene-graph element on which to focus
 * @param axis - the axis as string: posX, negX, posY, negY, posZ, negZ
 */
x3dom.Runtime.prototype.showObject = function ( obj, axis )
{
    if ( obj && obj._x3domNode )
    {
        if ( axis === undefined ) {axis = "negZ";}
        var min = x3dom.fields.SFVec3f.MAX();
        var max = x3dom.fields.SFVec3f.MIN();

        var vol = obj._x3domNode.getVolume();
        vol.getBounds( min, max );

        var mat = obj._x3domNode.getCurrentTransform();

        min = mat.multMatrixPnt( min );
        max = mat.multMatrixPnt( max );

        var viewarea = this.canvas.doc._viewarea;

        // assume FOV_smaller as camera's fovMode
        var focalLen = ( viewarea._width < viewarea._height ) ?
            viewarea._width : viewarea._height;

        var n0;    // facingDir

        switch ( axis )
        {
            case "posX": n0 = new x3dom.fields.SFVec3f( 1,  0,  0 ); break;
            case "negX": n0 = new x3dom.fields.SFVec3f( -1,  0,  0 ); break;
            case "posY": n0 = new x3dom.fields.SFVec3f( 0,  1,  0 ); break;
            case "negY": n0 = new x3dom.fields.SFVec3f( 0, -1,  0 ); break;
            case "posZ": n0 = new x3dom.fields.SFVec3f( 0,  0,  1 ); break;
            case "negZ": n0 = new x3dom.fields.SFVec3f( 0,  0, -1 ); break;
        }

        var viewpoint = this.canvas.doc._scene.getViewpoint();
        var fov = viewpoint.getFieldOfView() / 2.0;
        var ta = Math.tan( fov );

        if ( Math.abs( ta ) > x3dom.fields.Eps )
        {
            focalLen /= ta;
        }

        var w = viewarea._width - 1;
        var h = viewarea._height - 1;

        var frame = 0.25;
        var minScreenPos = new x3dom.fields.SFVec2f( frame * w, frame * h );

        frame = 0.75;
        var maxScreenPos = new x3dom.fields.SFVec2f( frame * w, frame * h );

        var dia2 = max.subtract( min ).multiply( 0.5 );     // half diameter
        var rw = dia2.length();                         // approx radius

        var pc = min.add( dia2 );                         // center in wc
        var vc = maxScreenPos.subtract( minScreenPos ).multiply( 0.5 );

        var rs = 1.5 * vc.length();
        vc = vc.add( minScreenPos );

        var dist = 1.0;
        if ( rs > x3dom.fields.Eps )
        {
            dist = ( rw / rs ) * Math.sqrt( vc.x * vc.x + vc.y * vc.y + focalLen * focalLen );
        }

        n0 = mat.multMatrixVec( n0 ).normalize();
        n0 = n0.multiply( dist );
        var p0 = pc.add( n0 );

        var qDir = x3dom.fields.Quaternion.rotateFromTo( new x3dom.fields.SFVec3f( 0, 0, 1 ), n0 );
        var R = qDir.toMatrix();

        var T = x3dom.fields.SFMatrix4f.translation( p0.negate() );
        var M = x3dom.fields.SFMatrix4f.translation( p0 );

        M = M.mult( R ).mult( T ).mult( M );
        var viewmat = M.inverse();

        viewarea.animateTo( viewmat, viewpoint );
    }
};

/**
 * APIMethod animateViewpointTo
 *
 * Animates the current viewpoint to a new location.
 *
 * @param target - The taget view matrix or a viewpoint node
 * @param duration - The animation duration
 */
x3dom.Runtime.prototype.animateViewpointTo = function ( target, duration )
{
    var viewarea  = this.canvas.doc._viewarea;
    var viewpoint = this.canvas.doc._scene.getViewpoint();

    if ( target._x3domNode != undefined )
    {
        target = target._x3domNode;
    }

    viewarea.animateTo( target, viewpoint, duration );
};

/**
 * APIMethod getCenter
 *
 * Returns the center of a X3DShapeNode or X3DGeometryNode.
 *
 * @param domNode - the node for which its center shall be returned
 *
 * @returns Node center (or null if no Shape or Geometry)
 */
x3dom.Runtime.prototype.getCenter = function ( domNode )
{
    if ( domNode && domNode._x3domNode &&
        ( this.isA( domNode, "X3DShapeNode" ) || this.isA( domNode, "X3DGeometryNode" ) ) )
    {
        return domNode._x3domNode.getCenter();
    }

    return null;
};

/**
 * APIMethod getCurrentTransform
 *
 * Returns the current to world transformation of a node.
 *
 * @param domNode - the node for which its transformation shall be returned
 *
 * @returns Transformation matrix (or null no valid node is given)
 */
x3dom.Runtime.prototype.getCurrentTransform = function ( domNode )
{
    if ( domNode && domNode._x3domNode )
    {
        return domNode._x3domNode.getCurrentTransform();
    }

    return null;
};

/**
 * APIMethod getBBox
 *
 * Returns the bounding box of a node.
 *
 * @param domNode - the node for which its volume shall be returned
 *
 * @returns The min and max positions of the node's bounding box.
 */
x3dom.Runtime.prototype.getBBox = function ( domNode )
{
    if ( domNode && domNode._x3domNode && this.isA( domNode, "X3DBoundedObject" ) )
    {
        var vol = domNode._x3domNode.getVolume();

        return {
            min : x3dom.fields.SFVec3f.copy( vol.min ),
            max : x3dom.fields.SFVec3f.copy( vol.max )
        };
    }

    return null;
};

/**
 * APIMethod getSceneBBox
 *
 * Returns the bounding box of the scene.
 *
 * @returns The min and max positions of the scene's bounding box.
 */
x3dom.Runtime.prototype.getSceneBBox = function ()
{
    var scene = this.canvas.doc._scene;
    scene.updateVolume();

    return {
        min : x3dom.fields.SFVec3f.copy( scene._lastMin ),
        max : x3dom.fields.SFVec3f.copy( scene._lastMax )
    };
};

/**
 * APIFunction: debug
 *
 * Displays or hides the debug window. If parameter is omitted,
 * the current visibility status is returned.
 *
 * @param show - true to show debug window, false to hide
 *
 * @returns Current visibility status of debug window (true=visible, false=hidden)
 */
x3dom.Runtime.prototype.debug = function ( show )
{
    var doc = this.canvas.doc;
    if ( doc._viewarea._visDbgBuf === undefined )
    {
        doc._viewarea._visDbgBuf = ( doc._x3dElem.getAttribute( "showLog" ) === "true" );
    }

    if ( arguments.length > 0 )
    {
        if ( show === true )
        {
            doc._viewarea._visDbgBuf = true;
            x3dom.debug.logContainer.style.display = "block";
        }
        else
        {
            doc._viewarea._visDbgBuf = false;
            x3dom.debug.logContainer.style.display = "none";
        }
    }
    else
    {
        doc._viewarea._visDbgBuf = !doc._viewarea._visDbgBuf;
        x3dom.debug.logContainer.style.display = ( doc._viewarea._visDbgBuf == true ) ? "block" : "none";
    }
    doc.needRender = true;

    return doc._viewarea._visDbgBuf;
};

/**
 * APIFunction: navigationType
 *
 * Readout of the currently active navigation.
 *
 * @returns A string representing the active navigation type
 */
x3dom.Runtime.prototype.navigationType = function ()
{
    return this.canvas.doc._scene.getNavigationInfo().getType();
};

/**
 * APIFunction: noNav
 *
 * Switches to noNav mode
 */
x3dom.Runtime.prototype.noNav = function ()
{
    this.canvas.doc._scene.getNavigationInfo().setType( "none" );
};

/**
 * APIFunction: examine
 *
 * Switches to examine mode
 */
x3dom.Runtime.prototype.examine = function ()
{
    this.canvas.doc._scene.getNavigationInfo().setType( "examine" );
};

/**
 * APIFunction: turnTable
 *
 * Switches to turnTable mode
 */
x3dom.Runtime.prototype.turnTable = function ()
{
    this.canvas.doc._scene.getNavigationInfo().setType( "turntable" );
};

/**
 * APIFunction: fly
 *
 * Switches to fly mode
 */
x3dom.Runtime.prototype.fly = function ()
{
    this.canvas.doc._scene.getNavigationInfo().setType( "fly" );
};

/**
 * APIFunction: freeFly
 *
 * Switches to freeFly mode
 */
x3dom.Runtime.prototype.freeFly = function ()
{
    this.canvas.doc._scene.getNavigationInfo().setType( "freefly" );
};

/**
 * APIFunction: lookAt
 *
 * Switches to lookAt mode
 */
x3dom.Runtime.prototype.lookAt = function ()
{
    this.canvas.doc._scene.getNavigationInfo().setType( "lookat" );
};
/**
 * APIFunction: lookAround
 *
 * Switches to lookAround mode
 */
x3dom.Runtime.prototype.lookAround = function ()
{
    this.canvas.doc._scene.getNavigationInfo().setType( "lookaround" );
};

/**
 * APIFunction: walk
 *
 * Switches to walk mode
 */
x3dom.Runtime.prototype.walk = function ()
{
    this.canvas.doc._scene.getNavigationInfo().setType( "walk" );
};

/**
 * APIFunction: game
 *
 * Switches to game mode
 */
x3dom.Runtime.prototype.game = function ()
{
    this.canvas.doc._scene.getNavigationInfo().setType( "game" );
};

/**
 * APIFunction: helicopter
 *
 * Switches to helicopter mode
 */
x3dom.Runtime.prototype.helicopter = function ()
{
    this.canvas.doc._scene.getNavigationInfo().setType( "helicopter" );
};

/**
 * Function: resetExamin
 *
 * Resets all variables required by examine mode to init state
 */
x3dom.Runtime.prototype.resetExamin = function ()
{
    var viewarea = this.canvas.doc._viewarea;
    viewarea._rotMat = x3dom.fields.SFMatrix4f.identity();
    viewarea._transMat = x3dom.fields.SFMatrix4f.identity();
    viewarea._movement = new x3dom.fields.SFVec3f( 0, 0, 0 );
    viewarea._needNavigationMatrixUpdate = true;
    this.canvas.doc.needRender = true;
};

/**
 * APIFunction: disableKeys
 *
 * Disable keys
 */
x3dom.Runtime.prototype.disableKeys = function ()
{
    this.canvas.disableKeys = true;
};

/**
 * APIFunction: enableKeys
 *
 * Enable keys
 */
x3dom.Runtime.prototype.enableKeys = function ()
{
    this.canvas.disableKeys = false;
};

/**
 * APIFunction: disableLeftDrag
 *
 * Disable left drag
 */
x3dom.Runtime.prototype.disableLeftDrag = function ()
{
    this.canvas.disableLeftDrag = true;
};

/**
 * APIFunction: enableLeftDrag
 *
 * Enable left drag
 */
x3dom.Runtime.prototype.enableLeftDrag = function ()
{
    this.canvas.disableLeftDrag = false;
};

/**
 * APIFunction: disableRightDrag
 *
 * Disable right drag
 */
x3dom.Runtime.prototype.disableRightDrag = function ()
{
    this.canvas.disableRightDrag = true;
};

/**
 * APIFunction: enableRightDrag
 *
 * Enable right drag
 */
x3dom.Runtime.prototype.enableRightDrag = function ()
{
    this.canvas.disableRightDrag = false;
};

/**
 * APIFunction: disableMiddleDrag
 *
 * Disable middle drag
 */
x3dom.Runtime.prototype.disableMiddleDrag = function ()
{
    this.canvas.disableMiddleDrag = true;
};

/**
 * APIFunction: enableMiddleDrag
 *
 * Enable right drag
 */
x3dom.Runtime.prototype.enableMiddleDrag = function ()
{
    this.canvas.disableMiddleDrag = false;
};

/**
 * Function: togglePoints
 *
 * Toggles points attribute
 *
 * @param lines
 * @returns {*}
 */
x3dom.Runtime.prototype.togglePoints = function ( lines )
{
    var doc = this.canvas.doc;
    var mod = ( lines === true ) ? 3 : 2;

    doc._viewarea._points = ++doc._viewarea._points % mod;
    doc.needRender = true;

    return doc._viewarea._points;
};

/**
 * Function: pickRect
 *
 * Returns an array of all shape elements that are within the picked rectangle
 * defined by (x1, y1) and (x2, y2) in canvas coordinates
 *
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns {*}
 */
x3dom.Runtime.prototype.pickRect = function ( x1, y1, x2, y2 )
{
    return this.canvas.doc.onPickRect( this.canvas.gl, x1, y1, x2, y2 );
};

/**
 * Function: pickMode
 *
 * Get the current pickMode intersect type
 *
 * @param internal - true/false. If given return the internal representation.
 *                 Only use for debugging.
 *
 * @returns The current intersect type value suitable to use with changePickMode
 *      If parameter is, given, provide with internal representation.
 */
x3dom.Runtime.prototype.pickMode = function ( options )
{
    if ( options && options.internal === true )
    {
        return this.canvas.doc._scene._vf.pickMode;
    }
    return this.canvas.doc._scene._vf.pickMode.toLowerCase();
};

/**
 * Function: changePickMode
 *
 * Alter the value of intersect type. Can be one of: box, idBuf, idBuf24, idBufId, color, texCoord.
 * Other values are ignored.
 *
 * @param type - The new intersect type: box, idBuf, idBuf24, idBufId, color, texCoord
 *
 * @returns true if the type has been changed, false otherwise
 */
x3dom.Runtime.prototype.changePickMode = function ( type )
{
    // pick type one of : box, idBuf, idBuf24, idBufId, color, texCoord
    type = type.toLowerCase();

    switch ( type )
    {
        case "idbuf":    type = "idBuf";    break;
        case "idbuf24":  type = "idBuf24";  break;
        case "idbufid":  type = "idBufId";  break;
        case "texcoord": type = "texCoord"; break;
        case "color":    type = "color";    break;
        case "box":      type = "box";      break;
        default:
            x3dom.debug.logWarning( "Switch pickMode to " + type + " unknown intersect type" );
            type = undefined;
    }

    if ( type !== undefined )
    {
        this.canvas.doc._scene._vf.pickMode = type;
        x3dom.debug.logInfo( "Switched pickMode to '" + type + "'." );
        return true;
    }

    return false;
};

/**
 * APIFunction: speed
 *
 * Get the current speed value. If parameter is given the new speed value is set.
 *
 * @param newSpeed - The new speed value (optional)
 *
 * @returns The current speed value
 */
x3dom.Runtime.prototype.speed = function ( newSpeed )
{
    var navi = this.canvas.doc._scene.getNavigationInfo();
    if ( newSpeed )
    {
        navi._vf.speed = newSpeed;
        x3dom.debug.logInfo( "Changed navigation speed to " + navi._vf.speed );
    }
    return navi._vf.speed;
};

/**
 * APIFunction: zoom
 *
 * Modifies the zoom of current viewpoint with the specified zoom value.
 *
 * @param zoomAmount - The zoom amount
 */
x3dom.Runtime.prototype.zoom = function ( zoomAmount )
{
    this.canvas.doc._viewarea.zoom( zoomAmount );
    this.canvas.doc.needRender = true;
};

/**
 * APIFunction: statistics
 *
 * Get or set statistics info. If parameter is omitted, this method
 * only returns the the visibility status of the statistics info overlay.
 *
 * @param mode - true or false. To enable or disable the statistics info
 *
 * @returns The current visibility of the statistics info (true = visible, false = invisible)
 */
x3dom.Runtime.prototype.statistics = function ( mode )
{
    var states = this.canvas.stateViewer;
    if ( states )
    {
        this.canvas.doc.needRender = true;
        if ( mode === true )
        {
            states.display( mode );
            return true;
        }
        else if ( mode === false )
        {
            states.display( mode );
            return false;
        }
        else
        {
            states.display( !states.active );
            // if no parameter is given return current status (false = not visible, true = visible)
            return states.active;
        }
    }
    return false;
};

/**
 * Function: processIndicator
 *
 * Enable or disable the process indicator. If parameter is omitted, this method
 * only returns the the visibility status of the progress bar overlay.
 *
 * @param mode - true or false. To enable or disable the progress indicator
 *
 * @returns The current visibility of the progress indicator info (true = visible, false = invisible)
 */
x3dom.Runtime.prototype.processIndicator = function ( mode )
{
    var processDiv = this.canvas.progressDiv;
    if ( processDiv )
    {
        if ( mode === true )
        {
            processDiv.style.display = "flex";
            return true;
        }
        else if ( mode === false )
        {
            processDiv.style.display = "none";
            return false;
        }

        // if no parameter is given return current status (false = not visible, true = visible)
        return processDiv.style.display != "none";
    }
    return false;
};

/**
 * Get properties
 *
 * @returns {*}
 */
x3dom.Runtime.prototype.properties = function ()
{
    return this.canvas.doc.properties;
};

/**
 * Get current backend name
 *
 * @returns {*}
 */
x3dom.Runtime.prototype.backendName = function ()
{
    return this.canvas.backend;
};

/**
 * Get current framerate
 *
 * @returns {number}
 */
x3dom.Runtime.prototype.getFPS = function ()
{
    return this.fps;
};

/**
 * APIMethod isA
 *
 * Test a DOM node object against a node type string. This method
 * can be used to determine the "type" of a DOM node.
 *
 * @param domNode - the node to test for
 * @param nodeType - node name to test domNode against
 *
 * @returns True or false
 */
x3dom.Runtime.prototype.isA = function ( domNode, nodeType )
{
    var inherits = false;

    if ( nodeType && domNode && domNode._x3domNode )
    {
        if ( nodeType === "" )
        {
            nodeType = "X3DNode";
        }
        inherits = x3dom.isa( domNode._x3domNode,
            x3dom.nodeTypesLC[ nodeType.toLowerCase() ] );
    }

    return inherits;
};

/**
 * APIMethod getPixelScale
 *
 * Returns the virtual scale of one pixel for the current orthographic viewpoint.
 * The returned vector contains scale values for the x and y direction. The z value is always null.
 *
 * @returns x3dom.fields.SFVec3f or null if non orthographic view
 */
x3dom.Runtime.prototype.getPixelScale = function ()
{
    var vp = this.viewpoint();
    if ( !x3dom.isa( vp, x3dom.nodeTypes.OrthoViewpoint ) )
    {
        x3dom.debug.logError( "getPixelScale is only implemented for orthographic Viewpoints" );
        return null;
    }

    var zoomLevel = vp.getZoom();

    var left = zoomLevel[ 0 ];
    var bottom = zoomLevel[ 1 ];
    var right = zoomLevel[ 2 ];
    var top = zoomLevel[ 3 ];

    var x = right - left;
    var y = top - bottom;

    var pixelScaleX = x / this.getWidth();
    var pixelScaleY = y / this.getHeight();

    return new x3dom.fields.SFVec3f( pixelScaleX, pixelScaleY, 0.0 );
};

/**
 * APIMethod onAnimationStarted
 *
 */
x3dom.Runtime.prototype.onAnimationStarted = function ()
{
    //x3dom.debug.logInfo('Render frame finished');
    // to be overwritten by user
};

/**
 * APIMethod onAnimationFinished
 *
 */
x3dom.Runtime.prototype.onAnimationFinished = function ()
{
    //x3dom.debug.logInfo('Render frame finished');
    // to be overwritten by user
};

x3dom.Runtime.prototype.enterVR = function ()
{
    this.canvas.enterVR();
};

x3dom.Runtime.prototype.exitVR = function ()
{
    this.canvas.exitVR();
};

x3dom.Runtime.prototype.toggleVR = function ()
{
    if ( !this.canvas.xrSession )
    {
        this.enterVR();
    }
    else if ( this.canvas.xrSession )
    {
        this.exitVR();
    }
};

/**
 * APIMethod toggleProjection
 *
 * @param perspViewID
 * @param orthoViewID
 * @returns {number}
 */
x3dom.Runtime.prototype.toggleProjection = function ( perspViewID, orthoViewID )
{
    var dist;
    var factor = 2.2;
    var runtime = document.getElementById( "x3d" ).runtime;
    var navInfo = runtime.canvas.doc._scene.getNavigationInfo();
    var speed = navInfo._vf.transitionTime;
    var persp = document.getElementById( perspViewID )._x3domNode;
    var ortho = document.getElementById( orthoViewID )._x3domNode;

    navInfo._vf.transitionTime = 0;

    ortho._bindAnimation = false;
    persp._bindAnimation = false;

    if ( persp._vf.isActive )
    {
        ortho._viewMatrix = persp._viewMatrix;

        document.getElementById( orthoViewID ).setAttribute( "set_bind", "true" );

        dist = persp._viewMatrix.e3().length() / factor;

        ortho.setZoom( dist );
    }
    else if ( ortho._vf.isActive )
    {
        persp._viewMatrix = ortho._viewMatrix;

        document.getElementById( perspViewID ).setAttribute( "set_bind", "true" );

        dist = ortho._fieldOfView[ 2 ] * -factor;

        var translation = ortho._viewMatrix.e2().normalize().multiply( dist );

        persp._viewMatrix.setTranslate( translation );
    }

    navInfo._vf.transitionTime = speed;

    ortho._bindAnimation = true;
    persp._bindAnimation = true;

    return ( persp._vf.isActive ) ? 0 : 1;
};

/**
 * APIFunction: replaceWorld
 *
 * Replaces the current scene element
 *
 * For example:
 *   > var element, x3d, jsobject, optionalUrl;
 *   > element = document.getElementById('the_x3delement');
 *   > x3d = element.runtime.createX3DFromJS(jsobject, optionalUrl);
 *   > element.runtime.replaceWorld(x3d);
 *
 * @param scene - scene element to substitute
 *
 * @note replaceWorld replaces the current x3d element. It is
 *       therefore necessary to get the replaced x3d element
 *       each time to access the new runtime.
 */
x3dom.Runtime.prototype.replaceWorld = function ( scene )
{
    var x3dElement,
        child,
        name;

    if ( scene.localName.toUpperCase() === "X3D" )
    {
        x3dElement = scene.cloneNode( false );
    }
    else
    {
        x3dElement = this.doc.cloneNode( false );
    }
    //clean x3d element
    while ( child = scene.firstChild )
    {
        name = child.nodeType === 1 ? child.localName.toUpperCase() : null;
        if ( name == "HEAD" || name == "SCENE" )
        {
            x3dElement.appendChild( child );
        }
        else
        {
            child.remove();
        }
    }

    this.doc.parentNode.replaceChild( x3dElement, this.doc );
    this.doc = x3dElement;
    x3dom.reload();
    return;
};

/**
 * APIFunction: createX3DFromJS
 *
 * Creates a x3d element from a JSON JavaScript X3D object
 *
 * For example:
 *   > var element, x3d, jsobject, optionalUrl;
 *   > element = document.getElementById('the_x3delement');
 *   > x3d = element.runtime.createX3DFromJS(jsobject, optionalUrl);
 *   > element.runtime.replaceWorld(x3d);
 *
 * @param jsobject - JavaScript JSON object of X3D object
 * @param optionalURL - if specified, does a PROTO expansion on jsobject.
 *                      JSON ExternProtoDeclare's are loaded relative to this URL.
 *
 * @returns The x3d element
 */
x3dom.Runtime.prototype.createX3DFromJS = function ( jsobject, optionalURL )
{
    if ( optionalURL )
    {
        jsobject = x3dom.protoExpander.prototypeExpander( optionalURL, jsobject );
    }
    var jsonParser = new x3dom.JSONParser();
    return jsonParser.parseJavaScript( jsobject );
};

/**
 * APIFunction: createX3DFromString
 *
 * Creates a x3d element from a JSON or XML String
 *
 * For example:
 *
 *   > var element, x3d, jsonOrXML, optionalUrl;
 *   > element = document.getElementById('the_x3delement');
 *   > x3d = element.runtime.createX3DFromString(jsonOrXML, optionalUrl);
 *   > element.runtime.replaceWorld(x3d);
 *
 * @param jsonOrXML - JSON or XML of X3D object
 * @param optionalURL - if specified, does a PROTO expansion on json.
 *                         JSON ExternProtoDeclare's are loaded relative to this URL.
 *
 * @returns The x3d element
 */
x3dom.Runtime.prototype.createX3DFromString = function ( jsonOrXML, optionalURL )
{
    try
    {
        var jsobject = JSON.parse( jsonOrXML );
        return this.createX3DFromJS( jsobject, optionalURL );
    }
    catch ( e )
    {
        var parser = new DOMParser();
        var doc = parser.parseFromString( jsonOrXML, "application/xml" );
        var scene = doc.querySelector( "X3D" );
        if ( scene == null )
        {
            doc = parser.parseFromString( jsonOrXML, "text/html" );
            scene = doc.querySelector( "X3D" );
        }
        return scene;
    }
};

/**
 * APIFunction: createX3DFromURLPromise
 *
 * Creates a Promise resolved to the x3d element from a Url
 *
 * For example:
 *   > var element, x3d, json, optionalUrl;
 *   > element = document.getElementById('the_x3delement');
 *   > x3d = element.runtime.createX3DFromURK(Url, optionalUrl);
 *   > element.runtime.replaceWorld(x3d);
 *
 * @param url - url of XML or JSON of X3D object
 * @param optionalURL - if specified, does a PROTO expansion on json, only.
 *                         JSON ExternProtoDeclare's are loaded relative to this URL.
 *
 * @returns A Promise resolved to the x3d element
 */
x3dom.Runtime.prototype.createX3DFromURLPromise = function ( url, optionalURL )
{
    this.canvas.doc.incrementDownloads();
    var that = this;
    return fetch( url )
        .then( function ( r ) { return r.text(); } )
        .then( function ( text )
        {
            that.canvas.doc.decrementDownloads();
            return that.createX3DFromString( text, optionalURL );
        } )
        .catch( function ( r )
        {
            that.canvas.doc.decrementDownloads();
            x3dom.debug.logError( "fetch failed: " + r );
            return null;
        } );
};

/**
 * APIFunction: loadURL
 *
 * loads asynchronuously a scene from a URL with json or xml content.
 * The function returns before the world is loaded. Use events or .ready
 * to determine when the scene is available.
 * For more control use .createX3DFromURLPromise(url, optionalURL).
 *
 * Example:
 *   > var element, url , optionalUrl;
 *   > element.runtime.loadURL(url, optionalUrl);
 *
 * @param url - url of XML or JSON of X3D object
 * @param optionalURL - if specified, does a PROTO expansion on json, only.
 *                         JSON ExternProtoDeclare's are loaded relative to this URL.
 *
 * @returns undefined
 *
 * @note replaceWorld replaces the current x3d element. It is
 *       therefore necessary to get the replaced x3d element
 *       each time to access the new runtime.
 */
x3dom.Runtime.prototype.loadURL = function ( url, optionalURL )
{
    var that = this;
    this.createX3DFromURLPromise( url, optionalURL )
        .then( function ( x3d )
        {
            if ( x3d != null ) {that.replaceWorld( x3d );}
            else {x3dom.debug.logError( "loadURL: could not fetch or parse " + url );}
        } );
};