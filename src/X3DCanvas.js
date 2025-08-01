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

/**
 * The canvas object wraps the HTML canvas x3dom draws
 * @constructs x3dom.X3DCanvas
 * @param {Object} [x3dElement] - x3d element rendering into the canvas
 * @param {String} [canvasIdx] - id of HTML canvas
 */
x3dom.X3DCanvas = function ( x3dElem, canvasIdx )
{
    //async constructor
    return ( async () =>
    {
        var that = this;

        /**
     * The index of the HTML canvas
     * @member {String} _canvasIdx
     */
        this._canvasIdx = canvasIdx;

        /**
     * The X3D Element
     * @member {X3DElement} x3dElem
     */
        this.x3dElem = x3dElem;

        /**
     * The current canvas dimensions
     * @member {Array} _current_dim
     */
        this._current_dim = [ 0, 0 ];

        // for FPS measurements
        this.fps_t0 = Date.now();
        this.lastTimeFPSWasTaken = 0;
        this.framesSinceLastTime = 0;

        this._totalTime = 0;
        this._elapsedTime = 0;

        this.doc = null;

        this.isSessionSupportedPromise = null;
        this.xrSession = null;
        this.xrReferenceSpace = null;
        this.supportsPassiveEvents = false;

        this.devicePixelRatio = window.devicePixelRatio || 1;

        this.lastMousePos = { x: 0, y: 0 };
        //try to determine behavior of certain DOMNodeInsertedEvent:
        //IE11 dispatches one event for each node in an inserted subtree, other browsers use a single event per subtree
        x3dom.caps.DOMNodeInsertedEvent_perSubtree = !( navigator.userAgent.indexOf( "MSIE" )    != -1 ||
                                                   navigator.userAgent.indexOf( "Trident" ) != -1 );

        // allow listening for (size) changes
        x3dElem.__setAttribute = x3dElem.setAttribute;

        //adds setAttribute function for width and height to the X3D element
        x3dElem.setAttribute = function ( attrName, newVal )
        {
            this.__setAttribute( attrName, newVal );

            // scale resolution so device pixel are used rather then css pixels
            newVal = parseInt( newVal );

            switch ( attrName )
            {
                case "width":
                    that.canvas.setAttribute( "width", newVal * that.devicePixelRatio );
                    if ( that.doc && that.doc._viewarea )
                    {
                        that.doc._viewarea._width = parseInt( that.canvas.getAttribute( "width" ), 0 );
                        that.doc.needRender = true;
                    }
                    break;

                case "height":
                    that.canvas.setAttribute( "height", newVal * that.devicePixelRatio );
                    if ( that.doc && that.doc._viewarea )
                    {
                        that.doc._viewarea._height = parseInt( that.canvas.getAttribute( "height" ), 0 );
                        that.doc.needRender = true;
                    }
                    break;

                default:
                    break;
            }
        };

        this.backend = this.x3dElem.getAttribute( "backend" );

        this.backend = ( this.backend ) ? this.backend.toLowerCase() : "none";

        this.canvas = this._createHTMLCanvas( x3dElem );

        x3dom.debug.appendElement( x3dElem );

        this.canvas.parent = this;

        this.context = await this._initContext( this.canvas );

        this.backend = "webgpu";

        if ( this.context == null )
        {
            this.hasRuntime = false;
            this._createInitFailedDiv( x3dElem );
            return;
        }

        x3dom.caps.BACKEND = this.backend;

        var runtimeEnabled = x3dElem.getAttribute( "runtimeEnabled" );

        if ( runtimeEnabled !== null )
        {
            this.hasRuntime = ( runtimeEnabled.toLowerCase() == "true" );
        }
        else
        {
            this.hasRuntime = x3dElem.hasRuntime;
        }

        /**
     * STATS VIEWER STUFF
     * TODO MOVE IT TO MAIN.JS
     */
        this.showStat = x3dElem.getAttribute( "showStat" );
        this.stateViewer = new x3dom.States( x3dElem );

        if ( this.showStat !== null && this.showStat == "true" )
        {
            this.stateViewer.display( true );
        }

        this.x3dElem.appendChild( this.stateViewer.viewer );

        // progress bar
        this.showProgress = x3dElem.getAttribute( "showProgress" );
        this.progressDiv = this._createProgressDiv();
        this.progressDiv.style.display = ( this.showProgress !== null && this.showProgress == "true" ) ? "flex" : "none";
        this.x3dElem.appendChild( this.progressDiv );

        // vr button
        this.vrDiv = this._createVRDiv();
        this.x3dElem.appendChild( this.vrDiv );

        // touch visualization
        this.showTouchpoints = x3dElem.getAttribute( "showTouchpoints" );
        this.showTouchpoints = this.showTouchpoints ? this.showTouchpoints : false;

        // disable touch events
        this.disableTouch = x3dElem.getAttribute( "disableTouch" );
        this.disableTouch = this.disableTouch ? ( this.disableTouch.toLowerCase() == "true" ) : false;

        this.disableKeys = x3dElem.getAttribute( "disableKeys" );
        this.disableKeys = this.disableKeys ? ( this.disableKeys.toLowerCase() == "true" ) : false;

        this.disableRightDrag = x3dElem.getAttribute( "disableRightDrag" );
        this.disableRightDrag = this.disableRightDrag ? ( this.disableRightDrag.toLowerCase() == "true" ) : false;

        this.disableLeftDrag = x3dElem.getAttribute( "disableLeftDrag" );
        this.disableLeftDrag = this.disableLeftDrag ? ( this.disableLeftDrag.toLowerCase() == "true" ) : false;

        this.disableMiddleDrag = x3dElem.getAttribute( "disableMiddleDrag" );
        this.disableMiddleDrag = this.disableMiddleDrag ? ( this.disableMiddleDrag.toLowerCase() == "true" ) : false;

        this.detectPassiveEvents();

        this.bindEventListeners();

        return this;
    } )();
};

