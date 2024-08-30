import { useContext } from "react"
import { ThemeContext } from "../../App"
import styles from './styles.module.scss'
import cx from 'classnames'

export const SwitchThemeButton = () => {
    const {theme,handleChangeTheme} = useContext(ThemeContext)

    const handleToggleClick = () => {
        handleChangeTheme()
    }

    return <>
        <div className="">
            <input id="theme" className={styles.input} type="checkbox" defaultChecked={theme === "dark"}  />
            <label className={styles.circle_wrap} htmlFor="theme" onClick={handleToggleClick} >
                <span className={cx(styles.circle, styles[theme])}>
                    {theme === 'light' && <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>}
                    {theme === 'dark' &&  <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                        viewBox="0 0 499.712 499.712" style={{enableBackground:'new 0 0 499.712 499.712'}} xmlSpace="preserve">
                        <path style={{fill:'#FFD93B'}} d="M146.88,375.528c126.272,0,228.624-102.368,228.624-228.64c0-55.952-20.16-107.136-53.52-146.88
                            C425.056,33.096,499.696,129.64,499.696,243.704c0,141.392-114.608,256-256,256c-114.064,0-210.608-74.64-243.696-177.712
                            C39.744,355.368,90.944,375.528,146.88,375.528z"/>
                        <path style={{fill:'#F4C534'}} d="M401.92,42.776c34.24,43.504,54.816,98.272,54.816,157.952c0,141.392-114.608,256-256,256
                            c-59.68,0-114.448-20.576-157.952-54.816c46.848,59.472,119.344,97.792,200.928,97.792c141.392,0,256-114.608,256-256
                            C499.712,162.12,461.392,89.64,401.92,42.776z"/>
                        <g>
                            <polygon style={{fill:'#FFD83B'}} points="128.128,99.944 154.496,153.4 213.472,161.96 170.8,203.56 180.864,262.296 
                                128.128,234.568 75.376,262.296 85.44,203.56 42.768,161.96 101.744,153.4 	"/>
                            <polygon style={{fill:'#FFD83B'}} points="276.864,82.84 290.528,110.552 321.104,114.984 298.976,136.552 304.208,166.984 
                                276.864,152.616 249.52,166.984 254.752,136.552 232.624,114.984 263.2,110.552 	"/>
                        </g>
                    </svg>}
                    {/* {theme} */}
                </span>
            </label>
        </div>
    </>
}