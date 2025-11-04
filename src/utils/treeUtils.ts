import type { Model, NodeId } from "@/types/model";

/**
 * Get path from root to node
 */
export function getNodePath(nodeId: NodeId, model: Model): NodeId[] {
  const path: NodeId[] = [];
  let currentId: NodeId | null = nodeId;

  while (currentId) {
    path.unshift(currentId);

    // Find parent
    const parent = findParent(currentId, model);
    if (!parent) break;

    currentId = parent;
  }

  return path;
}

/**
 * Find parent of a node
 */
export function findParent(nodeId: NodeId, model: Model): NodeId | null {
  for (const [id, node] of Object.entries(model.nodes)) {
    if (node.type === "assembly" && node.children.includes(nodeId)) {
      return id;
    }
  }
  return null;
}

/**
 * Get all descendant node IDs (recursive)
 */
export function getDescendants(nodeId: NodeId, model: Model): NodeId[] {
  const node = model.nodes[nodeId];
  if (!node || node.type !== "assembly") {
    return [];
  }

  const descendants: NodeId[] = [];
  for (const childId of node.children) {
    descendants.push(childId);
    descendants.push(...getDescendants(childId, model));
  }
  return descendants;
}

/**
 * Validate that moving a node won't create circular references
 */
export function validateTreeMove(
  nodeId: NodeId,
  newParentId: NodeId,
  model: Model
): boolean {
  // Can't move node to itself
  if (nodeId === newParentId) return false;

  // Can't move node to its own descendant
  const descendants = getDescendants(nodeId, model);
  if (descendants.includes(newParentId)) return false;

  return true;
}

/**
 * Flatten tree in depth-first order
 */
export function flattenTree(model: Model): NodeId[] {
  const result: NodeId[] = [];

  function traverse(nodeId: NodeId) {
    result.push(nodeId);
    const node = model.nodes[nodeId];
    if (node.type === "assembly") {
      for (const childId of node.children) {
        traverse(childId);
      }
    }
  }

  traverse(model.rootId);
  return result;
}

/**
 * Get direct children of a node
 */
export function getChildren(nodeId: NodeId, model: Model): NodeId[] {
  const node = model.nodes[nodeId];
  if (node.type === "assembly") {
    return [...node.children];
  }
  return [];
}

/**
 * Get sibling nodes
 */
export function getSiblings(nodeId: NodeId, model: Model): NodeId[] {
  const parent = findParent(nodeId, model);
  if (!parent) {
    return [nodeId]; // Root has no siblings
  }
  return getChildren(parent, model);
}
