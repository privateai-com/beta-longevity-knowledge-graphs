import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { PageHead } from "../../components/PageHead";
import { MainLayout } from "../../layouts/MainLayout";
import styles from "./styles.module.scss";
import videoSrc from "../../assets/video/main.mp4";

export const HomePage = () => {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Home</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <MainLayout>
        {/* <PageHead
                title='Home'
            /> */}
        {/* <div className={styles.logo}>
                <video  muted autoPlay loop playsInline>
                    <source src={'https://s3.amazonaws.com/webflow-prod-assets/655a09c01f4650d9c5cdd3ab/65cf9094a015a8e5a48e3434_test_subtitles_1.webm'} type="video/webm" />
                    <source src={'https://s3.amazonaws.com/webflow-prod-assets/655a09c01f4650d9c5cdd3ab/65d48c5c71711ecf2d0e1ab3_video.mp4'} type="video/mp4" />
                </video>
            </div> */}
      </MainLayout>
    </>
  );
};
