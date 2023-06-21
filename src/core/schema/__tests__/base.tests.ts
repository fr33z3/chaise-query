import { BaseDataType } from '../base';
import { Nullable } from '../nullable';
import { Optional } from '../optional';

class CustomDataType extends BaseDataType<string> {}

describe('BaseDataType', () => {
  const dataType = new CustomDataType();

  it('gives nullable wrapper for data type', () => {
    const nullableDataType = dataType.nullable();
    expect(nullableDataType).toBeInstanceOf(Nullable);
  });

  it('gives optional wrapper for data type', () => {
    const nullableDataType = dataType.optional();
    expect(nullableDataType).toBeInstanceOf(Optional);
  });
});
