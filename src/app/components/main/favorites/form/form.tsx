import { EventHandler, FocusEventHandler, FormEvent } from "react";
import { RadioStation, SetStringState } from "@/types";
import RadioName from "./name";
import RadioTags from "./tags";

interface Arguments{
  radio: RadioStation,
  editingRadio: RadioStation,
  setEditingName: SetStringState,
  setEditingTags: SetStringState,
  submitEdit: EventHandler<FormEvent>,
  exitEditingInput: FocusEventHandler<HTMLInputElement>
}

export default function EditableFields({radio, editingRadio, setEditingName, setEditingTags, submitEdit, exitEditingInput}:Arguments){
  return (
    <div className="col-xs-6 col-sm-8">
      <form onSubmit={submitEdit}>
        <div className="form-group">
          <RadioName radio={radio} editingRadio={editingRadio} setEditingName={setEditingName} submitEdit={submitEdit} exitEditingInput={exitEditingInput}></RadioName>
          <br/>
          <RadioTags radio={radio} editingRadio={editingRadio} setEditingTags={setEditingTags} submitEdit={submitEdit} exitEditingInput={exitEditingInput}></RadioTags>
        </div>
      </form>
    </div>
  );
}