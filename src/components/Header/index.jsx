import { Logo } from "../../assets/icons/logo"
import { globalPaths } from "../../constants/route-path"
import { Menu } from "../Menu"
import styles from './styles.module.scss'
import cx from 'classnames'
import { SwitchThemeButton } from "../SwitchThemeButton"
import { MenuItem } from "../MenuItem"
import { Link } from "react-router-dom"

export const Header = () => {
    return <header className={styles.header}>
        <div className={styles.header_inner}>
            <Link
                to="/"
                className={cx(styles.logo)}
            >
                <Logo
                    className={cx(styles.logo)}
                />
            </Link>
            <Menu 
                list={globalPaths}
            />
            <div className={styles.header_col}>
                <MenuItem
                    className={styles.desktopShow}
                    href="https://demo.privateai.com"
                    name="DEMO"
                    target="_blank"
                />
                <SwitchThemeButton />
            </div>
        </div>
    </header>
}