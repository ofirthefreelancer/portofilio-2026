"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { DprCanvas } from "./DprCanvas";

// Abstract "volumetric scan" lattice for §3's structural half: a grid of nodes
// that ripples like a depth field being read. Reads as engineering / imaging.
function Lattice({ color }: { color: string }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const N = 26;
  const gap = 0.42;
  const count = N * N;

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    let i = 0;
    const half = ((N - 1) * gap) / 2;
    for (let x = 0; x < N; x++) {
      for (let y = 0; y < N; y++) {
        const px = x * gap - half;
        const py = y * gap - half;
        const d = Math.sqrt(px * px + py * py);
        const z = Math.sin(d * 1.3 - t * 1.2) * 0.5;
        dummy.position.set(px, py, z);
        const s = 0.05 + (z + 0.5) * 0.05;
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        m.setMatrixAt(i++, dummy.matrix);
      }
    }
    m.instanceMatrix.needsUpdate = true;
    m.rotation.z = Math.sin(t * 0.1) * 0.05;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.9} />
    </instancedMesh>
  );
}

export default function StructuralGrid({
  color,
  reduced = false,
}: {
  color: string;
  reduced?: boolean;
}) {
  return (
    <DprCanvas reduced={reduced} camera={{ position: [0, -0.6, 7.5], fov: 38 }}>
      <group rotation={[-0.9, 0, 0]}>
        <Lattice color={color} />
      </group>
    </DprCanvas>
  );
}
