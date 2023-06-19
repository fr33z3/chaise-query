import { DataType, InferType, OnParseFn } from './base'

export class ArrayDataType<S extends DataType<any>> implements DataType<InferType<S>[]> {
  readonly itemDataType: S;

  constructor(dataType: S) {
    this.itemDataType = dataType;
  }

  parse(data: any, onParse?: OnParseFn): InferType<S>[] {
    if (!Array.isArray(data)) {
      throw new Error("Data must be an array.");
    }

    const parsedArray = data.map(item => this.itemDataType.parse(item, onParse));
    if (onParse) return onParse(this, parsedArray)

    return parsedArray;
  }
}

