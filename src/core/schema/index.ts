import { InferType, DataType } from './data_type';
export { string } from './string';
export { number } from './number';
export { object } from './object';
export { array } from './array';
export { dto } from './dto';
export { boolean } from './boolean';
export { nullable } from './nullable';
export { optional } from './optional';

export type Schema<TData> = DataType<TData>
export type InferSchema<S extends Schema<any>> = InferType<S>