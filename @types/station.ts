export enum Line {
  EW,
  CG,
  NS,
  NE,
  CC,
  CE,
  DT,
  TE,
}

export interface StationCode {
  line: Line
  code: string
}

export interface Station {
  id: number
  name: string
  codes: StationCode[]
}
