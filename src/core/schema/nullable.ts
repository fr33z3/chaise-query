import { DataType, InferType } from "./base";

export class Nullable<S extends DataType<any>> extends DataType<S | null> {
  constructor(private dataType: S) {
    super();
  }

  parse(data: any): InferType<S> | null {
    if (data === null || data === undefined) {
      return null;
    }

    return this.dataType.parse(data);
  }
}