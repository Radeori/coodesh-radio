"use client"

import styles from "./page.module.css";
import { useState, useEffect } from "react";

export default function Home() {
  const [appLoaded, setAppLoaded] = useState(false);
  const [radios, setRadios] = useState([]);
  const [pagedRadios, setPagedRadios] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [radioHover, setRadioHover] = useState("");
  const [playingRadio, setPlayingRadio] = useState(null);
  const [editingRadio, setEditingRadio] = useState(null);
  const [editingName, setEditingName] = useState(null);
  const [editingTags, setEditingTags] = useState(null);
  const [editingInputs, setEditingInputs] = useState(null);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [searchHover, setSearchHover] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const PAGE_LIMIT = 10;

  function toggleRadio(radio){
    let favoritesNow = [...favorites];
    let radioIndex;
    for(radioIndex = 0; radioIndex < favoritesNow.length && favoritesNow[radioIndex].stationuuid !== radio.stationuuid; radioIndex++);
    if(radioIndex < favoritesNow.length){
      favoritesNow.splice(radioIndex, 1);
    }
    else{
      favoritesNow.push(radio);
    }
    setFavorites([...favoritesNow]);
  }

  function isFavorite(radio){
    let radioIndex;
    for(radioIndex = 0; radioIndex < favorites.length && favorites[radioIndex].stationuuid !== radio.stationuuid; radioIndex++);
    return radioIndex < favorites.length;
  }

  function isHover(radio){
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    return radio.stationuuid === radioHover || width < 576;
  }

  function showPlay(radio){
    if(isHover(radio)){
      if(playingRadio === null || playingRadio.stationuuid !== radio.stationuuid){
        return true;
      }
    }
    return false;
  }

  function showStop(radio){
    if(playingRadio === null){
      return false;
    }
    if(playingRadio.stationuuid === radio.stationuuid){
      return true;
    }
  }

  function hideFavicon(radio){
    if(isHover(radio)){
      return true;
    }
    if(playingRadio !== null && playingRadio.stationuuid === radio.stationuuid){
      return true;
    }
    return false;
  }

  function removeHidden(element){
    let classes = element.getAttribute("class");
    classes = classes.replace("hidden", "");
    element.setAttribute("class", classes);
  }

  function startEditingRadio(radio, target){
    const formGroupElement = target.parentNode.parentNode.children[1].children[0].children[0];
    const inputElements = [formGroupElement.children[1], formGroupElement.children[4]];
    removeHidden(inputElements[0]);
    inputElements[0].focus();
    setEditingInputs(inputElements);
    setEditingRadio(radio);
    setEditingName(radio.name);
    setEditingTags(radio.tags);
  }

  function exitEditingInput(event){
    if(event.relatedTarget === null || editingInputs.includes(event.relatedTarget) === false){
      submitEdit(null);
    }
  }

  function submitEdit(event){
    if(event !== null){
      event.preventDefault();
    }
    let favoritesNow = [...favorites];
    let radioIndex;
    if(editingRadio !== null){
      for(radioIndex = 0; radioIndex < favoritesNow.length && favoritesNow[radioIndex].stationuuid !== editingRadio.stationuuid; radioIndex++);
      if(radioIndex < favoritesNow.length){
        favoritesNow[radioIndex].name = editingName;
        favoritesNow[radioIndex].tags = editingTags;
        setFavorites([...favoritesNow]);
      }
      setEditingRadio(null);
    }
  }

  function isEditing(radio){
    return (editingRadio !== null) && (editingRadio.stationuuid === radio.stationuuid);
  }

  function mergeRadios(radioSets){
    let finalRadioSet = radioSets[0].slice();
    for(let i=1; i<radioSets.length; i++){
      radioSets[i].forEach((radio) => {
        finalRadioSet.some((finalRadio) => finalRadio.stationuuid === radio.stationuuid) ? null : finalRadioSet.push(radio);
      });
    }
    return finalRadioSet;
  }

  async function tryToPlay(audioToPlay){
    try{
      await audioToPlay.play();
    }
    catch(error){
      setPlayingAudio(null);
      setPlayingRadio(null);
    }
  }
  
  useEffect(() => {
    if(appLoaded){
      if(JSON.parse(localStorage.getItem("favorites")).length < favorites.length){
        const favoritesDiv = document.getElementById("favoritesDiv");
        favoritesDiv.scrollTo(0, favoritesDiv.scrollHeight);
      }
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
    else{
      let localFavorites = localStorage.getItem("favorites");
      if(localFavorites !== null){
        setFavorites(JSON.parse(localFavorites));
      }
      setAppLoaded(true);
    }
  },[favorites]);

  useEffect(() => {
    const baseUri = "https://de1.api.radio-browser.info/json/stations/search?hidebroken=true";
    if(searchQuery === ""){
      fetch(baseUri).then((res) => res.json()).then((data) => {
        setRadios(data);
        setMaxPages(Math.ceil(data.length/PAGE_LIMIT));
        setPagedRadios(data.slice(0,PAGE_LIMIT));
      });
    }
    else{
      const delaySearch = setTimeout(() => {
        Promise.all([
          fetch(baseUri+"&name="+searchQuery).then((res) => res.json()),
          fetch(baseUri+"&country="+searchQuery).then((res) => res.json()),
          fetch(baseUri+"&countrycode="+searchQuery).then((res) => res.json()),
          fetch(baseUri+"&language="+searchQuery).then((res) => res.json()),
          fetch(baseUri+"&tag="+searchQuery).then((res) => res.json())
        ])
        .then((datas) => {
          const fetchRadios = mergeRadios(datas);
          setRadios(fetchRadios);
          setMaxPages(Math.ceil(fetchRadios.length/PAGE_LIMIT));
          setPagedRadios(fetchRadios.slice(0,PAGE_LIMIT));
        })
      }, 1000);
      return () => clearTimeout(delaySearch);
    }
    setPageIndex(1);
  },[searchQuery]);

  useEffect(() => {
    setPagedRadios(radios.slice((pageIndex-1)*PAGE_LIMIT,PAGE_LIMIT*pageIndex));
  },[pageIndex]);

  useEffect(() => {
    let localAudio;
    if(playingAudio !== null){
      playingAudio.pause();
      setPlayingAudio(null);
    }
    if(playingRadio !== null){
      localAudio = new Audio(playingRadio.url_resolved);
      setPlayingAudio(localAudio);
      tryToPlay(localAudio);
      
    }
  },[playingRadio]);
  
  return (
    <div className={"container-fluid " + styles.page}>
      <div className="row">
        <div className={"col-xs-12 col-sm-3 " + styles.sidebar + (sidebarVisible ? " visible" : " invisible")}>
          <div className={"nav " + styles.navSidebar + " " + styles.menuNavSidebar}>
            <div onClick={() => setSidebarVisible(false)} className={styles.menuButton}>
              <i className={"bi bi-list " + styles.menuIcon}></i>
            </div>
          </div>
          <form onSubmit={(event) => event.preventDefault()} className={"nav navbar-form text-center " + styles.navSidebar}>
            <div className={"form-group " + styles.searchFormGroup}>
              <input type="text" onChange={(event) => setSearchQuery(event.target.value)} className={"form-control " + styles.inputSearch} placeholder="Search here" />
            </div>
          </form>
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
        </div>
        <div className={(sidebarVisible ? "col-xs-12 col-sm-9 col-sm-offset-3 " : "col-sm-12 ") + styles.main}>
          <h1 className={"page-header " + styles.pageHeader}>Radio Browser</h1>
          <div className="row">
            <span className={"col-xs-12 col-sm-6 " + styles.listHeader}>FAVORITE RADIOS</span>
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
          </div>
          <ul className={styles.favoriteList}>
            <li className={styles.listRadio + " " + styles.playingRadio}>
              <div className="row">
                <div className={"col-xs-2 " + styles.radioFaviconDiv}>
                  <i onClick={() => setPlayingRadio(null)} className={"bi bi-stop-fill " + styles.playingRadioStopButton + (playingRadio === null ? " invisible" : " visible")}></i>
                </div>
                <div className="col-xs-10 col-xs-offset-2">
                  <span className={styles.listRadioName}>{playingRadio === null ? "" : playingRadio.name}</span>
                </div>
              </div>
            </li>
          </ul>
          <ul id="favoritesDiv" className={styles.favoriteList}>
            {favorites.map((radio) => (
              <li onMouseEnter={() => setRadioHover(radio.stationuuid)} onMouseLeave={() => setRadioHover("")} key={radio.stationuuid} className={styles.listRadio}>
                <div className="row">
                  <div className={"col-xs-2 " + styles.radioFaviconDiv}>
                    <img className={styles.listRadioFavicon + (hideFavicon(radio) ? " " + styles.transparentFavicon : "")} src={radio.favicon} />
                    <i onClick={() => setPlayingRadio(radio)} className={"bi bi-play-fill " + styles.radioPlayButton + (showPlay(radio) ? " visible" : " invisible")}></i>
                    <i onClick={() => setPlayingRadio(null)} className={"bi bi-stop-fill " + styles.radioStopButton + (showStop(radio) ? " visible" : " invisible")}></i>
                  </div>
                  <div className="col-xs-6 col-sm-8">
                    <form onSubmit={submitEdit}>
                      <div className="form-group">
                        <span className={styles.listRadioName + (editingRadio === null || editingRadio.stationuuid !== radio.stationuuid ? "" : " hidden")}>
                          {radio.name}
                        </span>
                        <input type="text" defaultValue={radio.name.trim()}
                        onChange={(event) => setEditingName(event.target.value)}
                        onKeyDown={(event) => event.code === "Enter" || event.code === "NumpadEnter" ? submitEdit(event) : null}
                        onBlur={exitEditingInput}
                        
                        className={"form-control " + styles.listRadioName + (editingRadio !== null && radio.stationuuid === editingRadio.stationuuid ? "" : " hidden")}>
                        </input>
                        <br/>
                        <span className={styles.listRadioTags + (editingRadio === null || editingRadio.stationuuid !== radio.stationuuid ? "" : " hidden")}>
                          {radio.tags.split(",").join(", ")}
                        </span>
                        <input type="text" defaultValue={radio.tags}
                        onChange={(event) => setEditingTags(event.target.value)}
                        onKeyDown={(event) => event.code === "Enter" || event.code === "NumpadEnter" ? submitEdit(event) : null}
                        onBlur={exitEditingInput}
                        className={"form-control " + styles.listRadioTags + (editingRadio !== null && radio.stationuuid === editingRadio.stationuuid ? "" : " hidden")}>
                        </input>
                      </div>
                    </form>
                  </div>
                  <div className={"col-xs-2 col-sm-1 " + styles.listRadioButton}>
                    <i onClick={(event) => startEditingRadio(radio, event.target)}
                    className={"bi bi-pencil-fill " + styles.listRadioIcon + (isHover(radio) ? " visible" : " invisible") + (isEditing(radio) ? " hidden" : "")}>
                    </i>
                    <i className={"bi bi-clipboard-check-fill " + styles.listRadioIcon + (isEditing(radio) ? "" : " hidden")}></i>
                  </div>
                  <div className={"col-xs-2 col-sm-1 " + styles.listRadioButton}>
                    <i onClick={() => toggleRadio(radio)} className={"bi bi-trash3-fill " + styles.listRadioIcon + (isHover(radio) ? " visible" : " invisible")}></i>
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