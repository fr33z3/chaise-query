import { DataType, InferType } from './data_type';

export class Optional<S extends DataType<any>> implements DataType<S | undefined> {
  constructor(private dataType: S) {}

  parse(data: any): InferType<S> | undefined {
    if (data === undefined) {
      return undefined;
    }

    return this.dataType.parse(data);
  }
}