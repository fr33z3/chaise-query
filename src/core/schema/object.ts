import { DataType, InferType, OnParseFn } from "./base";

export type ObjectData = Record<string, DataType<any>>

export class ObjectDataType<S extends ObjectData> implements DataType<{ [K in keyof S]: InferType<S[K]> }> {
  readonly attributes: S

  constructor(attributes: S) {
    this.attributes = attributes
  }

  parse(data: any, onParse?: OnParseFn): { [K in keyof S]: InferType<S[K]> } {
    const result: Partial<{ [K in keyof S]: InferType<S[K]> }> = {};

    for (const key in this.attributes) {
      if (this.attributes.hasOwnProperty(key) && data.hasOwnProperty(key)) {
        result[key] = this.attributes[key].parse(data[key], onParse);
      } else {
        throw new Error(`Data must have a property ${key}.`);
      }
    }

    return result as { [K in keyof S]: InferType<S[K]> };
  }
}