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
import { RadioStation } from "./types";

export default function Home() {
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);

  const [radios, setRadios] = useState<Array<RadioStation>>([]);
  const [pagedRadios, setPagedRadios] = useState<Array<RadioStation>>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const PAGE_LIMIT = 10;
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [maxPages, setMaxPages] = useState<number>(1);

  const [favoritesLoaded, setFavoritesLoaded] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Array<RadioStation>>([]);

  const [playingRadio, setPlayingRadio] = useState<RadioStation>(new RadioStation());
  const [playingAudio, setPlayingAudio] = useState<HTMLAudioElement>(new Audio());

  const [radioHover, setRadioHover] = useState<string>("");
  const [editingRadio, setEditingRadio] = useState<RadioStation>(new RadioStation());
  const [editingName, setEditingName] = useState<string>("");
  const [editingTags, setEditingTags] = useState<string>("");
  const [editingInputs, setEditingInputs] = useState<Array<Element>>([]);

  function toggleRadio(radio: RadioStation){
    const favoritesNow: Array<RadioStation> = [...favorites];
    let radioIndex: number;
    for(radioIndex = 0; radioIndex < favoritesNow.length && favoritesNow[radioIndex].stationuuid !== radio.stationuuid; radioIndex++);
    if(radioIndex < favoritesNow.length){
      favoritesNow.splice(radioIndex, 1);
    }
    else{
      favoritesNow.push(radio);
    }
    setFavorites([...favoritesNow]);
  }

  function isFavorite(radio: RadioStation){
    let radioIndex: number;
    for(radioIndex = 0; radioIndex < favorites.length && favorites[radioIndex].stationuuid !== radio.stationuuid; radioIndex++);
    return radioIndex < favorites.length;
  }

  function isHover(radio: RadioStation){
    const width: number = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    return radio.stationuuid === radioHover || width < 576;
  }

  function removeHidden(element: Element){
    let classes: string | null = element.getAttribute("class");
    if(classes !== null){
      classes = classes.replace("hidden", "");
      element.setAttribute("class", classes);
    }    
  }

  function startEditingRadio(radio: RadioStation, target: EventTarget){
    let formGroupElement: ParentNode | null = (target as HTMLElement)?.parentNode;
    if(formGroupElement !== null){
      formGroupElement = formGroupElement.parentNode;
      if(formGroupElement !== null){
        formGroupElement = formGroupElement.children[1].children[0].children[0];
      }
    }
    if(formGroupElement !== null){
      const inputElements = [formGroupElement.children[1], formGroupElement.children[4]];
      removeHidden(inputElements[0]);
      (inputElements[0] as HTMLElement)?.focus();
      setEditingInputs(inputElements);
      setEditingRadio(radio);
      setEditingName(radio.name);
      setEditingTags(radio.tags);
    }
  }

  function exitEditingInput(event: React.FocusEvent<HTMLInputElement, Element>){
    if(event.relatedTarget === null || (editingInputs.includes(event.relatedTarget as Element) === false)){
      submitEdit();
    }
  }

  function submitEdit(){
    const favoritesNow: Array<RadioStation> = [...favorites];
    let radioIndex: number;
    if(editingRadio.stationuuid !== ""){
      for(radioIndex = 0; radioIndex < favoritesNow.length && favoritesNow[radioIndex].stationuuid !== editingRadio.stationuuid; radioIndex++);
      if(radioIndex < favoritesNow.length && editingName.length > 0 && editingTags.length > 0){
        favoritesNow[radioIndex].name = editingName;
        favoritesNow[radioIndex].tags = editingTags;
        setFavorites([...favoritesNow]);
      }
      setEditingRadio(new RadioStation());
    }
  }

  async function tryToPlay(audioToPlay: HTMLAudioElement){
    try{
      await audioToPlay.play();
    }
    catch(error){
      console.debug(error);
      setPlayingAudio(new Audio());
      setPlayingRadio(new RadioStation());
    }
  }

  function mergeRadios(radioSets:Array<Array<RadioStation>>){
    const finalRadioSet: Array<RadioStation> = radioSets[0].slice();
    for(let i: number = 1; i < radioSets.length; i++){
      radioSets[i].forEach((radio) => {
        if(finalRadioSet.some((finalRadio) => finalRadio.stationuuid === radio.stationuuid) === false) finalRadioSet.push(radio);
      });
    }
    return finalRadioSet;
  }

  function handleData(data: Array<RadioStation>){
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
    const baseUri: string = "https://de1.api.radio-browser.info/json/stations/search?hidebroken=true";
    if(searchQuery === ""){
      fetch(baseUri).then((res) => res.json()).then((data) => {
        handleData(data);
      });
    }
    else{
      const delaySearch: NodeJS.Timeout = setTimeout(() => {
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
  },[pageIndex, radios]);
  
  useEffect(() => {
    if(favoritesLoaded){
      const storedFavorites: string | null = localStorage.getItem("favorites");
      if(storedFavorites !== null && JSON.parse(storedFavorites).length < favorites.length){
        const favoritesList: HTMLElement | null = document.getElementById("favoritesList");
        if(favoritesList !== null){
          favoritesList.scrollTo(0, favoritesList.scrollHeight);
        }        
      }
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
    else{
      const localFavorites: string | null = localStorage.getItem("favorites");
      if(localFavorites !== null){
        setFavorites(JSON.parse(localFavorites));
      }
      setFavoritesLoaded(true);
    }
  },[favorites, favoritesLoaded]);

  useEffect(() => {
    let localAudio: HTMLAudioElement;
    if(playingAudio.src.length > 0){
      playingAudio.pause();
      setPlayingAudio(new Audio());
    }
    if(playingRadio.stationuuid !== ""){
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
      <div id="main" className={(sidebarVisible ? "col-xs-12 col-sm-9 col-sm-offset-3 " : "col-sm-12 ") + styles.main}>
        <h1 id="pageHeader" className={"page-header " + styles.pageHeader}>Radio Browser</h1>
        <div id="favoriteListHeader" className="row">
          <span id="favoriteListTitle" className={"col-xs-12 col-sm-6 " + styles.listHeader}>FAVORITE RADIOS</span>
          <OpenSidebarButton sidebarVisible={sidebarVisible} setSidebarVisible={setSidebarVisible}></OpenSidebarButton>
        </div>
        <PlayingRadio playingRadio={playingRadio} setPlayingRadio={setPlayingRadio}></PlayingRadio>
        <ul id="favoritesList" className={styles.favoriteList}>
          {favorites.map((radio) => (
            <Radio key={radio.stationuuid} radio={radio} setRadioHover={setRadioHover}>
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