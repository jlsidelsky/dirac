import { useRef, useMemo, useEffect, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { useModel } from "@/store/ModelStore";
import {
  createGeometry,
  applyTransform,
  createDefaultMaterial,
  createSelectionMaterial,
} from "@/utils/threejsHelpers";
import * as THREE from "three";

interface ModelObjectProps {
  nodeId: string;
  children?: ReactNode;
}

export function ModelObject({ nodeId, children }: ModelObjectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const { state, dispatch } = useModel();
  const node = state.model.nodes[nodeId];
  const isSelected = state.selection.selectedNodeId === nodeId;

  // All hooks must be called before any early returns
  const isAssembly = node?.type === "assembly";
  const isPrimitive = node?.type === "primitive";

  // Geometry - only for primitives, but we need to call useMemo before early returns
  const geometry = useMemo<THREE.BufferGeometry | null>(() => {
    if (!node || !isPrimitive) return null;
    return createGeometry(node.primitiveType, node.properties);
  }, [node, isPrimitive]);

  // Primitive color - only for primitives
  const primitiveColor = isPrimitive && node ? node.color : undefined;

  // Material - only for primitives, but hook must be called
  const material = useMemo<THREE.MeshStandardMaterial | null>(() => {
    if (!isPrimitive) return null;
    return isSelected
      ? createSelectionMaterial(primitiveColor)
      : createDefaultMaterial(primitiveColor);
  }, [isSelected, primitiveColor, isPrimitive]);

  // Edges geometry - only for primitives
  const edgesGeometry = useMemo<THREE.EdgesGeometry | null>(() => {
    if (!geometry) return null;
    return new THREE.EdgesGeometry(geometry);
  }, [geometry]);

  // Edge material - only for primitives
  const edgeMaterial = useMemo<THREE.LineBasicMaterial | null>(() => {
    if (!isPrimitive) return null;
    return new THREE.LineBasicMaterial({
      color: isSelected ? 0x10b981 : 0x1f2937,
      linewidth: 1,
      transparent: true,
      opacity: isSelected ? 0.8 : 0.6,
    });
  }, [isSelected, isPrimitive]);

  // useFrame hook - must be called before early returns
  useFrame(() => {
    if (!node) return;
    const targetRef = isAssembly ? groupRef : meshRef;
    const edgesTargetRef = isAssembly ? null : edgesRef;

    if (targetRef.current) {
      applyTransform(targetRef.current, node.transform);
    }

    if (edgesTargetRef?.current) {
      applyTransform(edgesTargetRef.current, node.transform);
    }
  });

  // useEffect hook - must be called before early returns
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.userData.nodeId = nodeId;
    }
    if (groupRef.current && isAssembly) {
      groupRef.current.userData.nodeId = nodeId;
    }
  }, [nodeId, isAssembly]);

  // Early returns after all hooks
  if (!node) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: "SELECT_NODE", nodeId });
  };

  if (isAssembly) {
    // Assembly nodes are containers, apply transform to group
    return (
      <group
        ref={groupRef}
        onClick={(e) => {
          e.stopPropagation();
          dispatch({ type: "SELECT_NODE", nodeId });
        }}
      >
        {children}
      </group>
    );
  }

  // Primitive node - must have geometry and material at this point
  if (!geometry || !material || !edgesGeometry || !edgeMaterial) {
    return null;
  }

  return (
    <group>
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material}
        onClick={handleClick}
        castShadow
        receiveShadow
        onPointerOver={() => {
          if (!isSelected) {
            // Could add hover effect here
          }
        }}
      />
      <lineSegments
        ref={edgesRef}
        geometry={edgesGeometry}
        material={edgeMaterial}
        onClick={handleClick}
      />
    </group>
  );
}
