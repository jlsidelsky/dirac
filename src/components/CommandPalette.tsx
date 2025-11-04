import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { useModel } from "@/store/ModelStore";
import { flattenTree, findParent } from "@/utils/treeUtils";
import {
  getNextPrimitiveName,
  getNextAssemblyName,
} from "@/utils/nameGenerator";
import { PRIMITIVE_INFO } from "@/constants/primitives";
import type { PrimitiveType } from "@/types/model";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const { state, dispatch } = useModel();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const allNodes = flattenTree(state.model);

  // Get the parent ID - if selected node is an assembly, use it; otherwise use its parent or root
  const selectedNodeId = state.selection.selectedNodeId || state.model.rootId;
  const selectedNode = state.model.nodes[selectedNodeId];
  let parentId = state.model.rootId;

  if (selectedNode) {
    if (selectedNode.type === "assembly") {
      parentId = selectedNodeId;
    } else {
      // If selected node is a primitive, find its parent or use root
      const parent = findParent(selectedNodeId, state.model);
      parentId = parent || state.model.rootId;
    }
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Nodes">
          {allNodes
            .filter((nodeId) => nodeId !== state.model.rootId)
            .map((nodeId) => {
              const node = state.model.nodes[nodeId];
              if (!node) return null;
              return (
                <CommandItem
                  key={nodeId}
                  value={`node-${nodeId}`}
                  onSelect={() => {
                    dispatch({ type: "SELECT_NODE", nodeId });
                    setOpen(false);
                  }}
                >
                  {node.name} ({node.type})
                  <CommandShortcut>
                    {node.type === "primitive" ? "Primitive" : "Assembly"}
                  </CommandShortcut>
                </CommandItem>
              );
            })}
        </CommandGroup>
        <CommandGroup heading="Add Primitive">
          {PRIMITIVE_INFO.map((primitive) => (
            <CommandItem
              key={primitive.type}
              value={`add-${primitive.type}`}
              onSelect={() => {
                const name = getNextPrimitiveName(
                  state.model,
                  primitive.type as PrimitiveType
                );
                dispatch({
                  type: "ADD_PRIMITIVE",
                  parentId,
                  primitiveType: primitive.type as PrimitiveType,
                  name,
                });
                setOpen(false);
              }}
            >
              Add {primitive.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem
            value="add-assembly"
            onSelect={() => {
              const name = getNextAssemblyName(state.model);
              dispatch({
                type: "ADD_ASSEMBLY",
                parentId,
                name,
              });
              setOpen(false);
            }}
          >
            Add Assembly
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
