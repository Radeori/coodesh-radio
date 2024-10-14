import styles from "./play-radio.module.css";

export default function PlayingRadio({playingRadio, setPlayingRadio}) {
  return (
    <ul className={styles.favoriteList + " " + styles.playingRadioDiv}>
      <li className={styles.listRadio + " " + styles.playingRadio}>
        <div className="row">
          <div className={"col-xs-2 " + styles.radioFaviconDiv}>
            <i onClick={() => setPlayingRadio(null)} className={"bi bi-stop-fill " + styles.playingRadioStopButton + (playingRadio === null ? " invisible" : " visible")}></i>
          </div>
          <div className="col-xs-10 col-xs-offset-2">
            <span className={styles.listRadioName}>
              {playingRadio === null ? "" : playingRadio.name}
            </span>
          </div>
        </div>
      </li>
    </ul>
  );
}