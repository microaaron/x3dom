/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 *
 *
 *
 *
 */

/* ### ForcePhysicsModel ### */
x3dom.registerNodeType(
    "ForcePhysicsModel",
    "ParticleSystems",
    class ForcePhysicsModel extends x3dom.nodeTypes.X3DParticlePhysicsModelNode
    {
        /**
       * Constructor for ForcePhysicsModel
       * @constructs x3dom.nodeTypes.ForcePhysicsModel
       * @x3d 4.0
       * @component ParticleSystems
       * @status full
       * @extends x3dom.nodeTypes.X3DParticlePhysicsModelNode
       * @param {Object} [ctx=null] - context object, containing initial settings like namespace
       * @classdesc The ForcePhysicsModel node specifies a physics model that applies a constant force value to the particles. Force may act in any given direction vector at any strength.
       */
        constructor ( ctx )
        {
            super( ctx );

            //this.addField_SFBool( ctx, "enabled", true );

            this.addField_SFVec3f( ctx, "force", 0, -9.8, 0 );

            //this.addField_SFNode( "metadata", x3dom.nodeTypes.X3DMetadataObject );
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