export class RadioStation {
  stationuuid: string;
  name: string;
  tags: string;
  favicon: string;
  url_resolved: string;

  constructor() {
    this.stationuuid = "";
    this.name = "";
    this.tags = "";
    this.favicon = "";
    this.url_resolved = "";
  }
}

export type SetBooleanState = (b: boolean) => void;

export type SetNumericState = (n: number) => void;

export type SetStringState = (s: string) => void;

export type CheckRadioState = (r: RadioStation) => boolean;
export type SetRadioState = (r: RadioStation) => void;
export type RadioFunction = (r: RadioStation) => void;

export type StartEditingHandler = (r: RadioStation, et: EventTarget) => void;
export type ExitEditingInput = (fe: React.FocusEvent<HTMLInputElement, Element>) => void;
export type SubmitEdit = () => void;