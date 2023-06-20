import { ObjectDataType, ObjectData } from "./object";
import { InferType, OnParseFn } from './base';

export type DTOPOptions = {
  keys?: string[]
}

export class DTO<N extends string, S extends ObjectData> extends ObjectDataType<S> {
  readonly name: N;
  private keys: string[];

  constructor(name: N, scalars: S, options: DTOPOptions) {
    super(scalars);
    this.name = name;
    this.keys = options.keys ?? ['id'];
  }
  
  parse(data: any, onParse?: OnParseFn): { [K in keyof S]: InferType<S[K]> } & { __typeName: N } {
    if (onParse) {
      return onParse(this, data);
    }

    const parsedData = super.parse(data, onParse);

    return {
      __typeName: this.name,
      ...parsedData
    };
  }

  parseNext(data: any, onParse: OnParseFn): { [K in keyof S]: InferType<S[K]> } & { __typeName: N } {
    const parsedData = super.parse(data, onParse);

    return {
      __typeName: this.name,
      ...parsedData
    };    
  }

  getIdentifier(data: S) {
    const identifier = this.keys.map(key => data[key]).join(';');
    return identifier;
  }
}