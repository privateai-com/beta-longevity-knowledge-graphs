import { memo } from "react";
import { transformDataToNodesAndEdges } from "./utils";
import { GraphVis } from "./GraphVis";

export const Graph2D = memo(
  ({ graphData, setGraphData, isEdit, setNodesLabelWithoutEdges }) => {
    const { nodes, edges } = transformDataToNodesAndEdges(graphData);

    return (
      <GraphVis
        setGraphData={setGraphData}
        nodes={nodes}
        edges={edges}
        isEdit={isEdit}
        setNodesLabelWithoutEdges={setNodesLabelWithoutEdges}
      />
    );
  }
);
