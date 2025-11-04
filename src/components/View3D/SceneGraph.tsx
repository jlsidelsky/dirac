import type { ReactElement } from "react";
import { useModel } from "@/store/ModelStore";
import { ModelObject } from "./ModelObject";
import { getChildren } from "@/utils/treeUtils";

export function SceneGraph() {
  const { state } = useModel();
  const rootId = state.model.rootId;

  const renderNode = (nodeId: string): ReactElement | null => {
    const node = state.model.nodes[nodeId];
    if (!node || !node.visible) return null;

    if (node.type === "assembly") {
      const children = getChildren(nodeId, state.model);
      return (
        <ModelObject key={nodeId} nodeId={nodeId}>
          {children.map((childId) => renderNode(childId))}
        </ModelObject>
      );
    } else {
      return <ModelObject key={nodeId} nodeId={nodeId} />;
    }
  };

  return <>{renderNode(rootId)}</>;
}
