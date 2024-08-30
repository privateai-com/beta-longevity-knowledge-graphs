import { useState } from "react"
import { MenuItem } from "../MenuItem"
import styles from './styles.module.scss'
import cx from 'classnames'

export const Menu = ({list}) => {

    const [isOpen, setToggleFlag] = useState(false)

    return <nav className={styles.nav}>
        <button
            className={styles.toggleButton}
            onClick={()=>setToggleFlag(prev => !prev)}
        >
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 12V10H18V12H0ZM0 7V5H18V7H0ZM0 2V0H18V2H0Z" fill="currentColor"/>
            </svg>
        </button>
        <ul className={cx(styles.list, isOpen && styles.showMobile)}>
            {list.map(item=>{
                return <MenuItem 
                    key={item.name}
                    href={item.path}
                    name={item.name}
                />
            })}
            <MenuItem 
                href={'https://demo.privateai.com'}
                target="_blank"
                name={'DEMO'}
                className={styles.mobileLink}
            />
        </ul>
    </nav>
}