import { BaseDataType } from "./base";

export class StringDataType extends BaseDataType<string> {
  parse(data: any): string {
    if (data === null) {
      throw new TypeError('expected string but received null');
    }
    if (data === undefined) {
      throw new TypeError('expected string but received undefined');
    }
    if (typeof data === 'boolean') {
      throw new TypeError('expected string but received boolean');
    }
    if (Array.isArray(data)) {
      throw new TypeError(`expected string but received array`);
    }
    if (typeof data === 'object') {
      throw new TypeError(`expected string but received object`);
    }

    return String(data);
  }
}