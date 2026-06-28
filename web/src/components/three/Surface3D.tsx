"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { SurfaceMesh } from "./SurfaceMesh";

interface Surface3DProps {
  z: number[][];
  autoRotate?: boolean;
  enableControls?: boolean;
  height?: number;
  className?: string;
}

export default function Surface3D({
  z,
  autoRotate = false,
  enableControls = true,
  height = 4,
  className,
}: Surface3DProps) {
  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [13, 9.5, 15], fov: 30 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[8, 12, 6]} intensity={1.1} color="#fff6e6" />
        <directionalLight position={[-10, 6, -8]} intensity={0.5} color="#62d2e0" />
        <group rotation={[0, 0, 0]}>
          <SurfaceMesh z={z} height={height} />
        </group>
        <OrbitControls
          enablePan={false}
          enableZoom={enableControls}
          enableRotate={enableControls}
          autoRotate={autoRotate}
          autoRotateSpeed={0.55}
          target={[0, 0.2, 0]}
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 2.1}
        />
      </Canvas>
    </div>
  );
}