x3dom.X3DCanvas.prototype.detectPassiveEvents = function ()
{
    if ( typeof window !== "undefined" && typeof window.addEventListener === "function" )
    {
        var passive = false;

        var options = Object.defineProperty( {}, "passive",
            {
                get : function () { passive = true; }
            } );
        // note: have to set and remove a no-op listener instead of null
        // (which was used previously), becasue Edge v15 throws an error
        // when providing a null callback.
        // https://github.com/rafrex/detect-passive-events/pull/3
        var noop = function () {};
        window.addEventListener( "testPassiveEventSupport", noop, options );
        window.removeEventListener( "testPassiveEventSupport", noop, options );

        this.supportsPassiveEvents = passive;
    }
};

x3dom.X3DCanvas.prototype.bindEventListeners = function ()
{
    var that = this;

    this.onMouseDown = function ( evt )
    {
        if ( !this.isMulti )
        {
            this.focus();
            this.classList.add( "x3dom-canvas-mousedown" );

            switch ( evt.button )
            {
                case 0:  this.mouse_button = 1; break;  //left
                case 1:  this.mouse_button = 4; break;  //middle
                case 2:  this.mouse_button = 2; break;  //right
                default: this.mouse_button = 0; break;
            }

            if ( evt.shiftKey ) { this.mouse_button = 1; }
            if ( evt.ctrlKey )  { this.mouse_button = 4; }
            if ( evt.altKey )   { this.mouse_button = 2; }

            var pos = this.parent.mousePosition( evt );
            this.mouse_drag_x = pos.x;
            this.mouse_drag_y = pos.y;

            this.mouse_dragging = true;

            this.parent.doc.onMousePress( that.gl, this.mouse_drag_x, this.mouse_drag_y, this.mouse_button );
            this.parent.doc.needRender = true;
        }
    };

    this.onMouseUp = function ( evt )
    {
        if ( !this.isMulti )
        {
            var prev_mouse_button = this.mouse_button;
            this.classList.remove( "x3dom-canvas-mousedown" );

            this.mouse_button = 0;
            this.mouse_dragging = false;

            this.parent.doc.onMouseRelease( that.gl, this.mouse_drag_x, this.mouse_drag_y, this.mouse_button, prev_mouse_button );
            this.parent.doc.needRender = true;
        }
    };

    this.onMouseOver = function ( evt )
    {
        if ( !this.isMulti )
        {
            this.mouse_button = 0;
            this.mouse_dragging = false;

            this.parent.doc.onMouseOver( that.gl, this.mouse_drag_x, this.mouse_drag_y, this.mouse_button );
            this.parent.doc.needRender = true;
        }
    };

    this.onMouseOut = function ( evt )
    {
        if ( !this.isMulti )
        {
            this.mouse_button = 0;
            this.mouse_dragging = false;
            this.classList.remove( "x3dom-canvas-mousedown" );

            this.parent.doc.onMouseOut( that.gl, this.mouse_drag_x, this.mouse_drag_y, this.mouse_button );
            this.parent.doc.needRender = true;
        }
    };

    this.onDoubleClick = function ( evt )
    {
        if ( !this.isMulti )
        {
            this.mouse_button = 0;

            var pos = this.parent.mousePosition( evt );
            this.mouse_drag_x = pos.x;
            this.mouse_drag_y = pos.y;

            this.mouse_dragging = false;

            this.parent.doc.onDoubleClick( that.gl, this.mouse_drag_x, this.mouse_drag_y );
            this.parent.doc.needRender = true;
        }
    };

    this.onMouseMove = function ( evt )
    {
        if ( !this.isMulti )
        {
            var pos = this.parent.mousePosition( evt );

            if ( pos.x != that.lastMousePos.x || pos.y != that.lastMousePos.y )
            {
                that.lastMousePos = pos;

                this.mouse_drag_x = pos.x;
                this.mouse_drag_y = pos.y;

                if ( this.mouse_dragging )
                {
                    if ( evt.shiftKey ) { this.mouse_button = 1; }
                    if ( evt.ctrlKey )  { this.mouse_button = 4; }
                    if ( evt.altKey )   { this.mouse_button = 2; }

                    if ( this.mouse_button == 1 && !this.parent.disableLeftDrag ||
                         this.mouse_button == 2 && !this.parent.disableRightDrag ||
                         this.mouse_button == 4 && !this.parent.disableMiddleDrag )
                    {
                        this.parent.doc.onDrag( that.context, this.mouse_drag_x, this.mouse_drag_y, this.mouse_button );
                    }
                }
                else
                {
                    this.parent.doc.onMove( that.context, this.mouse_drag_x, this.mouse_drag_y, this.mouse_button );
                }

                this.parent.doc.needRender = true;

                // deliberately different for performance reasons
                evt.preventDefault();
                evt.stopPropagation();
            }
        }
    };

    this.onDOMMouseScroll = function ( evt )
    {
        if ( !this.isMulti )
        {
            this.focus();

            var originalY = this.parent.mousePosition( evt ).y;
            if ( this.parent.doc._scene.getNavigationInfo()._vf.reverseScroll == true )
            {
                this.mouse_drag_y -= 2 * evt.detail;
            }
            else
            {
                this.mouse_drag_y += 2 * evt.detail;
            }

            this.parent.doc.onWheel( that.gl, this.mouse_drag_x, this.mouse_drag_y, originalY );
            this.parent.doc.needRender = true;

            evt.preventDefault();
            evt.stopPropagation();
        }
    };

    this.onKeyPress = function ( evt )
    {
        if ( !this.parent.disableKeys )
        {
            evt.preventDefault();
            this.parent.doc.onKeyPress( evt.charCode );
        }
        this.parent.doc.needRender = true;
    };

    this.onMouseWheel = function ( evt )
    {
        if ( !this.isMulti )
        {
            this.focus();

            var originalY = this.parent.mousePosition( evt ).y;

            if ( this.parent.doc._scene.getNavigationInfo()._vf.reverseScroll == true )
            {
                this.mouse_drag_y += 0.1 * evt.wheelDelta;
            }
            else
            {
                this.mouse_drag_y -= 0.1 * evt.wheelDelta;
            }

            this.parent.doc.onWheel( that.gl, this.mouse_drag_x, this.mouse_drag_y, originalY );
            this.parent.doc.needRender = true;

            evt.preventDefault();
            evt.stopPropagation();
        }
    };

    this.onKeyUp = function ( evt )
    {
        if ( !this.parent.disableKeys )
        {
            this.parent.doc.onKeyUp( evt.keyCode );
        }
        this.parent.doc.needRender = true;
    };

    this.onKeyDown = function ( evt )
    {
        if ( !this.parent.disableKeys )
        {
            this.parent.doc.onKeyDown( evt.keyCode );
        }
        this.parent.doc.needRender = true;
    };

    if ( this.canvas !== null && this.gl !== null && this.hasRuntime )
    {
        // event handler for mouse interaction
        this.canvas.mouse_dragging = false;
        this.canvas.mouse_button = 0;
        this.canvas.mouse_drag_x = 0;
        this.canvas.mouse_drag_y = 0;

        this.canvas.isMulti = false;    // don't interfere with multi-touch

        this.canvas.oncontextmenu = function ( evt )
        {
            evt.preventDefault();
            evt.stopPropagation();
            return false;
        };

        // TODO: handle context lost events properly
        this.canvas.addEventListener( "webglcontextlost", function ( event )
        {
            x3dom.debug.logError( "WebGL context lost" );
            event.preventDefault();
        }, false );

        this.canvas.addEventListener( "webglcontextrestored", function ( event )
        {
            x3dom.debug.logError( "recover WebGL state and resources on context lost NYI" );
            event.preventDefault();
        }, false );

        // Mouse Events
        this.canvas.addEventListener( "mousedown", this.onMouseDown, false );

        this.canvas.addEventListener( "mouseup", this.onMouseUp, false );

        this.canvas.addEventListener( "mouseover", this.onMouseOver, false );

        this.canvas.addEventListener( "mouseout", this.onMouseOut, false );

        this.canvas.addEventListener( "dblclick", this.onDoubleClick, false );

        this.canvas.addEventListener( "mousemove", this.onMouseMove, false );

        this.canvas.addEventListener( "DOMMouseScroll", this.onDOMMouseScroll, false );

        this.canvas.addEventListener( "mousewheel", this.onMouseWheel, this.supportsPassiveEvents ? {passive: false} : false );

        // Key Events
        this.canvas.addEventListener( "keypress", this.onKeyPress, true );

        // in webkit special keys are only handled on key-up
        this.canvas.addEventListener( "keyup", this.onKeyUp, true );

        this.canvas.addEventListener( "keydown", this.onKeyDown, true );

        // Multitouch Events
        var touches =
        {
            numTouches : 0,

            firstTouchTime  : Date.now(),
            firstTouchPoint : new x3dom.fields.SFVec2f( 0, 0 ),

            lastPos  : new x3dom.fields.SFVec2f(),
            lastDrag : new x3dom.fields.SFVec2f(),

            lastMiddle         : new x3dom.fields.SFVec2f(),
            lastSquareDistance : 0,
            lastAngle          : 0,
            lastLayer          : [],

            examineNavType : 1,

            calcAngle : function ( vector )
            {
                var rotation = vector.normalize().dot( new x3dom.fields.SFVec2f( 1, 0 ) );
                rotation = Math.acos( rotation );

                if ( vector.y < 0 )
                {rotation = Math.PI + ( Math.PI - rotation );}

                return rotation;
            },

            disableTouch : this.disableTouch,
            // set a marker in HTML so we can track the position of the finger visually
            visMarker    : this.showTouchpoints,
            visMarkerBag : [],

            visualizeTouches : function ( evt )
            {
                if ( !this.visMarker )
                {return;}

                var touchBag = [];
                var marker = null;

                for ( var i = 0; i < evt.touches.length; i++ )
                {
                    var id = evt.touches[ i ].identifier || evt.touches[ i ].streamId;
                    if ( !id ) {id = 0;}

                    var index = this.visMarkerBag.indexOf( id );

                    if ( index >= 0 )
                    {
                        marker = document.getElementById( "visMarker" + id );

                        marker.style.left = ( evt.touches[ i ].pageX ) + "px";
                        marker.style.top  = ( evt.touches[ i ].pageY ) + "px";
                    }
                    else
                    {
                        marker = document.createElement( "div" );

                        marker.appendChild( document.createTextNode( "#" + id ) );
                        marker.id = "visMarker" + id;
                        marker.className = "x3dom-touch-marker";
                        document.body.appendChild( marker );

                        index = this.visMarkerBag.length;
                        this.visMarkerBag[ index ] = id;
                    }

                    touchBag.push( id );
                }

                for ( var j = this.visMarkerBag.length - 1; j >= 0; j-- )
                {
                    var oldId = this.visMarkerBag[ j ];

                    if ( touchBag.indexOf( oldId ) < 0 )
                    {
                        this.visMarkerBag.splice( j, 1 );
                        marker = document.getElementById( "visMarker" + oldId );
                        document.body.removeChild( marker );
                    }
                }
            }
        };

        // === Touch Start ===
        var touchStartHandler = function ( evt, doc )
        {
            this.isMulti = true;

            evt.preventDefault();

            touches.visualizeTouches( evt );

            this.focus();

            if ( doc == null )
            {doc = this.parent.doc;}

            var navi = doc._scene.getNavigationInfo();

            switch ( navi.getType() )
            {
                case "examine":
                    touches.examineNavType = 1;
                    break;
                case "turntable":
                    touches.examineNavType = 2;
                    break;
                default:
                    touches.examineNavType = 0;
                    break;
            }

            touches.lastLayer = [];

            var i,
                pos;
            for ( i = 0; i < evt.touches.length; i++ )
            {
                pos = this.parent.mousePosition( evt.touches[ i ] );
                touches.lastLayer.push( [ evt.touches[ i ].identifier, new x3dom.fields.SFVec2f( pos.x, pos.y ) ] );
            }

            if ( touches.numTouches < 1 && evt.touches.length == 1 )
            {
                touches.numTouches = 1;
                touches.lastDrag = new x3dom.fields.SFVec2f( evt.touches[ 0 ].screenX, evt.touches[ 0 ].screenY );
            }
            else if ( touches.numTouches < 2 && evt.touches.length >= 2 )
            {
                touches.numTouches = 2;

                var touch0 = new x3dom.fields.SFVec2f( evt.touches[ 0 ].screenX, evt.touches[ 0 ].screenY );
                var touch1 = new x3dom.fields.SFVec2f( evt.touches[ 1 ].screenX, evt.touches[ 1 ].screenY );

                var distance = touch1.subtract( touch0 );
                var middle = distance.multiply( 0.5 ).add( touch0 );
                var squareDistance = distance.dot( distance );

                touches.lastMiddle = middle;
                touches.lastSquareDistance = squareDistance;
                touches.lastAngle = touches.calcAngle( distance );

                touches.lastPos = this.parent.mousePosition( evt.touches[ 0 ] );
            }

            // update scene bbox
            doc._scene.updateVolume();

            if ( touches.examineNavType == 1 )
            {
                for ( i = 0; i < evt.touches.length; i++ )
                {
                    pos = this.parent.mousePosition( evt.touches[ i ] );
                    doc.onPick( that.gl, pos.x, pos.y );

                    //Trigger onmouseover to collect affected X3DPointingDeviceSensorNodes
                    doc._viewarea.prepareEvents( pos.x, pos.y, 0, "onmouseover" );
                    doc._viewarea.prepareEvents( pos.x, pos.y, 1, "onmousedown" );

                    doc._viewarea._pickingInfo.lastClickObj = doc._viewarea._pickingInfo.pickObj;
                }
            }
            else if ( evt.touches.length )
            {
                pos = this.parent.mousePosition( evt.touches[ 0 ] );
                doc.onMousePress( that.gl, pos.x, pos.y, 1 );     // 1 means left mouse button
            }

            doc.needRender = true;
        };

        // === Touch Move ===
        var touchMoveHandler = function ( evt, doc )
        {
            evt.preventDefault();

            touches.visualizeTouches( evt );

            if ( doc == null )
            {doc = this.parent.doc;}

            var pos = null;
            var rotMatrix = null;

            var touch0,
                touch1,
                distance,
                middle,
                squareDistance,
                deltaMiddle,
                deltaZoom,
                deltaMove;

            if ( touches.examineNavType == 1 )
            {
                // one finger: x/y rotation
                if ( evt.touches.length == 1 )
                {
                    var currentDrag = new x3dom.fields.SFVec2f( evt.touches[ 0 ].screenX, evt.touches[ 0 ].screenY );

                    var deltaDrag = currentDrag.subtract( touches.lastDrag );
                    touches.lastDrag = currentDrag;

                    var mx = x3dom.fields.SFMatrix4f.rotationY( deltaDrag.x / 100 );
                    var my = x3dom.fields.SFMatrix4f.rotationX( deltaDrag.y / 100 );
                    rotMatrix = mx.mult( my );

                    doc.onMoveView( that.gl, evt, touches, null, rotMatrix );

                    //Trigger onmousemove to notify X3DPointingDeviceSensorNodes
                    pos = this.parent.mousePosition( evt.touches[ 0 ] );
                    doc.onPick( that.gl, pos.x, pos.y );
                    doc._viewarea.prepareEvents( pos.x, pos.y, 1, "onmousemove" );
                }
                // two fingers: scale, translation, rotation around view (z) axis
                else if ( evt.touches.length >= 2 )
                {
                    touch0 = new x3dom.fields.SFVec2f( evt.touches[ 0 ].screenX, evt.touches[ 0 ].screenY );
                    touch1 = new x3dom.fields.SFVec2f( evt.touches[ 1 ].screenX, evt.touches[ 1 ].screenY );

                    distance = touch1.subtract( touch0 );
                    middle = distance.multiply( 0.5 ).add( touch0 );
                    squareDistance = distance.dot( distance );

                    deltaMiddle = middle.subtract( touches.lastMiddle );
                    deltaZoom = squareDistance - touches.lastSquareDistance;

                    deltaMove = new x3dom.fields.SFVec3f(
                        deltaMiddle.x / screen.width, -deltaMiddle.y / screen.height,
                        deltaZoom / ( screen.width * screen.height * 0.2 ) );

                    var rotation = touches.calcAngle( distance );
                    var angleDelta = touches.lastAngle - rotation;
                    touches.lastAngle = rotation;

                    rotMatrix = x3dom.fields.SFMatrix4f.rotationZ( angleDelta );

                    touches.lastMiddle = middle;
                    touches.lastSquareDistance = squareDistance;

                    doc.onMoveView( that.gl, evt, touches, deltaMove, rotMatrix );
                }
            }
            else if ( evt.touches.length )
            {
                if ( touches.examineNavType == 2 && evt.touches.length >= 2 )
                {
                    touch0 = new x3dom.fields.SFVec2f( evt.touches[ 0 ].screenX, evt.touches[ 0 ].screenY );
                    touch1 = new x3dom.fields.SFVec2f( evt.touches[ 1 ].screenX, evt.touches[ 1 ].screenY );

                    distance = touch1.subtract( touch0 );
                    squareDistance = distance.dot( distance );
                    deltaZoom = ( squareDistance - touches.lastSquareDistance ) / ( 0.1 * ( screen.width + screen.height ) );

                    touches.lastPos.y += deltaZoom;
                    touches.lastSquareDistance = squareDistance;

                    doc.onDrag( that.gl, touches.lastPos.x, touches.lastPos.y, 2 );
                }
                else
                {
                    pos = this.parent.mousePosition( evt.touches[ 0 ] );

                    doc.onDrag( that.gl, pos.x, pos.y, 1 );
                }
            }

            doc.needRender = true;
        };

        // === Touch end ===
        var touchEndHandler = function ( evt, doc )
        {
            this.isMulti = false;

            if ( evt.cancelable )
            {
                evt.preventDefault();
            }

            touches.visualizeTouches( evt );

            if ( doc == null )
            {doc = this.parent.doc;}

            doc._viewarea._isMoving = false;

            // reinit first finger for rotation
            if ( touches.numTouches == 2 && evt.touches.length == 1 )
            {touches.lastDrag = new x3dom.fields.SFVec2f( evt.touches[ 0 ].screenX, evt.touches[ 0 ].screenY );}

            // if all touches are released, reset the list of currently affected pointing sensors
            if ( evt.touches.length == 0 )
            {
                var affectedPointingSensorsList = doc._nodeBag.affectedPointingSensors;
                for ( var i = 0; i < affectedPointingSensorsList.length; ++i )
                {
                    affectedPointingSensorsList[ i ].pointerReleased();
                }

                doc._nodeBag.affectedPointingSensors = [];
            }

            var dblClick = false;

            if ( evt.touches.length < 2 )
            {
                if ( touches.numTouches == 1 )
                {dblClick = true;}
                touches.numTouches = evt.touches.length;
            }

            if ( touches.examineNavType == 1 )
            {
                for ( var i = 0; i < touches.lastLayer.length; i++ )
                {
                    var pos = touches.lastLayer[ i ][ 1 ];

                    doc.onPick( that.gl, pos.x, pos.y );

                    if ( doc._scene._vf.pickMode.toLowerCase() !== "box" )
                    {
                        doc._viewarea.prepareEvents( pos.x, pos.y, 1, "onmouseup" );
                        doc._viewarea._pickingInfo.lastClickObj = doc._viewarea._pickingInfo.pickObj;

                        // click means that mousedown _and_ mouseup were detected on same element
                        if ( doc._viewarea._pickingInfo.pickObj &&
                            doc._viewarea._pickingInfo.pickObj ===
                                doc._viewarea._pickingInfo.lastClickObj )
                        {
                            doc._viewarea.prepareEvents( pos.x, pos.y, 1, "onclick" );
                        }
                    }
                    else
                    {
                        var line = doc._viewarea.calcViewRay( pos.x, pos.y );
                        var isect = doc._scene.doIntersect( line );
                        var obj = line.hitObject;

                        if ( isect && obj )
                        {
                            doc._viewarea._pick.setValues( line.hitPoint );
                            doc._viewarea.checkEvents( obj, pos.x, pos.y, 1, "onclick" );

                            x3dom.debug.logInfo( "Hit '" + obj._xmlNode.localName + "/ " +
                                obj._DEF + "' at pos " + doc._viewarea._pick );
                        }
                    }
                }

                if ( dblClick )
                {
                    var now = Date.now();
                    var dist = touches.firstTouchPoint.subtract( touches.lastDrag ).length();

                    if ( dist < 18 && now - touches.firstTouchTime < 180 )
                    {doc.onDoubleClick( that.gl, 0, 0 );}

                    touches.firstTouchTime = now;
                    touches.firstTouchPoint = touches.lastDrag;
                }
            }
            else if ( touches.lastLayer.length )
            {
                pos = touches.lastLayer[ 0 ][ 1 ];
                doc.onMouseRelease( that.gl, pos.x, pos.y, 0, 1 );
            }

            doc.needRender = true;
        };

        if ( !this.disableTouch )
        {
            // w3c / apple touch events (in Chrome via chrome://flags)
            this.canvas.addEventListener( "touchstart",    touchStartHandler, this.supportsPassiveEvents ? {passive: false} : true );
            this.canvas.addEventListener( "touchmove",     touchMoveHandler,  this.supportsPassiveEvents ? {passive: false} : true );
            this.canvas.addEventListener( "touchend",      touchEndHandler,   true );
        }
    }
};

