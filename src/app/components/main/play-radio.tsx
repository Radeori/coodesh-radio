import styles from "./play-radio.module.css";
import { RadioStation, SetRadioState } from "@/types";

interface Arguments{
  playingRadio: RadioStation,
  setPlayingRadio: SetRadioState
}

export default function PlayingRadio({playingRadio, setPlayingRadio}:Arguments) {
  return (
    <ul className={styles.favoriteList + " " + styles.playingRadioDiv}>
      <li className={styles.listRadio + " " + styles.playingRadio}>
        <div className="row">
          <div className={"col-xs-2 " + styles.radioFaviconDiv}>
            <i onClick={() => setPlayingRadio(new RadioStation())}
              className={"bi bi-stop-fill " + styles.playingRadioStopButton + (playingRadio.stationuuid === "" ? " invisible" : " visible")}>
            </i>
          </div>
          <div className="col-xs-10 col-xs-offset-2">
            <span className={styles.listRadioName}>
              {playingRadio.stationuuid === "" ? "" : playingRadio.name}
            </span>
          </div>
        </div>
      </li>
    </ul>
  );
}