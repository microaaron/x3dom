/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 *
 *
 *
 *
 */

/* ### ConeEmitter ### */
x3dom.registerNodeType(
    "ConeEmitter",
    "ParticleSystems",
    class ConeEmitter extends x3dom.nodeTypes.X3DParticleEmitterNode
    {
      /**
       * Constructor for ConeEmitter
       * @constructs x3dom.nodeTypes.ConeEmitter
       * @x3d 4.0
       * @component ParticleSystems
       * @status full
       * @extends x3dom.nodeTypes.X3DParticleEmitterNode
       * @param {Object} [ctx=null] - context object, containing initial settings like namespace
       * @classdesc The ConeEmitter node is an emitter that generates all the available particles from a specific point in space.
       */
      constructor ( ctx )
      {
          super( ctx );
          
          this.addField_SFFloat( ctx, "angle", 0.7853981633974483 );
          
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