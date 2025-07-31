/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 *
 *
 *
 *
 */

/* ### SurfaceEmitter ### */
x3dom.registerNodeType(
    "SurfaceEmitter",
    "ParticleSystems",
    class SurfaceEmitter extends x3dom.nodeTypes.X3DParticleEmitterNode
    {
      /**
       * Constructor for SurfaceEmitter
       * @constructs x3dom.nodeTypes.SurfaceEmitter
       * @x3d 4.0
       * @component ParticleSystems
       * @status full
       * @extends x3dom.nodeTypes.X3DParticleEmitterNode
       * @param {Object} [ctx=null] - context object, containing initial settings like namespace
       * @classdesc The SurfaceEmitter node is an emitter that generates particles from the surface of an object.
       */
      constructor ( ctx )
      {
          super( ctx );
          
          //this.addField_SFFloat( ctx, "mass", 0 );
          
          //this.addField_SFNode( "metadata", x3dom.nodeTypes.X3DMetadataObject );
          
          //this.addField_SFBool( ctx, "on", true );
          
          //this.addField_SFFloat( ctx, "speed", 0 );
          
          //this.addField_SFFloat( ctx, "surfaceArea", 0 );
          
          //this.addField_SFFloat( ctx, "variation", 0.25 );
          
          this.addField_SFNode( "surface", x3dom.nodeTypes.X3DGeometryNode );
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