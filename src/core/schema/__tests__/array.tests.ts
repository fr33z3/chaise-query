import { DataType } from '../data_type';
import { ArrayDataType } from '../array';
import { ChaiseSchemaError } from '../../errors/schema_error';

describe('ArrayDataType', () => {
  describe('for data type', () => {
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
      expect(() => dataType.parse(0)).toThrow(ChaiseSchemaError);
      expect(() => dataType.parse(100)).toThrow(ChaiseSchemaError);
      expect(() => dataType.parse(100)).toThrow('expected array but received number');
    });

    it('does not parse string', () => {
      expect(() => dataType.parse('')).toThrow(ChaiseSchemaError);
      expect(() => dataType.parse('test')).toThrow(ChaiseSchemaError);
      expect(() => dataType.parse('test')).toThrow('expected array but received string');
    });

    it('does not parse boolean', () => {
      expect(() => dataType.parse(false)).toThrow(ChaiseSchemaError);
      expect(() => dataType.parse(true)).toThrow(ChaiseSchemaError);
      expect(() => dataType.parse(true)).toThrow('expected array but received boolean');
    });

    it('does not parse object', () => {
      expect(() => dataType.parse({})).toThrow(ChaiseSchemaError);
      expect(() => dataType.parse({ a: 1 })).toThrow(ChaiseSchemaError);
      expect(() => dataType.parse({ a: 1 })).toThrow('expected array but received object');
    });

    it('does not parse null', () => {
      expect(() => dataType.parse(null)).toThrow(ChaiseSchemaError);
      expect(() => dataType.parse(null)).toThrow('expected array but received null');
    });

    it('does not parse undefined', () => {
      expect(() => dataType.parse(undefined)).toThrow(ChaiseSchemaError);
      expect(() => dataType.parse(undefined)).toThrow('expected array but received undefined');
    });
  });

  describe('for data type which throws ChaiseSchemaError', () => {
    const mockedType: DataType<any> = {
      parse: jest.fn().mockImplementation(() => {
        throw new ChaiseSchemaError('any', 'test');
      }),
    };
    const nullableDataType = new ArrayDataType(mockedType);

    it('throws ChaiseSchemaError with defined path', () => {
      expect(() => nullableDataType.parse([1])).toThrow(ChaiseSchemaError);
      expect(() => nullableDataType.parse([1])).toThrow("expected any but received test at 0");
    });
  });

  describe('for data type which throws any other error', () => {
    const mockedType: DataType<any> = {
      parse: jest.fn().mockImplementation(() => {
        throw new Error('test error');
      }),
    };
    const nullableDataType = new ArrayDataType(mockedType);

    it('throws original error', () => {
      expect(() => nullableDataType.parse([1])).toThrow(Error);
      expect(() => nullableDataType.parse([1])).toThrow('test error');
    });
  });
});