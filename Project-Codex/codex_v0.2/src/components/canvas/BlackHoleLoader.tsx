'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

// ============================================================================
// CONFIGURATION
// ============================================================================
const CONFIG = {
  // Animation Phases (seconds)
  GATHER_TIME: 3.5,
  SINGULARITY_TIME: 0.5,
  EXPLOSION_TIME: 2.0,
  
  // Visuals
  PARTICLE_COUNT: 60000, // Extreme detail
  DISK_RADIUS_INNER: 3.5,
  DISK_RADIUS_OUTER: 18.0,
  EVENT_HORIZON_RADIUS: 2.5,
  
  // Colors
  COLOR_CORE: new THREE.Color('#ffffff'),
  COLOR_INNER: new THREE.Color('#ffaa33'),
  COLOR_MID: new THREE.Color('#ff4400'),
  COLOR_OUTER: new THREE.Color('#440000'),
};

// ============================================================================
// SHADERS
// ============================================================================

const particleVertexShader = `
  uniform float uTime;
  uniform float uPhase; // 0=Gather, 1=Singularity, 2=Explode, 3=Stable
  uniform float uProgress; // 0-1 within phase
  
  attribute vec3 aStartPosition;
  attribute float aRandom;
  attribute float aOrbitRadius;
  attribute float aOrbitSpeed;
  attribute float aOrbitOffset;
  attribute float aSize;
  
  varying float vAlpha;
  varying float vTemp;
  varying float vDist;

  // Easing functions
  float easeInQuart(float x) { return x * x * x * x; }
  float easeOutExpo(float x) { return x == 1.0 ? 1.0 : 1.0 - pow(2.0, -10.0 * x); }

  void main() {
    vec3 pos = aStartPosition;
    float alpha = 0.0;
    float temp = 0.0;
    
    // Calculate the "Stable" position for this particle at the current time
    // We use this as the target for the explosion to ensure a seamless transition
    float stableAngle = aOrbitOffset + uTime * aOrbitSpeed;
    float stableR = aOrbitRadius;
    float stableY = (aRandom - 0.5) * 0.5 * (stableR / 12.0) + sin(stableAngle * 2.0 + uTime) * 0.1;
    vec3 stablePos = vec3(
      cos(stableAngle) * stableR,
      stableY,
      sin(stableAngle) * stableR
    );

    // --- PHASE 0: GATHERING (Gravity Well) ---
    if (uPhase < 1.0) {
      // Accelerating collapse (Gravity)
      float t = pow(uProgress, 2.5); 
      
      // Pure radial collapse from start position to center
      // We do NOT rotate the cloud to avoid any helical/spiral artifacts.
      // Particles move straight from their random spawn point towards (0,0,0).
      vec3 collapsePos = mix(aStartPosition, vec3(0.0), t);
      
      // Add chaotic vibration that increases with pressure (t)
      // This simulates the "immense force" and temperature rising
      // We use sin(t * PI) to dampen it at the very start and very end (so it hits 0.0 cleanly)
      float pressure = sin(t * 3.14159); 
      float vibrationAmt = pressure * 0.5; // Reduced vibration amplitude to avoid wave artifacts
      
      // High frequency chaotic vibration (Heat)
      vec3 noise = vec3(
        sin(uTime * 50.0 + aRandom * 123.45),
        sin(uTime * 45.0 + aRandom * 678.90),
        sin(uTime * 55.0 + aRandom * 321.00)
      ) * vibrationAmt;
      
      pos = collapsePos + noise;
      
      alpha = smoothstep(0.0, 0.1, t); // Fade in quickly
      temp = t; // Heat increases as they compress
    }
    
    // --- PHASE 1: SINGULARITY (Immense Pressure) ---
    else if (uPhase < 2.0) {
      pos = vec3(0.0);
      // Fade shake to 0 at the end to match start of Phase 2
      float shake = 0.2 * (1.0 - uProgress); 
      pos += vec3(
        sin(uTime * 100.0 + aRandom * 100.0) * shake,
        cos(uTime * 80.0 + aRandom * 50.0) * shake,
        sin(uTime * 120.0 + aRandom * 25.0) * shake
      );
      alpha = 1.0;
      temp = 1.0;
    }
    
    // --- PHASE 2: EXPLOSION (Big Bang) ---
    else if (uPhase < 3.0) {
      float t = easeOutExpo(uProgress);
      
      // Shockwave: Expand spherically
      vec3 sphereDir = normalize(vec3(
        cos(aRandom * 6.28) * sin(aRandom * 3.14),
        cos(aRandom * 3.14),
        sin(aRandom * 6.28) * sin(aRandom * 3.14)
      ));
      
      float blastRadius = t * 40.0; // Big initial blast
      vec3 blastPos = sphereDir * blastRadius;
      
      // Smoothly blend from the Blast to the Stable Orbit
      float settle = smoothstep(0.1, 1.0, uProgress);
      
      pos = mix(blastPos, stablePos, settle);
      
      // Calculate target Alpha/Temp for Phase 3
      float velZ = cos(stableAngle);
      float targetAlpha = 1.0 + velZ * 0.5;
      float targetTemp = 1.0 - smoothstep(3.0, 18.0, stableR);
      
      // Blend from Explosion state (Alpha=1, Temp=1) to Stable state
      alpha = mix(1.0, targetAlpha, settle);
      temp = mix(1.0, targetTemp, settle);
    }
    
    // --- PHASE 3: STABLE ORBIT ---
    else {
      // Exactly matches the target of Phase 2
      pos = stablePos;
      
      // Relativistic beaming
      float velZ = cos(stableAngle);
      float beaming = 1.0 + velZ * 0.5;
      
      alpha = beaming;
      temp = 1.0 - smoothstep(3.0, 18.0, stableR);
    }

    vAlpha = alpha;
    vTemp = temp;
    vDist = length(pos);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Size attenuation - Reduced multiplier for smaller, sharper particles
    gl_PointSize = aSize * (150.0 / -mvPosition.z);
  }
`;

