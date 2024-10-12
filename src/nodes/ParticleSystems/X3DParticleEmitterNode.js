/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 *
 *
 *
 *
 */

/* ### X3DParticleEmitterNode ### */
x3dom.registerNodeType(
    "X3DParticleEmitterNode",
    "ParticleSystems",
    class X3DParticleEmitterNode extends x3dom.nodeTypes.X3DNode
    {
      /**
       * Constructor for X3DParticleEmitterNode
       * @constructs x3dom.nodeTypes.X3DParticleEmitterNode
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
          
          this.addField_SFFloat( ctx, "mass", 0 );
          
          //this.addField_SFNode( "metadata", x3dom.nodeTypes.X3DMetadataObject );
          
          this.addField_SFBool( ctx, "on", true );
          
          this.addField_SFFloat( ctx, "speed", 0 );
          
          this.addField_SFFloat( ctx, "surfaceArea", 0 );
          
          this.addField_SFFloat( ctx, "variation", 0.25 );
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