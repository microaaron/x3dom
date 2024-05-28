/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 *
 *
 *
 *
 */

/* ### ParticleSystem ### */
x3dom.registerNodeType(
    "ParticleSystem",
    "ParticleSystems",
    class ParticleSystem extends x3dom.nodeTypes.X3DShapeNode
    {
      /**
       * Constructor for ParticleSystem
       * @constructs x3dom.nodeTypes.ParticleSystem
       * @x3d 4.0
       * @component ParticleSystems
       * @status full
       * @extends x3dom.nodeTypes.X3DShapeNode
       * @param {Object} [ctx=null] - context object, containing initial settings like namespace
       * @classdesc The ParticleSystem node specifies a complete particle system.
       */
      constructor ( ctx )
      {
          super( ctx );
          
          this.addField_SFNode( "appearance", x3dom.nodeTypes.X3DAppearanceNode );
          
          this.addField_SFBool( ctx, "bboxDisplay", false );
          
          this.addField_SFBool( ctx, "castShadow", true );
          
          this.addField_SFBool( ctx, "createParticles", true );
          
          this.addField_SFNode( "geometry", x3dom.nodeTypes.X3DGeometryNode );
          
          this.addField_SFBool( ctx, "enabled", true );
          
          this.addField_SFFloat( ctx, "lifetimeVariation", 0.25 );
          
          this.addField_SFFloat( ctx, "lifetimeVariation", 0.25 );
          
          this.addField_SFInt32( ctx, "maxParticles", 200 );
          
          this.addField_SFNode( "metadata", x3dom.nodeTypes.X3DMetadataObject );
          
          this.addField_SFFloat( ctx, "particleLifetime", 5 );
          
          this.addField_SFVec2f( ctx, "particleSize", 0.02, 0.02 );
          
          this.addField_SFBool( ctx, "visible", true );
          
      }
    }
);