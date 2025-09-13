/** @namespace */
/*
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2025 X3DOM Open Source Community
 * Dual licensed under the MIT and GPL
 */

/* ### X3DUrlObject ### */
x3dom.registerNodeType(
    "X3DUrlObject",
    "Networking",

    /**
     * X3DUrlObject is an abstract interface
     * @constructs x3dom.nodeTypes.X3DUrlObject
     * @x3d 4.0
     * @component Networking
     * @status full
     * @extends null
     * @param {Object} [ctx=null] - context object, containing initial settings like namespace
     * @classdesc This abstract interface is inherited by all nodes that contain data located on the World Wide Web, such as AudioClip, ImageTexture and Inline.
     */
    function X3DUrlObject ( ctx )
    {
        /**
         * The autoRefresh field defines the interval in seconds that are necessary before an automatic reload of the current url asset is performed. If the preceding file loading fails or the load field is FALSE, no automatic refresh is performed. If performed, a refresh attempts to reload the currently loaded entry of the url list. If an automatic refresh fails to reload the currently loaded url entry, the X3D browser retries the other entries in the url list.
         * NOTE  Automatic refresh is different than query and response timeouts performed by a networking library while sequentially attempting to retrieve addressed content from a url list.
         * @var {x3dom.fields.SFTime} autoRefresh
         * @memberof x3dom.nodeTypes.X3DUrlObject
         * @initvalue 0.0
         * @field x3d
         * @instance
         */
        this.addField_SFTime( ctx, `autoRefresh`, 0.0 );

        /**
         * The autoRefreshTimeLimit field defines the maximum duration that automatic refresh activity can occur.
         * WARNING  Automatically reloading content can have security implications and needs to be considered carefully.
         * @var {x3dom.fields.SFTime} autoRefreshTimeLimit
         * @memberof x3dom.nodeTypes.X3DUrlObject
         * @initvalue 3600.0
         * @field x3d
         * @instance
         */
        this.addField_SFTime( ctx, `autoRefreshTimeLimit`, 3600.0 );

        /**
         * The description field specifies a textual description for the url asset. This information may be used by X3D browser-specific user interfaces that wish to present users with more detailed information about the linked content.
         * @var {x3dom.fields.SFString} description
         * @memberof x3dom.nodeTypes.X3DUrlObject
         * @initvalue ""
         * @field x3d
         * @instance
         */
        this.addField_SFString( ctx, `description`, `` );

        /**
         * The load field allows deferring when the referenced content is read and displayed, in profiles that support that field. In profiles that do not support the load field, url content is loaded immediately.
         * @var {x3dom.fields.SFBool} load
         * @memberof x3dom.nodeTypes.X3DUrlObject
         * @initvalue true
         * @field x3d
         * @instance
         */
        this.addField_SFBool( ctx, `load`, true );

        /**
         * All url fields can hold multiple string values. The strings in these fields indicate multiple locations to search for data in the order listed. If the X3D browser cannot locate or interpret the data specified by the first location, it shall try the second and subsequent locations in order until a location containing interpretable data is encountered. X3D browsers only have to interpret a single string. If no interpretable locations are found, the node type defines the resultant default behaviour.
         * @var {x3dom.fields.MFString} url
         * @memberof x3dom.nodeTypes.X3DUrlObject
         * @initvalue []
         * @field x3d
         * @instance
         */
        this.addField_MFString( ctx, `url`, [] );
    }
);