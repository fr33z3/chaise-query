import { ChaiseSchemaError } from "../errors/schema_error";
import { BaseDataType } from "./base";

export class BooleanDataType extends BaseDataType<boolean> {
  parse(data: any): boolean {
    if (data === null) {
      throw new ChaiseSchemaError('boolean', 'null');
    }

    if (data === undefined) {
      throw new ChaiseSchemaError('boolean', 'undefined');
    }

    if (Array.isArray(data)) {
      throw new ChaiseSchemaError('boolean', 'array');
    }

    if (typeof data !== 'boolean') {
      throw new ChaiseSchemaError('boolean', typeof data);
    }

    return Boolean(data);
  }
}