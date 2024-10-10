"use client"

import styles from "./page.module.css";
import { useState, useEffect } from "react";

export default function Home() {
  const [radios, setRadios] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [searchHover, setSearchHover] = useState(false);
  const [searchActive, setSearchActive] = useState(false);

  function toggleRadio(radio){
    let favoritesNow = favorites;
    if(favorites.includes(radio)){
      favoritesNow.splice(favoritesNow.indexOf(radio), 1);
    }
    else{
      favoritesNow.push(radio);
    }
    setFavorites([...favoritesNow]);
  }

  function isFavorite(radio){
    if(favorites.includes(radio)){
      return true;
    }
    return false;
  }

  useEffect(() => { 
    fetch("https://de1.api.radio-browser.info/json/stations/search?limit=10")
      .then((res) => res.json())
      .then((data) => {
        setRadios(data);
      })
  }, []);
  
  return (
    <div className={"container-fluid " + styles.page}>
      <div className="row">
        <div className={"col-sm-3 col-md-2 " + styles.sidebar + (sidebarVisible ? " visible" : " invisible")}>
          <div className={"nav " + styles.navSidebar + " " + styles.menuNavSidebar}>
            <div onClick={() => setSidebarVisible(false)} className={styles.menuButton}>
              <i className={"bi bi-list " + styles.menuIcon}></i>
            </div>
          </div>
          <form className={"nav navbar-form " + styles.navSidebar}>
            <div className={"form-group" + styles.formGroup}>
              <input type="text" className={"form-control " + styles.inputSearch} placeholder="Search here" />
            </div>            
          </form>
          <ul className={"nav " + styles.navSidebar}>
            {radios.map((radio) => (
              <li key={radio.stationuuid} onClick={()=>toggleRadio(radio)} className={"row " + styles.sidebarRadio}>
                <span className={"col-md-10 " + styles.sidebarRadioName}>{radio.name}</span>
                <div className="col-md-2">
                  <i className={"bi bi-check " + styles.sidebarRadioCheck + (isFavorite(radio) ? " visible" : " invisible")}></i>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className={(sidebarVisible ? "col-sm-9 col-md-10 col-md-offset-2 col-sm-offset-3 " : "col-sm-12 ") + styles.main}>
          <h1 className={"page-header " + styles.pageHeader}>Radio Browser</h1>
          <div className="row">
            <span className={"col-sm-6 " + styles.listHeader}>FAVORITE RADIOS</span>
            <div className={"col-sm-6 " + styles.listSearch}>
              <i
                onClick={() => setSidebarVisible(true)}
                onMouseEnter={() => setSearchHover(true)} onMouseLeave={() => {setSearchHover(false);setSearchActive(false)}}
                onMouseDown={() => setSearchActive(true)} onMouseUp={() => setSearchActive(false)}
                className={"bi bi-search " + styles.listSearchIcon + (searchHover ? " " + styles.listSearchHover : "") + (searchActive ? " " + styles.listSearchActive : "")}>
              </i>
              <span onClick={() => setSidebarVisible(true)}
                onMouseEnter={() => setSearchHover(true)} onMouseLeave={() => {setSearchHover(false);setSearchActive(false)}}
                onMouseDown={() => setSearchActive(true)} onMouseUp={() => setSearchActive(false)}
                className={styles.listSearchText}>
                Search stations
              </span>
            </div>
          </div>
          <ul className={styles.favoriteList}>
              {favorites.map((radio) => (
                <li key={radio.stationuuid} className={styles.listRadio}>
                  <div className="row">
                    <div className="col-md-2">
                      <img className={styles.listRadioFavicon} src={radio.favicon} />
                      <i className="bi"></i>
                    </div>
                    <div className="col-md-8">
                      <span className={styles.listRadioName}>{radio.name}</span>
                      <br/>
                      <span className={styles.listRadioTags}>{radio.tags}</span>
                    </div>
                    <div className={"col-md-1 " + styles.listRadioButton}>
                      <i className={"bi bi-pencil-fill " + styles.listRadioIcon}></i>
                    </div>
                    <div className={"col-md-1 " + styles.listRadioButton}>
                      <i onClick={() => toggleRadio(radio)} className={"bi bi-trash3-fill " + styles.listRadioIcon}></i>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}