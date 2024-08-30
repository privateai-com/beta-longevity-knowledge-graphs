import { globalPaths } from './constants/route-path';
import { createBrowserRouter } from 'react-router-dom';
import { GraphCollectionPage, GraphPage, HomePage } from './pages';

export const router = createBrowserRouter([
    ...globalPaths,
    {
        name:'Graph page',
        path: "/graph/:graphID",
        element: <GraphPage />,
    },
    {
        name:'Graph page',
        path: "/knowledge/:pageID",
        element: <GraphCollectionPage />,
    },
    {
        name:'Home',
        path: "*",
        element: <GraphCollectionPage />,
    },
]);