import styles from "./favorites.module.css";
import { RadioStation, SetStringState } from "@/types";

interface Arguments{
  radio: RadioStation,
  setRadioHover: SetStringState,
  children: React.ReactNode
}

export default function Radio({radio, setRadioHover, children}:Arguments){
  return (
    <li onMouseEnter={() => setRadioHover(radio.stationuuid)} onMouseLeave={() => setRadioHover("")} key={radio.stationuuid} className={styles.listRadio}>
      <div className="row">
        {children}
      </div>
    </li>
  )
}