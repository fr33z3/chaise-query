export class ChaiseSchemaError extends Error {
  private _expectedTypes: string[] = [];
  private _receivedType: string;
  private _path: string[] = [];

  public get path(): string {
    return this._path.join('.');
  }

  public get message(): string {
    if (this._path.length === 0) {
      return `expected ${this.expectedTypes()} but received ${this._receivedType}`;
    } else {
      return `expected ${this.expectedTypes()} but received ${this._receivedType} at ${this.path}`;
    }
  }

  constructor(expectedTypes: string, receivedType: string)
  constructor(expectedTypes: string[], receivedType: string)
  constructor(expectedTypes: string | string[], receivedType: string) {
    super();
    this._expectedTypes = Array.isArray(expectedTypes) ? expectedTypes : [expectedTypes];
    this._receivedType = receivedType;
  }

  override toString(): string {
    return this.message;
  }

  addParent(parent: string): void {
    this._path = [parent, ...this._path, ];
  }

  extendExpectedType(expectedType: string): void {
    this._expectedTypes.push(expectedType);
  }

  private expectedTypes(): string {
    return this._expectedTypes.join(' or ');
  }
}