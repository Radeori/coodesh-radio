import styles from "./tags.module.css";
import { FocusEventHandler, KeyboardEventHandler } from "react";
import { RadioStation, SetStringState } from "@/types";

interface Arguments{
  radio: RadioStation,
  editingRadio: RadioStation,
  setEditingTags: SetStringState,
  submitEdit: KeyboardEventHandler,
  exitEditingInput: FocusEventHandler<HTMLInputElement>
}

export default function RadioTags({radio, editingRadio, setEditingTags, submitEdit, exitEditingInput}:Arguments) {
  return (
    <>
      <span className={styles.listRadioTags + (editingRadio === null || editingRadio.stationuuid !== radio.stationuuid ? "" : " hidden")}>
        {radio.tags.split(",").join(", ")}
      </span>
      <input type="text" defaultValue={radio.tags}
        onChange={(event: React.FormEvent<HTMLInputElement>) => setEditingTags(event.currentTarget.value)}
        onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => event.code === "Enter" || event.code === "NumpadEnter" ? submitEdit(event) : null}
        onBlur={exitEditingInput}
        className={"form-control " + styles.listRadioTags + (editingRadio !== null && radio.stationuuid === editingRadio.stationuuid ? "" : " hidden")}>
      </input>
    </>
  );
}