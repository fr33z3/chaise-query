import { DataType } from "./base";

export class StringDataType extends DataType<string> {
  parse(data: any): string {
    return String(data);
  }
}