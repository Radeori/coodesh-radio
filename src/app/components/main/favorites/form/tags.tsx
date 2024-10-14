import styles from "./tags.module.css";

export default function RadioTags({radio, editingRadio, setEditingTags, submitEdit, exitEditingInput}) {
  return (
    <>
      <span className={styles.listRadioTags + (editingRadio === null || editingRadio.stationuuid !== radio.stationuuid ? "" : " hidden")}>
        {radio.tags.split(",").join(", ")}
      </span>
      <input type="text" defaultValue={radio.tags}
        onChange={(event) => setEditingTags(event.target.value)}
        onKeyDown={(event) => event.code === "Enter" || event.code === "NumpadEnter" ? submitEdit(event) : null}
        onBlur={exitEditingInput}
        className={"form-control " + styles.listRadioTags + (editingRadio !== null && radio.stationuuid === editingRadio.stationuuid ? "" : " hidden")}>
      </input>
    </>
  );
}