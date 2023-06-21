import { ChaiseSchemaError } from "../errors/schema_error";
import { BaseDataType } from "./base";

export class NumberDataType extends BaseDataType<number> {
  parse(data: any): number {
    if (data === null) {
      throw new ChaiseSchemaError('number', 'null');
    }

    if (data === undefined) {
      throw new ChaiseSchemaError('number', 'undefined');
    }

    if (Array.isArray(data)) {
      throw new ChaiseSchemaError('number', 'array');
    }

    if (data === '') {
      throw new ChaiseSchemaError('number', 'srting');
    }

    const parsed = Number(data);

    if (isNaN(parsed)) {
      throw new ChaiseSchemaError('number', typeof data);
    }

    return parsed;
  }
}

export const number = () => new NumberDataType();