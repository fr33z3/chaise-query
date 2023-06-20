import { Nullable } from "./nullable";

export type OnParseFn = (obj: DataType<any>, data: any) => any

export abstract class DataType<Data> {
  parse(data: any, onParse?: OnParseFn): Data {
    if (onParse) return onParse(this, data);

    return data;
  }

  nullable(): Nullable<typeof this> {
    return new Nullable(this);
  }
}


export type InferType<S> = S extends DataType<infer T> ? T : never;