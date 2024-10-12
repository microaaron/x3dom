/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 *
 *
 *
 *
 */

/* ### BoundedPhysicsModel ### */
x3dom.registerNodeType(
    "BoundedPhysicsModel",
    "ParticleSystems",
    class BoundedPhysicsModel extends x3dom.nodeTypes.X3DParticlePhysicsModelNode
    {
      /**
       * Constructor for BoundedPhysicsModel
       * @constructs x3dom.nodeTypes.BoundedPhysicsModel
       * @x3d 4.0
       * @component ParticleSystems
       * @status full
       * @extends x3dom.nodeTypes.X3DParticlePhysicsModelNode
       * @param {Object} [ctx=null] - context object, containing initial settings like namespace
       * @classdesc The BoundedPhysicsModel node specifies a physics model that applies a user-defined set of geometrical bounds to the particles.
       */
      constructor ( ctx )
      {
          super( ctx );
          
          //this.addField_SFBool( ctx, "enabled", true );
          
          this.addField_SFNode( "geometry", x3dom.nodeTypes.X3DGeometryNode );
          
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