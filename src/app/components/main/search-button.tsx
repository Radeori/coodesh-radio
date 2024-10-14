import styles from "./search-button.module.css";
import { useState } from "react";
import { SetBooleanState } from "@/types";

interface Arguments{
  sidebarVisible: boolean,
  setSidebarVisible: SetBooleanState
}

export default function OpenSidebarButton({sidebarVisible, setSidebarVisible}:Arguments) {
  const [searchHover, setSearchHover] = useState(false);
  const [searchActive, setSearchActive] = useState(false);

  return (
    <div className={"col-sm-6 " + styles.listSearch}>
      <i
        onClick={() => setSidebarVisible(true)}
        onMouseEnter={() => setSearchHover(true)} onMouseLeave={() => {setSearchHover(false);setSearchActive(false)}}
        onMouseDown={() => setSearchActive(true)} onMouseUp={() => setSearchActive(false)}
        className={"bi bi-search " + styles.listSearchIcon + (searchHover && !sidebarVisible ? " " + styles.listSearchHover : "") +
          (searchActive && !sidebarVisible ? " " + styles.listSearchActive : "")}>
      </i>
      <span onClick={() => setSidebarVisible(true)}
        onMouseEnter={() => setSearchHover(true)} onMouseLeave={() => {setSearchHover(false);setSearchActive(false)}}
        onMouseDown={() => setSearchActive(true)} onMouseUp={() => setSearchActive(false)}
        className={"hidden-xs " + styles.listSearchText + (searchHover && !sidebarVisible ? " " + styles.listSearchTextHover : "") +
          (searchActive && !sidebarVisible ? " " + styles.listSearchTextActive : "")}>
        Search stations
      </span>
    </div>
  );
}