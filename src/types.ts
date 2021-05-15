export type Serialize<T> = T extends Date
  ? string
  : T extends Function
  ? never
  : T extends {}
  ? { [k in keyof T]: Serialize<T[k]> }
  : T
