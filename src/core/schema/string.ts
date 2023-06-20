import { BaseDataType } from "./base";

export class StringDataType extends BaseDataType<string> {
  parse(data: any): string {
    return String(data);
  }
}