import { OnParseFn } from './data_type';
import { ObjectDataType, ObjectData, ObjectTypeInfer } from "./object";

export type DTOPOptions = {
  keys?: string[]
}

export class DTO<N extends string, S extends ObjectData> extends ObjectDataType<S> {
  private keys: string[];

  constructor(readonly name: N, attibutes: S, options: DTOPOptions) {
    super(attibutes);
    this.keys = options.keys ?? ['id'];
  }

  parse(data: any, onParse?: OnParseFn): ObjectTypeInfer<S> & { __typeName: N } {
    if (onParse) {
      return onParse(this, data);
    }

    const parsedData = super.parse(data, onParse);

    return {
      __typeName: this.name,
      ...parsedData
    };
  }

  parseNext(data: any, onParse: OnParseFn): ObjectTypeInfer<S> & { __typeName: N } {
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