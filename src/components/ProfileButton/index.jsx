import { apiPaths, PUBLIC_API_KEY, PUBLIC_API_URL } from "../../constants/api"
import { useContext, useState } from "react";
import axios from "axios";
import styles from './styles.module.scss'
import { ModalContext } from "../../App";

export const ProfileButton = ({id,username}) => {
    const [modalData, setModalData] = useState(false);
    const {setModalInfo} = useContext(ModalContext)

    const handleClick = async () => {

        await axios({
                method: 'GET',
                url:`${PUBLIC_API_URL}${apiPaths.getProfile}?profileId=${id}`,
                headers:{
                    'x-api-key': PUBLIC_API_KEY
                }
            }
            ).then((response)=>{
            const { data } = response.data
            setModalInfo({isOpen: true, ...data})
            // setModalData(data)
        })
        
        
    }

    return <>
        <button
            onClick={handleClick}
            className={styles.profileBtn}
        >
            <svg className={styles.icon} viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.86719 7.39062C4.97656 7.39062 3.44531 5.73438 3.44531 3.69531C3.44531 1.6875 4.98438 0.0625 6.86719 0.0625C8.75781 0.0625 10.2812 1.66406 10.2812 3.67969C10.2812 5.72656 8.75 7.39062 6.86719 7.39062ZM6.86719 6.03906C7.95312 6.03906 8.86719 5.01562 8.86719 3.67969C8.86719 2.38281 7.96094 1.41406 6.86719 1.41406C5.77344 1.41406 4.85938 2.39844 4.85938 3.69531C4.85938 5.02344 5.78125 6.03906 6.86719 6.03906ZM1.99219 14.6562C0.640625 14.6562 -0.0078125 14.2266 -0.0078125 13.3125C-0.0078125 11.1797 2.66406 8.30469 6.85938 8.30469C11.0547 8.30469 13.7266 11.1797 13.7266 13.3125C13.7266 14.2266 13.0781 14.6562 11.7344 14.6562H1.99219ZM1.72656 13.3047H11.9922C12.1719 13.3047 12.25 13.25 12.25 13.1016C12.25 11.9062 10.3125 9.65625 6.85938 9.65625C3.40625 9.65625 1.47656 11.9062 1.47656 13.1016C1.47656 13.25 1.54688 13.3047 1.72656 13.3047Z" fill="#BDC5DC"/>
            </svg>

            {username}
        </button>
    </>
}