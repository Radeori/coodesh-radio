import styles from "./favorites.module.css";

export default function Radio({radio, setRadioHover, children}
){
  return (
    <li onMouseEnter={() => setRadioHover(radio.stationuuid)} onMouseLeave={() => setRadioHover("")} key={radio.stationuuid} className={styles.listRadio}>
      <div className="row">
        {children}
      </div>
    </li>
  )
}