//----------------------------------------------------------------------------------------------------------------------

/**
 * Creates the WebGPU context and returns it
 * @returns {WebGPUContext} context
 * @param {HTMLCanvas} canvas
 */
x3dom.X3DCanvas.prototype._initContext = async function ( canvas )
{
    x3dom.debug.logInfo( "Initializing X3DCanvas for [" + canvas.id + "]" );
    var context = await x3dom.gfx_webgpu( canvas, this.x3dElem );

    if ( !context )
    {
        x3dom.debug.logError( "No 3D context found..." );
        this.x3dElem.removeChild( canvas );
        return null;
    }

    return context;
};

//----------------------------------------------------------------------------------------------------------------------

/**
 * Creates a param node and adds it to the target node's children
 * @param {String} node - the target node
 * @param {String} name - the name for the parameter
 * @param {String} value - the value for the parameter
 */
x3dom.X3DCanvas.prototype.appendParam = function ( node, name, value )
{
    var param = document.createElement( "param" );
    param.setAttribute( "name", name );
    param.setAttribute( "value", value );
    node.appendChild( param );
};

//----------------------------------------------------------------------------------------------------------------------

/**
 * Creates a div to inform the user that the initialization failed
 * @param {String} x3dElem - the X3D element
 */
x3dom.X3DCanvas.prototype._createInitFailedDiv = function ( x3dElem )
{
    var div = document.createElement( "div" );
    div.setAttribute( "id", "x3dom-create-init-failed" );
    div.style.width = x3dElem.getAttribute( "width" );
    div.style.height = x3dElem.getAttribute( "height" );
    div.style.backgroundColor = "#C00";
    div.style.color = "#FFF";
    div.style.fontSize = "20px";
    div.style.fontWidth = "bold";
    div.style.padding = "10px 10px 10px 10px";
    div.style.display = "inline-block";
    div.style.fontFamily = "Helvetica";
    div.style.textAlign = "center";

    div.appendChild( document.createTextNode( "Your Browser does not support X3DOM" ) );
    div.appendChild( document.createElement( "br" ) );
    div.appendChild( document.createTextNode( "Read more about Browser support on:" ) );
    div.appendChild( document.createElement( "br" ) );

    var link = document.createElement( "a" );
    link.setAttribute( "href", "http://www.x3dom.org/?page_id=9" );
    link.appendChild( document.createTextNode( "X3DOM | Browser Support" ) );
    div.appendChild( link );

    // check if "altImg" is specified on x3d element and if so use it as background
    var altImg = x3dElem.getAttribute( "altImg" ) || null;
    if ( altImg )
    {
        var altImgObj = new Image();
        altImgObj.src = altImg;
        div.style.backgroundImage = "url(" + altImg + ")";
        div.style.backgroundRepeat = "no-repeat";
        div.style.backgroundPosition = "50% 50%";
    }

    x3dElem.appendChild( div );

    x3dom.debug.logError( "Your Browser does not support X3DOM!" );
};

