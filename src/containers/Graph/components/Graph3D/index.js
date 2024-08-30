import levenshtein from 'fast-levenshtein';
import React, { useState, useRef, useCallback, useEffect, useContext} from 'react';
import * as THREE from 'three';
import SpriteText from 'three-spritetext';
// import { ForceGraphMethods } from 'react-force-graph-3d';
import axios from 'axios';
import ForceGraph3D from 'react-force-graph-3d-fixed';
// import { Loader } from 'components';
import styles from './styles.module.scss';
import {ThemeContext} from "../../../../App"


export const Graph3D = ({
  haveHandleClick = true,
  data, links = [], showLogo = true,
  isFetching = true,
  // eslint-disable-next-line
  // height,
  parentRef = null,
}) => {
  const [isModalClicked, setModalClicked] = useState(false);
  const [isLoadingDataForNode, setLoadingDataForNode] = useState(false);

  const [,setLoadedData] = useState(false); 
  const [modalData, setModalData] = useState(null);
  const [contextMenuCoords, setContextMenuCoords] = useState({ x: 0, y: 0 });

  const {theme} = useContext(ThemeContext)

  const themeStatus = theme

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);
  const fgRef = useRef();
  const [isLoaded, setLoading] = useState(false);

  const updateDimensions = (repeat = false) => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: Math.max(containerRef.current ? containerRef.current.clientHeight : 0),
      });
      if(fgRef.current && fgRef.current?.d3Force) {
        fgRef.current?.d3Force('charge')?.strength(-15);
      }

      if(repeat) {
        setTimeout(() => {
        }, 1500);
      }
    }
  };

  useEffect(() => {
    if(fgRef.current && isLoaded) {
      fgRef.current.cameraPosition({ x: 0, y: 0, z: 300 }, { x: 0, y: 0, z: 0 }, 1);
      fgRef.current?.d3Force('charge')?.strength(-15);
      fgRef.current.refresh();
      setTimeout(() => {
        fgRef.current?.refresh();
        setTimeout(() => {
          fgRef.current?.refresh();
          setTimeout(() => {
            fgRef.current?.refresh();
            setTimeout(() => {
              fgRef.current?.refresh();
            }, 2000);
          }, 2000);
        }, 2000);
      }, 2000);
    }
  }, [isLoaded]);

  useEffect(() => {
    if(!isFetching && isLoaded === false) {
      setLoading(() => true);
    }
  }, [isFetching]);

  const linkPositionUpdate = (
    sprite,
    { start, end },
  ) => {
    const middlePos = ['x', 'y', 'z'].reduce((acc, c) => {
      acc[c] = start[c] + (end[c] - start[c]) / 2;
      return acc;
    }, {});

    if (sprite) {
      Object.assign(sprite.position, middlePos);
    }
  };

  const handleClick2 = useCallback((node) => {
    const distance = 40;
    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

    if(!fgRef.current) return;
    fgRef.current.cameraPosition(
      { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
      node, 
      3000, 
    );
  }, [fgRef]);

  const handleClick = async (node) => {
    handleClick2(node);
  };

  const closeModal = () => {
    setModalClicked(() => false);
    setModalData(() => null);
  };

  useEffect(() => {
    if(parentRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          setDimensions({ width, height });
        }
      });

      if (containerRef.current) {
        resizeObserver.observe(parentRef.current);
      }

      return () => resizeObserver.disconnect();
    }
    updateDimensions();
  }, [parentRef, isLoaded]);

  const linkThreeObjectUpdate = (link) => {

    const verb = links.find((_link) => _link.source === link.source.id && _link.target === link.target.id);

    const linkLabel = verb?.linkLabel ? verb.linkLabel : '';

    const sprite = new SpriteText(`${linkLabel}`);

    sprite.color = themeStatus === 'dark' ? '#fff' : '#000';
    sprite.textHeight = 3;
    return sprite;

  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%', position: 'relative', background: 'var(--aside-bg)', borderRadius: 8, overflow: 'hidden', display: 'flex', height: '100%',
      }}
    >
      {showLogo && (
      <div
        className={styles.canvasLogo}
      >
        {/* <FullLogoWithEye sizes={{
          x: 300,
          y: 'auto',
        }}
        /> */}

      </div>
      )}
      {
        // isLoaded
      }

      {!isLoaded && (
      <div className="" style={{ display: 'flex', margin: 'auto', color: 'var(--accent-color, #4659FE)' }}>
        Loading...
        {/* <Loader size={64} /> */}
      </div>
      )}

      {/* {JSON.stringify(data)} */}

      {!fgRef && isLoaded && (
      <>
        Error
      </>
      )}
      {
        data && data.links && data.nodes && isLoaded && (
          <ForceGraph3D
            ref={fgRef}
            nodeOpacity={1}
            controlType="orbit"
            onNodeClick={(node) => (haveHandleClick ? handleClick(node) : () => {})}
            linkDirectionalArrowColor="#000"
            linkDirectionalParticleColor="#000"
            linkThreeObjectExtend
            linkWidth={themeStatus === 'dark' ? 0.1 : 0.3}
            linkColor="rgb(0,0,0)"
            linkOpacity={1}
            // // eslint-disable-next-line
            // nodeThreeObjectExtend
            // eslint-disable-next-line
            linkThreeObject={linkThreeObjectUpdate}
            linkPositionUpdate={linkPositionUpdate}
            // eslint-disable-next-line
            nodeThreeObject={(node) => {
              // eslint-disable-next-line
              const foundSourceLink = links.find((_link) => _link.source === node.id);

              const group = new THREE.Group();

              // Create a sphere
              const THEME = themeStatus === 'dark' || themeStatus === 'light' ? themeStatus : 'dark';

              const nodeColors = {
                dark: {
                  sourceColor: '#359CFB',
                  subjectColor: '#422FBB',

                },
                light: {
                  sourceColor: '#359CFB',
                  subjectColor: '#422FBB',
                },
              };

              const sphere = new THREE.Mesh(
                new THREE.SphereGeometry(5),
                new THREE.MeshBasicMaterial({
                  color: nodeColors[THEME][foundSourceLink ? 'sourceColor' : 'subjectColor'],
                  transparent: true,
                  opacity: 0.95,
                }),
              );
              group.add(sphere);
              // node.color = nodeColors[THEME][foundSourceLink ? 'sourceColor' : 'subjectColor']

              // eslint-disable-next-line
              node.color = nodeColors[THEME][foundSourceLink ? 'sourceColor' : 'subjectColor'];

              const sprite = new SpriteText(node.id || '');
              // sprite.color = '#fff';
              sprite.color = themeStatus === 'dark' ? '#fff' : '#000';
              sprite.textHeight = 3;
              sprite?.position.set(0, 7, 0);
              group.add(sprite);

              return group;
            }}
            width={dimensions.width}
            height={dimensions.height}
            // eslint-disable-next-line
            onEngineStop={() => {setLoadedData(true)}}
            backgroundColor={themeStatus === 'light' ? '#F3F5FF' : '#313742'}
            graphData={data}
          />
        )
      }

    </div>

  );
};
