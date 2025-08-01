# X3DOM Change Log

## Version 1.8.4-dev

* Features
  * draft X3D 4.1 FontLibrary support for custom fonts
  * full support for HAnimDisplacer
  * ImageTexture colorSpaceConversion field
  * support for glTF extensions:
    * KHR_lights_punctual
    * KHR_materials_emissive_strength
    * KHR_mesh_quantization
    * EXT_texture_webp
    * EXT_meshopt_compression
    * MSFT_texture_dds
  * field values from metadata for non-standard nodes
* Improvements
  * Extrusion: fix for two point spines, smooth closed spine and xs 
  * hooks for HAnim in grouping node traversal
  * defaults for outputOnly fields (in Protos)
  * improve IS field name processing in Protos
  * isBound and bindTime output for bindable nodes
  * generate module builds (x3dom-modules.js etc.)
  * allow null value for glTF.scene.nodes
  * improved fog over shadows ([dmorehead](https://github.com/dmorehead))
  * enable negative scale auto-ccw for BufferGeometry/glTF
  * enable shadows for BufferGeometry/glTF
  * add "STEP" interpolator mode to interpolators
  * update cycleInterval behaviour to X3Dv4
  * more accurate startTime update
  * tune PhysicalMaterial for compatible light intensity
* Bugfixes
  * fix Rectangle2D size updates
  * fix fitAll for OrthoViewpoint
  * fix nav. type field updates
  * fix mipmaps for compressed dds
  * allow turntable as initial navigation
    
## Version 1.8.3

* Bugfixes
  * fog pass over shadow
  * numerical field docs
  * improve sortType changes
  * MovieTexture: autostart, ios and removal
  * support url field change for AudioClip
  * better indices for textured IFS with creases 
  * ensure correct children order after ExternProto instancing
  * delete Bindables on Inline removal 
  * more robust DDS header length check
  * allow 0,0,0 as first color in ColorInterpolator
  * game mode init 
  * ROUTE into ProtoInstance
  * update download count after ExternProto loading 
  * Plane subdivision update
  * allow smooth creaseAngle during coord updates for IFS
  * NormalInterpolator: array of MFVec3f
* Improvements
  * tolerate insufficient tex. coords. for IFS
  * shadow/fog test scenes
  * tweaked ESM with depth delta cutoff
  * shadow blur ignores now background
  * replaceWorld with X3D dom
  * prefer dom field updates through mutations
  * tune glTF alphaCutoff
  * auto sortType based on auto texture channel count
  * disable depth write by default for transparent shapes without textures
  * glTF: support extensionsRequired
  * Anchor: allow empty urls and log description 
  * allow field access functions for USE nodes
  * replace new Function() with safe constructed method for shader fields 
  * replace eval() with safe JSON.parse()
  * check back-ups in url field for ImageTexture, Inline, Anchor and ExternProto
  * enable PointProperties for BinaryGeometry
  * SpotLight beamWidth default update
  * allow buffer option for Coordinate/Normal/ColorInterpolators
  * set buffer interpolator default duration to 1 for better compatibility
  * #sourceCode for JSON encoding
  * allow picking of Points which have pointProperties
  * remove duplicate codes for x3dom-full-physics.js/x3dom-physics.debug.js
  * verify doc is available (not null), before manipulations
* Features
  * add basic webXR support
  * baseURL parameter
  * bboxDisplay field for X3DBoundedObject, x3dom custom fields bboxMargin and bboxColor
  * support for glTF draco extension
  * support for EXPORT/IMPORT statements ([microaaron](https://github.com/microaaron))

## Version 1.8.2

* Changes
  * remove support for compressed BinGeo files & Zlib
  * remove support for ImageGeometry
  * remove support for MultiPart
  * remove support for ExternalShape/ExternalGeo and glTF 1.0
  * remove support for loading single components
* Features
  * new Node-based build system
  * automatic origChannelCount detection
  * added exploration modes
  * experimental support for X3D prototypes
  * X3D 4.0: visible field
  * X3D 4.0: viewpoint: viewAll, near/farClipping, navigationInfo fields
  * X3D 4.0: description field for more nodes
  * X3D 4.0: Cone/Cylinder bttom/side/top fields changeable
  * X3D 4.0: PointProperties: variable point size and sprites
* Improvements
  * linted source code
  * replaced deprecated MutationEvents with a MutationObserver
  * use passive event listeners if supported
  * make it possible to run x3dom in strict mode
  * text node improvements
  * resume time at paused fraction
  * more robust collisions in walk mode
  * improved self-transparency
  * SFRotation field type
* Bugfixes
  * BinGeo/PopGeo picking
  * dynamic changes of origChannelCount-Attribute
  * gltf loader material DEF/USE robustness
  * allow better gc after Inline removal
  * line per segment color
  * Sphere, Box, Cylinder, Cone, Plane, Rectangle2D, Disk2D, ArcClose2D ccw
  * TouchSensor isOver to false on mouseout
  * shadows on apples
  * transparent text
  * BooleanToggle toggle event after set
  * TouchSensor hit output fields
  * Light output fields
  * robust transitions to animated viewpoints
  * keep trying to start enabled audio
  * apply gammaCorrectionDefault to background cubemap
  * use HSV space for ColorInterpolator
  * observe and handle removal of X3D element

## Version 1.8.1

* Bugfixes
  * Re-enable x3dom-log text selection.
  * Fix for Debug-Log: 'v'-key does not display 'fieldOfView'.
  * Background fixes
  * enable Nurbs texCoord field
  * various example fixes
  * more robust shader parsing
  * allow queued ComposedShader url loading
  * ComposedShader fixes for VR
  * PixelTexture parsing
* Improvements
  * TextureCoordinateGenerator COORD mode

## Version 1.8.0

* Features
  * webGL 2.0 support
  * glTF 2.0 support
  * Physically-based materials & lighting
  * webVR integration
  * Nurbs
  * Allow multiple planes on a single MPR Volume style element
  * HAnim CPU skinning
  * scene X3D SAI methods
  * X3D JSON encoding for inlines
  * Content negotiation support for Inlines

* Nodes
  * Shape
    * PhysicalMaterial
  * Lighting
    * PhysicalEnvironmentLight
  * Interpolation
    * PositionInterpolator2D
  * Geometry3D
    * BufferAccessor
    * BufferGeometry
    * BufferView
  * Rendering
    * CoordinateDouble
  * EventUtilitie
    * BooleanFilter
    * BooleanSequencer
    * BooleanToggle
    * BooleanTrigger
    * IntegerSequencer
    * IntegerTrigger
    * TimeTrigger
    * X3DSequencerNode
    * X3DTriggerNode
  * VolumeRendering
    * MPRPlane
  * NURBS
    * Contour2D
    * ContourPolyline2D
    * NurbsCurve
    * NurbsCurve2D
    * NurbsOrientationInterpolator
    * NurbsPatchSurface
    * NurbsPositionInterpolator
    * NurbsSurfaceInterpolator
    * NurbsTrimmedSurface
    * X3DNurbsSurfaceGeometryNode
    * X3DParametricGeometryNode

* Fixes & enhancements
   * Sphere
      * Allow fieldChanged by always setting qfactor.
      * Improved texture coordinates
   * Improved caching.
   * Bounding box fixes.
   * Documentation Updates.
   * New global ‘useGeoCache’ param option to toggle use of GeoCache.
   * log div id change to x3dom-log.
   * Many fixes and enhancements by the X3DOM core team and the X3DOM community.

## Version 1.7.2

* Secure X3DOM delivery over HTTPS.
* New RequestManager for all X3DOM related downloads.
* Stop Flash support and remove the Flash-backend.
* Added basic glTF Binary (GLB) support to the ExternalShape-Node.
* General Navigation and Turntable improvements.
* Exposed canvas event handlers.
* Added compatibility with python 3 and 2 for manage.py.
* New GeoLOD-Node.
* and many small other fixes and enhancements.

## Version 1.7.1

* Maintenance release, with lot of bug fixes.
* Compressed Texture Support
* Integration of the Mapbox Earcut library for better polygon triangulation
* DepthMappedVolumeStyle Node + DepthMap Support
* Improved text quality
* Move the ammo.js from x3dom-full.js to the new x3dom-full-physics.js to reduce the download size.
* and many small other fixes and enhancements.

## Version 1.7.0

* CommonSurfaceShader now also supports object-space normal maps (in addition to already available tangent-space normal maps)
* If a viewpoint gets transformed, its center of rotation now gets transformed accordingly (thanks to Andreas Plesch, Harvard University).
* Improvements in geospatial components (support for easting_first, thanks to Andreas Plesch, Harvard University).
* ExternalGeometry node now has a multi-field for the data URL (of type MFString), multiple URLs can be specified as fallback. This is fully backwards compatible with old scenes that specify only a single string.
* alphaClipThreshold attribute to adapt the threshold for X3DOM's alpha test (for textures with transparency)
* Basic TriangleSet implementation (thanks to Yvonne Jung, Fulda University of Applied Sciences)
* Runtime documentation made available
* New tutorial about runtime configuration
* New tutorial about the experimental SSAO implementation
* Some smaller documentation updates
* Several fixes (thanks to Ander Arbelaiz, Andreas Plesch and Yvonne Jung)

## Version 1.6.0

Most important Changes:
* A completely new documentation portal, available via the link from www.x3dom.org and directly via doc.x3dom.org
  * Extensive node API documentation resources, including detailed information about all nodes and fields
  * A lot of great, new tutorials, along with a brand-new "Getting Started" guide

* A first version of the new x3dom examples portal, available at examples.x3dom.org
  * All former examples from the x3dom repository can now be found at this central example page
  * A fresh re-design of the examples page will be available in the near future

* Automated nightly testing suite for improved stability and qualitiy assurance, available at testing.x3dom.org
  * Testing for Chrome and Firefox (Windows 8)
  * Regression test suite, based on script result evaluation and explicit screenshot comparisons
  * Automation and documentation (timeline) for testing process

* New DOM field interface for more efficient field access, using getFieldValue / setFieldValue and requestFieldRef / releaseFieldRef (documentation: doc.x3dom.org/author/index.html)

* New onoutputchange event, for easy handling of ROUTE output in JavaScript
  * can be installed on any node
  * tutorial available at doc.x3dom.org/tutorials/animationInteraction/onoutputchange/index.html

* Gamma-correct lighting by default
  * Example and tutorial at doc.x3dom.org/tutorials/lighting/gamma/index.html

* A new TURNTABLE mode for more intuitive user interaction
  * Example and tutorial available at doc.x3dom.org/tutorials/animationInteraction/navigation/index.html

* First version of the pointingDeviceSensor component, including PlaneSensor, TouchSensor and CylinderSensor
  * Example and tutorial available at doc.x3dom.org/tutorials/animationInteraction/navigation/index.html

* First version of a new, long-lasting Shape Resource Container and ExternalGeometry node
  * documentation of progress available www.x3dom.org/src/
  * will be enriched with new features for compression and streaming during development of X3DOM 2.0
  * will replace ImageGeometry, BinaryGeometry and POPGeometry in X3DOM 2.0

* Instead of permanently linking to the dev version, from now on, we recommend to always use the latest stable release, which is available via the following links:
  *  www.x3dom.org/download/x3dom.js
  *  www.x3dom.org/x3dom/release/x3dom.js

* We have continued our efforts to support IE 11, rendering X3DOM content with WebGL.
  While there are still some issues, some of them caused by non-IE conformant HTML pages in general (also including some of our examples), X3DOM’s IE 11 support is constantly improving.

New Components:
* H-Anim
* PointingDeviceSensors
* RigidBodyPhysics

New Nodes:
* LineSet
* MetadataBoolean
* MultiPart
* ExternalGeometry

Removed Nodes:
* BitLODGeometry

Fixes and Improvements:
* fixed projection matrix bugs
* added shootRay functionality
* added restriction for examine/turntable navigation mode behaviour
* fixed start/end angle bug for Arc2d
* improved debugging possibilities by defining getters
* fixed memory leaks
* fixed adding/removing of background nodes at runtime
* fixed transparency updates
* fixed broken field update for concave IndexedFaceSets
* fixed shader field update when no DOM node is available
* fix to allow lower case attributes in inlined files
* fixed lower case field name support
* added Extrusion node with texture mapping
* added (multiple) mpeg dash in x3dom movie texture
* updates of volume rendering component including composable styles
* fixed several bugs in flash backend
* extended fitObject/All functionality
* implemented gamma-correct rendering
* several shader fixes
* added geosystem UTM/GC support
* basic IE11 WebGL support
* added support for Geolocation node as a transform
* added param to force flash for all IE versions
* added flag to disable culling for LOD-like nodes
* fixed texture clamp/repeat
* allowing setAttribute for lower case field names
* added lit field for geometries
* added new field interfaces get/setFieldValue request/releaseFieldRef
* fixed setAttribute on currently bound viewpoint
* removed over aggressive light clamping for multiple lights
* fixed problems with aspect ratio
* fixed flash download path bug
* fixed reloading if x3d already initialized
* added ping-pong path
* added callbacks for all listeners to expect global mouserelease
* improved dragging functionality
* added orthographic zooming
* renamed X3DBoundedNode to X3DBoundedObject
* lots of cleanup
* added mipmapping for RenderedTexture
* added grab cursor
* fixed removal of original node from namespace when USEd instance was deleted
* fixed TimeSensor looping bug
* fixed USE case sensitivity
* fixed AudioClip automatic playback

## Version 1.5.1

Maintenance release, with lot of bug fixes. Recommended upgrade for 1.5 users.

## Version 1.5.0

We are proud to announce the release of X3DOM 1.5. This most recent
installment of our popular Declarative3D polyfill shines with lots of
new features and a wagon load full of bugfixes.

With version 1.5, X3DOM also overcomes some limits of the scenegraph
structure by using new internal structures for culling and fast
rendering, decoupled from the frontend graph inside the DOM, which,
however, still remains intact as usual.

New Features
* Generally improved traversal and rendering performance with a new
  transformation and volume caching infrastructure
* Culling techniques for large model rendering (some of them still experimental)
  check the [video](http://www.youtube.com/watch?v=2Nd4af3iHdM), or see the [tutorial](http://x3dom.org/docs/dev/tutorial/culling.html)
* Improved experimental binary geometry container and encoding
    * BinaryGeometry with more compact encoding that only uses 7 Bytes per
      triangle (see [example](http://x3dom.org/x3dom/example/x3dom_buddhaBG.html)) and works nicely on mobile devices
    * POPGeometry for progressive streaming and LOD - see the paper and project
      page [here](http://x3dom.org/pop/), or directly check some [examples](http://examples.x3dom.org/pop-pg13/happy.html)
* Experimental BVH Refiner node, for rendering of large, regular data sets
  with dynamic LOD (see [example](http://examples.x3dom.org/BVHRefiner/BVHRefiner.html))
* Shadow support for large scenes and all lights types (see [tutoria](http://x3dom.org/docs/dev/tutorial/shadows.html) for more
  information or click [here](http://x3dom.org/x3dom/example/x3dom_animatedLights.xhtml) or for a [demo](http://examples.x3dom.org/binaryGeo/oilrig_demo/index.html)
* CADGeometry component (not part of the HTML profile)
* Extrusion (and many more geometric 3D primitives in additional
  Geometry3DExt component, also not part of the HTML profile)
* Convenience object 'Moveable' for [object manipulation](http://x3dom.org/x3dom/example/x3dom_uiEvents.html)
* Additional X3D component plugins (not part of the HTML profile and x3dom.js package)
    * CADGeometry component
    * Geometry3D component (e.g. Extrusion, missing level 4 nodes)

Fixes and Improvements
* Many internal [improvements and bugfixes](https://github.com/x3dom/x3dom/issues?milestone=&page=1&state=closed)
* Route removal implemented
* Improved picking functionality to enhance trade-off between precision
  and number of possible ids
* Fullscreen convenience method `x3dom.toggleFullScreen()`
* RenderedTexture extensions for rendering normal buffer or stereo
  (currently only for Oculus Rift)

For a detailed list of changes refer to the [CHANGELOG](http://x3dom.org/download/1.5/CHANGELOG) file.

Grab the frozen 1.5.0 version [here](http://x3dom.org/download/1.5/)

## Version 1.4.0

Welcome to X3DOM 1.4!

After almost one year in the making we are proud to announce a new X3DOM release.
With this latest installment of our defacto standard JavasScript library that marries
HTML with declarative 3D content, we provide many fixes and enhancements.

New in 1.4
  * Experimental geometry nodes that externalize vertex data in binary containers:
      - ImageGeometry (which holds vertex attributes in images),
      - BinaryGeometry (which holds vertex data in binary files,
        where attributes can have - besides standard 32-bit - 8-bit and 16-bit precision),
      - BitLODGeometry (which also holds vertex attributes in external files,
        though here the containers can consist of variable bit precision for JPEG-like effects)
      - Tutorial for image and binary geometry generation (:ref:`aopt`)
  * OrthoViewpoint and Viewfrustum
  * Basic support for VolumeRendering component (VolumeData node, OpacityMapVolumeStyle, MPRVolumeStyle)
  * Programmatic documentation API (:ref:`runtime_api`)
  * MultiTouch integration now supporting iOS devices, Chrome, and Mozilla
  * Added attribute setters, viewpointChanged event, helicopter mode etc.

Enhancements and Fixes
  * Enhanced picking with a max. of 65,535 objects, while the corresponding mouse or touch event
    also provides the picked position with 16-bit precision and the object normal at this position
  * More rendering features like the sortKey/sortType Appearance fields for defining the
    rendering order, or the DepthMode (App. child) to define if an object shall be readOnly
  * Multiline Text support per specification
      - changed FontStyle size field to X3D default behavior
  * Enhanced JavaScript runtime API now with a plethora of additional methods  (:ref:`runtime_api`)
  * Lots of Flash backend fixes (e.g., LOD now also in Flash renderer supported)
  * Many more bugfixes in IndexedFaceSet, skybox background node etc.


For a complete and exhaustive list of changes, please refer to the [CHANGELOG](http://x3dom.org/download/1.4/CHANGELOG>) 
file or [GitHub Issue Tracker](https://github.com/x3dom/x3dom/issues?page=1&sort=updated&state=closed).

You can get the this X3DOM release from: http://x3dom.org/download/1.4/

## Version 1.3.0

  * Our participation at the W3C was officially launched
  * We have moved from SF to GitHub
  * We have added some unit tests
  * We have renewed our documentation and added some tutorials
  * We have added component support for X3DOM to hold the core tight and allow (non-)standardized extensions
  * With the release of Flash 11 we are now able to use a non-beta API for the Flash fallback
  * `<x3d src='foo.x3d' />` support allows integration of 3D content like
    native images. Note: this will not behave like including images and only work in a client/server
    environment due the fact that we have to use the XMLHttpRequest functionality
  * We have redesigned our multitouch support. It now works on iOS devices and
    multitouch setups with Mozilla. For Android and Firefox there seem to be
    some bugs in the android implementation and this should work only
    after these bugs are closed
  * We worked on the WebGL-backend, reducing the shader complexity to run on
    mobile hardware. The shaders are now chosen using a cabs-like system.
  * Added support for billboards
  * Redesigned our build system
  * We have implemented functionality for reflecting inlined scenes into the
    namespace of parent scenes. With this it is now possible to access
    elements from the parent scene to address elements within the inlined
    scene. Due to the lack of supporting such a concept in the X3D and
    HTML standard we have made use of a custom extension (see field
    nameSpaceName)
  * Inline support in a flash renderer
  * Support for a `<param>` tag. This allows to configure
    the framework runtime at a single point
  * Extended triangulation for generating triangles out of concave geometry
  * New components
  * Various fixes & new features

With the new component model we have added the first two optional components:

  * 2D primitive support for the use of elements like rectangles, discs, lines, etc.
  * Initial support for some GEO referencing elements from the X3D specification

## Version 1.2.0

After many months of work, we’re proud to announce the release today of
X3DOM 1.2. There’s plenty of cool stuff we have worked on since the last
release. You can also swing by the downloads page to grab a copy of the
release package:

http://x3dom.org/x3dom/release/

Major Feature: Flash11/MoleHill Render backend

The new version supports an additional render-backend. The system now looks
for a Flash11 plugin if the browser does not provide a SAI-Plugin or WebGL
interface. This enables the user to view X3DOM pages, with some restrictions,
using the Internet Explorer 9 browser. It utilizes the Adobe Flash MoleHill
3D-API for GPU-Accelerated rendering. To use Adobe Flash-based X3DOM you need
the latest Adobe Flash Player Incubator build (11.01.3d).

Our `x3dom.swf` must either be placed in the same folder as your xhtml/html
files, or you can specify a path with the swfpath-Parameter of the X3D-Node.
With the X3D-Nodes backend-Parameter you can set Flash as default backend.

At the moment the Flash-backend is still in an early beta state with most of
base nodes working. Special features like multiple lights, shadows,
CommonSurfaceShader, etc. are being worked on

Additional Changes

  * Internal reorganization of sources. Node type have now their own submodule
    (src/nodes) and are split into groups.
  * Text node is partially working now. You can use any font available to the
    browser. This includes WebFonts of CSS3.
  * Added system to pass parameters to runtime. The use attributes with the
    X3D element will be deprecated in 1.3. Currently supported parameters
  * Partially working MT support with on Firefox beta. Experimental.
  * It is now possible to directly apply CSS styles to the X3D element.
  * Fixed display problem with textures which have dimensions not to the
    power of two.

## Version 1.1.0

Second stable release after almost 7 month.

http://x3dom.org/download/x3dom-v1.1.js

Most features from the 1.1. milestone are implemented:

  * Unified HTML/XHTML encoding
  * HTML5 <canvas>, <img> and <video> as texture element supported
  * CSS 3D Transforms
  * Shader composition framework
  * multiple lights and support for Spot-, Point- and DirectionalLight
  * Fog
  * LOD
  * Support for large meshes
  * Improved normal generation
  * Follower component
  * WebGL compatibility
  * The proposed HTML profile is almost implemented
  * The fallback-model has changed a bit. We partially support X3D-SAI
    plugins now and removed O3D as technology.

Recently there have been several changes in the WebGL-API (e.g. interface
changes in texImage2D() method, replacement of old WebGL array types with
the new TypedArray specification, enforcement of precision modifiers in
shader code, and changed behavior of NPOT textures). This leads to
incompatibilities with previous versions, why the 1.0 X3DOM release does
no longer work together with recent browser versions.

## Version 1.0.0

First stable release of the framework.

http://x3dom.org/download/x3dom-v1.0.js

All initially planned features are implemented:

  * HTML / XHTML Support
  * Monitoring of DOM element add/remove and attribute change
  * JS-Scenegraph synchronizer
  * ROUTEs
  * DEF/USE support
  * External Subtree (via X3D Inline)
  * Image (Texture), Movie (Texture) and Sound (Emitter) support
  * Navigation: Examine
  * WebGL Render backend
  * The proposed HTML profile is partially implemented.

Full release notes [here](http://www.x3dom.org/?p=781).
