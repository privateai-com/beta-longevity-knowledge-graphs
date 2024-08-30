import Typography from '../Typography'
import styles from './styles.module.scss'

export const PageHead = ({
    title = ''
}) => {
    return <>
        <div className={styles.page_head}>
            <Typography type='h1'>
                {title}
            </Typography>
        </div>
    </>
}