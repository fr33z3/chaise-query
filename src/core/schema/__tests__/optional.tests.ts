import { ChaiseSchemaError } from '../../errors/schema_error';
import { DataType } from '../data_type';
import { Optional } from '../optional';

describe('Optional', () => {
  describe('for data type', () => {
    const mockedType: DataType<any> = {
      parse: jest.fn(),
    };
    const nullableDataType = new Optional(mockedType);

    it('returns undefined when data is undefined', () => {
      expect(nullableDataType.parse(undefined)).toBeUndefined();
    });

    it('calls wrapped dataType parse method if data is null', () => {
      nullableDataType.parse(null);

      expect(mockedType.parse).toBeCalledWith(null);
    });

    it('calls wrapped dataType parse method if data is not undefined', () => {
      nullableDataType.parse(0);
      expect(mockedType.parse).toBeCalledWith(0);
    });

    it('calls wrapped dataType parse method if data is not undefined', () => {
      nullableDataType.parse('');
      expect(mockedType.parse).toBeCalledWith('');
    });
  });

  describe('for data type which throws ChaiseSchemaError', () => {
    const mockedType: DataType<any> = {
      parse: jest.fn().mockImplementation(() => {
        throw new ChaiseSchemaError('any', 'test');
      }),
    };
    const nullableDataType = new Optional(mockedType);

    it('throws ChaiseSchemaError with extended source type', () => {
      expect(() => nullableDataType.parse(0)).toThrow(ChaiseSchemaError);
      expect(() => nullableDataType.parse(0)).toThrow("expected any or undefined but received test");
    });
  });

  describe('for data type which throws any other error', () => {
    const mockedType: DataType<any> = {
      parse: jest.fn().mockImplementation(() => {
        throw new Error('test error');
      }),
    };
    const nullableDataType = new Optional(mockedType);

    it('throws original error', () => {
      expect(() => nullableDataType.parse(0)).toThrow(Error);
      expect(() => nullableDataType.parse(0)).toThrow('test error');
    });
  });
});