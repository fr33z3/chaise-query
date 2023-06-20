import { BaseDataType } from "./base";

export class BooleanDataType extends BaseDataType<boolean> {
  parse(data: any): boolean {
    if (typeof data !== 'boolean') {
      throw new Error('Data must be boolean type.');
    }

    return Boolean(data);
  }
}