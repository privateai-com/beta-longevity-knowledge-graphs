import cx from 'classnames'
import styles from './styles.module.scss'

export const Button = ({
    onClick,
    children,
    className,
    disabled = false
}) => {

    return <button
        onClick={onClick}
        className={cx(className, styles.btn)}
        disabled={disabled}
    >
        {children}
    </button>
}