import styles from "./name.module.css";

export default function RadioName({radio, editingRadio, setEditingName, submitEdit, exitEditingInput}) {
  return (
    <>
      <span className={styles.listRadioName + (editingRadio === null || editingRadio.stationuuid !== radio.stationuuid ? "" : " hidden")}>
        {radio.name}
      </span>
      <input type="text" defaultValue={radio.name.trim()}
        onChange={(event) => setEditingName(event.target.value)}
        onKeyDown={(event) => event.code === "Enter" || event.code === "NumpadEnter" ? submitEdit(event) : null}
        onBlur={exitEditingInput}
        className={"form-control " + styles.listRadioName + (editingRadio !== null && radio.stationuuid === editingRadio.stationuuid ? "" : " hidden")}>
      </input>
    </>
  );
}