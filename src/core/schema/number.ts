import { BaseDataType } from "./base";

export class NumberDataType extends BaseDataType<number> {
  parse(data: any): number {
    return Number(data);
  }
}