/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2025 X3DOM Open Source Community
 * Dual licensed under the MIT and GPL
 */

/* ### UnlitMaterial ### */
x3dom.registerNodeType(
    "UnlitMaterial",
    "Shape",
    class UnlitMaterial extends x3dom.nodeTypes.X3DOneSidedMaterialNode
    {
        /**
         * Constructor for UnlitMaterial
         * @constructs x3dom.nodeTypes.UnlitMaterial
         * @x3d 4.0
         * @component Shape
         * @status full
         * @extends x3dom.nodeTypes.X3DOneSidedMaterialNode
         * @param {Object} [ctx=null] - context object, containing initial settings like namespace
         * @classdesc Material that is unaffected by light sources. Suitable to create various non-realistic effects, when the colors are defined explicitly and are not affected by the placement of the shape relative to the lights or camera.Material that is unaffected by light sources. Suitable to create various non-realistic effects, when the colors are defined explicitly and are not affected by the placement of the shape relative to the lights or camera.
         */
        constructor ( ctx )
        {
            super( ctx );

            /**
             * Use the emissiveColor field value as the emissiveParameter.rgb.
             * @var {x3dom.fields.SFColor} emissiveColor
             * @range [0, 1]
             * @memberof x3dom.nodeTypes.UnlitMaterial
             * @initvalue 1, 1, 1
             * @field x3d
             * @instance
             */
            this.addField_SFColor( ctx, "emissiveColor", 1, 1, 1 );

            /**
             * Use the 1.0 - transparency as the emissiveParameter.a.
             * @var {x3dom.fields.SFFloat} transparency
             * @range [0, 1]
             * @memberof x3dom.nodeTypes.UnlitMaterial
             * @initvalue 0
             * @field x3d
             * @instance
             */
            this.addField_SFFloat( ctx, `transparency`, 0 );
        }
    }
);