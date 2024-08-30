import { DataSet } from 'vis-data';

const initial = {
  nodes: new DataSet(),
  edges: new DataSet(),
} 

export const checkGraphStructureValid = (data) => (
  data.every((obj) => 
    typeof obj === 'object' &&
    Object.prototype.hasOwnProperty.call(obj, 'subject') &&
    Object.prototype.hasOwnProperty.call(obj, 'verb') &&
    Object.prototype.hasOwnProperty.call(obj, 'object') &&
    Object.prototype.hasOwnProperty.call(obj, 'uncertainty') &&
    Object.prototype.hasOwnProperty.call(obj, 'comment'))
);

const setNodeSizes = (nodes, edgesData) => 
  nodes.map((node) => {
    const nodeId = node.id;
    const nodeEdges = edgesData.filter((edge) => edge.from === nodeId || edge.to === nodeId);
    const numberOfEdges = nodeEdges.length;
    const updatedNode = { ...node };

    switch (true) {
      case numberOfEdges >= 1 && numberOfEdges <= 3:
        updatedNode.size = 20;
        break;
      case numberOfEdges <= 9:
        updatedNode.size = 24;
        break;
      case numberOfEdges <= 15:
        updatedNode.size = 28;
        break;
      case numberOfEdges <= 20:
        updatedNode.size = 32;
        break;
      case numberOfEdges <= 25:
        updatedNode.size = 36;
        break;
      case numberOfEdges <= 30:
        updatedNode.size = 40;
        break;
      case numberOfEdges >= 31:
        updatedNode.size = 44;
        break;
      default:
        updatedNode.size = 16;
        break;
    }
    return updatedNode;
  });

export const transformDataToNodesAndEdges =
  (data) => {
    if (!data || data?.length === 0) {
      return initial;
    }

    const isStructureValid = checkGraphStructureValid(data);

    if (!isStructureValid) {
      return initial;
    }

    const nodes = new DataSet
    const uniqueNodes = new Set
    const uniqueEdges = {};
    const edgesData = [];

    data.forEach((item) => {
      const headNodeId = item.subject;
      const tailNodeId = item.object;

      if (!uniqueNodes.has(headNodeId)) {
        uniqueNodes.add(headNodeId);
        nodes.add({
          id: headNodeId,
          label: item.subject,
          size: 16,
        });
      }

      if (!uniqueNodes.has(tailNodeId)) {
        uniqueNodes.add(tailNodeId);
        nodes.add({
          id: tailNodeId,
          label: item.object,
          size: 16,
        });
      }

      const edgeKey = `${headNodeId}-${tailNodeId}`;

      if (!uniqueEdges[edgeKey]) {
        edgesData.push({
          from: headNodeId,
          to: tailNodeId,
          label: item.verb,
        });
        uniqueEdges[edgeKey] = true;
      }
    });

    const currentNodes = setNodeSizes(nodes, edgesData);
    const nodesDataSet = new DataSet(currentNodes);
    const edges = new DataSet(edgesData);

    return { nodes: nodesDataSet, edges } ;
  };

export const transformNodesAndEdgesToData =
  (nodes, edges) => {
    const data = [];

    edges.forEach((edge) => {
      const headNode = nodes.get(edge.from);
      const tailNode = nodes.get(edge.to);

      if (headNode && tailNode) {
        const item = {
          subject: headNode.label,
          object: tailNode.label,
          verb: edge.label,
          uncertainty: 0,
          comment: '',
        };
        
        data.push(item);
      }
    });

    return data;
  };