//----------------------------------------------------------------------------------------------------------------------

/**
 * Creates the HTML canvas used as render target
 * @returns {HTMLCanvas} - the created canvas
 * @param {HTMLNode} x3dElem - the X3D root node
 */
x3dom.X3DCanvas.prototype._createHTMLCanvas = function ( x3dElem )
{
    x3dom.debug.logInfo( "Creating canvas for (X)3D element..." );
    var canvas = document.createElement( "canvas" );
    canvas.setAttribute( "class", "x3dom-canvas" );

    // check if user wants to style the X3D element
    var userStyle = x3dElem.getAttribute( "style" );
    if ( userStyle )
    {
        x3dom.debug.logInfo( "Inline X3D styles detected" );
    }

    // check if user wants to attach events to the X3D element
    var evtArr = [
        "onmousedown",
        "onmousemove",
        "onmouseout",
        "onmouseover",
        "onmouseup",
        "onclick",
        "ondblclick",
        "onkeydown",
        "onkeypress",
        "onkeyup",

        // w3c touch: http://www.w3.org/TR/2011/WD-touch-events-20110505/
        "ontouchstart",
        "ontouchmove",
        "ontouchend",
        "ontouchcancel",
        "ontouchleave",
        "ontouchenter",

        // drag and drop, requires 'draggable' source property set true (usually of an img)
        "ondragstart",
        "ondrop",
        "ondragover"
    ];

    // TODO; handle attribute event handlers dynamically during runtime
    //this step is necessary because of some weird behavior in some browsers:
    //we need a canvas element on startup to make every callback (e.g., 'onmousemove') work,
    //which was previously set for the canvas' outer elements
    for ( var i = 0; i < evtArr.length; i++ )
    {
        var evtName = evtArr[ i ];
        var userEvt = x3dElem.getAttribute( evtName );
        if ( userEvt )
        {
            x3dom.debug.logInfo( evtName + ", " + userEvt );

            canvas.setAttribute( evtName, userEvt );

            //remove the event attribute from the X3D element to prevent duplicate callback invocation
            x3dElem.removeAttribute( evtName );
        }
    }

    var userProp = x3dElem.getAttribute( "draggable" );
    if ( userProp )
    {
        x3dom.debug.logInfo( "draggable=" + userProp );
        canvas.setAttribute( "draggable", userProp );
    }

    // workaround since one cannot find out which handlers are registered
    if ( !x3dElem.__addEventListener && !x3dElem.__removeEventListener )
    {
        x3dElem.__addEventListener = x3dElem.addEventListener;
        x3dElem.__removeEventListener = x3dElem.removeEventListener;

        // helpers to propagate the element's listeners
        x3dElem.addEventListener = function ( type, func, phase )
        {
            var j,
                found = false;
            for ( j = 0; j < evtArr.length && !found; j++ )
            {
                if ( evtArr[ j ] === type )
                {
                    found = true;
                }
            }

            if ( found )
            {
                x3dom.debug.logInfo( "addEventListener for div.on" + type );
                canvas.addEventListener( type, func, phase );
            }
            else
            {
                x3dom.debug.logInfo( "addEventListener for X3D.on" + type );
                this.__addEventListener( type, func, phase );
            }
        };

        x3dElem.removeEventListener = function ( type, func, phase )
        {
            var j,
                found = false;
            for ( j = 0; j < evtArr.length && !found; j++ )
            {
                if ( evtArr[ j ] === type )
                {
                    found = true;
                }
            }

            if ( found )
            {
                x3dom.debug.logInfo( "removeEventListener for div.on" + type );
                canvas.removeEventListener( type, func, phase );
            }
            else
            {
                x3dom.debug.logInfo( "removeEventListener for X3D.on" + type );
                this.__removeEventListener( type, func, phase );
            }
        };
    }

    //add element-specific (global) events for the X3D tag
    if ( x3dElem.hasAttribute( "ondownloadsfinished" ) )
    {
        x3dElem.addEventListener( "downloadsfinished",
            function ()
            {
                var eventObject = {
                    target : x3dElem,
                    type   : "downloadsfinished"
                };

                var funcStr = x3dElem.getAttribute( "ondownloadsfinished" );
                var func = new Function( "event", funcStr );
                func.call( x3dElem, eventObject );
            },
            true );
    }

    x3dElem.appendChild( canvas );

    // If the X3D element has an id attribute, append "_canvas"
    // to it and and use that as the id for the canvas
    var id = x3dElem.getAttribute( "id" );
    if ( id !== null )
    {
        canvas.id = "x3dom-" + id + "-canvas";
    }
    else
    {
        // If the X3D element does not have an id... do what?
        // For now check the date for creating a (hopefully) unique id
        var index = Date.now();
        canvas.id = "x3dom-" + index + "-canvas";
    }

    // fix for undefined style attribute when using deprecated .xhtml files
    x3dElem.style = x3dElem.style || {};

    // Apply the width and height of the X3D element to the canvas
    var w,
        h;

    if ( ( w = x3dElem.getAttribute( "width" ) ) !== null )
    {
        //Attention: pbuffer dim is _not_ derived from style attribs!
        if ( w.indexOf( "%" ) >= 0 )
        {
            x3dom.debug.logWarning( "The width attribute is to be specified in pixels not in percent." );
        }
        canvas.style.width = w;
        x3dElem.style.width = w;
        canvas.setAttribute( "width", w );
    }

    if ( ( h = x3dElem.getAttribute( "height" ) ) !== null )
    {
        //Attention: pbuffer dim is _not_ derived from style attribs!
        if ( h.indexOf( "%" ) >= 0 )
        {
            x3dom.debug.logWarning( "The height attribute is to be specified in pixels not in percent." );
        }
        canvas.style.height = h;
        x3dElem.style.height = h;
        canvas.setAttribute( "height", h );
    }

    // http://snook.ca/archives/accessibility_and_usability/elements_focusable_with_tabindex
    canvas.setAttribute( "tabindex", "0" );
    // canvas.focus(); ???why - it is necessary - makes touch events break???

    return canvas;
};

