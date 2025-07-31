/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 *
 *
 *
 *
 */

/* ### WindPhysicsModel ### */
x3dom.registerNodeType(
    "WindPhysicsModel",
    "ParticleSystems",
    class WindPhysicsModel extends x3dom.nodeTypes.X3DParticlePhysicsModelNode
    {
      /**
       * Constructor for WindPhysicsModel
       * @constructs x3dom.nodeTypes.WindPhysicsModel
       * @x3d 4.0
       * @component ParticleSystems
       * @status full
       * @extends x3dom.nodeTypes.X3DParticlePhysicsModelNode
       * @param {Object} [ctx=null] - context object, containing initial settings like namespace
       * @classdesc The WindPhysicsModel node specifies a physics model that applies a wind effect to the particles. 
       */
      constructor ( ctx )
      {
          super( ctx );
          
          this.addField_SFVec3f( ctx, "direction", 0, 1, 0 );
          
          //this.addField_SFBool( ctx, "enabled", true );
          
          this.addField_SFFloat( ctx, "gustiness", 0.1 );
          
          //this.addField_SFNode( "metadata", x3dom.nodeTypes.X3DMetadataObject );
          
          this.addField_SFFloat( ctx, "speed", 0.1 );
          
          this.addField_SFFloat( ctx, "turbulence", 0 );
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