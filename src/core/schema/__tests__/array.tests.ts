import { DataType } from '../data_type';
import { ArrayDataType } from '../array';

describe('ArrayDataType', () => {
  const mockedType: DataType<any> = {
    parse: jest.fn(),
  };
  const dataType = new ArrayDataType(mockedType);

  it('parses empty array', () => {
    expect(dataType.parse([])).toEqual([]);
  });

  it('parses array of numbers', () => {
    dataType.parse([1, 2, 3]);

    expect(mockedType.parse).toHaveBeenCalledWith(1, undefined);
    expect(mockedType.parse).toHaveBeenCalledWith(2, undefined);
    expect(mockedType.parse).toHaveBeenCalledWith(3, undefined);
  });

  it('parses array of strings', () => {
    dataType.parse(['1', '2', '3']);

    expect(mockedType.parse).toHaveBeenCalledWith('1', undefined);
    expect(mockedType.parse).toHaveBeenCalledWith('2', undefined);
    expect(mockedType.parse).toHaveBeenCalledWith('3', undefined);
  });

  it('parses array of boolean', () => {
    dataType.parse([true, false]);

    expect(mockedType.parse).toHaveBeenCalledWith(true, undefined);
    expect(mockedType.parse).toHaveBeenCalledWith(false, undefined);
  });

  it('does not parse number', () => {
    expect(() => dataType.parse(0)).toThrow(TypeError);
    expect(() => dataType.parse(100)).toThrow(TypeError);
    expect(() => dataType.parse(100)).toThrow('expected array but received number');
  });

  it('does not parse string', () => {
    expect(() => dataType.parse('')).toThrow(TypeError);
    expect(() => dataType.parse('test')).toThrow(TypeError);
    expect(() => dataType.parse('test')).toThrow('expected array but received string');
  });

  it('does not parse boolean', () => {
    expect(() => dataType.parse(false)).toThrow(TypeError);
    expect(() => dataType.parse(true)).toThrow(TypeError);
    expect(() => dataType.parse(true)).toThrow('expected array but received boolean');
  });

  it('does not parse object', () => {
    expect(() => dataType.parse({})).toThrow(TypeError);
    expect(() => dataType.parse({ a: 1 })).toThrow(TypeError);
    expect(() => dataType.parse({ a: 1 })).toThrow('expected array but received object');
  });

  it('does not parse null', () => {
    expect(() => dataType.parse(null)).toThrow(TypeError);
    expect(() => dataType.parse(null)).toThrow('expected array but received null');
  });

  it('does not parse undefined', () => {
    expect(() => dataType.parse(undefined)).toThrow(TypeError);
    expect(() => dataType.parse(undefined)).toThrow('expected array but received undefined');
  });
});