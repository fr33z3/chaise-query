import { BaseDataType } from "./base";

export class NumberDataType extends BaseDataType<number> {
  parse(data: any): number {
    if (data === null) {
      throw new TypeError('expected number but received null');
    }

    if (data === undefined) {
      throw new TypeError('expected number but received undefined');
    }

    if (Array.isArray(data)) {
      throw new TypeError(`expected number but received array`);
    }

    if (data === '') {
      throw new TypeError(`expected number but received empty string`);
    }

    const parsed = Number(data);
    if (isNaN(parsed)) {
      throw new TypeError(`expected number but received ${typeof data}`);
    }

    return parsed;
  }
}