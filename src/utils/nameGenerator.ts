import type { Model, PrimitiveType } from "@/types/model";

/**
 * Generate the next available name for a primitive type
 * e.g., "Mesh 1", "Mesh 2", "Mesh 3", etc.
 */
export function getNextPrimitiveName(
  model: Model,
  _primitiveType: PrimitiveType
): string {
  const pattern = /^Mesh (\d+)$/i;

  // Find all existing names that match the pattern
  const existingNumbers: number[] = [];
  for (const node of Object.values(model.nodes)) {
    if (node.type === "primitive") {
      const match = node.name.match(pattern);
      if (match) {
        existingNumbers.push(parseInt(match[1], 10));
      }
    }
  }

  // Find the next available number
  if (existingNumbers.length === 0) {
    return "Mesh 1";
  }

  existingNumbers.sort((a, b) => a - b);
  let nextNumber = 1;

  for (const num of existingNumbers) {
    if (num === nextNumber) {
      nextNumber++;
    } else {
      break;
    }
  }

  return `Mesh ${nextNumber}`;
}

/**
 * Generate the next available name for an assembly
 */
export function getNextAssemblyName(model: Model): string {
  const pattern = /^Assembly (\d+)$/i;
  const existingNumbers: number[] = [];

  for (const node of Object.values(model.nodes)) {
    if (node.type === "assembly") {
      const match = node.name.match(pattern);
      if (match) {
        existingNumbers.push(parseInt(match[1], 10));
      }
    }
  }

  if (existingNumbers.length === 0) {
    return "Assembly 1";
  }

  existingNumbers.sort((a, b) => a - b);
  let nextNumber = 1;

  for (const num of existingNumbers) {
    if (num === nextNumber) {
      nextNumber++;
    } else {
      break;
    }
  }

  return `Assembly ${nextNumber}`;
}
