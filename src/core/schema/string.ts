import { DataType } from "./base";

export class StringDataType implements DataType<string> {
  parse(data: any) {
    return String(data)
  }
}