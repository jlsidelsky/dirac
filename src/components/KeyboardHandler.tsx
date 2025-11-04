import { useEffect } from "react";
import { useModel } from "@/store/ModelStore";

export function KeyboardHandler() {
  const { state, dispatch } = useModel();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if not typing in an input field
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // Handle Delete key
      if (e.key === "Delete" || e.key === "Backspace") {
        const selectedNodeId = state.selection.selectedNodeId;

        // Don't delete if nothing is selected or if root is selected
        if (!selectedNodeId || selectedNodeId === state.model.rootId) {
          return;
        }

        e.preventDefault();
        dispatch({ type: "DELETE_NODE", nodeId: selectedNodeId });
        // Clear selection after deletion
        dispatch({ type: "SELECT_NODE", nodeId: null });
      }

      // Handle Undo (Ctrl+Z or Cmd+Z)
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        dispatch({ type: "UNDO" });
      }

      // Handle Redo (Ctrl+Shift+Z, Ctrl+Y, or Cmd+Shift+Z)
      if (
        ((e.ctrlKey || e.metaKey) && e.key === "z" && e.shiftKey) ||
        ((e.ctrlKey || e.metaKey) && e.key === "y")
      ) {
        e.preventDefault();
        dispatch({ type: "REDO" });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [state.selection.selectedNodeId, state.model.rootId, dispatch]);

  return null;
}

