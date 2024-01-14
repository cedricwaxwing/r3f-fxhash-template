import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { folder, useControls } from "leva";
import waterDudv from "../../assets/textures/waterdudv.jpg";
import { CircleGeometry, Color, RepeatWrapping } from "three";
import { Reflector } from "three/addons/objects/Reflector.js";

const Water = () => {
  const { scene, viewport } = useThree();

  const geometry = new CircleGeometry(40, 64);
  const waterShader = Reflector.ReflectorShader;

  waterShader.vertexShader = `
  uniform mat4 textureMatrix;
  varying vec4 vUv;
  #include <common>
  #include <logdepthbuf_pars_vertex>

  void main() {
    vUv = textureMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    #include <logdepthbuf_vertex>

  }`;
  waterShader.fragmentShader = `
  uniform vec3 color;
  uniform sampler2D tDiffuse;
  uniform sampler2D tDudv;
  uniform float time;
  varying vec4 vUv;
  uniform float roughness;
  uniform float metalness;
  #include <logdepthbuf_pars_fragment>

  float blendOverlay( float base, float blend ) {
    return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );
  }

  vec3 blendOverlay( vec3 base, vec3 blend ) {
    return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );
  }

  void main() {
    #include <logdepthbuf_fragment>

   float waveStrength = 0.5;
   float waveSpeed = 0.03;

    // simple distortion (ripple) via dudv map (see https://www.youtube.com/watch?v=6B7IF6GOu7s)

    vec2 distortedUv = texture2D( tDudv, vec2( vUv.x + time * waveSpeed, vUv.y ) ).rg * waveStrength;
    distortedUv = vUv.xy + vec2( distortedUv.x, distortedUv.y + time * waveSpeed );
    vec2 distortion = ( texture2D( tDudv, distortedUv ).rg * 2.0 - 1.0 ) * waveStrength;

    // new uv coords

    vec4 uv = vec4( vUv );
    uv.xy += distortion;

    vec4 base = texture2DProj( tDiffuse, uv );

    gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`;

  const dudVMap = useTexture(waterDudv);
  dudVMap.wrapS = dudVMap.wrapT = RepeatWrapping;

  const water = new Reflector(geometry, {
    shader: waterShader,
    clipBias: 0.003,
    textureWidth: 1000,
    textureHeight: 1000,
    color: new Color("#1f58b5"),
  });

  const { sheen, sheenColor, clearcoat, clearcoatRoughness, envMapIntensity } =
    useControls({
      water: folder(
        {
          sheenColor: { value: new Color("#1f58b5") },
          sheen: { min: 0, max: 10, value: 3.0 },
          clearcoat: { min: 0, max: 1, value: 0.95 },
          clearcoatRoughness: { min: 0, max: 1, value: 0.55 },
          envMapIntensity: { min: 0, max: 5, value: 0.4 },
        },
        { collapsed: true }
      ),
    });

  useFrame(({ clock }, dt) => {
    const t = clock.getElapsedTime();
    water.material.uniforms.time.value += t * 0.005;
  });

  water.material.uniforms.tDudv = { value: dudVMap };
  water.material.uniforms.time = { value: 0 };

  water.rotation.set(-Math.PI / 2, 0, 0);
  water.position.set(0, -((viewport.height / 2) * 0.75), 0);

  scene.add(water);
};

export default Water;
