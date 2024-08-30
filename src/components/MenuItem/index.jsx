import { Link, matchRoutes, useLocation } from "react-router-dom"
import { router } from "../../router"
import styles from './styles.module.scss'
import cx from 'classnames'


export const MenuItem = ({name, className, href,target = '_self'}) => {
    const location = useLocation()
    const {routes} = router
    const [{ route }] = matchRoutes(routes, location)
    const isGraphRoute = route.name === "Graph page"

    return <div className="">
        <Link 
            to={href}
            target={target}
            className={cx(styles.link, (route.name === name || (name === "Knowledge base" && isGraphRoute)) && styles.active, className)}
        >
            {name}
        </Link>
    </div>
}