import { OnParseFn, DataType, InferType } from './data_type';
import { BaseDataType } from "./base";
import { Optional } from "./optional";

export type ObjectData = Record<string, DataType<any>>

type OptionalKeys<S> = { [K in keyof S]: S[K] extends Optional<any> ? K : never }[keyof S]
type MandatoryKeys<S> = Exclude<keyof S, OptionalKeys<S>>
export type ObjectTypeInfer<S> = { [K in MandatoryKeys<S>]: InferType<S[K]> } & { [K in OptionalKeys<S>]?: InferType<S[K]> }

export class ObjectDataType<S extends ObjectData> extends BaseDataType<ObjectTypeInfer<S>> {
  constructor(readonly attributes: S) {
    super();
    this.attributes = attributes;
  }

  parse(data: any, onParse?: OnParseFn): ObjectTypeInfer<S> {
    const result: ObjectTypeInfer<S> = {} as ObjectTypeInfer<S>;

    for (const key in this.attributes) {
      if (this.attributes.hasOwnProperty(key) && data.hasOwnProperty(key)) {
        const k = key as unknown as keyof ObjectTypeInfer<S>;
        result[k] = this.attributes[key].parse(data[key], onParse);
      } else {
        throw new Error(`Data must have a property ${key}.`);
      }
    }

    return result;
  }
}