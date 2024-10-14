import styles from "./button.module.css";
import { MouseEventHandler } from "react";
import { CheckRadioState, RadioStation } from "@/types";

interface Arguments{
  radio: RadioStation,
  editingRadio: RadioStation,
  startEditingRadio: MouseEventHandler,
  isHover: CheckRadioState
}

export default function EditButton({radio, editingRadio, startEditingRadio, isHover}:Arguments) {

  function isEditing(radio: RadioStation){
    return (editingRadio !== null) && (editingRadio.stationuuid === radio.stationuuid);
  }

  return (
    <div className={"col-xs-2 col-sm-1 " + styles.listRadioButton}>
      <i onClick={() => startEditingRadio(radio, event.target)}
      className={"bi bi-pencil-fill " + styles.listRadioIcon + (isHover(radio) ? " visible" : " invisible") + (isEditing(radio) ? " hidden" : "")}>
      </i>
      <i className={"bi bi-clipboard-check-fill " + styles.listRadioIcon + (isEditing(radio) ? "" : " hidden")}></i>
    </div>
  );
}