/**
 * Watches for a resize of the canvas and sets the current dimensions
 */
x3dom.X3DCanvas.prototype._watchForResize = function ( )
{
    if ( this.xrSession )
    {
        return;
    }

    var new_dim = [
        parseInt( x3dom.getStyle( this.canvas, "width" ) ) || 0,
        parseInt( x3dom.getStyle( this.canvas, "height" ) ) || 0
    ];

    if ( ( this._current_dim[ 0 ] != new_dim[ 0 ] ) || ( this._current_dim[ 1 ] != new_dim[ 1 ] ) )
    {
        this._current_dim = new_dim;
        this.x3dElem.setAttribute( "width", new_dim[ 0 ] + "px" );
        this.x3dElem.setAttribute( "height", new_dim[ 1 ] + "px" );
    }
};

//----------------------------------------------------------------------------------------------------------------------

/**
 * Creates the div for progression visualization
 */
x3dom.X3DCanvas.prototype._createProgressDiv = function ()
{
    var progressDiv = document.createElement( "div" );
    progressDiv.setAttribute( "class", "x3dom-progress" );

    var spinnerDiv = document.createElement( "div" );
    spinnerDiv.setAttribute( "class", "x3dom-progress-spinner" );
    progressDiv.appendChild( spinnerDiv );

    var text = document.createElement( "div" );
    text.setAttribute( "id", "x3domProgessCount" );
    text.appendChild( document.createTextNode( "Loading..." ) );
    progressDiv.appendChild( text );

    progressDiv.oncontextmenu = progressDiv.onmousedown = function ( evt )
    {
        evt.preventDefault();
        evt.stopPropagation();
        return false;
    };
    return progressDiv;
};

