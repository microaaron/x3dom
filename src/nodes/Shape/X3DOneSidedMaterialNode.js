/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2025 X3DOM Open Source Community
 * Dual licensed under the MIT and GPL
 */

/* ### X3DOneSidedMaterialNode ### */
x3dom.registerNodeType(
    "X3DOneSidedMaterialNode",
    "Shape",
    class X3DOneSidedMaterialNode extends x3dom.nodeTypes.X3DMaterialNode
    {
        /**
         * Constructor for X3DOneSidedMaterialNode
         * @constructs x3dom.nodeTypes.X3DOneSidedMaterialNode
         * @x3d 4.0
         * @component Shape
         * @status full
         * @extends x3dom.nodeTypes.X3DMaterialNode
         * @param {Object} [ctx=null] - context object, containing initial settings like namespace
         * @classdesc This is the base node type for material nodes that describe how the shape looks like from one side.
         * This node defines common properties for a lighting calculation, but independent of the lighting model (Phong, physically-based, unlit).
         * This node can be used within Appearance.material or Appearance.backMaterial.
         */
        constructor ( ctx )
        {
            super( ctx );

            /**
             * The emissiveTexture RGB channel is multiplied with the emissiveColor to yield the emissiveParameter in the lighting equations. Further information is provided in Points and lines rendering(https://www.web3d.org/documents/specifications/19775-1/V4.0/Part01/components/rendering.html#PointsLinesRendering).
             * @var {x3dom.fields.SFNode} emissiveTexture
             * @memberof x3dom.nodeTypes.X3DOneSidedMaterialNode
             * @initvalue x3dom.nodeTypes.X3DSingleTextureNode
             * @field x3d
             * @instance
             */
            this.addField_SFNode( `emissiveTexture`, x3dom.nodeTypes.X3DSingleTextureNode );

            /**
             * @var {x3dom.fields.SFString} emissiveTextureMapping
             * @memberof x3dom.nodeTypes.X3DOneSidedMaterialNode
             * @initvalue ""
             * @field x3d
             * @instance
             */
            this.addField_SFString( ctx, `emissiveTextureMapping`, `` );

            /**
             * normal.xyz = normalize((textureSample(normalTexture).rgb * vec3(2,2,2) - vec3(1,1,1)) * vec3(normalScale, normalScale, 1))
             * @var {x3dom.fields.SFFloat} normalScale
             * @range [0, ∞)
             * @memberof x3dom.nodeTypes.X3DOneSidedMaterialNode
             * @initvalue 1
             * @field x3d
             * @instance
             */
            this.addField_SFFloat( ctx, `normalScale`, 1 );

            /**
             * normal.xyz = normalize((textureSample(normalTexture).rgb * vec3(2,2,2) - vec3(1,1,1)) * vec3(normalScale, normalScale, 1))
             * @var {x3dom.fields.SFNode} normalTexture
             * @memberof x3dom.nodeTypes.X3DOneSidedMaterialNode
             * @initvalue x3dom.nodeTypes.X3DSingleTextureNode
             * @field x3d
             * @instance
             */
            this.addField_SFNode( `normalTexture`, x3dom.nodeTypes.X3DSingleTextureNode );

            /**
             * @var {x3dom.fields.SFString} normalTextureMapping
             * @memberof x3dom.nodeTypes.X3DOneSidedMaterialNode
             * @initvalue ""
             * @field x3d
             * @instance
             */
            this.addField_SFString( ctx, `normalTextureMapping`, `` );
        }
    }
);