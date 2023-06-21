import { BooleanDataType } from '../boolean';

describe('BooleanDataType', () => {
  const dataType = new BooleanDataType();

  it('parses boolean', () => {
    expect(dataType.parse(true)).toEqual(true);
    expect(dataType.parse(false)).toEqual(false);
  });

  it('does not parse string', () => {
    expect(() => dataType.parse('')).toThrow(TypeError);
    expect(() => dataType.parse('test')).toThrow(TypeError);
    expect(() => dataType.parse('test')).toThrow('expected boolean but received string');
  });

  it('does not parse number', () => {
    expect(() => dataType.parse(0)).toThrow(TypeError);
    expect(() => dataType.parse(100)).toThrow(TypeError);
    expect(() => dataType.parse(100.1)).toThrow(TypeError);
    expect(() => dataType.parse(100.1)).toThrow('expected boolean but received number');
  });

  it('does not parse string', () => {
    expect(() => dataType.parse('')).toThrow(TypeError);
    expect(() => dataType.parse('test')).toThrow(TypeError);
    expect(() => dataType.parse('test')).toThrow('expected boolean but received string');
  });

  it ('does not parse array', () => {
    expect(() => dataType.parse([])).toThrow(TypeError);
    expect(() => dataType.parse([1, 2])).toThrow(TypeError);
    expect(() => dataType.parse([1, 2])).toThrow('expected boolean but received array');
  });

  it ('does not parse object', () => {
    expect(() => dataType.parse({})).toThrow(TypeError);
    expect(() => dataType.parse({ a: 1 })).toThrow(TypeError);
    expect(() => dataType.parse({ a: 1 })).toThrow('expected boolean but received object');
  });

  it ('does not parse null', () => {
    expect(() => dataType.parse(null)).toThrow(TypeError);
    expect(() => dataType.parse(null)).toThrow('expected boolean but received null');
  });

  it ('does not parse undefined', () => {
    expect(() => dataType.parse(undefined)).toThrow(TypeError);
    expect(() => dataType.parse(undefined)).toThrow('expected boolean but received undefined');
  });
});