const particleFragmentShader = `
  uniform vec3 uColorCore;
  uniform vec3 uColorInner;
  uniform vec3 uColorMid;
  uniform vec3 uColorOuter;

  varying float vAlpha;
  varying float vTemp;
  varying float vDist;

  void main() {
    // Circular particle
    vec2 xy = gl_PointCoord.xy - vec2(0.5);
    float r = length(xy);
    if (r > 0.5) discard;
    
    // Soft edge
    float glow = 1.0 - (r * 2.0);
    glow = pow(glow, 1.5);
    
    // Color based on temperature/distance
    vec3 color = mix(uColorOuter, uColorMid, smoothstep(0.0, 0.5, vTemp));
    color = mix(color, uColorInner, smoothstep(0.5, 0.8, vTemp));
    color = mix(color, uColorCore, smoothstep(0.8, 1.0, vTemp));
    
    gl_FragColor = vec4(color, vAlpha * glow);
  }
`;

const eventHorizonVertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const eventHorizonFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  
  void main() {
    // Fresnel effect for the "edge" of the black hole
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - dot(vNormal, viewDir), 4.0);
    
    // Black core with subtle glowing rim
    vec3 color = vec3(0.0);
    vec3 rimColor = vec3(0.2, 0.05, 0.01) * 2.0;
    
    gl_FragColor = vec4(mix(color, rimColor, fresnel), 1.0);
  }
