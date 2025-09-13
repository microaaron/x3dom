/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2025 X3DOM Open Source Community
 * Dual licensed under the MIT and GPL
 */

/* ### X3DSingleTextureNode ### */
x3dom.registerNodeType(
    "X3DSingleTextureNode",
    "Texturing",
    class X3DSingleTextureNode extends x3dom.nodeTypes.X3DTextureNode
    {
        /**
         * Constructor for X3DSingleTextureNode
         * @constructs x3dom.nodeTypes.X3DSingleTextureNode
         * @x3d 4.0
         * @component Texturing
         * @status full
         * @extends x3dom.nodeTypes.X3DTextureNode
         * @param {Object} [ctx=null] - context object, containing initial settings like namespace
         * @classdesc This abstract node type is the base type for all texture node types that define a single texture. A single texture can be used to influence a parameter of various material nodes in the Shape component, and it can be a child of MultiTexture.
         * This abstract type applies to all texture nodes except MultiTexture.
         */
        constructor ( ctx )
        {
            super( ctx );

            /**
             * The textureProperties field allows fine control over a texture's application, as described in Texture coordinates(https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/texturing.html#TextureCoordinates).
             * @var {x3dom.fields.SFNode} textureProperties
             * @memberof x3dom.nodeTypes.X3DSingleTextureNode
             * @initvalue x3dom.nodeTypes.TextureProperties
             * @field x3d
             * @instance
             */
            this.addField_SFNode( `textureProperties`, x3dom.nodeTypes.TextureProperties );
        }
    }
);