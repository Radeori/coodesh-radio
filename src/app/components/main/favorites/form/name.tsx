import styles from "./name.module.css";
import { FocusEventHandler, KeyboardEventHandler } from "react";
import { RadioStation, SetStringState } from "@/types";

interface Arguments{
  radio: RadioStation,
  editingRadio: RadioStation,
  setEditingName: SetStringState,
  submitEdit: KeyboardEventHandler,
  exitEditingInput: FocusEventHandler<HTMLInputElement>
}

export default function RadioName({radio, editingRadio, setEditingName, submitEdit, exitEditingInput}:Arguments) {
  return (
    <>
      <span className={styles.listRadioName + (editingRadio === null || editingRadio.stationuuid !== radio.stationuuid ? "" : " hidden")}>
        {radio.name}
      </span>
      <input type="text" defaultValue={radio.name.trim()}
        onChange={(event: React.FormEvent<HTMLInputElement>) => setEditingName(event.currentTarget.value)}
        onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => event.code === "Enter" || event.code === "NumpadEnter" ? submitEdit(event) : null}
        onBlur={exitEditingInput}
        className={"form-control " + styles.listRadioName + (editingRadio !== null && radio.stationuuid === editingRadio.stationuuid ? "" : " hidden")}>
      </input>
    </>
  );
}