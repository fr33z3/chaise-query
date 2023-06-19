import { InferType, DataType } from './base'
import { StringDataType } from './string'
import { NumberDataType } from './number'
import { ObjectDataType } from './object'
import { ArrayDataType } from './array'
import { DTO, DTOPOptions } from './dto'
import { BooleanDataType } from './boolean'
import { Nullable } from './nullable'

export const string = () => new StringDataType()
export const number = () => new NumberDataType()
export const boolean = () => new BooleanDataType()
export const object = <S extends Record<string, DataType<any>>>(schema: S) => new ObjectDataType<S>(schema)
export const array = <S extends DataType<any>>(scalar: S) => new ArrayDataType<S>(scalar)
export const dto = <N extends string, T extends Record<string, DataType<any>>>(name: N, schema: T, options?: DTOPOptions) => new DTO<N, T>(name, schema, options ?? {})
export const nullable = <S extends DataType<any>>(scalar: S) => new Nullable<S>(scalar)

export type Schema<TData> = DataType<TData>
export type InferSchema<S extends Schema<any>> = InferType<S>