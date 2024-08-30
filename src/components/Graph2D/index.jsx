import { FC, memo } from 'react';
// import { Edge } from 'vis-network';
// import { Tooltip } from 'react-tooltip';
import cx from 'classnames';

// import {
//   // ButtonIcon,
//   Typography,
// } from 'components';

// import { fullscreenIcon } from 'assets';
import { transformDataToNodesAndEdges } from './utils';
// import { GraphLoader } from '../Loader';
// import { DeleteBtn } from '../DeleteBtn';

import styles from './styles.module.scss';
import { GraphVis } from './GraphVis';
// import Typography from '../../../../components/Typography';


export const Graph2D = memo(({
  graphData, setGraphData, isEdit,
  isLoading, onFullScreen, articleId, isOwner,
  setNodesLabelWithoutEdges, isPublished,
}) => {
  const { nodes, edges } = transformDataToNodesAndEdges(graphData);
  const edgesCurrent = edges.get().filter(({ to }) => to !== 0);
  const edgesCount = edgesCurrent.length;
  const nodesCount = nodes.length;

  return (
    <GraphVis
    setGraphData={setGraphData}
    nodes={nodes}
    edges={edges}
    isEdit={isEdit}
    setNodesLabelWithoutEdges={setNodesLabelWithoutEdges}
  />
  );
});
