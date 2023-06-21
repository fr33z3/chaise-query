export class ChaiseSchemaError extends Error {
  private _path: string[] = [];

  public get path(): string {
    return this._path.join('.');
  }

  public get message(): string {
    return `expected ${this.expectedType} but received ${this.receivedType} at ${this.path}`;
  }

  constructor(readonly expectedType: string, readonly receivedType: string) {
    super();
  }

  override toString(): string {
    return this.message;
  }

  addParent(parent: string): void {
    this._path = [parent, ...this._path, ];
  }
}