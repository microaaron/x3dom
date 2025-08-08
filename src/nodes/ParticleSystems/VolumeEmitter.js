/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 *
 *
 *
 *
 */

/* ### VolumeEmitter ### */
x3dom.registerNodeType(
    "VolumeEmitter",
    "ParticleSystems",
    class VolumeEmitter extends x3dom.nodeTypes.X3DParticleEmitterNode
    {
        /**
       * Constructor for VolumeEmitter
       * @constructs x3dom.nodeTypes.VolumeEmitter
       * @x3d 4.0
       * @component ParticleSystems
       * @status full
       * @extends x3dom.nodeTypes.X3DParticleEmitterNode
       * @param {Object} [ctx=null] - context object, containing initial settings like namespace
       * @classdesc A VolumeEmitter node emits particles from random positions on the surface of a volume, which then propagate either inside or outside the given closed geometry volume.
       */
        constructor ( ctx )
        {
            super( ctx );

            //this.addField_MFInt32( ctx, "set_coordIndex", [] );//I don't know what it is.

            this.addField_SFNode( "coord", x3dom.nodeTypes.X3DCoordinateNode );

            this.addField_SFVec3f( ctx, "direction", 0, 1, 0 );

            //this.addField_SFFloat( ctx, "mass", 0 );

            //this.addField_SFNode( "metadata", x3dom.nodeTypes.X3DMetadataObject );

            //this.addField_SFBool( ctx, "on", true );

            //this.addField_SFFloat( ctx, "speed", 0 );

            //this.addField_SFFloat( ctx, "surfaceArea", 0 );

            //this.addField_SFFloat( ctx, "variation", 0.25 );

            this.addField_MFInt32( ctx, "coordIndex", [ -1 ] );

            this.addField_SFBool( ctx, "interna", true );
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