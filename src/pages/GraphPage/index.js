import {Helmet} from 'react-helmet'
import { Graph } from '../../containers/Graph'
import { GraphLayout } from '../../layouts/GraphLayout'

export const GraphPage = () =>{
    return <>
    <GraphLayout>
        <Graph />
    </GraphLayout>
</>
}