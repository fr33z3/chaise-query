import { ChaiseSchemaError } from '../../errors/schema_error';
import { number } from '../number';

describe('NumberDataType', () => {
  const dataType = number();

  it('parses numbers', () => {
    expect(dataType.parse(100)).toEqual(100);
    expect(dataType.parse(100.1)).toEqual(100.1);
  });

  it('parses string', () => {
    expect(dataType.parse('100')).toEqual(100);
    expect(dataType.parse('100.2')).toEqual(100.2);
  });

  it('does not parse non number string', () => {
    expect(() => dataType.parse('')).toThrow(ChaiseSchemaError);
    expect(() => dataType.parse('test')).toThrow(ChaiseSchemaError);
    expect(() => dataType.parse('test')).toThrow('expected number but received string');
  });

  it('parses boolean', () => {
    expect(dataType.parse(true)).toEqual(1);
    expect(dataType.parse(false)).toEqual(0);
  });

  it('does not parse array and object', () => {
    expect(() => dataType.parse([])).toThrow(ChaiseSchemaError);
    expect(() => dataType.parse([1, 2])).toThrow(ChaiseSchemaError);
    expect(() => dataType.parse([1, 2])).toThrow('expected number but received array');

    expect(() => dataType.parse({})).toThrow(ChaiseSchemaError);
    expect(() => dataType.parse({ a: 1 })).toThrow(ChaiseSchemaError);
    expect(() => dataType.parse({ a: 1 })).toThrow('expected number but received object');
  });

  it('does not parse null and undefined', () => {
    expect(() => dataType.parse(null)).toThrow(ChaiseSchemaError);
    expect(() => dataType.parse(null)).toThrow('expected number but received null');

    expect(() => dataType.parse(undefined)).toThrow(ChaiseSchemaError);
    expect(() => dataType.parse(undefined)).toThrow('expected number but received undefined');
  });
});