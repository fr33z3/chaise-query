import { DataType, InferType, OnParseFn } from './data_type';
import { BaseDataType } from './base';
import { ChaiseSchemaError } from '../errors/schema_error';

export class ArrayDataType<S extends DataType<any>> extends BaseDataType<InferType<S>[]> {
  constructor(readonly itemDataType: S) {
    super();
  }

  parse(data: any, onParse?: OnParseFn): InferType<S>[] {
    if (data === null) {
      throw new ChaiseSchemaError('array', 'null');
    }

    if (data === undefined) {
      throw new ChaiseSchemaError('array', 'undefined');
    }

    if (!Array.isArray(data)) {
      throw new ChaiseSchemaError('array', typeof data);
    }

    const parsedArray = data.map(item => this.itemDataType.parse(item, onParse));
    if (onParse) return onParse(this, parsedArray);

    return parsedArray;
  }
}

