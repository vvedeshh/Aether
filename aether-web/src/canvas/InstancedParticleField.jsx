/**
 * InstancedParticleField.jsx
 * ---------------------------
 * Author: Vedesh Panday
 * Description:
 *   Renders an instanced particle system using THREE.js with custom
 *   shaders for color, simple physics simulation (gravity, drag, bounce), and
 *   instancing for performance.
 */

import * as THREE from "three";
import { useEffect, useRef } from "react";
import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";

// Custom shader: passes color per particle
const vertexShader = `
  attribute vec3 instanceColor;
  varying vec3 vColor;
  void main() {
    vColor = instanceColor;
    vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  void main() {
    gl_FragColor = vec4(vColor, 1.0);
  }
`;

const InstancedColorMaterial = shaderMaterial({}, vertexShader, fragmentShader);
extend({ InstancedColorMaterial });

export default function InstancedParticleField({ particles }) {
  const meshRef = useRef();
  const dummy = useRef(new THREE.Object3D());

  const DRAG = 0.995;
  const BOUNDS = 200;
  const BOUNCE_FACTOR = 0.8;
  const COLOUR_COMPONENTS = 3;

  // Initialize mesh instance matrices and color attributes when particles change
  useEffect(() => {
    const mesh = meshRef.current;
    const colorArray = new Float32Array(particles.length * COLOUR_COMPONENTS);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const color = new THREE.Color(p.color);

      // Set transform matrix
      dummy.current.position.copy(p.position);
      dummy.current.scale.set(p.size, p.size, p.size);
      dummy.current.updateMatrix();
      mesh.setMatrixAt(i, dummy.current.matrix);

      // Set color buffer
      colorArray.set([color.r, color.g, color.b], i * COLOUR_COMPONENTS);
    }

    mesh.geometry.setAttribute(
      "instanceColor",
      new THREE.InstancedBufferAttribute(colorArray, COLOUR_COMPONENTS)
    );
    mesh.count = particles.length;
    mesh.instanceMatrix.needsUpdate = true;
  }, [particles]);

  // Animation loop: update physics and transforms every frame
  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Physics: apply gravity + drag
      p.velocity.y -= p.gravity;
      p.velocity.multiplyScalar(DRAG);
      p.position.add(p.velocity);

      // Boundary bounce logic (within cubic volume)
      for (let axis = 0; axis < COLOUR_COMPONENTS; axis++) {
        const pos = p.position.getComponent(axis);
        const vel = p.velocity.getComponent(axis);

        if (pos > BOUNDS) {
          p.position.setComponent(axis, BOUNDS);
          p.velocity.setComponent(axis, -Math.abs(vel) * BOUNCE_FACTOR);
        } else if (pos < -BOUNDS) {
          p.position.setComponent(axis, -BOUNDS);
          p.velocity.setComponent(axis, Math.abs(vel) * BOUNCE_FACTOR);
        }
      }

      // Update instance matrix for rendering
      dummy.current.position.copy(p.position);
      dummy.current.scale.set(p.size, p.size, p.size);
      dummy.current.updateMatrix();
      mesh.setMatrixAt(i, dummy.current.matrix);
    }

    mesh.count = particles.length;
    mesh.instanceMatrix.needsUpdate = true;
  });

  // Return the GPU-instanced particle field
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, 10000]}>
      <sphereGeometry args={[1, 8, 8]} />
      <instancedColorMaterial />
    </instancedMesh>
  );
}
