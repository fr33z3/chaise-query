import { DataType } from "./base";

export class NumberDataType implements DataType<number> {
  parse(data: any): number {
    return Number(data)
  }
}