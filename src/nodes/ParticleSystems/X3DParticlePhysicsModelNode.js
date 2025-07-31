/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 *
 *
 *
 *
 */

/* ### X3DParticlePhysicsModelNode ### */
x3dom.registerNodeType(
    "X3DParticlePhysicsModelNode",
    "ParticleSystems",
    class X3DParticlePhysicsModelNode extends x3dom.nodeTypes.X3DNode
    {
      /**
       * Constructor for X3DParticlePhysicsModelNode
       * @constructs x3dom.nodeTypes.X3DParticlePhysicsModelNode
       * @x3d 4.0
       * @component ParticleSystems
       * @status full
       * @extends x3dom.nodeTypes.X3DNode
       * @param {Object} [ctx=null] - context object, containing initial settings like namespace
       * @classdesc The X3DParticleEmitterNode abstract type represents any node that is an emitter of particles. The shape and distribution of particles is dependent on the type of the concrete node.
       */
      constructor ( ctx )
      {
          super( ctx );
          
          this.addField_SFBool( ctx, "enabled", true );
          
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