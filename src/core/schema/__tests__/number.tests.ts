import { NumberDataType } from '../number';

describe('NumberDataType', () => {
  describe('non nullable', () => {
    const dataType = new NumberDataType();

    it('parses numbers', () => {
      expect(dataType.parse(100)).toEqual(100);
      expect(dataType.parse(100.1)).toEqual(100.1);
    });

    it('parses string', () => {
      expect(dataType.parse('100')).toEqual(100);
      expect(dataType.parse('100.2')).toEqual(100.2);
    });

    it('does not parse non number string', () => {
      expect(() => dataType.parse('')).toThrow(TypeError);
      expect(() => dataType.parse('test')).toThrow(TypeError);
      expect(() => dataType.parse('test')).toThrow('must be number but received string');
    });

    it('parses boolean', () => {
      expect(dataType.parse(true)).toEqual(1);
      expect(dataType.parse(false)).toEqual(0);
    });

    it('does not parse array and object', () => {
      expect(() => dataType.parse([])).toThrow(TypeError);
      expect(() => dataType.parse([1, 2])).toThrow(TypeError);
      expect(() => dataType.parse([1, 2])).toThrow('must be number but received array');

      expect(() => dataType.parse({})).toThrow(TypeError);
      expect(() => dataType.parse({ a: 1 })).toThrow(TypeError);
      expect(() => dataType.parse({ a: 1 })).toThrow('must be number but received object');
    });

    it('does not parse null and undefined', () => {
      expect(() => dataType.parse(null)).toThrow(TypeError);
      expect(() => dataType.parse(null)).toThrow('must be number but received null');

      expect(() => dataType.parse(undefined)).toThrow(TypeError);
      expect(() => dataType.parse(undefined)).toThrow('must be number but received undefined');
    });
  });
});