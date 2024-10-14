import styles from "./button.module.css";
import { CheckRadioState, RadioFunction, RadioStation } from "@/types";

interface Arguments{
  radio: RadioStation,
  toggleRadio: RadioFunction,
  isHover: CheckRadioState
}

export default function RemoveButton({radio, toggleRadio, isHover}:Arguments) {
  return (
    <div className={"col-xs-2 col-sm-1 " + styles.listRadioButton}>
      <i onClick={() => toggleRadio(radio)} className={"bi bi-trash3-fill " + styles.listRadioIcon + (isHover(radio) ? " visible" : " invisible")}></i>
    </div>
  );
}