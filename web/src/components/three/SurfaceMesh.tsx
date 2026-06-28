"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { ramp } from "@/lib/colors";

interface SurfaceMeshProps {
  z: number[][]; // [ny][nx]
  width?: number;
  depth?: number;
  height?: number;
  wireframe?: boolean;
}

/** Malla 3D de z=f(x,y) con color por vértice según altura normalizada. */
export function SurfaceMesh({
  z,
  width = 10,
  depth = 10,
  height = 4,
  wireframe = true,
}: SurfaceMeshProps) {
  const { geometry } = useMemo(() => {
    const ny = z.length;
    const nx = z[0].length;
    let zMin = Infinity;
    let zMax = -Infinity;
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const v = z[j][i];
        if (Number.isFinite(v)) {
          if (v < zMin) zMin = v;
          if (v > zMax) zMax = v;
        }
      }
    }
    const span = zMax - zMin || 1;

    const positions = new Float32Array(nx * ny * 3);
    const colors = new Float32Array(nx * ny * 3);
    let p = 0;
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const v = Number.isFinite(z[j][i]) ? z[j][i] : zMin;
        const tn = (v - zMin) / span;
        const x = (i / (nx - 1) - 0.5) * width;
        const zz = (j / (ny - 1) - 0.5) * depth;
        const y = (tn - 0.5) * height;
        positions[p] = x;
        positions[p + 1] = y;
        positions[p + 2] = zz;
        const [r, g, b] = ramp(tn);
        colors[p] = r / 255;
        colors[p + 1] = g / 255;
        colors[p + 2] = b / 255;
        p += 3;
      }
    }

    const indices: number[] = [];
    for (let j = 0; j < ny - 1; j++) {
      for (let i = 0; i < nx - 1; i++) {
        const a = j * nx + i;
        const b = j * nx + i + 1;
        const c = (j + 1) * nx + i;
        const d = (j + 1) * nx + i + 1;
        indices.push(a, c, b, b, c, d);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return { geometry: geo };
  }, [z, width, depth, height]);

  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          vertexColors
          metalness={0.18}
          roughness={0.55}
          side={THREE.DoubleSide}
          flatShading={false}
        />
      </mesh>
      {wireframe && (
        <mesh geometry={geometry}>
          <meshBasicMaterial
            color="#0a0e12"
            wireframe
            transparent
            opacity={0.18}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}
