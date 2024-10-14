import styles from "./favicon.module.css";

export default function RadioFavicon({radio, playingRadio, setPlayingRadio, isHover}) {
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

  return (
    <div className={"col-xs-2 " + styles.radioFaviconDiv}>
      <img className={styles.listRadioFavicon + (hideFavicon(radio) ? " " + styles.transparentFavicon : "")} src={radio.favicon} />
      <i onClick={() => setPlayingRadio(radio)} className={"bi bi-play-fill " + styles.radioPlayButton + (showPlay(radio) ? " visible" : " invisible")}></i>
      <i onClick={() => setPlayingRadio(null)} className={"bi bi-stop-fill " + styles.radioStopButton + (showStop(radio) ? " visible" : " invisible")}></i>
    </div>
  );
}