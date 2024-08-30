import { useContext } from "react";
import { TableContext } from "../..";
import { filterConstants } from "../../../../constants/filterConstants";
import styles from "./styles.module.scss";
import cx from "classnames";
import Typography from "../../../../components/Typography";

export const KnowladgeBaseFilter = () => {
  const { filterOptions, handleFilterClick } = useContext(TableContext);

  return (
    <aside className={styles.filter_container}>
      <div
        className=""
        style={{ display: "flex", alignItems: "center", gap: 10 }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 1C5.37935 0.999675 4.77387 1.19186 4.26702 1.55006C3.76016 1.90826 3.37688 2.41484 3.17 3H0V5H3.17C3.3766 5.58553 3.75974 6.09257 4.2666 6.45121C4.77346 6.80986 5.37909 7.00245 6 7.00245C6.62091 7.00245 7.22654 6.80986 7.7334 6.45121C8.24026 6.09257 8.6234 5.58553 8.83 5H16V3H8.83C8.62312 2.41484 8.23984 1.90826 7.73298 1.55006C7.22613 1.19186 6.62065 0.999675 6 1ZM10 9C9.37935 8.99967 8.77387 9.19186 8.26702 9.55006C7.76016 9.90826 7.37688 10.4148 7.17 11H0V13H7.17C7.3766 13.5855 7.75974 14.0926 8.2666 14.4512C8.77346 14.8099 9.37909 15.0025 10 15.0025C10.6209 15.0025 11.2265 14.8099 11.7334 14.4512C12.2403 14.0926 12.6234 13.5855 12.83 13H16V11H12.83C12.6231 10.4148 12.2398 9.90826 11.733 9.55006C11.2261 9.19186 10.6207 8.99967 10 9Z"
            fill="currentColor"
          />
        </svg>
        <Typography type="h3">Filter</Typography>
      </div>
      {/* {filterOptions.map(filterOption => {
            return filterOption.title
        })} */}
      <Typography type="h4">Subjects</Typography>
      <ul className={styles.filter_list}>
        {filterConstants.map((filterConstant) => {
          const isActive = filterOptions.find(
            (filterOption) => filterOption.min === filterConstant.min
          );

          return (
            <li
              key={filterConstant.min}
              className={cx(styles.filter_list_item, isActive && styles.active)}
            >
              <button
                className={cx(styles.filterBtn)}
                onClick={() => handleFilterClick(filterConstant)}
              >
                {filterConstant.title}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};
