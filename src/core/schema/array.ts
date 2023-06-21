import { DataType, InferType, OnParseFn } from './data_type';
import { BaseDataType } from './base';

export class ArrayDataType<S extends DataType<any>> extends BaseDataType<InferType<S>[]> {
  constructor(readonly itemDataType: S) {
    super();
  }

  parse(data: any, onParse?: OnParseFn): InferType<S>[] {
    if (data === null) {
      throw new TypeError('expected array but received null');
    }

    if (data === undefined) {
      throw new TypeError('expected array but received undefined');
    }

    if (!Array.isArray(data)) {
      throw new TypeError(`expected array but received ${typeof data}`);
    }

    const parsedArray = data.map(item => this.itemDataType.parse(item, onParse));
    if (onParse) return onParse(this, parsedArray);

    return parsedArray;
  }
}

