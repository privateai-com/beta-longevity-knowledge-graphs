import { useState } from "react";
import { createContext } from "react";
import { useEffect } from "react";
import Typography from "./components/Typography";
import { THEMES } from "./constants/themeConstants";
import { changeTheme, setBodyClass } from "./hooks/changeTheme";
import Modal from "react-modal";
import styles from "./styles.module.scss";
import FallbackImage from "./assets/img/profileFallbackImage.svg";
import FallbackImageLight from "./assets/img/profileFallbackImageLight.svg";

export const ThemeContext = createContext(null);
export const ModalContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState("");
  const [modalInfo, setModalInfo] = useState({
    isOpen: false,
    username: null,
    description: null,
    socialLink: null,
  });

  useEffect(() => {
    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = (event) => {
      const newColorScheme = event.matches ? "dark" : "light";
      const foundTheme = THEMES.find((item) => item.name === newColorScheme);
      if (foundTheme) {
        setTheme(foundTheme.name);
        setBodyClass({ className: foundTheme.name });
      } else {
        setTheme(THEMES[0].name);
        setBodyClass({ className: THEMES[0].name });
      }
    };
    applyTheme(matchMedia);
    matchMedia.addEventListener("change", applyTheme);
    return () => {
      matchMedia.removeEventListener("change", applyTheme);
    };
  }, []);

  const handleChangeTheme = () => {
    const newTheme = changeTheme({ theme });
    setTheme(newTheme);
  };

  function closeModal() {
    setModalInfo({
      isOpen: false,
      owner: null,
      description: null,
    });
  }

  console.log(modalInfo);

  return (
    <ThemeContext.Provider value={{ theme, handleChangeTheme }}>
      <ModalContext.Provider value={{ modalInfo, setModalInfo }}>
        {children}
      </ModalContext.Provider>
      <Modal isOpen={modalInfo.isOpen} className={styles.modal}>
        <div className={styles.modal_inner}>
          <Typography type="h2">Owner</Typography>
          <div className={styles.modal_content}>
            <div className={styles.modal_contnet_col}>
              <div className={styles.modal_contnet_image}>
                <div className={styles.modal_contnet_image_inner}>
                  <picture>
                    <source srcset={modalInfo?.avatarUrl} />

                    {theme === "dark" ? (
                      <img
                        src={FallbackImage}
                        alt="Fallback Image"
                        width="600"
                      />
                    ) : (
                      <img
                        src={FallbackImageLight}
                        alt="Fallback Image"
                        width="600"
                      />
                    )}
                  </picture>
                </div>
              </div>
            </div>
            <div className={styles.modal_contnet_col}>
              <div className={styles.modal_row}>
                <Typography type="h3">{modalInfo.username}</Typography>
              </div>

              <div className={styles.modal_row}>
                <Typography type="h3">{"Organisation/Institute"}</Typography>
                <Typography type="p">{modalInfo.organization}</Typography>
              </div>

              <div className={styles.modal_row}>
                <Typography type="h3">{"Position"}</Typography>
                <Typography type="p">{modalInfo.position}</Typography>
              </div>

              <div className={styles.modal_row}>
                <Typography type="h3">{"Research Fields"}</Typography>
                <Typography type="p">{modalInfo.researchFields}</Typography>
              </div>
            </div>
          </div>
          <button className={styles.modal_close} onClick={closeModal}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="20"
                height="20"
                transform="translate(1 1)"
                fill="none"
              ></rect>
              <path
                d="M1 1L21 21"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M21 1L1 21"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </button>
        </div>
      </Modal>
    </ThemeContext.Provider>
  );
};
