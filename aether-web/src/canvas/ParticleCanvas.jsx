/**
 * ParticleCanvas.jsx
 * -------------------
 * Author: Vedesh Panday
 * Description:
 *   Main rendering canvas for Aether's 3D particle simulator using React Three Fiber.
 *   Includes controls, instanced rendering, postprocessing (glow, trails),
 *   real-time stats tracking, and keyboard-based particle spawning.
 */

import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import InstancedParticleField from "./InstancedParticleField";

/**
 * AfterimageEffect
 * Applies a motion trail (ghosting effect) using AfterimagePass.
 */
function AfterimageEffect({ enabled }) {
  const { gl, scene, camera, size } = useThree();
  const composerRef = useRef();

  useEffect(() => {
    if (!enabled) return;
    let mounted = true;

    const load = async () => {
      const [{ AfterimagePass }, { RenderPass }, { EffectComposer }] = await Promise.all([
        import("three/examples/jsm/postprocessing/AfterimagePass"),
        import("three/examples/jsm/postprocessing/RenderPass"),
        import("three/examples/jsm/postprocessing/EffectComposer"),
      ]);
      const composer = new EffectComposer(gl);
      composer.setSize(size.width, size.height);
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(new AfterimagePass(0.88));
      if (mounted) composerRef.current = composer;
    };

    load();
    return () => {
      mounted = false;
    };
  }, [enabled, gl, scene, camera, size]);

  // Render the motion trail effect
  useFrame(() => {
    if (enabled) composerRef.current?.render();
  }, 1);

  return null;
}

/**
 * Spawner
 * Spawns particles using the 'E' key based on mouse location and user settings.
 */
function Spawner({ settings, spawnParticles }) {
  const { camera, mouse } = useThree();
  const raycaster = useRef(new THREE.Raycaster());

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() !== "e") return;

      const count = settings.mode === "burst" ? settings.count : 1;
      const center = getSpawnPosition();
      const particles = [];

      // Generate particles around spawn center
      for (let i = 0; i < count; i++) {
        const jitter = new THREE.Vector3(
          THREE.MathUtils.randFloat(-1, 1),
          THREE.MathUtils.randFloat(-1, 1),
          THREE.MathUtils.randFloat(-1, 1)
        );
        const pos = center.clone().add(jitter);
        particles.push({
          position: pos,
          velocity: new THREE.Vector3(
            THREE.MathUtils.randFloat(-0.2, 0.2),
            THREE.MathUtils.randFloat(-0.2, 0.2),
            THREE.MathUtils.randFloat(-0.2, 0.2)
          ),
          size: settings.size,
          color: settings.color,
          gravity: getGravity(settings.gravity),
        });
      }

      spawnParticles(particles);
    };

    // Calculates 3D spawn position from mouse using raycasting
    const getSpawnPosition = () => {
      raycaster.current.setFromCamera(mouse, camera);
      const point = raycaster.current.ray.origin
        .clone()
        .add(raycaster.current.ray.direction.clone().multiplyScalar(100));
      return clampToBounds(point, 200);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [camera, mouse, settings, spawnParticles]);

  return null;
}

/**
 * clampToBounds
 * Prevents a position from exceeding the simulation bounds.
 */
function clampToBounds(pos, bounds) {
  return new THREE.Vector3(
    Math.max(-bounds, Math.min(bounds, pos.x)),
    Math.max(-bounds, Math.min(bounds, pos.y)),
    Math.max(-bounds, Math.min(bounds, pos.z))
  );
}

/**
 * getGravity
 * Returns gravity strength based on environment preset.
 */
function getGravity(env) {
  switch (env) {
    case "earth":
      return 0.01;
    case "moon":
      return 0.002;
    case "mars":
      return 0.004;
    default:
      return 0;
  }
}

/**
 * StatsTracker
 * Tracks camera zoom and frames per second for HUD display.
 */
function StatsTracker({ setZoom, setFps }) {
  const UPDATE_INTERVAL = 0.5;

  const { camera } = useThree();
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useFrame(() => {
    frameCount.current++;
    const now = performance.now();
    const delta = (now - lastTime.current) / 1000;

    // Update FPS every 0.5s
    if (delta >= UPDATE_INTERVAL) {
      setFps(Math.round(frameCount.current / delta));
      frameCount.current = 0;
      lastTime.current = now;
    }

    // Update zoom level from camera distance
    setZoom(camera.position.length().toFixed(1));
  });

  return null;
}

/**
 * ParticleCanvas
 * Renders the entire 3D particle simulation environment with UI and effects.
 */
export default function ParticleCanvas({ settings, particles, spawnParticles, setZoom, setFps }) {
  return (
    <Canvas camera={{ position: [0, 0, 80], fov: 90, near: 1, far: 2000 }}>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} />

      {/* Visual Effects */}
      {settings.glow && (
        <EffectComposer multisampling={4}>
          <Bloom intensity={1.5} luminanceThreshold={0} luminanceSmoothing={0.9} />
        </EffectComposer>
      )}
      {settings.trail && <AfterimageEffect enabled />}

      {/* Core Components */}
      <Spawner settings={settings} spawnParticles={spawnParticles} />
      <InstancedParticleField particles={particles} />
      <OrbitControls enablePan enableZoom enableRotate minDistance={10} maxDistance={1000} />
      <StatsTracker setZoom={setZoom} setFps={setFps} />
    </Canvas>
  );
}
