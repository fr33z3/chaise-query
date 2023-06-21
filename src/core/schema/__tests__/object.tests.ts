import { DataType } from '../data_type';
import { ObjectDataType } from '../object';

describe('ObjectDataType', () => {
  const mockedType1: DataType<any> = {
    parse: jest.fn(),
  };
  const mockedType2: DataType<any> = {
    parse: jest.fn(),
  };

  const dataType = new ObjectDataType({
    first: mockedType1,
    second: mockedType2,
  });

  it('parses empty object', () => {
    dataType.parse({});

    expect(mockedType1.parse).toHaveBeenCalledWith(undefined, undefined);
    expect(mockedType2.parse).toHaveBeenCalledWith(undefined, undefined);
  });

  it('parses partial object', () => {
    dataType.parse({
      first: 1,
    });

    expect(mockedType1.parse).toHaveBeenCalledWith(1, undefined);
    expect(mockedType2.parse).toHaveBeenCalledWith(undefined, undefined);
  });

  it('parses object', () => {
    dataType.parse({
      first: 1,
      second: 2,
    });

    expect(mockedType1.parse).toHaveBeenCalledWith(1, undefined);
    expect(mockedType2.parse).toHaveBeenCalledWith(2, undefined);
  });

  it('parses object with null', () => {
    dataType.parse({
      first: null,
      second: 2,
    });

    expect(mockedType1.parse).toHaveBeenCalledWith(null, undefined);
    expect(mockedType2.parse).toHaveBeenCalledWith(2, undefined);
  });

  it('does not parse number', () => {
    expect(() => dataType.parse(0)).toThrow(TypeError);
    expect(() => dataType.parse(100)).toThrow(TypeError);
    expect(() => dataType.parse(100)).toThrow('expected object but received number');
  });

  it('does not parse string', () => {
    expect(() => dataType.parse('')).toThrow(TypeError);
    expect(() => dataType.parse('test')).toThrow(TypeError);
    expect(() => dataType.parse('test')).toThrow('expected object but received string');
  });

  it('does not parse boolean', () => {
    expect(() => dataType.parse(false)).toThrow(TypeError);
    expect(() => dataType.parse(true)).toThrow(TypeError);
    expect(() => dataType.parse(true)).toThrow('expected object but received boolean');
  });

  it('does not parse array', () => {
    expect(() => dataType.parse([])).toThrow(TypeError);
    expect(() => dataType.parse([1, 2, 3])).toThrow(TypeError);
    expect(() => dataType.parse([1, 2, 3])).toThrow('expected object but received array');
  });

  it('does not parse null', () => {
    expect(() => dataType.parse(null)).toThrow(TypeError);
    expect(() => dataType.parse(null)).toThrow('expected object but received null');
  });

  it('does not parse undefined', () => {
    expect(() => dataType.parse(undefined)).toThrow(TypeError);
    expect(() => dataType.parse(undefined)).toThrow('expected object but received undefined');
  });
});