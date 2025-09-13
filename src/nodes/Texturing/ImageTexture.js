/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2025 X3DOM Open Source Community
 * Dual licensed under the MIT and GPL
 */

/* ### ImageTexture ### */
x3dom.registerNodeType(
    "ImageTexture",
    "Texturing",
    class ImageTexture extends x3dom.nodeTypes.X3DTexture2DNode
    {
        /**
         * Constructor for ImageTexture
         * @constructs x3dom.nodeTypes.ImageTexture
         * @x3d 4.0
         * @component Texturing
         * @status full
         * @extends x3dom.nodeTypes.X3DTexture2DNode
         * @param {Object} [ctx=null] - context object, containing initial settings like namespace
         * @classdesc The ImageTexture node defines a texture map by specifying an image file and general parameters for mapping to geometry.
         */
        constructor ( ctx )
        {
            super( ctx );
            x3dom.nodeTypes.X3DUrlObject.call( this, ctx );

            /**
             * Specifies whether embedded color profiles are used in conversion to rendering. true for X3D, false for glTF.
             * @var {x3dom.fields.SFBool} colorSpaceConversion
             * @memberof x3dom.nodeTypes.ImageTexture
             * @initvalue true
             * @field x3dom
             * @instance
             */
            this.addField_SFBool( ctx, "colorSpaceConversion", true );

            /**
             * The autoRefresh field defines the interval in seconds that are necessary before an automatic reload of the current url asset is performed. If the preceding file loading fails or the load field is FALSE, no automatic refresh is performed. If performed, a refresh attempts to reload the currently loaded entry of the url list. If an automatic refresh fails to reload the currently loaded url entry, the X3D browser retries the other entries in the url list.
             * NOTE  Automatic refresh is different than query and response timeouts performed by a networking library while sequentially attempting to retrieve addressed content from a url list.
             * @var {x3dom.fields.SFTime} autoRefresh
             * @memberof x3dom.nodeTypes.ImageTexture
             * @initvalue 0.0
             * @field x3d
             * @instance
             */;

            /**
             * The autoRefreshTimeLimit field defines the maximum duration that automatic refresh activity can occur.
             * WARNING  Automatically reloading content can have security implications and needs to be considered carefully.
             * @var {x3dom.fields.SFTime} autoRefreshTimeLimit
             * @memberof x3dom.nodeTypes.ImageTexture
             * @initvalue 3600.0
             * @field x3d
             * @instance
             */;

            /**
             * The description field specifies a textual description for the url asset. This information may be used by X3D browser-specific user interfaces that wish to present users with more detailed information about the linked content.
             * @var {x3dom.fields.SFString} description
             * @memberof x3dom.nodeTypes.ImageTexture
             * @initvalue ""
             * @field x3d
             * @instance
             */;

            /**
             * The load field allows deferring when the referenced content is read and displayed, in profiles that support that field. In profiles that do not support the load field, url content is loaded immediately.
             * @var {x3dom.fields.SFBool} load
             * @memberof x3dom.nodeTypes.ImageTexture
             * @initvalue true
             * @field x3d
             * @instance
             */;

            /**
             * All url fields can hold multiple string values. The strings in these fields indicate multiple locations to search for data in the order listed. If the X3D browser cannot locate or interpret the data specified by the first location, it shall try the second and subsequent locations in order until a location containing interpretable data is encountered. X3D browsers only have to interpret a single string. If no interpretable locations are found, the node type defines the resultant default behaviour.
             * @var {x3dom.fields.MFString} url
             * @memberof x3dom.nodeTypes.ImageTexture
             * @initvalue []
             * @field x3d
             * @instance
             */;
        }
    }
);