/**
 * Creates the div for progression visualization
 */
x3dom.X3DCanvas.prototype._createVRDiv = function ()
{
    var vrDiv = document.createElement( "div" );
    vrDiv.setAttribute( "class", "x3dom-vr" );

    vrDiv.onclick = ( e ) =>
    {
        this.x3dElem.runtime.toggleVR();
    };

    vrDiv.oncontextmenu = function ( evt )
    {
        evt.preventDefault();
        evt.stopPropagation();
        return false;
    };

    vrDiv.title = "Toggle VR";

    return vrDiv;
};

//----------------------------------------------------------------------------------------------------------------------

/** Helper that converts a point from node coordinates to page coordinates
 FIXME: does NOT work when x3dom.css is not included so that x3d element is not floating
 */
x3dom.X3DCanvas.prototype.mousePosition = function ( evt )
{
    var rect = evt.target.getBoundingClientRect();

    var offsetX = Math.round( evt.clientX - rect.left ) * this.devicePixelRatio;
    var offsetY = Math.round( evt.clientY - rect.top  ) * this.devicePixelRatio;

    return new x3dom.fields.SFVec2f( offsetX, offsetY );
};

//----------------------------------------------------------------------------------------------------------------------

/** Is called in the main loop after every frame
 */
x3dom.X3DCanvas.prototype.tick = function ( timestamp, xrFrame )
{
    var that = this;

    this._elapsedTime = ( this._totalTime ) ? timestamp - this._totalTime : 0;

    this._totalTime = timestamp;

    var runtime = this.x3dElem.runtime;
    var d = Date.now();
    var diff = d - this.lastTimeFPSWasTaken;

    var fps = 1000.0 / ( d - this.fps_t0 );
    this.fps_t0 = d;

    // update routes and stuff
    this.doc.advanceTime( d / 1000.0 );
    var animD = Date.now() - d;

    if ( this.doc.hasAnimationStateChanged() )
    {
        if ( this.doc.isAnimating() )
        {
            runtime.onAnimationStarted();
        }
        else
        {
            runtime.onAnimationFinished();
        }
    }

    if ( this.doc.needRender || xrFrame )
    {
        // calc average frames per second
        if ( diff >= 1000 )
        {
            runtime.fps = this.framesSinceLastTime / ( diff / 1000.0 );
            runtime.addMeasurement( "FPS", runtime.fps );

            this.framesSinceLastTime = 0;
            this.lastTimeFPSWasTaken = d;
        }
        this.framesSinceLastTime++;

        runtime.addMeasurement( "ANIM", animD );

        if ( runtime.isReady == false )
        {
            runtime.ready();
            runtime.isReady = true;
        }

        runtime.enterFrame( {"total": this._totalTime, "elapsed": this._elapsedTime} );

        if ( !xrFrame )
        {
            this.doc.needRender = false;
        }

        this.doc.render( this.context, this.getVRFrameData( xrFrame ) );

        if ( !this.doc._scene._vf.doPickPass )
        {
            runtime.removeMeasurement( "PICKING" );
        }

        runtime.exitFrame( {"total": this._totalTime, "elapsed": this._elapsedTime} );
    }

    if ( this.progressDiv )
    {
        if ( this.doc.downloadCount > 0 )
        {
            runtime.addInfo( "#LOADS:", this.doc.downloadCount );
        }
        else
        {
            runtime.removeInfo( "#LOADS:" );
        }

        if ( this.doc.properties.getProperty( "showProgress" ) !== "false" )
        {
            if ( this.progressDiv )
            {
                var count = Math.max( +this.doc.downloadCount, 0 );
                this.progressDiv.childNodes[ 1 ].textContent = "" + count;
                if ( this.doc.downloadCount > 0 )
                {
                    this.progressDiv.style.opacity = "1";
                }
                else
                {
                    this.progressDiv.style.opacity = "0";
                }
            }
        }
        else
        {
            this.progressDiv.style.opacity = "0";
        }
    }

    //fire downloadsfinished event, if necessary
    if ( this.doc.downloadCount <= 0 && this.doc.previousDownloadCount > 0 )
    {
        var evt;
        if ( document.createEvent )
        {
            evt = document.createEvent( "Events" );
            evt.initEvent( "downloadsfinished", true, true );
            that.x3dElem.dispatchEvent( evt );
        }
        else if ( document.createEventObject )
        {
            evt = document.createEventObject();
            // http://stackoverflow.com/questions/1874866/how-to-fire-onload-event-on-document-in-ie
            that.x3dElem.fireEvent( "ondownloadsfinished", evt );
        }
    }

    this.doc.previousDownloadCount = this.doc.downloadCount;
};

