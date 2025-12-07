import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useFBO } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// Custom shader material for the fluid simulation
const createSimulationMaterial = () => new THREE.ShaderMaterial({
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform sampler2D uCurrentPosition;
    uniform sampler2D uOriginalPosition;
    uniform float uTime;
    uniform float uCurl;
    uniform float uSpeed;

    vec3 snoise(vec3 uv) {
      uv.x += uTime * 0.01;
      float s = sin(uv.z * 2.1) * 0.2 + cos(uv.y * 3.2) * 0.3 + sin(uv.x * 2.2) * 0.2;
      float c = cos(uv.z * 2.1) * 0.2 + sin(uv.y * 3.2) * 0.3 + cos(uv.x * 2.2) * 0.2;
      float s2 = sin(uv.y * 1.1) * 0.2 + cos(uv.x * 2.2) * 0.3 + sin(uv.z * 1.2) * 0.2;
      float c2 = cos(uv.y * 1.1) * 0.2 + sin(uv.x * 2.2) * 0.3 + cos(uv.z * 1.2) * 0.2;
      return vec3(s, c, s2 * c2) * uCurl;
    }

    void main() {
      vec3 currentPos = texture2D(uCurrentPosition, vUv).xyz;
      vec3 originalPos = texture2D(uOriginalPosition, vUv).xyz;
      vec3 noise = snoise(currentPos * 0.1);
      currentPos += noise * uSpeed;
      gl_FragColor = vec4(currentPos, 1.0);
    }
  `,
  uniforms: {
    uCurrentPosition: { value: null },
    uOriginalPosition: { value: null },
    uTime: { value: 0 },
    uCurl: { value: 1.5 },
    uSpeed: { value: 0.01 },
  },
});

const createRenderMaterial = () => new THREE.ShaderMaterial({
  vertexShader: `
    uniform sampler2D uPosition;
    uniform float uTime;
    varying vec3 vColor;

    void main() {
      vec3 pos = texture2D(uPosition, position.xy).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = 1.5;
      vColor = normalize(pos) * 0.5 + 0.5;
    }
  `,
  fragmentShader: `
    varying vec3 vColor;
    void main() {
      gl_FragColor = vec4(vColor, 1.0);
    }
  `,
  uniforms: {
    uPosition: { value: null },
    uTime: { value: 0 },
  },
  transparent: true,
  depthWrite: false,
});

export function ParticleScene() {
  const size = 256; // Reduced for performance
  const pointsRef = useRef<THREE.Points>(null!);
  const { gl } = useThree();
  
  const simulationMaterial = useMemo(() => createSimulationMaterial(), []);
  const renderMaterial = useMemo(() => createRenderMaterial(), []);

  // Create FBOs
  const fbo1 = useFBO(size, size, {
    type: THREE.FloatType,
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
  });
  const fbo2 = useFBO(size, size, {
    type: THREE.FloatType,
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
  });

  // Store current FBO index for ping-pong
  const fboRef = useRef({ read: fbo1, write: fbo2 });

  // Initialize particle positions and textures
  const { originalPositionTexture, particlePositions } = useMemo(() => {
    const particles = new Float32Array(size * size * 4);
    const geometry = new THREE.TorusKnotGeometry(1.2, 0.3, 200, 16);
    const positions = geometry.attributes.position.array;
    
    for (let i = 0; i < size * size; i++) {
      const i4 = i * 4;
      const p_i = (i * 3) % positions.length;
      particles[i4 + 0] = positions[p_i + 0];
      particles[i4 + 1] = positions[p_i + 1];
      particles[i4 + 2] = positions[p_i + 2];
      particles[i4 + 3] = 1.0;
    }

    const originalPositionTexture = new THREE.DataTexture(
      particles, 
      size, 
      size, 
      THREE.RGBAFormat, 
      THREE.FloatType
    );
    originalPositionTexture.needsUpdate = true;

    const particlePositions = new Float32Array(size * size * 3);
    for (let i = 0; i < size * size; i++) {
      const i3 = i * 3;
      particlePositions[i3 + 0] = (i % size) / size;
      particlePositions[i3 + 1] = Math.floor(i / size) / size;
      particlePositions[i3 + 2] = 0;
    }

    return { originalPositionTexture, particlePositions };
  }, [size]);

  // Initialize FBO with original positions
  useEffect(() => {
    const tempScene = new THREE.Scene();
    const tempCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const tempMaterial = new THREE.MeshBasicMaterial({ map: originalPositionTexture });
    const tempMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), tempMaterial);
    tempScene.add(tempMesh);
    
    gl.setRenderTarget(fboRef.current.read);
    gl.render(tempScene, tempCamera);
    gl.setRenderTarget(null);
    
    tempMaterial.dispose();
  }, [gl, originalPositionTexture]);

  // Simulation loop
  useFrame((state) => {
    const { gl, clock } = state;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    // Update simulation
    simulationMaterial.uniforms.uCurrentPosition.value = fboRef.current.read.texture;
    simulationMaterial.uniforms.uOriginalPosition.value = originalPositionTexture;
    simulationMaterial.uniforms.uTime.value = clock.elapsedTime;
    
    const simulationMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simulationMaterial);
    scene.add(simulationMesh);
    
    gl.setRenderTarget(fboRef.current.write);
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    // Swap FBOs
    const temp = fboRef.current.read;
    fboRef.current.read = fboRef.current.write;
    fboRef.current.write = temp;

    // Update render material
    renderMaterial.uniforms.uPosition.value = fboRef.current.read.texture;
    renderMaterial.uniforms.uTime.value = clock.elapsedTime;

    // Rotate points
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.002;
      pointsRef.current.rotation.x += 0.001;
    }
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute 
            attach="attributes-position" 
            count={size * size} 
            array={particlePositions} 
            itemSize={3} 
          />
        </bufferGeometry>
        <primitive object={renderMaterial} attach="material" />
      </points>
      <EffectComposer>
        <Bloom intensity={0.8} luminanceThreshold={0.1} luminanceSmoothing={0.9} height={512} />
      </EffectComposer>
    </>
  );
}
