import { BaseDataType } from "./base";

export class BooleanDataType extends BaseDataType<boolean> {
  parse(data: any): boolean {
    if (data === null) {
      throw new TypeError('expected boolean but received null');
    }

    if (data === undefined) {
      throw new TypeError('expected boolean but received undefined');
    }

    if (Array.isArray(data)) {
      throw new TypeError(`expected boolean but received array`);
    }

    if (typeof data !== 'boolean') {
      throw new TypeError(`expected boolean but received ${typeof data}`);
    }

    return Boolean(data);
  }
}