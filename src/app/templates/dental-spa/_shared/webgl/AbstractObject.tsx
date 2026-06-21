"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { DprCanvas } from "./DprCanvas";

type Colors = { glass: string; particle: string };

function Particles({ color, count = 220 }: { color: string; count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    // deterministic spherical shell (no Math.random — keeps SSR/build stable)
    const arr = new Float32Array(count * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = golden * i;
      const rad = 3.1 + (i % 7) * 0.16;
      arr[i * 3] = Math.cos(t) * r * rad;
      arr[i * 3 + 1] = y * rad;
      arr[i * 3 + 2] = Math.sin(t) * r * rad;
    }
    return arr;
  }, [count]);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.045}
        sizeAttenuation
        transparent
        opacity={0.7}
        depthWrite={false}
      />
    </points>
  );
}

function Knot({
  colors,
  progressRef,
}: {
  colors: Colors;
  progressRef?: MutableRefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const p = progressRef?.current ?? 0;
    g.rotation.y += dt * 0.25;
    // Progress tilts and gently breathes the object as §4 services advance.
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -0.35 + p * 0.9, 4, dt);
    const s = 1 + Math.sin(state.clock.elapsedTime * 0.6) * 0.015 + p * 0.06;
    g.scale.setScalar(s);
  });

  return (
    <group ref={group}>
      {/* Bright backdrop disc the glass refracts/tints against — keeps the
          object reading as colored glass instead of a dark silhouette. */}
      <mesh position={[0, 0, -2.4]}>
        <circleGeometry args={[3.2, 48]} />
        <meshBasicMaterial color={colors.glass} transparent opacity={0.5} />
      </mesh>
      <mesh castShadow>
        <torusKnotGeometry args={[1.12, 0.4, 200, 32]} />
        <MeshTransmissionMaterial
          samples={4}
          resolution={256}
          thickness={1.3}
          roughness={0.08}
          chromaticAberration={0.35}
          anisotropy={0.3}
          ior={1.45}
          distortion={0.2}
          distortionScale={0.35}
          temporalDistortion={0.08}
          color={colors.glass}
          attenuationColor={colors.particle}
          attenuationDistance={2.2}
        />
      </mesh>
    </group>
  );
}

export default function AbstractObject({
  colors,
  progressRef,
  reduced = false,
}: {
  colors: Colors;
  progressRef?: MutableRefObject<number>;
  reduced?: boolean;
}) {
  return (
    <DprCanvas reduced={reduced} camera={{ position: [0, 0, 5.2], fov: 42 }}>
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 6, 5]} intensity={2.4} color={"#ffffff"} />
      <pointLight position={[-5, -2, 2]} intensity={60} color={colors.particle} />
      <pointLight position={[3, 3, 4]} intensity={45} color={colors.glass} />
      <Knot colors={colors} progressRef={progressRef} />
      <Particles color={colors.particle} />
    </DprCanvas>
  );
}
