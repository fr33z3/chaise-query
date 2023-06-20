export type OnParseFn = (obj: DataType<any>, data: any) => any

export interface DataType<Data> {
  parse(data: any, onParse?: OnParseFn): Data
}

export type InferType<S> = S extends DataType<infer T> ? T : never;