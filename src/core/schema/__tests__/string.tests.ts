import { StringDataType } from '../string';

describe('StringDataType', () => {
  const dataType = new StringDataType();

  it('parses string', () => {
    expect(dataType.parse('')).toEqual('');
    expect(dataType.parse('test')).toEqual('test');
  });

  it('coerce number to string', () => {
    expect(dataType.parse(0)).toEqual('0');
    expect(dataType.parse(100)).toEqual('100');
    expect(dataType.parse(100.1)).toEqual('100.1');
  });

  it('fails on boolean', () => {
    expect(() => dataType.parse(true)).toThrow(TypeError);
    expect(() => dataType.parse(true)).toThrow("expected string but received boolean");
  });

  it('fails on array', () => {
    expect(() => dataType.parse([])).toThrow(TypeError);
    expect(() => dataType.parse([1, 2])).toThrow(TypeError);
    expect(() => dataType.parse([1, 2])).toThrow("expected string but received array");
  });

  it('fails on object', () => {
    expect(() => dataType.parse({})).toThrow(TypeError);
    expect(() => dataType.parse({ a: 1 })).toThrow(TypeError);
    expect(() => dataType.parse({ b: 1 })).toThrow("expected string but received object");
  });

  it('fails on null', () => {
    expect(() => dataType.parse(null)).toThrow(TypeError);
    expect(() => dataType.parse(null)).toThrow("expected string but received null");
  });

  it('fails on undefined', () => {
    expect(() => dataType.parse(undefined)).toThrow(TypeError);
    expect(() => dataType.parse(undefined)).toThrow("expected string but received undefined");
  });
});