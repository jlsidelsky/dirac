import { useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Grid, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { SceneGraph } from "./SceneGraph";
import { useModel } from "@/store/ModelStore";

function CameraController() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return null;
}

function Lighting() {
  const mainLightRef = useRef<THREE.DirectionalLight>(null);

  useEffect(() => {
    if (mainLightRef.current) {
      // Configure shadow map for main light with soft shadows
      mainLightRef.current.shadow.camera.left = -10;
      mainLightRef.current.shadow.camera.right = 10;
      mainLightRef.current.shadow.camera.top = 10;
      mainLightRef.current.shadow.camera.bottom = -10;
      mainLightRef.current.shadow.camera.near = 0.5;
      mainLightRef.current.shadow.camera.far = 50;
      // Higher resolution for better quality soft shadows
      mainLightRef.current.shadow.mapSize.width = 4096;
      mainLightRef.current.shadow.mapSize.height = 4096;
      mainLightRef.current.shadow.bias = -0.0001;
      mainLightRef.current.shadow.normalBias = 0.02;
      // Much larger shadow radius for very soft, diffused edges
      mainLightRef.current.shadow.radius = 20;
      // Position light to look at origin for better shadows
      mainLightRef.current.target.position.set(0, 0, 0);
      mainLightRef.current.target.updateMatrixWorld();
    }
  }, []);

  return (
    <>
      <ambientLight intensity={1.0} />
      <directionalLight
        ref={mainLightRef}
        position={[10, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[4096, 4096]}
      />
      <directionalLight position={[-10, 10, -5]} intensity={0.8} />
      <pointLight position={[0, 10, 0]} intensity={0.5} />
    </>
  );
}

function BackgroundClickHandler() {
  const { camera, scene } = useThree();
  const { dispatch } = useModel();

  useEffect(() => {
    const raycaster = new THREE.Raycaster();

    const handleClick = (event: MouseEvent) => {
      // Create a ray from the mouse position
      const mouse = new THREE.Vector2();
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Get all objects in the scene (excluding helpers like Grid and AxesHelper)
      const selectableObjects: THREE.Object3D[] = [];
      scene.traverse((child) => {
        if (child.userData.nodeId) {
          selectableObjects.push(child);
        }
      });

      const intersects = raycaster.intersectObjects(selectableObjects, true);

      // If no objects were hit, deselect
      if (intersects.length === 0) {
        dispatch({ type: "SELECT_NODE", nodeId: null });
      }
    };

    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.addEventListener("click", handleClick);
      return () => canvas.removeEventListener("click", handleClick);
    }
  }, [camera, scene, dispatch]);

  return null;
}

function AxesHelper() {
  const axesLength = 3;
  const axesThickness = 0.02;

  return (
    <>
      {/* X-axis (red) */}
      <mesh position={[axesLength / 2, 0, 0]}>
        <boxGeometry args={[axesLength, axesThickness, axesThickness]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      {/* Y-axis (green) */}
      <mesh position={[0, axesLength / 2, 0]}>
        <boxGeometry args={[axesThickness, axesLength, axesThickness]} />
        <meshBasicMaterial color="#22c55e" />
      </mesh>
      {/* Z-axis (blue) */}
      <mesh position={[0, 0, axesLength / 2]}>
        <boxGeometry args={[axesThickness, axesThickness, axesLength]} />
        <meshBasicMaterial color="#3b82f6" />
      </mesh>
    </>
  );
}

function ShadowSetup() {
  const { gl } = useThree();

  useEffect(() => {
    // Enable shadows on the renderer with soft shadows
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows with radius blur
  }, [gl]);

  return null;
}

function GroundPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <shadowMaterial opacity={0.2} />
    </mesh>
  );
}

export function View3D() {
  return (
    <div className="absolute inset-0 bg-background">
      <Canvas shadows>
        <PerspectiveCamera makeDefault fov={50} position={[5, 5, 5]} />
        <CameraController />
        <ShadowSetup />
        <Lighting />
        <Grid args={[10, 10]} cellColor="#6b7280" sectionColor="#656566" />
        <GroundPlane />
        <AxesHelper />
        <SceneGraph />
        <BackgroundClickHandler />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={20}
        />
      </Canvas>
    </div>
  );
}
