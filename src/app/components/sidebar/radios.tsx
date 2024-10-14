import styles from "./radios.module.css";
import { CheckRadioState, RadioFunction, RadioStation, SetNumericState } from "@/types";

interface Arguments{
  pagedRadios: Array<RadioStation>,
  maxPages: number,
  pageIndex: number,
  setPageIndex: SetNumericState,
  toggleRadio: RadioFunction,
  isFavorite: CheckRadioState
}

export default function PagedRadios({pagedRadios, maxPages, pageIndex, setPageIndex, toggleRadio, isFavorite}:Arguments) {
  return (
    <ul className={"nav " + styles.navSidebar}>
      {pagedRadios.map((radio) => (
        <li key={radio.stationuuid} onClick={()=>toggleRadio(radio)} className={"row " + styles.sidebarRadio}>
          <span className={"col-xs-10 " + styles.sidebarRadioName}>{radio.name}</span>
          <i className={"col-xs-2 bi bi-check " + styles.sidebarRadioCheck + (isFavorite(radio) ? " visible" : " invisible")}></i>
        </li>
      ))}
      <li className={"row " + styles.sidebarPagingDiv}>
        <i onClick={() => setPageIndex(1)} className={"col-xs-2 bi bi-box-arrow-in-left " + styles.sidebarPagingIcon}></i>
        <i onClick={() => pageIndex > 1 ? setPageIndex(pageIndex-1) : null} className={"col-xs-2 bi bi-arrow-left-short " + styles.sidebarPagingIcon}></i>
        <span className={"col-xs-4 " + styles.sidebarPagingInfo}>{pageIndex}/{maxPages}</span>
        <i onClick={() => pageIndex < maxPages ? setPageIndex(pageIndex+1) : null} className={"col-xs-2 bi bi-arrow-right-short " + styles.sidebarPagingIcon}></i>
        <i onClick={() => setPageIndex(maxPages)} className={"col-xs-2 bi bi-box-arrow-in-right " + styles.sidebarPagingIcon}></i>
      </li>
    </ul>
  )
};