//------------------------------------------------------------------------------

x3dom.X3DCanvas.prototype.mainloop = function ( timestamp, xrFrame )
{
    if ( this.doc && this.x3dElem.runtime )
    {
        this._watchForResize();

        this.tick( timestamp, xrFrame );

        if ( this.xrSession )
        {
            this.xrSession.requestAnimationFrame( this.mainloop );
        }
        else
        {
            window.requestAnimFrame( this.mainloop );
        }
    }
};

//------------------------------------------------------------------------------

/** Loads the given @p uri.
 * @param uri can be a uri or an X3D node
 * @param sceneElemPos
 * @param settings properties
 */
x3dom.X3DCanvas.prototype.load = function ( uri, sceneElemPos, settings )
{
    this.doc = new x3dom.X3DDocument( this.canvas, this.gl, settings );

    this.doc.onload = () =>
    {
        this.mainloop = this.mainloop.bind( this );

        this.checkForVRSupport();

        if ( this.hasRuntime )
        {
            this.mainloop();
        }
        else
        {
            this.tick();
        }
    };

    this.x3dElem.render = () =>
    {
        if ( this.hasRuntime )
        {
            this.doc.needRender = true;
        }
        else
        {
            this.doc.render( x3dCanvas.context );
        }
    };

    this.x3dElem.context = this.context.ctx3d;

    this.doc.onerror = function ()
    {
        alert( "Failed to load X3D document" );
    };

    this.doc.load( uri, sceneElemPos );
};

