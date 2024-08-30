import { CollectionItem } from "../../components/CollectionItem";
import collection from "../../data/collection.json";
import cx from "classnames";
import styles from "./styles.module.scss";
import { KnowladgeBaseFilter } from "./components/Filter";
import { createContext, useState } from "react";
import { Button } from "../../components/Button";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Typography from "../../components/Typography";
import { useEffect } from "react";
import { filterConstants } from "../../constants/filterConstants";
import Scrollbar from "react-scrollbars-custom";
import useIsMobile from "../../hooks/uiHook";

export const TableContext = createContext(null);

export const KnowledgeBaseContainer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [filterOptions, setFilterOptions] = useState([]);
  // const [pageID, setPageID] = useState(1)
  let { pageID } = useParams();
  pageID = pageID ?? 1;

  const perPage = useIsMobile() ? 5 : 12;

  // useEffect(()=>{
  //     handleFilterClick()
  // },[perPage,useIsMobile])

  const formatGetOptions = (arr) => {
    if (arr.length === 0) return "";
    const optionLabel = arr.map((option) => option.title).join(",");
    return optionLabel;
  };

  const handleFilterClick = (
    option = {
      title: "",
    }
  ) => {
    const foundFilterOption = filterOptions.find(
      (filterOption) => filterOption.title === option?.title
    );

    if (foundFilterOption) {
      const newFilterOptions = filterOptions.filter(
        (_foundFilterOption) => option.title !== _foundFilterOption.title
      );
      setFilterOptions(newFilterOptions);
      navigate(`/knowledge/${1}?options=${formatGetOptions(newFilterOptions)}`);
    } else {
      setFilterOptions([...filterOptions, option]);
      navigate(
        `/knowledge/${1}?options=${formatGetOptions([
          ...filterOptions,
          option,
        ])}`
      );
    }
  };

  const handleNavigation = (direction) => {
    const newPageID = Number(pageID) + direction;
    if (filterOptions.length === 0) {
      navigate(`/knowledge/${newPageID}`);
    } else {
      navigate(
        `/knowledge/${newPageID}?options=${formatGetOptions(filterOptions)}`
      );
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const options = searchParams.get("options");

    const newArr = filterConstants.filter((filterConstant) => {
      if (options && options !== "") {
        const isFound = options
          .split(",")
          .find((option) => option === filterConstant.title);
        // console.log(isFound)
        if (isFound) {
          return true;
        }
        // const isFound = options.find(option => { filterConstant.title === option })
      }

      // return isFound ? true : false

      return false;
    });

    setFilterOptions(newArr);

    // You can also trigger any other logic based on the new pageID value
  }, [location.search]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const options = searchParams.get("options");
    if (options === "") {
      searchParams.delete("options");
      // Update the URL with the new search string
      navigate({
        pathname: location.pathname,
        search: searchParams.toString(),
      });
    }
  }, [location.search]);

  let avalibleList = 0;

  if (filterOptions.length > 0) {
    filterOptions.forEach((option) => {
      avalibleList += option.max - option.min;
    });
  } else {
    filterConstants.forEach((option) => {
      avalibleList += option.max - option.min + 1;
    });
  }

  const isNextBtnDisabled = perPage * pageID > avalibleList;

  return (
    <TableContext.Provider
      value={{
        filterOptions,
        handleFilterClick,
      }}
    >
      <section className={styles.wrap}>
        <KnowladgeBaseFilter className={styles.col} />
        <div className={styles.col}>
          {/* <div className={cx(styles.table_row,styles.table_head)}>
                    <Typography type='span'>
                        File name
                    </Typography>
                    <Typography type='span'>
                        Core entities
                    </Typography>
                    <Typography type='span'>
                        Created
                    </Typography>
                    <Typography type='span'>
                        Modified
                    </Typography>
                    <Typography type='span'>
                        Status
                    </Typography>
                </div> */}
          <div className={styles.table_body}>
            {/* disableTracksWidthCompensation */}
            {/* noDefaultStyles */}
            <Scrollbar>
              <div className={styles.table_list}>
                {filterOptions.length === 0
                  ? collection
                      .filter(
                        (item, _index) =>
                          _index < perPage * pageID &&
                          _index >= perPage * (pageID - 1)
                      )
                      .map(({ id }) => (
                        <CollectionItem
                          key={id}
                          id={id}
                          className={styles.table_row}
                          column_className={styles.table_col}
                        />
                      ))
                  : collection
                      .filter((item, index) => {
                        let isValid = false;
                        filterOptions.forEach((filterOption) => {
                          const min = filterOption.min;
                          const max = filterOption.max;
                          if (index + 1 >= min && index + 1 <= max) {
                            isValid = true;
                          }
                        });
                        return isValid;
                      })
                      .filter(
                        (item, _index) =>
                          _index < perPage * pageID &&
                          _index >= perPage * (pageID - 1)
                      )
                      .map(({ id }) => (
                        <CollectionItem
                          key={id}
                          id={id}
                          className={styles.table_row}
                          column_className={styles.table_col}
                        />
                      ))}
              </div>
            </Scrollbar>
          </div>
          <div className={styles.pagination}>
            <Button
              onClick={() => {
                handleNavigation(-1);
              }}
              disabled={pageID <= 1}
              className={styles.paginationButton}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19 12.998H5V10.998H19V12.998Z" fill="currentColor" />
              </svg>
            </Button>
            <span style={{ padding: 10 }} className={styles.paginationSpan}>
              {pageID}
            </span>
            <Button
              className={styles.paginationButton}
              onClick={() => handleNavigation(1)}
              disabled={isNextBtnDisabled}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 12.998H13V18.998H11V12.998H5V10.998H11V4.99799H13V10.998H19V12.998Z"
                  fill="currentColor"
                />
              </svg>
            </Button>
          </div>
        </div>
      </section>
    </TableContext.Provider>
  );
};
