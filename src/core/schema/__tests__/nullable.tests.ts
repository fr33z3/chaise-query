import { DataType } from '../data_type';
import { Nullable } from '../nullable';

describe('Nullable', () => {
  const mockedType: DataType<any> = {
    parse: jest.fn(),
  };
  const nullableDataType = new Nullable(mockedType);

  it('returns null when data is null or undefined', () => {
    expect(nullableDataType.parse(null)).toBeNull();
    expect(nullableDataType.parse(undefined)).toBeNull();
  });

  it('calls wrapped dataType parse method if data is not null', () => {
    nullableDataType.parse(0);
    expect(mockedType.parse).toBeCalledWith(0);
  });

  it('calls wrapped dataType parse method if data is not null', () => {
    nullableDataType.parse('');
    expect(mockedType.parse).toBeCalledWith('');
  });
});