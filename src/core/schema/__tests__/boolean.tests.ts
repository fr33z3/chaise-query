import { ChaiseSchemaError } from '../../errors/schema_error';
import { boolean } from '../boolean';

describe('BooleanDataType', () => {
  const dataType = boolean();

  it('parses boolean', () => {
    expect(dataType.parse(true)).toEqual(true);
    expect(dataType.parse(false)).toEqual(false);
  });

  it('does not parse string', () => {
    expect(() => dataType.parse('')).toThrow(ChaiseSchemaError);
    expect(() => dataType.parse('test')).toThrow(ChaiseSchemaError);
    expect(() => dataType.parse('test')).toThrow('expected boolean but received string');
  });

  it('does not parse number', () => {
    expect(() => dataType.parse(0)).toThrow(ChaiseSchemaError);
    expect(() => dataType.parse(100)).toThrow(ChaiseSchemaError);
    expect(() => dataType.parse(100.1)).toThrow(ChaiseSchemaError);
    expect(() => dataType.parse(100.1)).toThrow('expected boolean but received number');
  });

  it('does not parse string', () => {
    expect(() => dataType.parse('')).toThrow(ChaiseSchemaError);
    expect(() => dataType.parse('test')).toThrow(ChaiseSchemaError);
    expect(() => dataType.parse('test')).toThrow('expected boolean but received string');
  });

  it ('does not parse array', () => {
    expect(() => dataType.parse([])).toThrow(ChaiseSchemaError);
    expect(() => dataType.parse([1, 2])).toThrow(ChaiseSchemaError);
    expect(() => dataType.parse([1, 2])).toThrow('expected boolean but received array');
  });

  it ('does not parse object', () => {
    expect(() => dataType.parse({})).toThrow(ChaiseSchemaError);
    expect(() => dataType.parse({ a: 1 })).toThrow(ChaiseSchemaError);
    expect(() => dataType.parse({ a: 1 })).toThrow('expected boolean but received object');
  });

  it ('does not parse null', () => {
    expect(() => dataType.parse(null)).toThrow(ChaiseSchemaError);
    expect(() => dataType.parse(null)).toThrow('expected boolean but received null');
  });

  it ('does not parse undefined', () => {
    expect(() => dataType.parse(undefined)).toThrow(ChaiseSchemaError);
    expect(() => dataType.parse(undefined)).toThrow('expected boolean but received undefined');
  });
});