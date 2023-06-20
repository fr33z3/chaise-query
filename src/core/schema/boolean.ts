import { BaseDataType } from "./base";

export class BooleanDataType extends BaseDataType<boolean> {
  parse(data: any): boolean {
    if (typeof data !== 'boolean') {
      throw new TypeError('must be boolean type.');
    }

    return Boolean(data);
  }
}