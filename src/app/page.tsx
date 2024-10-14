"use client"

import styles from "./page.module.css";
import { useState, useEffect, SetStateAction, Dispatch, FocusEventHandler, EventHandler, FormEvent } from "react";

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
  const [sidebarVisible, setSidebarVisible]:[boolean, Dispatch<SetStateAction<boolean>>] = useState(true);

  const [radios, setRadios]:[Array<RadioStation> | never[], Dispatch<SetStateAction<Array<RadioStation>>> | Dispatch<SetStateAction<never[]>>] = useState([]);
  const [pagedRadios, setPagedRadios]:[Array<RadioStation> | never[], Dispatch<SetStateAction<Array<RadioStation>>> | Dispatch<SetStateAction<never[]>>] = useState([]);
  const [searchQuery, setSearchQuery]:[string, Dispatch<SetStateAction<string>>] = useState("");

  const PAGE_LIMIT = 10;
  const [pageIndex, setPageIndex]:[number, Dispatch<SetStateAction<number>>] = useState(1);
  const [maxPages, setMaxPages]:[number, Dispatch<SetStateAction<number>>] = useState(1);

  const [favoritesLoaded, setFavoritesLoaded]:[boolean, Dispatch<SetStateAction<boolean>>] = useState(false);
  const [favorites, setFavorites]:[Array<RadioStation> | never[], SetStateAction<Array<RadioStation>> | Dispatch<SetStateAction<never[]>>] = useState([]);

  const [playingRadio, setPlayingRadio]:[RadioStation | null, Dispatch<SetStateAction<RadioStation>> | Dispatch<SetStateAction<null>>] = useState(null);
  const [playingAudio, setPlayingAudio]:[HTMLAudioElement | null, Dispatch<SetStateAction<HTMLAudioElement>> | Dispatch<SetStateAction<null>>] = useState(null);

  const [radioHover, setRadioHover]:[string, Dispatch<SetStateAction<string>>] = useState("");
  const [editingRadio, setEditingRadio]:[RadioStation | null, Dispatch<SetStateAction<RadioStation>> | Dispatch<SetStateAction<null>>] = useState(null);
  const [editingName, setEditingName]:[string | null, Dispatch<SetStateAction<string>> | Dispatch<SetStateAction<null>>] = useState(null);
  const [editingTags, setEditingTags]:[string | null, Dispatch<SetStateAction<string>> | Dispatch<SetStateAction<null>>] = useState(null);
  const [editingInputs, setEditingInputs]:[Array<any> | null, Dispatch<SetStateAction<Array<any>>> | Dispatch<SetStateAction<null>>] = useState(null);

  function toggleRadio(radio: RadioStation){
    let favoritesNow: Array<RadioStation> = [...favorites];
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
    var width: number = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    return radio.stationuuid === radioHover || width < 576;
  }

  function removeHidden(element: HTMLElement){
    let classes: string | null = element.getAttribute("class");
    if(classes !== null){
      classes = classes.replace("hidden", "");
      element.setAttribute("class", classes);
    }    
  }

  function startEditingRadio(radio: RadioStation, target: HTMLElement){
    let formGroupElement: ParentNode | null = target.parentNode;
    if(formGroupElement !== null){
      formGroupElement = formGroupElement.parentNode;
      if(formGroupElement !== null){
        formGroupElement = formGroupElement.children[1].children[0].children[0];
      }
    }
    if(formGroupElement !== null){
      const inputElements: Array<any> = [formGroupElement.children[1], formGroupElement.children[4]];
      removeHidden(inputElements[0]);
      inputElements[0].focus();
      setEditingInputs(inputElements);
      setEditingRadio(radio);
      setEditingName(radio.name);
      setEditingTags(radio.tags);
    }
  }

  function exitEditingInput(event: FocusEventHandler<HTMLInputElement>){
    if(event.relatedTarget === null || (editingInputs !== null && editingInputs.includes(event.relatedTarget) === false)){
      submitEdit(null);
    }
  }

  function submitEdit(event: EventHandler<FormEvent>){
    if(event !== null){
      event.preventDefault();
    }
    let favoritesNow: Array<RadioStation> = [...favorites];
    let radioIndex: number;
    if(editingRadio !== null){
      for(radioIndex = 0; radioIndex < favoritesNow.length && favoritesNow[radioIndex].stationuuid !== editingRadio.stationuuid; radioIndex++);
      if(radioIndex < favoritesNow.length && editingName !== null && editingTags !== null){
        favoritesNow[radioIndex].name = editingName;
        favoritesNow[radioIndex].tags = editingTags;
        setFavorites([...favoritesNow]);
      }
      setEditingRadio(null);
    }
  }

  async function tryToPlay(audioToPlay: HTMLAudioElement){
    try{
      await audioToPlay.play();
    }
    catch(error){
      setPlayingAudio(null);
      setPlayingRadio(null);
    }
  }

  function mergeRadios(radioSets:Array<Array<RadioStation>>){
    let finalRadioSet: Array<RadioStation> = radioSets[0].slice();
    for(let i: number = 1; i < radioSets.length; i++){
      radioSets[i].forEach((radio) => {
        finalRadioSet.some((finalRadio) => finalRadio.stationuuid === radio.stationuuid) ? null : finalRadioSet.push(radio);
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
  },[pageIndex]);
  
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
      let localFavorites: string | null = localStorage.getItem("favorites");
      if(localFavorites !== null){
        setFavorites(JSON.parse(localFavorites));
      }
      setFavoritesLoaded(true);
    }
  },[favorites]);

  useEffect(() => {
    let localAudio: HTMLAudioElement;
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
      <div id="main" className={(sidebarVisible ? "col-xs-12 col-sm-9 col-sm-offset-3 " : "col-sm-12 ") + styles.main}>
        <h1 id="pageHeader" className={"page-header " + styles.pageHeader}>Radio Browser</h1>
        <div id="favoriteListHeader" className="row">
          <span id="favoriteListTitle" className={"col-xs-12 col-sm-6 " + styles.listHeader}>FAVORITE RADIOS</span>
          <OpenSidebarButton sidebarVisible={sidebarVisible} setSidebarVisible={setSidebarVisible}></OpenSidebarButton>
        </div>
        <PlayingRadio playingRadio={playingRadio} setPlayingRadio={setPlayingRadio}></PlayingRadio>
        <ul id="favoritesList" className={styles.favoriteList}>
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