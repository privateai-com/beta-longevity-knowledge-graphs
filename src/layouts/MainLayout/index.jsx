import { Header } from "../../components/Header"
import styles from './styles.module.scss'

export const MainLayout = ({children}) => {
    return <>
        <Header />
        <main className={styles.main}>
            {children}
        </main>
    </>
}