//------------------------------------------------------------------------------

x3dom.X3DCanvas.prototype.checkForVRSupport = function ()
{
    if ( !navigator.xr )
    {
        return;
    }

    navigator.xr.isSessionSupported( "immersive-vr" ).then( ( isSupported ) =>
    {
        if ( isSupported )
        {
            this.vrDiv.style.display = "block";
        }
    } );
};

x3dom.X3DCanvas.prototype.enterVR = function ()
{
    if ( this.xrSession )
    {
        return;
    }

    this.gl.ctx3d.makeXRCompatible().then( () =>
    {
        navigator.xr.requestSession( "immersive-vr" ).then( ( session ) =>
        {
            session.requestReferenceSpace( "local" ).then( ( space ) =>
            {
                const xrLayer = new XRWebGLLayer( session, this.gl.ctx3d );
                session.updateRenderState( { baseLayer: xrLayer } );

                this._oldCanvasWidth  = this.canvas.width;
                this._oldCanvasHeight = this.canvas.height;

                this.canvas.width  = xrLayer.framebufferWidth;
                this.canvas.height = xrLayer.framebufferHeight;

                this.gl.VRMode = 2;
                this.xrReferenceSpace = space;
                this.xrSession = session;
                this.doc.needRender = true;

                var mat_view = this.doc._viewarea.getViewMatrix();
                var rotation = new x3dom.fields.Quaternion( 0, 0, 1, 0 );
                rotation.normalize();
                rotation.setValue( mat_view );
                var translation = mat_view.e3();

                const offsetTransform = new XRRigidTransform( {x: translation.x, y: translation.y, z: translation.z},
                    {x: rotation.x, y: rotation.y, z: rotation.z, w: rotation.w} );
                this.xrReferenceSpace = this.xrReferenceSpace.getOffsetReferenceSpace( offsetTransform );

                this.xrSession.addEventListener( "end", () =>
                {
                    this.exitVR();
                } );

                session.requestAnimationFrame( this.mainloop );
            } );
        } );
    } );
};

//------------------------------------------------------------------------------

x3dom.X3DCanvas.prototype.exitVR = function ()
{
    if ( !this.xrSession )
    {
        return;
    }

    this.xrSession.end();
    this.xrSession = undefined;
    this.xrReferenceSpace = undefined;
    this.canvas.width  = this._oldCanvasWidth;
    this.canvas.height = this._oldCanvasHeight;
    this.gl.VRMode = 1;
    this.doc.needRender = true;
    window.requestAnimationFrame( this.mainloop );
};

//------------------------------------------------------------------------------

x3dom.X3DCanvas.prototype.getVRFrameData = function ( xrFrame )
{
    if ( !xrFrame )
    {
        return;
    }

    const pose = xrFrame.getViewerPose( this.xrReferenceSpace );

    if ( !pose )
    {
        return;
    }

    const vrFrameData = {
        framebuffer : xrFrame.session.renderState.baseLayer.framebuffer,
        controllers : {}
    };

    for ( const view of pose.views )
    {
        if ( view.eye === "left" )
        {
            vrFrameData.leftViewMatrix = view.transform.inverse.matrix;
            vrFrameData.leftProjectionMatrix = view.projectionMatrix;
        }
        else if ( view.eye === "right" )
        {
            vrFrameData.rightViewMatrix = view.transform.inverse.matrix;
            vrFrameData.rightProjectionMatrix = view.projectionMatrix;
        }
    }

    for ( const inputSource of xrFrame.session.inputSources )
    {
        // Show the input source if it has a grip space
        if ( inputSource.gripSpace )
        {
            const inputPose = xrFrame.getPose( inputSource.gripSpace, this.xrReferenceSpace );
            if ( inputPose !== null && inputPose.transform !== null )
            {
                vrFrameData.controllers[ inputSource.handedness ] = {
                    gamepad : inputSource.gamepad,
                    type    : inputSource.profiles[ 0 ],
                    pose    : {
                        position : [
                            inputPose.transform.position.x,
                            inputPose.transform.position.y,
                            inputPose.transform.position.z
                        ],
                        orientation : [
                            inputPose.transform.orientation.x,
                            inputPose.transform.orientation.y,
                            inputPose.transform.orientation.z,
                            inputPose.transform.orientation.w
                        ]
                    }
                };
            }
        }
    }

    return vrFrameData;
};
