import { DataType } from "./base";

export class BooleanDataType implements DataType<boolean> {
  parse(data: any) {
    if (typeof data !== 'boolean') {
      throw new Error('Data must be a boolean.')
    }

    return Boolean(data)
  }
}