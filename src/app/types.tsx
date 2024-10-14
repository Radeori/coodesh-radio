export class RadioStation {
  stationuuid: string;
  name: string;
  tags: string;
  favicon: string;

  constructor() {
    this.stationuuid = "";
    this.name = "";
    this.tags = "";
    this.favicon = "";
  }
}

export type SetBooleanState = (b: boolean) => void;

export type SetNumericState = (n: number) => void;

export type SetStringState = (s: string) => void;

export type CheckRadioState = (r: RadioStation) => boolean;
export type SetRadioState = (r: RadioStation | null) => void;
export type RadioFunction = (r: RadioStation) => void;
