/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 *
 *
 *
 *
 */

/* ### PointEmitter ### */
x3dom.registerNodeType(
    "PointEmitter",
    "ParticleSystems",
    class PointEmitter extends x3dom.nodeTypes.X3DParticleEmitterNode
    {
        /**
       * Constructor for PointEmitter
       * @constructs x3dom.nodeTypes.PointEmitter
       * @x3d 4.0
       * @component ParticleSystems
       * @status full
       * @extends x3dom.nodeTypes.X3DParticleEmitterNode
       * @param {Object} [ctx=null] - context object, containing initial settings like namespace
       * @classdesc The PointEmitter node is an emitter that generates particles from the point in space specified by the position field. Particles are emitted in the specified direction and speed.
       */
        constructor ( ctx )
        {
            super( ctx );

            /**
           * direction
           * @var {x3dom.fields.SFVec3f} direction
           * @memberof x3dom.nodeTypes.PointEmitter
           * @initvalue 0,1,0
           * @range [-1, 1]
           * @field x3d
           * @instance
           */
            this.addField_SFVec3f( ctx, "direction", 0, 1, 0 );

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