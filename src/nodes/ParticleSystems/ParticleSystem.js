/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 *
 *
 *
 *
 */

/* ### ParticleSystem ### */
x3dom.registerNodeType(
    "ParticleSystem",
    "ParticleSystems",
    class ParticleSystem extends x3dom.nodeTypes.X3DShapeNode
    {
        /**
       * Constructor for ParticleSystem
       * @constructs x3dom.nodeTypes.ParticleSystem
       * @x3d 4.0
       * @component ParticleSystems
       * @status full
       * @extends x3dom.nodeTypes.X3DShapeNode
       * @param {Object} [ctx=null] - context object, containing initial settings like namespace
       * @classdesc The ParticleSystem node specifies a complete particle system.
       */
        constructor ( ctx )
        {
            super( ctx );

            //this.addField_SFNode( "appearance", x3dom.nodeTypes.X3DAppearanceNode ); //X3DShapeNode

            //this.addField_SFBool( ctx, "bboxDisplay", false );  //X3DBoundedObject

            this.addField_SFBool( ctx, "castShadow", true );

            this.addField_SFBool( ctx, "createParticles", true );

            //this.addField_SFNode( "geometry", x3dom.nodeTypes.X3DGeometryNode ); //X3DShapeNode

            this.addField_SFBool( ctx, "enabled", true );

            this.addField_SFFloat( ctx, "lifetimeVariation", 0.25 );

            this.addField_SFInt32( ctx, "maxParticles", 200 );

            //this.addField_SFNode( "metadata", x3dom.nodeTypes.X3DMetadataObject ); //X3DNode

            this.addField_SFFloat( ctx, "particleLifetime", 5 );

            this.addField_SFVec2f( ctx, "particleSize", 0.02, 0.02 );

            //this.addField_SFBool( ctx, "visible", true ); //X3DBoundedObject

            this.addField_SFBool( ctx, "isActive", true );

            //this.addField_SFVec3f( ctx, "bboxCenter", 0, 0, 0 ); //X3DBoundedObject

            //this.addField_SFVec3f( ctx, "bboxSize", -1, -1, -1 ); //X3DBoundedObject

            this.addField_SFNode( "color", x3dom.nodeTypes.X3DColorNode );

            this.addField_MFFloat( ctx, "colorKey", [] );

            this.addField_SFNode( "emitter", x3dom.nodeTypes.X3DParticleEmitterNode );

            this.addField_SFString( ctx, "geometryType", "QUAD" );

            this.addField_MFNode( "physics", x3dom.nodeTypes.X3DParticlePhysicsModelNode );

            /**
          * @var {x3dom.fields.SFNode} texCoord
          * @memberof x3dom.nodeTypes.ParticleSystem
          * @initvalue null
          * @range [TextureCoordinate|TextureCoordinateGenerator]
          * @field x3dom
          * @instance
          */
            this.addField_SFNode( "texCoord", x3dom.nodeTypes.X3DTextureCoordinateNode );

            this.addField_MFFloat( ctx, "texCoordKey", [] );
        }
        /*
      nodeChanged ()
      {
          super.nodeChanged();
      }
      addChild2 ( node, containerFieldName )
      {
          return super.addChild2( node, containerFieldName );
      }
      removeChild ( node, targetField, force )
      {
          return super.removeChild ( node, targetField, force );
      }
      parentAdded ( parent )
      {
          super.parentAdded( parent );
      }
      parentRemoved ( parent )
      {
          super.parentRemoved( parent );
      }
      fieldChanged ( fieldName )
      {
          super.fieldChanged( fieldName );
      }
      */
    }
);