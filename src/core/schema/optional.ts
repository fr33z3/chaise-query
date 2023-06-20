import { DataType, InferType } from './base';

export class Optional<S extends DataType<any>> extends DataType<S | undefined> {
  constructor(private dataType: S) {
    super();
  }

  parse(data: any): InferType<S> | undefined {
    if (data === undefined) {
      return undefined;
    }

    return this.dataType.parse(data);
  }
}