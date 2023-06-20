import { InferType, DataType } from './data_type';
import { StringDataType } from './string';
import { NumberDataType } from './number';
import { ObjectDataType } from './object';
import { ArrayDataType } from './array';
import { DTO, DTOPOptions } from './dto';
import { BooleanDataType } from './boolean';
import { Nullable } from './nullable';
import { Optional } from './optional';

export const string = () => new StringDataType();
export const number = () => new NumberDataType();
export const boolean = () => new BooleanDataType();
export const array = <S extends DataType<any>>(dataType: S) => new ArrayDataType<S>(dataType);
export const object = <S extends Record<string, DataType<any>>>(schema: S) => new ObjectDataType<S>(schema);
export const dto = <N extends string, T extends Record<string, DataType<any>>>(name: N, schema: T, options?: DTOPOptions) => new DTO<N, T>(name, schema, options ?? {});
export const nullable = <S extends DataType<any>>(dataType: S) => new Nullable<S>(dataType);
export const optional = <S extends DataType<any>>(dataType: S) => new Optional<S>(dataType);

export type Schema<TData> = DataType<TData>
export type InferSchema<S extends Schema<any>> = InferType<S>