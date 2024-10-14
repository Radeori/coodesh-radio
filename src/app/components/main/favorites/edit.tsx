import styles from "./button.module.css";

export default function EditButton({radio, editingRadio, startEditingRadio, isHover}) {

  function isEditing(radio){
    return (editingRadio !== null) && (editingRadio.stationuuid === radio.stationuuid);
  }

  return (
    <div className={"col-xs-2 col-sm-1 " + styles.listRadioButton}>
      <i onClick={(event) => startEditingRadio(radio, event.target)}
      className={"bi bi-pencil-fill " + styles.listRadioIcon + (isHover(radio) ? " visible" : " invisible") + (isEditing(radio) ? " hidden" : "")}>
      </i>
      <i className={"bi bi-clipboard-check-fill " + styles.listRadioIcon + (isEditing(radio) ? "" : " hidden")}></i>
    </div>
  );
}