import { OnParseFn, DataType, InferType } from './data_type';
import { BaseDataType } from "./base";
import { Optional } from "./optional";
import { ChaiseSchemaError } from '../errors/schema_error';

export type ObjectData = Record<string, DataType<any>>

type OptionalKeys<S> = { [K in keyof S]: S[K] extends Optional<any> ? K : never }[keyof S]
type MandatoryKeys<S> = Exclude<keyof S, OptionalKeys<S>>
export type ObjectTypeInfer<S> = { [K in MandatoryKeys<S>]: InferType<S[K]> } & { [K in OptionalKeys<S>]?: InferType<S[K]> }

export class ObjectDataType<S extends ObjectData> extends BaseDataType<ObjectTypeInfer<S>> {
  protected _typeName = 'object';

  constructor(readonly attributes: S) {
    super();
    this.attributes = attributes;
  }

  parse(data: any, onParse?: OnParseFn): ObjectTypeInfer<S> {
    if (data === null) {
      throw new ChaiseSchemaError(this._typeName, 'null');
    }
    if (data === undefined) {
      throw new ChaiseSchemaError(this._typeName, 'undefined');
    }
    if (Array.isArray(data)) {
      throw new ChaiseSchemaError(this._typeName, 'array');
    }
    if (typeof data !== 'object') {
      throw new ChaiseSchemaError(this._typeName, typeof data);
    }

    const result: ObjectTypeInfer<S> = {} as ObjectTypeInfer<S>;

    for (const key in this.attributes) {
      const k = key as unknown as keyof ObjectTypeInfer<S>;
      try {
        result[k] = this.attributes[key].parse(data[key], onParse);
      } catch (err) {
        if (err instanceof ChaiseSchemaError) {
          err.addParent(key);
        }
        throw err;
      }
    }

    return result;
  }
}

export const object = <S extends Record<string, DataType<any>>>(schema: S) => new ObjectDataType<S>(schema);