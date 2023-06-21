import { ChaiseSchemaError } from "../errors/schema_error";
import { BaseDataType } from "./base";

export class StringDataType extends BaseDataType<string> {
  parse(data: any): string {
    if (data === null) {
      throw new ChaiseSchemaError('string', 'null');
    }
    if (data === undefined) {
      throw new ChaiseSchemaError('string', 'undefined');
    }
    if (typeof data === 'boolean') {
      throw new ChaiseSchemaError('string', 'boolean');
    }
    if (Array.isArray(data)) {
      throw new ChaiseSchemaError('string', 'array');
    }
    if (typeof data === 'object') {
      throw new ChaiseSchemaError('string', 'object');
    }

    return String(data);
  }
}

export const string = () => new StringDataType();