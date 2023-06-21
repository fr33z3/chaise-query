import { ChaiseSchemaError } from '../../errors/schema_error';
import { DataType } from '../data_type';
import { nullable } from '../nullable';

describe('Nullable', () => {
  describe('for data type', () => {
    const mockedType: DataType<any> = {
      parse: jest.fn(),
    };
    const nullableDataType = nullable(mockedType);

    it('returns null when data is null or undefined', () => {
      expect(nullableDataType.parse(null)).toBeNull();
      expect(nullableDataType.parse(undefined)).toBeNull();
    });

    it('calls wrapped dataType parse method if data is not null', () => {
      nullableDataType.parse(0);
      expect(mockedType.parse).toBeCalledWith(0);
    });

    it('calls wrapped dataType parse method if data is not null', () => {
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
    const nullableDataType = nullable(mockedType);

    it('throws ChaiseSchemaError with extended source type', () => {
      expect(() => nullableDataType.parse(0)).toThrow(ChaiseSchemaError);
      expect(() => nullableDataType.parse(0)).toThrow("expected any or null but received test");
    });
  });

  describe('for data type which throws any other error', () => {
    const mockedType: DataType<any> = {
      parse: jest.fn().mockImplementation(() => {
        throw new Error('test error');
      }),
    };
    const nullableDataType = nullable(mockedType);

    it('throws original error', () => {
      expect(() => nullableDataType.parse(0)).toThrow(Error);
      expect(() => nullableDataType.parse(0)).toThrow('test error');
    });
  });
});