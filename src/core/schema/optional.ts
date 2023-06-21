import { ChaiseSchemaError } from '../errors/schema_error';
import { DataType, InferType } from './data_type';

export class Optional<S extends DataType<any>> implements DataType<S | undefined> {
  constructor(private dataType: S) {}

  parse(data: any): InferType<S> | undefined {
    if (data === undefined) {
      return undefined;
    }

    try {
      return this.dataType.parse(data);
    } catch (err: any) {
      if (err instanceof ChaiseSchemaError) {
        err.extendExpectedType('undefined');
      }

      throw err;
    }
  }
}

export const optional = <S extends DataType<any>>(dataType: S) => new Optional<S>(dataType);