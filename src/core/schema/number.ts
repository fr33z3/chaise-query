import { DataType } from "./base";

export class NumberDataType extends DataType<number> {
  parse(data: any): number {
    return Number(data);
  }
}