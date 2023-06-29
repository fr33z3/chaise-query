import { DataType, OnParseFn } from './data_type';
import { Nullable } from './nullable';
import { Optional } from './optional';

export abstract class BaseDataType<Data> implements DataType<Data> {
  parse(data: any, onParse?: OnParseFn): Data {
    if (onParse) return onParse(this, data);

    return data;
  }

  nullable(): Nullable<typeof this> {
    return new Nullable(this);
  }

  optional(): Optional<typeof this> {
    return new Optional(this);
  }
}