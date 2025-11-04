import * as THREE from "three";
import type {
  PrimitiveType,
  BasePrimitiveProps,
  Transform,
} from "@/types/model";

/**
 * Create Three.js geometry from primitive type and properties
 * Geometries are positioned so their bottom-left corner (or bottom-center for radial shapes)
 * is at the origin (0,0,0)
 */
export function createGeometry(
  primitiveType: PrimitiveType,
  properties: BasePrimitiveProps
): THREE.BufferGeometry {
  let geometry: THREE.BufferGeometry;

  switch (primitiveType) {
    case "box": {
      const width = properties.width ?? 1;
      const height = properties.height ?? 1;
      const depth = properties.depth ?? 1;
      geometry = new THREE.BoxGeometry(width, height, depth);
      // Translate so bottom-left corner is at origin (0,0,0)
      // Box is centered by default, so we move it by half dimensions
      geometry.translate(width / 2, height / 2, depth / 2);
      break;
    }

    case "cylinder": {
      const radius = properties.radius ?? 0.5;
      const height = properties.height ?? 1;
      geometry = new THREE.CylinderGeometry(
        radius,
        radius,
        height,
        properties.segments ?? 32
      );
      // Translate so bottom-center is at origin (sits on XY plane)
      geometry.translate(radius, height / 2, radius);
      break;
    }

    case "cone": {
      const radius = properties.radius ?? 0.5;
      const height = properties.height ?? 1;
      geometry = new THREE.ConeGeometry(
        radius,
        height,
        properties.segments ?? 32
      );
      // Translate so bottom-center is at origin (base sits on XY plane)
      geometry.translate(radius, height / 2, radius);
      break;
    }

    case "sphere": {
      const radius = properties.radius ?? 0.5;
      geometry = new THREE.SphereGeometry(
        radius,
        properties.segments ?? 32,
        properties.segments ?? 32
      );
      // Translate so bottom-center (lowest point) is at origin (sits on XY plane)
      geometry.translate(radius, radius, radius);
      break;
    }

    case "torus": {
      const radius = properties.radius ?? 0.5;
      const tube = properties.tube ?? 0.2;
      geometry = new THREE.TorusGeometry(
        radius,
        tube,
        properties.segments ?? 32,
        properties.segments ?? 32
      );
      // Translate so bottom-center is at origin
      geometry.translate(radius + tube, radius + tube, radius + tube);
      break;
    }

    case "pyramid": {
      const width = properties.width ?? 1;
      const height = properties.height ?? 1;
      const depth = properties.depth ?? 1;
      // Create a pyramid using a cone geometry with 4 sides (square base)
      const baseSize = Math.max(width, depth);
      geometry = new THREE.ConeGeometry(baseSize / 2, height, 4);
      // Rotate to align with box orientation, then translate so bottom-left corner is at origin
      geometry.rotateY(Math.PI / 4);
      geometry.translate(width / 2, height / 2, depth / 2);
      break;
    }

    default: {
      geometry = new THREE.BoxGeometry(1, 1, 1);
      geometry.translate(0.5, 0.5, 0.5);
      break;
    }
  }

  return geometry;
}

/**
 * Apply transform to Three.js object
 */
export function applyTransform(
  object3D: THREE.Object3D,
  transform: Transform
): void {
  object3D.position.set(
    transform.position.x,
    transform.position.y,
    transform.position.z
  );
  object3D.rotation.set(
    transform.rotation.x,
    transform.rotation.y,
    transform.rotation.z
  );
  object3D.scale.set(transform.scale.x, transform.scale.y, transform.scale.z);
}

/**
 * Get world-space transform of object
 */
export function getWorldTransform(object3D: THREE.Object3D): Transform {
  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();

  object3D.updateMatrixWorld(true);
  object3D.matrixWorld.decompose(position, quaternion, scale);

  const euler = new THREE.Euler().setFromQuaternion(quaternion);

  return {
    position: { x: position.x, y: position.y, z: position.z },
    rotation: { x: euler.x, y: euler.y, z: euler.z },
    scale: { x: scale.x, y: scale.y, z: scale.z },
  };
}

/**
 * Perform raycast from mouse event to find clicked object
 */
export function raycastFromMouse(
  event: MouseEvent,
  camera: THREE.Camera,
  _scene: THREE.Scene,
  objects: THREE.Object3D[]
): THREE.Intersection[] {
  const rect = (event.target as HTMLElement).getBoundingClientRect();
  const mouse = new THREE.Vector2();

  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  return raycaster.intersectObjects(objects, true);
}

/**
 * Create default material for objects
 */
export function createDefaultMaterial(
  color?: string
): THREE.MeshStandardMaterial {
  const colorValue = color ? parseInt(color.replace("#", ""), 16) : 0xffffff;
  return new THREE.MeshStandardMaterial({
    color: colorValue,
    metalness: 0.3,
    roughness: 0.7,
    emissive: colorValue,
    emissiveIntensity: 0.1, // Slight self-illumination to make white objects appear brighter
  });
}

/**
 * Create selection material with green tint overlay
 */
export function createSelectionMaterial(
  baseColor?: string
): THREE.MeshStandardMaterial {
  const baseColorValue = baseColor
    ? parseInt(baseColor.replace("#", ""), 16)
    : 0xffffff;

  // Create a light green tint color (0x4ade80 = light green)
  const tintColor = new THREE.Color(0x4ade80);
  const baseColorObj = new THREE.Color(baseColorValue);

  // Mix the base color with light green (70% base, 30% green tint)
  const mixedColor = baseColorObj.clone().lerp(tintColor, 0.3);

  return new THREE.MeshStandardMaterial({
    color: mixedColor,
    metalness: 0.5,
    roughness: 0.5,
    emissive: 0x4ade80,
    emissiveIntensity: 0.15, // Subtle green glow
  });
}
