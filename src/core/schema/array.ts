import { DataType, InferType, OnParseFn } from './base';

export class ArrayDataType<S extends DataType<any>> extends DataType<InferType<S>[]> {
  constructor(readonly itemDataType: S) {
    super();
  }

  parse(data: any, onParse?: OnParseFn): InferType<S>[] {
    if (!Array.isArray(data)) {
      throw new Error("Data must be an array.");
    }

    const parsedArray = data.map(item => this.itemDataType.parse(item, onParse));
    if (onParse) return onParse(this, parsedArray);

    return parsedArray;
  }
}

