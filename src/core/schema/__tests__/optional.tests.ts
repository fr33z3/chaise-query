import { DataType } from '../data_type';
import { Optional } from '../optional';

describe('Optional', () => {
  const mockedType: DataType<any> = {
    parse: jest.fn(),
  };
  const nullableDataType = new Optional(mockedType);

  it('returns undefined when data is undefined', () => {
    expect(nullableDataType.parse(undefined)).toBeUndefined();
  });

  it('calls wrapped dataType parse method if data is null', () => {
    nullableDataType.parse(null);

    expect(mockedType.parse).toBeCalledWith(null);
  });

  it('calls wrapped dataType parse method if data is not undefined', () => {
    nullableDataType.parse(0);
    expect(mockedType.parse).toBeCalledWith(0);
  });

  it('calls wrapped dataType parse method if data is not undefined', () => {
    nullableDataType.parse('');
    expect(mockedType.parse).toBeCalledWith('');
  });
});