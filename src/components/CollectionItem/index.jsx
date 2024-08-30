import { useEffect, useState } from "react";
import { apiPaths, PUBLIC_API_KEY, PUBLIC_API_URL } from "../../constants/api";
import axios from "axios";
import styles from "./styles.module.scss";
import { Link } from "react-router-dom";
import { ProfileButton } from "../ProfileButton";
import DocumentIcon from "../../assets/icons/document";
import { fullTimeFormatter } from "../../hooks/dataTimeFormater";
import Typography from "../Typography";
import cx from "classnames";
import { useMemo } from "react";
import { Graph2D } from "../Graph2D";
import FallbackImage from "../../assets/img/profileFallbackImage.svg";
import FallbackImageLight from "../../assets/img/profileFallbackImageLight.svg";
import { useContext } from "react";
import { ThemeContext } from "../../App";

export const CollectionItem = ({ id, className, column_className }) => {
  const [item, setItem] = useState(null);
  const { theme } = useContext(ThemeContext);

  useMemo(() => {
    if (id) {
      axios({
        method: "GET",
        url: `${PUBLIC_API_URL}${apiPaths.getArticle}?articleId=${id - 1}`,
        headers: {
          "x-api-key": PUBLIC_API_KEY,
        },
      })
        .then((respopnse) => {
          setItem(respopnse.data.data);
        })
        .catch((err) => {
          console.log(`${PUBLIC_API_KEY}`, err);
          // console.log(err)
        });
    }
  }, [id]);

  return (
    <div className={className}>
      {item && (
        <>
          <div className={column_className}>
            <div
              className=""
              style={{ display: "flex", gap: 10, alignItems: "flex-start" }}
            >
              <DocumentIcon className={styles.icon} />
              <Link to={"/graph/" + id} className={styles.title}>
                <Typography type="h3">{item.title}</Typography>
              </Link>
            </div>
            <div className={styles.row}>
              <ProfileButton
                username={item.owner.username || "Anonymous"}
                id={item.owner.id}
              />
              {item.field && (
                <div className="">
                  <div className={cx(styles.fieldTitle, styles.inline)}>
                    <Typography type="h4" className={styles.inline}>
                      Field:
                    </Typography>
                  </div>{" "}
                  <div className={styles.inline}>{item.field || "Empty"}</div>
                </div>
              )}
              {/*  */}

              <div className="">
                <div className={cx(styles.fieldTitle, styles.inline)}>
                  <Typography type="h4" className={styles.inline}>
                    Created:
                  </Typography>
                </div>{" "}
                <div className={styles.inline}>
                  {fullTimeFormatter(item.createdAt)}
                </div>
              </div>

              <div className="">
                <div className={cx(styles.fieldTitle, styles.inline)}>
                  <Typography type="h4" className={styles.inline}>
                    Last update:
                  </Typography>
                </div>{" "}
                <div className={styles.inline}>
                  {fullTimeFormatter(item.updatedAt)}
                </div>
              </div>

              <div className="">
                <div className={cx(styles.fieldTitle, styles.inline)}>
                  <Typography type="h4" className={styles.inline}>
                    Status:
                  </Typography>
                </div>{" "}
                <div className={styles.inline}>{item.status}</div>
              </div>

              {item.topCoreEntities && (
                <div className="">
                  <div className={cx(styles.fieldTitle, styles.inline)}>
                    <Typography
                      type="h4"
                      className={cx(styles.inline, styles.ellipse)}
                    >
                      Core entities:
                    </Typography>
                  </div>{" "}
                  <div className={cx(styles.inline, styles.ellipse)}>
                    {item.topCoreEntities}
                  </div>
                </div>
              )}

              {/*  */}
            </div>
          </div>
          {/* <div className={column_className}>
                <div className={styles.column}>
                    {item.topCoreEntities}
                </div>
            </div> */}

          <div className={styles.graph2d_col}>
            <Link
              to={"/graph/" + id}
              // className={styles.title}
            >
              <div className={styles.graph2d_col_inner}>
                {item?.graphDraft.length > 0 || item?.graph.length > 0 ? (
                  <Graph2D
                    graphData={
                      item?.graphDraft.length ? item?.graphDraft : item?.graph
                    }
                    setGraphData={() => {}}
                    isEdit={false}
                    isLoading={false}
                    onFullScreen={false}
                    articleId={item?.id}
                    isOwner={false}
                    setNodesLabelWithoutEdges={() => {}}
                    isPublished
                  />
                ) : (
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                      textAlign: "center",
                      color: "var(--divider-color)",
                    }}
                  >
                    <svg
                      width="202"
                      height="auto"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="currentColor"
                        d="M21 3H3C1.35 3 0 4.35 0 6v12c0 1.55 1.19 2.83 2.7 2.98.1.01.2.02.3.02h18c.1 0 .2 0 .29-.02.03 0 .06-.01.09-.01C22.86 20.78 24 19.52 24 18V6c0-1.65-1.35-3-3-3zm1 13.53l-2.21-4.42c-.25-.5-.69-.87-1.22-1.03-.19-.05-.38-.08-.57-.08-.35 0-.7.09-1.01.27l-6.41 3.74-2.46-1.67C7.78 13.11 7.39 13 7 13c-.52 0-1.03.2-1.41.59L2 17.18V6c0-.55.45-1 1-1h18c.55 0 1 .45 1 1v10.53z"
                      />
                      <circle fill="currentColor" cx="11" cy="10" r="2" />
                    </svg>
                    {/* {theme === "dark" ? <img src={'https://www.svgrepo.com/show/335564/file-image.svg'} alt="Fallback Image" width="180"/>:
                          <img src={'https://www.svgrepo.com/show/335564/file-image.svg'} alt="Fallback Image" width="180"/>} */}
                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="142" height="142" viewBox="0 0 142 142" fill="none">
                                <circle cx="71" cy="71" r="71" fill="#4659FE" fillOpacity="0.08" />
                                <path d="M40 42.5H57L63 47.5H98.5C102.918 47.5 106.5 51.0817 106.5 55.5V56.5V65.5H56L43 100H40C36.6863 100 34 97.3137 34 94V48.5C34 45.1863 36.6863 42.5 40 42.5Z" fill="white" />
                                <path d="M106.632 65.2V53.4588C106.632 50.1451 103.946 47.4588 100.632 47.4588H62.6437L59.5311 44.3446C58.0307 42.8434 55.9953 42 53.8728 42H40C36.6863 42 34 44.6863 34 48V93C34 96.866 37.134 100 41 100H42.8659M106.632 65.2H121.6C122.286 65.2 122.768 65.8753 122.546 66.5244L111.992 97.2976C111.438 98.9142 109.917 100 108.208 100H42.8659M106.632 65.2H58.6026C56.9319 65.2 55.4371 66.2385 54.8541 67.8042L42.8659 100" stroke="#7C859E" strokeWidth="3" />
                            </svg> */}
                    {/* <div className="" style={{marginTop:10, whiteSpace:'nowrap'}}>
                                <Typography type="span">
                                    Empty
                                </Typography>
                            </div> */}
                  </div>
                )}
              </div>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};
