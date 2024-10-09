"use client"

import styles from "./page.module.css";
import { useState, useEffect } from "react";

export default function Home() {
  const [radios, setRadios] = useState([]);
  const [favorites, setFavorites] = useState([]);

  function toggleRadio(radio){
    let favoritesNow = favorites;
    if(favorites.includes(radio)){
      favoritesNow.splice(favoritesNow.indexOf(radio), 1);
    }
    else{
      favoritesNow.push(radio);
    }
    setFavorites(favoritesNow);
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
        <div className={"col-sm-3 col-md-2 " + styles.sidebar}>
          <div className={"nav " + styles.navSidebar}>
            <div className={styles.menuButton}>
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
              <li key={radio.stationuuid} onClick={()=>toggleRadio(radio)}><a href="#"><span>{radio.name}</span></a></li>
            ))}
          </ul>
        </div>
        <div className={"col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 " + styles.main}>
          <h1 className={"page-header " + styles.pageHeader}>Radio Browser</h1>
          <div className="row">
            <span className="col-sm-6">Favorite Radios</span>
            <div className={"col-sm-6 " + styles.listSearch}>
              <i className="bi bi-search"></i>
              <span>Search stations</span>
            </div>
          </div>
          <ul className={styles.favoriteList}>
              {favorites.map((radio) => (
                <li key={radio.stationuuid} className={styles.listRadio}><span>{radio.name}</span></li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}