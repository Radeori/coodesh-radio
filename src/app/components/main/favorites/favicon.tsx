import styles from "./favicon.module.css";
import { CheckRadioState, RadioStation, SetRadioState } from "@/types";

interface Arguments{
  radio: RadioStation,
  playingRadio: RadioStation,
  setPlayingRadio: SetRadioState,
  isHover: CheckRadioState
}

export default function RadioFavicon({radio, playingRadio, setPlayingRadio, isHover}:Arguments) {
  function showPlay(radio: RadioStation){
    if(isHover(radio)){
      if(playingRadio === null || playingRadio.stationuuid !== radio.stationuuid){
        return true;
      }
    }
    return false;
  }

  function showStop(radio: RadioStation){
    if(playingRadio === null){
      return false;
    }
    if(playingRadio.stationuuid === radio.stationuuid){
      return true;
    }
  }

  function hideFavicon(radio: RadioStation){
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