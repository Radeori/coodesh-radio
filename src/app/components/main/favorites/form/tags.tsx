import styles from "./tags.module.css";
import { ExitEditingInput, RadioStation, SetStringState, SubmitEdit } from "@/types";

interface Arguments{
  radio: RadioStation,
  editingRadio: RadioStation,
  setEditingTags: SetStringState,
  submitEdit: SubmitEdit,
  exitEditingInput: ExitEditingInput
}

export default function RadioTags({radio, editingRadio, setEditingTags, submitEdit, exitEditingInput}:Arguments) {
  return (
    <>
      <span className={styles.listRadioTags + (editingRadio === null || editingRadio.stationuuid !== radio.stationuuid ? "" : " hidden")}>
        {radio.tags.split(",").join(", ")}
      </span>
      <input type="text" defaultValue={radio.tags}
        onChange={(event: React.FormEvent<HTMLInputElement>) => setEditingTags(event.currentTarget.value)}
        onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {if(event.code === "Enter" || event.code === "NumpadEnter") submitEdit()}}
        onBlur={(event) => exitEditingInput(event)}
        className={"form-control " + styles.listRadioTags + (editingRadio !== null && radio.stationuuid === editingRadio.stationuuid ? "" : " hidden")}>
      </input>
    </>
  );
}