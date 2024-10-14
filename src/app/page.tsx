"use client"

import styles from "./page.module.css";
import { useState, useEffect } from "react";

import Sidebar from "./components/sidebar/sidebar";
import CloseSidebarButton from "./components/sidebar/menu";
import SearchForm from "./components/sidebar/search";
import PagedRadios from "./components/sidebar/radios";

import OpenSidebarButton from "./components/main/search-button";
import PlayingRadio from "./components/main/play-radio";

import Radio from "./components/main/favorites/radio";
import RadioFavicon from "./components/main/favorites/favicon";
import EditableFields from "./components/main/favorites/form/form";
import EditButton from "./components/main/favorites/edit";
import RemoveButton from "./components/main/favorites/remove";

export default function Home() {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const [radios, setRadios] = useState([]);
  const [pagedRadios, setPagedRadios] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const PAGE_LIMIT = 10;
  const [pageIndex, setPageIndex] = useState(1);
  const [maxPages, setMaxPages] = useState(1);

  const [favoritesLoaded, setFavoritesLoaded] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const [playingRadio, setPlayingRadio] = useState(null);
  const [playingAudio, setPlayingAudio] = useState(null);

  const [radioHover, setRadioHover] = useState("");
  const [editingRadio, setEditingRadio] = useState(null);
  const [editingName, setEditingName] = useState(null);
  const [editingTags, setEditingTags] = useState(null);
  const [editingInputs, setEditingInputs] = useState(null);

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

  async function tryToPlay(audioToPlay){
    try{
      await audioToPlay.play();
    }
    catch(error){
      setPlayingAudio(null);
      setPlayingRadio(null);
    }
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

  function handleData(data){
    setRadios(data);
    setMaxPages(Math.ceil(data.length/PAGE_LIMIT));
    setPagedRadios(data.slice(0,PAGE_LIMIT));
    if(data.length === 0){
      setPageIndex(0);
    }
    else{
      setPageIndex(1);
    }
  }

  useEffect(() => {
    const baseUri = "https://de1.api.radio-browser.info/json/stations/search?hidebroken=true";
    if(searchQuery === ""){
      fetch(baseUri).then((res) => res.json()).then((data) => {
        handleData(data);
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
          handleData(mergeRadios(datas));
        })
      }, 1000);
      return () => clearTimeout(delaySearch);
    }
  },[searchQuery]);

  useEffect(() => {
    if(pageIndex > 0){
      setPagedRadios(radios.slice((pageIndex-1)*PAGE_LIMIT,PAGE_LIMIT*pageIndex));
    }
  },[pageIndex]);
  
  useEffect(() => {
    if(favoritesLoaded){
      if(localStorage.getItem("favorites") !== null && JSON.parse(localStorage.getItem("favorites")).length < favorites.length){
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
      setFavoritesLoaded(true);
    }
  },[favorites]);

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
    <div id="page" className={"container-fluid row " + styles.page}>
      <Sidebar sidebarVisible={sidebarVisible}>
        <CloseSidebarButton setSidebarVisible={setSidebarVisible}></CloseSidebarButton>
        <SearchForm setSearchQuery={setSearchQuery}></SearchForm>
        <PagedRadios 
          pagedRadios={pagedRadios} maxPages={maxPages} pageIndex={pageIndex} setPageIndex={setPageIndex} toggleRadio={toggleRadio} isFavorite={isFavorite}>
        </PagedRadios>
      </Sidebar>
      <div className={(sidebarVisible ? "col-xs-12 col-sm-9 col-sm-offset-3 " : "col-sm-12 ") + styles.main}>
        <h1 className={"page-header " + styles.pageHeader}>Radio Browser</h1>
        <div className="row">
          <span className={"col-xs-12 col-sm-6 " + styles.listHeader}>FAVORITE RADIOS</span>
          <OpenSidebarButton sidebarVisible={sidebarVisible} setSidebarVisible={setSidebarVisible}></OpenSidebarButton>
        </div>
        <PlayingRadio playingRadio={playingRadio} setPlayingRadio={setPlayingRadio}></PlayingRadio>
        <ul id="favoritesDiv" className={styles.favoriteList}>
          {favorites.map((radio) => (
            <Radio radio={radio} setRadioHover={setRadioHover}>
              <RadioFavicon radio={radio} playingRadio={playingRadio} setPlayingRadio={setPlayingRadio} isHover={isHover}></RadioFavicon>
              <EditableFields radio={radio} editingRadio={editingRadio}
                setEditingName={setEditingName} setEditingTags={setEditingTags}
                submitEdit={submitEdit} exitEditingInput={exitEditingInput}>
              </EditableFields>
              <EditButton radio={radio} editingRadio={editingRadio} startEditingRadio={startEditingRadio} isHover={isHover}></EditButton>
              <RemoveButton radio={radio} toggleRadio={toggleRadio} isHover={isHover}></RemoveButton>
            </Radio>
          ))}
        </ul>
      </div>
    </div>
  );
}