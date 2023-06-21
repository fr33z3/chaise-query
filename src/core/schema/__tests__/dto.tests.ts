import { ChaiseSchemaError } from '../../errors/schema_error';
import { DataType } from '../data_type';
import { dto } from '../dto';

describe('DTO', () => {
  describe('for data type', () => {
    const mockedType1: DataType<any> = {
      parse: jest.fn(),
    };
    const mockedType2: DataType<any> = {
      parse: jest.fn(),
    };

    const dataType = dto('TestDTO', {
      first: mockedType1,
      second: mockedType2,
    }, {});

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
      expect(() => dataType.parse(0)).toThrow(ChaiseSchemaError);
      expect(() => dataType.parse(100)).toThrow(ChaiseSchemaError);
      expect(() => dataType.parse(100)).toThrow('expected dto(TestDTO) but received number');
    });

    it('does not parse string', () => {
      expect(() => dataType.parse('')).toThrow(ChaiseSchemaError);
      expect(() => dataType.parse('test')).toThrow(ChaiseSchemaError);
      expect(() => dataType.parse('test')).toThrow('expected dto(TestDTO) but received string');
    });

    it('does not parse boolean', () => {
      expect(() => dataType.parse(false)).toThrow(ChaiseSchemaError);
      expect(() => dataType.parse(true)).toThrow(ChaiseSchemaError);
      expect(() => dataType.parse(true)).toThrow('expected dto(TestDTO) but received boolean');
    });

    it('does not parse array', () => {
      expect(() => dataType.parse([])).toThrow(ChaiseSchemaError);
      expect(() => dataType.parse([1, 2, 3])).toThrow(ChaiseSchemaError);
      expect(() => dataType.parse([1, 2, 3])).toThrow('expected dto(TestDTO) but received array');
    });

    it('does not parse null', () => {
      expect(() => dataType.parse(null)).toThrow(ChaiseSchemaError);
      expect(() => dataType.parse(null)).toThrow('expected dto(TestDTO) but received null');
    });

    it('does not parse undefined', () => {
      expect(() => dataType.parse(undefined)).toThrow(ChaiseSchemaError);
      expect(() => dataType.parse(undefined)).toThrow('expected dto(TestDTO) but received undefined');
    });
  });

  describe('for data type which throws ChaiseSchemaError', () => {
    const mockedType: DataType<any> = {
      parse: jest.fn().mockImplementation(() => {
        throw new ChaiseSchemaError('any', 'test');
      }),
    };
    const nullableDataType = dto('TestDTO', { first: mockedType }, {});

    it('throws ChaiseSchemaError with defined path', () => {
      expect(() => nullableDataType.parse({ first: 1 })).toThrow(ChaiseSchemaError);
      expect(() => nullableDataType.parse({ first: 1 })).toThrow("expected any but received test at first");
    });
  });

  describe('for data type which throws any other error', () => {
    const mockedType: DataType<any> = {
      parse: jest.fn().mockImplementation(() => {
        throw new Error('test error');
      }),
    };
    const nullableDataType = dto('TestDTO', { first: mockedType }, {});

    it('throws original error', () => {
      expect(() => nullableDataType.parse({ first: 1 })).toThrow(Error);
      expect(() => nullableDataType.parse({ first: 1 })).toThrow('test error');
    });
  });
});