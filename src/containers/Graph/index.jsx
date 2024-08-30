import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { FileInfo } from "./components/FileInfo"
import axios from "axios";
import { apiPaths, PUBLIC_API_KEY, PUBLIC_API_URL } from "../../constants/api"
import { Graph3D } from "./components/Graph3D"
import styles from './styles.module.scss'
import { Button } from "../../components/Button";
import Typography from "../../components/Typography";
import { Helmet } from "react-helmet";
// import {Graph2D} from './components/Graph2D'

export const Graph = () => {
    const [graph, setGraph] = useState(null)
    let { graphID } = useParams();
    const parentRef = useRef(null)
    const [isFetching , setFetchingFlag] = useState(true)

    useEffect(()=>{
        setFetchingFlag(true)
        axios({
            method: "GET",
            url: `${PUBLIC_API_URL}${apiPaths.getArticle}?articleId=${graphID - 1}`,
            headers:{
                'x-api-key': PUBLIC_API_KEY
            }
        }).then(response => {
            const { data } =response.data
            setGraph(data)
            setFetchingFlag(false)
        }).catch(err => {
            console.error(err);
            setFetchingFlag(false)
        })
        
    },[graphID])

    if(graph){
        console.log(graph)
    }

    return <>
        <div className={styles.wrap}>
            <Button
                onClick={
                    () => {
                        window.history.go(-1)
                    }
                }
            >
                Back
            </Button>
            <div className={styles.content}>
            {graph && <Helmet>
                <meta charSet="utf-8" />
                <title>{graph.title}</title>
                <link rel="canonical" href="http://mysite.com/example" />
            </Helmet>}
            {graph && <>
                <FileInfo 
                    data={graph}
                />
                <section className={styles.inner_content}>
                    <Typography type='h2'>
                        Data core structure
                    </Typography>
                    <div className={styles.graph}  ref={parentRef}>
                        {graph?.graph && graph?.graph.length !== 0 && graph?.graphDraft.length === 0 && <Graph3D 
                            parentRef={parentRef}
                            isFetching={isFetching}
                            links={[...graph.graph.map((graphItem) => ({
                                source: graphItem.object,
                                target: graphItem.subject,
                                value:
                                // 1,
                                graphItem.uncertainty,
                                linkLabel: graphItem.verb,
                            }))]}
                            data={{
                            nodes: [
                                ...graph.graph.map(
                                (graphItem) => (
                                    { id: graphItem.subject, group: graphItem.uncertainty }),
                                ),
                                ...graph.graph.map((graphItem) => ({
                                id: graphItem.object,
                                group: graphItem.uncertainty,
                                }))].reduce((o, i) => {
                                if (!o.find((v) => v.id === i.id)) {
                                o.push(i);
                                }
                                return o;
                            }, []),
                            links: [
                                ...graph.graph.map((graphItem) =>
                                ({
                                    source: graphItem.object,
                                    target: graphItem.subject,
                                    value: graphItem.uncertainty,
                                }))],
                            }}
                        />}

                        {graph?.graphDraft && graph?.graph.length === 0 && <Graph3D 
                            parentRef={parentRef}
                            isFetching={isFetching}
                            links={[...graph.graphDraft.map((graphItem) => ({
                                source: graphItem.object,
                                target: graphItem.subject,
                                value:
                                // 1,
                                graphItem.uncertainty,
                                linkLabel: graphItem.verb,
                            }))]}
                            data={{
                            nodes: [
                                ...graph.graphDraft.map(
                                (graphItem) => (
                                    { id: graphItem.subject, group: graphItem.uncertainty }),
                                ),
                                ...graph.graphDraft.map((graphItem) => ({
                                id: graphItem.object,
                                group: graphItem.uncertainty,
                                }))].reduce((o, i) => {
                                if (!o.find((v) => v.id === i.id)) {
                                o.push(i);
                                }
                                return o;
                            }, []),
                            links: [
                                ...graph.graphDraft.map((graphItem) =>
                                ({
                                    source: graphItem.object,
                                    target: graphItem.subject,
                                    value: graphItem.uncertainty,
                                }))],
                            }}
                        />}
                    </div>
                </section>
                {/* <div className="" style={{
                    width: '100%',
                    // height: '80vh',
                }}>
                    <div className={styles.canvasWrap} style={{
                        width:"100%",
                        paddingTop: '100%',
                    }}>
                        <Graph2D
                            graphData = {
                                // []
                                graph?.graphDraft.length ? graph?.graphDraft : graph?.graph
                            }
                            setGraphData={() => {}}
                            isEdit={false}
                            isLoading={false}
                            onFullScreen={false}
                            articleId= {graph?.id}
                            isOwner={false}
                            setNodesLabelWithoutEdges={() => {}}
                            isPublished

                        />
                    </div>
                </div> */}
            </>}

        
            </div>
        </div>
        
    </>
}