import styles from "./favorites.module.css";
import { RadioStation, SetStringState } from "@/types";

interface Arguments{
  radio: RadioStation,
  setRadioHover: SetStringState,
  children: React.ReactNode
}

export default function Radio({radio, setRadioHover, children}:Arguments){
  return (
    <li key={radio.stationuuid} onMouseEnter={() => setRadioHover(radio.stationuuid)} onMouseLeave={() => setRadioHover("")} className={styles.listRadio}>
      <div className="row">
        {children}
      </div>
    </li>
  )
}