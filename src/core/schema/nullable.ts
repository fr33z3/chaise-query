import { DataType, InferType } from "./data_type";

export class Nullable<S extends DataType<any>> implements DataType<S | null> {
  constructor(private dataType: S) {}

  parse(data: any): InferType<S> | null {
    if (data === null || data === undefined) {
      return null;
    }

    return this.dataType.parse(data);
  }
}