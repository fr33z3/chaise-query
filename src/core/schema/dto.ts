import { DataType, OnParseFn } from './data_type';
import { ObjectDataType, ObjectData, ObjectTypeInfer } from "./object";

export type DTOPOptions = {
  keys?: string[]
}

export class DTO<N extends string, S extends ObjectData> extends ObjectDataType<S> {
  private keys: string[];

  constructor(readonly name: N, attibutes: S, options: DTOPOptions) {
    super(attibutes);
    this._typeName = `dto(${name})`;
    this.keys = options.keys ?? ['id'];
  }

  parse(data: any, onParse?: OnParseFn): ObjectTypeInfer<S> {
    if (onParse) {
      return onParse(this, data);
    }

    return super.parse(data, onParse);
  }

  parseNext(data: any, onParse: OnParseFn): ObjectTypeInfer<S> {
    return super.parse(data, onParse);
  }

  getIdentifier(data: S) {
    const identifier = this.keys.map(key => data[key]).join(';');
    return identifier;
  }
}

export const dto = <N extends string, T extends Record<string, DataType<any>>>(name: N, schema: T, options?: DTOPOptions) => new DTO<N, T>(name, schema, options ?? {});