`;

// ============================================================================
// COMPONENTS
// ============================================================================

const AccretionDisk = ({ startTimeRef }: { startTimeRef: React.MutableRefObject<number | null> }) => {
  const meshRef = useRef<THREE.Points>(null);
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPhase: { value: 0 },
    uProgress: { value: 0 },
    uColorCore: { value: CONFIG.COLOR_CORE },
    uColorInner: { value: CONFIG.COLOR_INNER },
    uColorMid: { value: CONFIG.COLOR_MID },
    uColorOuter: { value: CONFIG.COLOR_OUTER },
  }), []);

  const attributes = useMemo(() => {
    const count = CONFIG.PARTICLE_COUNT;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    const orbitRadii = new Float32Array(count);
    const orbitSpeeds = new Float32Array(count);
    const orbitOffsets = new Float32Array(count);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Initial scattered positions
      const r = 50 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      randoms[i] = Math.random();
      
      // Orbit properties
      // Distribute more particles closer to center for density
      const distT = Math.pow(Math.random(), 2.0); 
      orbitRadii[i] = CONFIG.DISK_RADIUS_INNER + distT * (CONFIG.DISK_RADIUS_OUTER - CONFIG.DISK_RADIUS_INNER);
      
      orbitSpeeds[i] = (1.0 / Math.sqrt(orbitRadii[i])) * 5.0; // Kepler-ish
      orbitOffsets[i] = Math.random() * Math.PI * 2;
      sizes[i] = Math.random() * 1.0 + 0.2; // Smaller particles (0.2 to 1.2)
    }
    
    return { positions, randoms, orbitRadii, orbitSpeeds, orbitOffsets, sizes };
  }, []);

  useFrame((state) => {
    if (!meshRef.current || startTimeRef.current === null) return;
    
    const elapsed = state.clock.elapsedTime - startTimeRef.current;
    
    // Calculate phase and progress for Shader locally to avoid React re-renders
    let uPhase = 0;
    let uProgress = 0;
    
    if (elapsed < CONFIG.GATHER_TIME) {
      uPhase = 0;
      uProgress = elapsed / CONFIG.GATHER_TIME;
    } else if (elapsed < CONFIG.GATHER_TIME + CONFIG.SINGULARITY_TIME) {
      uPhase = 1;
      uProgress = (elapsed - CONFIG.GATHER_TIME) / CONFIG.SINGULARITY_TIME;
    } else if (elapsed < CONFIG.GATHER_TIME + CONFIG.SINGULARITY_TIME + CONFIG.EXPLOSION_TIME) {
      uPhase = 2;
      uProgress = (elapsed - (CONFIG.GATHER_TIME + CONFIG.SINGULARITY_TIME)) / CONFIG.EXPLOSION_TIME;
    } else {
      uPhase = 3;
      uProgress = 1;
    }

    const mat = meshRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uPhase.value = uPhase;
    mat.uniforms.uProgress.value = uProgress;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[attributes.positions, 3]} count={attributes.positions.length / 3} itemSize={3} />
        <bufferAttribute attach="attributes-aStartPosition" args={[attributes.positions, 3]} count={attributes.positions.length / 3} itemSize={3} />
        <bufferAttribute attach="attributes-aRandom" args={[attributes.randoms, 1]} count={attributes.randoms.length} itemSize={1} />
        <bufferAttribute attach="attributes-aOrbitRadius" args={[attributes.orbitRadii, 1]} count={attributes.orbitRadii.length} itemSize={1} />
        <bufferAttribute attach="attributes-aOrbitSpeed" args={[attributes.orbitSpeeds, 1]} count={attributes.orbitSpeeds.length} itemSize={1} />
        <bufferAttribute attach="attributes-aOrbitOffset" args={[attributes.orbitOffsets, 1]} count={attributes.orbitOffsets.length} itemSize={1} />
        <bufferAttribute attach="attributes-aSize" args={[attributes.sizes, 1]} count={attributes.sizes.length} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const EventHorizon = ({ visible }: { visible: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      const targetScale = visible ? CONFIG.EVENT_HORIZON_RADIUS : 0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <mesh ref={meshRef} scale={[0, 0, 0]}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        vertexShader={eventHorizonVertexShader}
        fragmentShader={eventHorizonFragmentShader}
      />
    </mesh>
  );
};

const Scene = ({ onAnimationComplete, enterBlackHole, onEnterComplete }: { onAnimationComplete?: () => void, enterBlackHole?: boolean, onEnterComplete?: () => void }) => {
  const [phase, setPhase] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const completed = useRef(false);
  const { camera } = useThree();

  useFrame((state, delta) => {
    // Handle "Enter Black Hole" animation
    if (enterBlackHole) {
      // 1. Accelerate towards center (Exponential)
      const target = new THREE.Vector3(0, 0, 0);
      const dist = camera.position.distanceTo(target);
      
      // Move faster as we get closer (Gravity assist)
      const speed = 2.0 + (25.0 / (dist + 0.1)); 
      camera.position.lerp(target, delta * speed * 0.1);
      
      // 2. Warp Effect (FOV Distortion)
      // "Bending all around him" - Increase FOV to create tunnel vision/warp speed effect
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = THREE.MathUtils.lerp(camera.fov, 120, delta * 2.0);
        camera.updateProjectionMatrix();
      }
      
      // 3. Time Dilation (Speed up the black hole rotation)
      // We can't easily change the shader time without passing a ref, 
      // but the camera movement itself provides most of the blur effect.
      
      // If very close, trigger complete
      if (dist < 1.0 && onEnterComplete) {
        onEnterComplete();
      }
      return;
    }

    if (startTimeRef.current === null) startTimeRef.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - startTimeRef.current;
    
    // Only update React state for phase changes (EventHorizon visibility)
    // Progress is handled inside AccretionDisk to avoid re-renders
    let currentPhase = 0;
    if (elapsed < CONFIG.GATHER_TIME) {
      currentPhase = 0;
    } else if (elapsed < CONFIG.GATHER_TIME + CONFIG.SINGULARITY_TIME) {
      currentPhase = 1;
    } else if (elapsed < CONFIG.GATHER_TIME + CONFIG.SINGULARITY_TIME + CONFIG.EXPLOSION_TIME) {
      currentPhase = 2;
    } else {
      currentPhase = 3;
      if (!completed.current) {
        completed.current = true;
        if (onAnimationComplete) onAnimationComplete();
      }
    }
    
    if (currentPhase !== phase) {
      setPhase(currentPhase);
    }
  });

  return (
    <>
      <AccretionDisk startTimeRef={startTimeRef} />
      <EventHorizon visible={phase >= 2} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.1} />
    </>
  );
};

// ============================================================================
// MAIN EXPORT
// ============================================================================

interface BlackHoleLoaderProps {
  onAnimationComplete?: () => void;
  enterBlackHole?: boolean;
  onEnterComplete?: () => void;
}

export default function BlackHoleLoader({ onAnimationComplete, enterBlackHole, onEnterComplete }: BlackHoleLoaderProps) {
  return (
    <div className="fixed inset-0 z-0 bg-black">
      <Canvas
        camera={{ position: [0, 10, 25], fov: 45 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 2]} // Handle high DPI screens
      >
        <Scene 
          onAnimationComplete={onAnimationComplete} 
          enterBlackHole={enterBlackHole}
          onEnterComplete={onEnterComplete}
        />
        
        {/* Interactive Controls - Disabled when entering */}
        <OrbitControls 
          enabled={!enterBlackHole}
          enablePan={false}
          enableZoom={true}
          minDistance={5}
          maxDistance={100}
          autoRotate={true}
          autoRotateSpeed={0.5}
          enableDamping={true}
        />
      </Canvas>
    </div>
  );
}
