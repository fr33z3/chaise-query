import { DataType } from "./base";

export class BooleanDataType extends DataType<boolean> {
  parse(data: any): boolean {
    if (typeof data !== 'boolean') {
      throw new Error('Data must be a boolean.');
    }

    return Boolean(data);
  }
}