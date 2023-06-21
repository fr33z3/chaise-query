import { ChaiseSchemaError } from "../errors/schema_error";
import { DataType, InferType } from "./data_type";

export class Nullable<S extends DataType<any>> implements DataType<S | null> {
  constructor(private dataType: S) {}

  parse(data: any): InferType<S> | null {
    if (data === null || data === undefined) {
      return null;
    }

    try {
      return this.dataType.parse(data);
    } catch (err: any) {
      if (err instanceof ChaiseSchemaError) {
        err.extendExpectedType('null');
      }

      throw err;
    }
  }
}

export const nullable = <S extends DataType<any>>(dataType: S) => new Nullable<S>(dataType);