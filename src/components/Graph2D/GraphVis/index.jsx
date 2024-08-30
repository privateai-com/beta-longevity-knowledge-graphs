import React, {
  memo, useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import cx from 'classnames';
import 'vis-network/styles/vis-network.css';

// import { Button, 
//   // ButtonIcon
//  } from 'components';
// import { closeModalIcon } from 'assets';
import {
  Data,
  DataInterfaceEdges,
  DataInterfaceNodes,
  Edge,
  Node,
  Network,
  Position,
} from 'vis-network';
import levenshtein from 'fast-levenshtein';
import axios from 'axios';
// import { notification } from 'utils';
import { transformNodesAndEdgesToData } from '../utils';
import { options } from './constants.js';
import { updateGraphControls } from './hooks.js';

import styles from './styles.module.scss';
import { Button } from '../../Button';
// import { Button } from '../../../../../components/Button';
// import GraphNodeModal from 'components/Modals/GraphNodeModal';



export const GraphVis = memo(({
  nodes, edges, isEdit, setGraphData, setNodesLabelWithoutEdges,
}) => {
  const graphRef = useRef(null);
  const inputRef = useRef(null);
  const networkRef = useRef(null);

  const [editingNodeId, setEditingNodeId] = useState(null);
  const [editingEdgeId, setEditingEdgeId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [shouldDeleteNode, setShouldDeleteNode] = useState(false);

  const [isModalDataLoading, setModalDataFlag] = useState(false);
  const [isModalClicked, setModalClicked] = useState(false);
  const [modalData, setModalData] = useState(null);

  const getNodesLabelWithoutEdges = useCallback(() => {
    const network = networkRef.current;
    if (network) {
      const nodesWithoutEdges = [];
      const allNodes = nodes.get();

      allNodes.forEach((node) => {
        const connectedEdges = network.getConnectedEdges(node.id);

        if (connectedEdges.length === 0) {
          nodesWithoutEdges.push(node.label);
        }
      });
      setNodesLabelWithoutEdges(nodesWithoutEdges);
    }
  }, [nodes, setNodesLabelWithoutEdges]);

  const handleAddNode = useCallback((data, callback) => {
    const newNode = {
      ...data,
      id: (nodes.length + 1).toString(),
    };
    setEditingNodeId(newNode.id);
    setShowPopup(true);
    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.value = newNode.label || '';
      setTimeout(() => {
        inputElement.focus();
        inputElement.select();
      }, 10);
    }


    setShouldDeleteNode(true);
    callback(newNode);
  }, [nodes]);

  const handleEditNode = useCallback((data, callback) => {
    setEditingNodeId(data.id);
    setShowPopup(true);
    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.value = data.label || '';
      setTimeout(() => {
        inputElement.focus();
        inputElement.select();
      }, 10);
    }
    setShouldDeleteNode(inputRef.current?.value.trim() === '');
    callback(data);
  }, []);

  const handleAddEdge = useCallback((data, callback) => {
    if (!data.to || !data.from) return;
    if (data.from === data.to) return;
    const existingEdge =
      edges.get().find((edge) => 
        (edge.from === data.from && edge.to === data.to) ||
        (edge.from === data.to && edge.to === data.from));
    if (existingEdge) return;

    const nodeTo = nodes.get(data.to);
    const nodeFrom = nodes.get(data.from);
    if (!nodeTo || !nodeFrom) return;
    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.value = data.label || '';
      setTimeout(() => {
        inputElement.focus();
        inputElement.select();
      }, 10);
    }

    const newEdgeId = (edges.length + 1).toString();
    setEditingEdgeId(newEdgeId);
    callback({ ...data, id: newEdgeId });
    setShowPopup(true);
    setGraphData(transformNodesAndEdgesToData(nodes, edges));
    getNodesLabelWithoutEdges();
  }, [edges, getNodesLabelWithoutEdges, nodes, setGraphData]);

  const handleDeleteEdge = useCallback((data, callback) => {
    if (Array.isArray(data?.edges) && data.edges.length === 1) {
      const edgeIdToDelete = data.edges[0];
      const currentEdge = edges.get().find(({ id }) => id === edgeIdToDelete);
      if (!currentEdge) return;
      const nodeFrom = nodes.get(currentEdge.from);
      if (!nodeFrom) return;
    }
    callback(data);
    setGraphData(transformNodesAndEdgesToData(nodes, edges));
    getNodesLabelWithoutEdges();
  }, [edges, getNodesLabelWithoutEdges, nodes, setGraphData]);

  const handleDeleteNode = useCallback((data, callback) => {
    if (!Array.isArray(data?.nodes)) return;
    callback(data);
    setGraphData(transformNodesAndEdgesToData(nodes, edges));
    getNodesLabelWithoutEdges();
  }, [edges, getNodesLabelWithoutEdges, nodes, setGraphData]);

  const currentOption = useMemo(() => ({
    ...options,
    manipulation: {
      enabled: isEdit,
      initiallyActive: isEdit,
      addNode: handleAddNode,
      editNode: handleEditNode,
      addEdge: handleAddEdge,
      deleteNode: handleDeleteNode,
      deleteEdge: handleDeleteEdge,
    }, 
  }), [handleAddEdge, handleAddNode, handleDeleteEdge, handleDeleteNode, handleEditNode, isEdit]);

  useEffect(() => {
    if (networkRef.current != null) {
      networkRef.current.destroy();
      networkRef.current = null;
    }
    networkRef.current = graphRef.current &&
      new Network(
        graphRef.current, 
        { nodes: nodes , edges: edges },
        currentOption,
      );
    updateGraphControls(graphRef);

    

    async function getWiki(obj, useLevenshtein = true) {
      const base_url = "https://en.wikipedia.org/w/api.php";

      // Search
      const searchParams = {
          action: 'query',
          format: 'json',
          list: 'search',
          origin: '*',
          utf8: 1,
          srsearch: obj,
      };

      let response = await axios.get(base_url, { params: searchParams });
      let query_data = response.data;

      if (!query_data.query.search.length) {
          return {};
      }

      let info = query_data.query.search[0];

      if (useLevenshtein) {
          const distance = levenshtein.get(obj.toLowerCase(), info.title.toLowerCase());
          const threshold = Math.max(obj.length, info.title.length) / 2;

          if (distance > threshold) {
              return {};
          }
      }

      // Extract
      const extractParams = {
          format: 'json',
          action: 'query',
          prop: 'extracts|info',
          origin: '*',
          exintro: true,
          explaintext: true,
          redirects: 1,
          titles: info.title,
          inprop: 'url',
      };

      response = await axios.get(base_url, { params: extractParams });
      query_data = response.data;

      let page = Object.values(query_data.query.pages)[0];
      return page;
    }
    
    const onClick = async (event) => {
      if (!networkRef.current) return;
      const canvasPosition = networkRef.current.canvasToDOM(event.pointer.canvas);
      const nodeId = networkRef.current.getNodeAt(canvasPosition);
      const edgeId = networkRef.current.getEdgeAt(canvasPosition);

      
      console.log(nodeId)
      console.log(edgeId)

      // 
      
      

      if (nodeId !== undefined && !isModalClicked) {
        setModalDataFlag(() => true)
        setModalClicked(() => true)
        await getWiki(nodeId).then(data => {
          setModalDataFlag(() => false)

          if(Object.keys(data).length == 0){
            closeModal()
          }else{
            setModalData(() => data)
          }
        }
          
      
        
        ).catch(error => 
          {
            setModalClicked(() => false)
            setModalData(() => null)

          }
          // console.error(error)
        );
      }
    };


    

    const onDoubleClick = (event) => {
      if (!networkRef.current) return;
      const canvasPosition = networkRef.current.canvasToDOM(event.pointer.canvas);
      const nodeId = networkRef.current.getNodeAt(canvasPosition);
      const edgeId = networkRef.current.getEdgeAt(canvasPosition);
      if (nodeId !== undefined) {
        setEditingNodeId(nodeId);
        setShowPopup(true);
        const node = nodes.get(nodeId);
        if (node && inputRef.current) {
          inputRef.current.value = node.label;
          inputRef.current.focus();
        }
      } else if (edgeId !== undefined) {
        setEditingEdgeId(edgeId);
        setShowPopup(true);
        const edge = edges.get(edgeId);
        if (edge && inputRef.current) {
          inputRef.current.value = edge.label ?? '';
          inputRef.current.focus();
        }
      } else {
        setShowPopup(false);
        setEditingNodeId(null);
        setEditingEdgeId(null);
      }
    };

    if (networkRef.current && isEdit) networkRef.current.on('doubleClick', onDoubleClick);
    if (networkRef.current) networkRef.current.on('click', onClick);
    if (networkRef.current) networkRef.current.on('hoverNode', ()=>graphRef.current ? graphRef.current.style.cursor = 'help': null);
    if (networkRef.current) networkRef.current.on('blurNode', ()=>graphRef.current ? graphRef.current.style.cursor = 'default': null);


    return () => {
      if (networkRef.current) {
        networkRef.current.off('doubleClick', onDoubleClick);
        networkRef.current.off('click', onClick);
        networkRef.current.off('hoverNode', ()=>graphRef.current ? graphRef.current.style.cursor = 'pointer': null);
        networkRef.current.off('blurNode', ()=>graphRef.current ? graphRef.current.style.cursor = 'default': null);
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [currentOption, edges, isEdit, nodes, setGraphData]);


  const resetState = () =>{

  }



  const closeModal = () =>{
    setModalClicked(() => false)
    setModalData(() => null)
  }




  


  const handleEnterPress = () => {
    if (editingNodeId !== null) {
      const updatedNode = nodes.get(editingNodeId);
      if (updatedNode && inputRef.current) {
        const newLabel = inputRef.current.value.trim();
        const existingNode = nodes.get({
          filter: (node) => node.label === newLabel && node.id !== editingNodeId,
        });

        if (existingNode.length > 0) {
          // notification.info({ message: `Node with label "${newLabel}" already exists` });
          return;
        } if (newLabel === '') {
          // setShouldDeleteNode(true);
          // notification.error({ message: 'node name cannot be empty' });
          return;
        } 
        updatedNode.label = newLabel;
        nodes.update(updatedNode);
      }
      setEditingNodeId(null);
    }

    if (editingEdgeId !== null || editingEdgeId !== undefined) {
      const currentEdges = edges.get();
      const updatedEdge = edges.get(editingEdgeId);
      if (updatedEdge && currentEdges) {
        const newLabel = inputRef.current?.value.trim();
        if (newLabel) {
          currentEdges.forEach((edge) => {
            if (edge.id === updatedEdge.id) {
              const newEdge = { ...edge };
              newEdge.label = newLabel;
              const index = currentEdges.findIndex((e) => e.id === updatedEdge.id);
              if (index !== -1) {
                currentEdges[index] = newEdge;
              }
            }
          });
          edges.update(currentEdges);
        } else {
          // edges.remove(editingEdgeId as string);
          // notification.error({ message: 'edge name cannot be empty' });
          return;
        }
      }
      setEditingEdgeId(null);
    }
    setGraphData(transformNodesAndEdgesToData(nodes, edges));
    getNodesLabelWithoutEdges();
    setShowPopup(false);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Delete' && networkRef.current && isEdit) {
        const selectedNodes = networkRef.current.getSelectedNodes();
        const selectedEdges = networkRef.current.getSelectedEdges();
        if (selectedNodes.length > 0) {
          nodes.remove(selectedNodes);
        }
        if (selectedEdges.length > 0) {
          edges.remove(selectedEdges);
        }
        setGraphData(transformNodesAndEdgesToData(nodes, edges));
        getNodesLabelWithoutEdges();
        setShowPopup(false);
        networkRef.current.unselectAll();
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [edges, getNodesLabelWithoutEdges, isEdit, nodes, setGraphData]);

  useEffect(() => {
    if (graphRef) {
      updateGraphControls(graphRef);
    }
  }, [graphRef]);

  const onClosePopup = useCallback(() => {
    if (shouldDeleteNode) {
      nodes.remove(editingNodeId);
    }
  
    if (editingEdgeId !== null) {
      const updatedEdge = edges.get(editingEdgeId);
      if (updatedEdge) {
        const newLabel = inputRef.current?.value.trim();
        if (!newLabel) {
          edges.remove(editingEdgeId);
          setGraphData(transformNodesAndEdgesToData(nodes, edges));
        }
      }
    }
  
    setShowPopup(false);
    setEditingNodeId(null);
    setEditingEdgeId(null);
    setShouldDeleteNode(false);
  }, [shouldDeleteNode, editingEdgeId, nodes, editingNodeId, edges, setGraphData]);

  useEffect(() => {
    const network = networkRef.current;
    if (network) {
      const nodesWithoutEdges = [];
      const allNodes = nodes.getIds(); // Получаем идентификаторы всех узлов

      allNodes.forEach((nodeId) => {
        const connectedEdges = network.getConnectedEdges(nodeId);

        if (connectedEdges.length === 0) {
          nodesWithoutEdges.push(nodeId);
        }
      });

      setNodesLabelWithoutEdges(nodesWithoutEdges);
    }
  }, [nodes, setNodesLabelWithoutEdges]);

  return (
    <>
      <div className={styles.visContainer}>
        <div className={styles.visWrapper} ref={graphRef} />
        <div
          className={cx(styles.popup, {
            [styles.show]: showPopup,
          })}
        >
          <div className={styles.popup_container}>
            <input
              type="text"
              onKeyUp={(event) => {
                if (event.key === 'Enter') {
                  handleEnterPress();
                }
              }}
              ref={inputRef}
            />
            <Button className={styles.popup_button_ok} onClick={handleEnterPress}>Ok</Button>
            {/* <ButtonIcon image={closeModalIcon} onClick={onClosePopup} /> */}
          </div>
        </div>
      </div>
      {/* {isModalClicked && modalData && <GraphNodeModal
        isLoading={isModalDataLoading}
        onCloseModal={closeModal}
        data={modalData}
      />} */}
    </>
  );
});
