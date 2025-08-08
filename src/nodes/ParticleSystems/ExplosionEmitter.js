/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 *
 *
 *
 *
 */

/* ### ExplosionEmitter ### */
x3dom.registerNodeType(
    "ExplosionEmitter",
    "ParticleSystems",
    class ExplosionEmitter extends x3dom.nodeTypes.X3DParticleEmitterNode
    {
        /**
       * Constructor for ExplosionEmitter
       * @constructs x3dom.nodeTypes.ExplosionEmitter
       * @x3d 4.0
       * @component ParticleSystems
       * @status full
       * @extends x3dom.nodeTypes.X3DParticleEmitterNode
       * @param {Object} [ctx=null] - context object, containing initial settings like namespace
       * @classdesc The ExplosionEmitter node is an emitter that generates all the available particles from a specific point in space at the initial time. Particles are emitted from the single point specified by the position field in all directions at the speed specified by the speed field.
       */
        constructor ( ctx )
        {
            super( ctx );

            //this.addField_SFFloat( ctx, "mass", 0 );

            //this.addField_SFNode( "metadata", x3dom.nodeTypes.X3DMetadataObject );

            //this.addField_SFBool( ctx, "on", true );

            this.addField_SFVec3f( ctx, "position", 0, 0, 0 );

            //this.addField_SFFloat( ctx, "speed", 0 );

            //this.addField_SFFloat( ctx, "surfaceArea", 0 );

            //this.addField_SFFloat( ctx, "variation", 0.25 );
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